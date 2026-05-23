import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "../sockets/socket.auth";
import { registerServiceEvents } from "../sockets/service.events";
import { registerScriptureEvents } from "../sockets/scripture.events";
import { registerAnnouncementEvents } from "../sockets/announcement.events";
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

  // ── Auth middleware — runs before every connection ─────
  io.use(socketAuthMiddleware);

  // ── Connection handler ─────────────────────────────────
  io.on("connection", (socket) => {
    const { userId, email, role } = socket.data;

    console.log(`[socket] connected — ${email} (${role}) [${socket.id}]`);

    // Join a role-based room — useful for targeted broadcasts later
    socket.join(`role:${role}`);
    socket.join(`user:${userId}`);

    // Register all event groups
    registerServiceEvents(io, socket);
    registerScriptureEvents(io, socket);
    registerAnnouncementEvents(io, socket);

    // ── Disconnect ───────────────────────────────────────
    socket.on("disconnect", (reason) => {
      console.log(`[socket] disconnected — ${email} (${reason})`);
    });
  });

  return io;
};