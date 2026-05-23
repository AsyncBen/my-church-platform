import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "../sockets/socket.auth";
import { registerServiceEvents } from "../sockets/service.events";
import { registerScriptureEvents } from "../sockets/scripture.events";
import { registerAnnouncementEvents } from "../sockets/announcement.events";
import { liveState } from "../services/live-state.store";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
} from "../types/socket.types";

export const initSocket = (httpServer: HttpServer) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, any, SocketData>(
    httpServer,
    {
      cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    }
  );

  // ── Auth middleware ────────────────────────────────────
  io.use(socketAuthMiddleware);

  // ── Connection handler ─────────────────────────────────
  io.on("connection", (socket) => {
    const { userId, email, role } = socket.data;

    // Centralized connection log (only place we log connections)
    console.log(`[socket] + connected   ${email} (${role}) [${socket.id}]`);

    // Join role room + personal room
    socket.join(`role:${role}`);
    socket.join(`user:${userId}`);

    // ── sync:state — send current service state immediately ──
    // Critical for late joiners, WiFi drops, app restarts
    const state = liveState.get();
    socket.emit("sync:state", {
      currentService: state.isLive
        ? {
            serviceId:  state.serviceId!,
            title:      state.serviceTitle!,
            startedBy:  state.startedBy!,
            startedAt:  state.startedAt!,
          }
        : null,
      currentScripture: state.currentScripture,
      serviceStatus: state.isLive ? "live" : "idle",
    });

    console.log(`[socket] sync:state sent to ${email} — service ${state.isLive ? "LIVE" : "idle"}`);

    // ── Register event groups ──────────────────────────────
    registerServiceEvents(io, socket);
    registerScriptureEvents(io, socket);
    registerAnnouncementEvents(io, socket);

    // ── Disconnect ─────────────────────────────────────────
    socket.on("disconnect", (reason) => {
      console.log(`[socket] - disconnected ${email} (${role}) — ${reason}`);
    });
  });

  return io;
};