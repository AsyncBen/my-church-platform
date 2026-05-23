import { Server, Socket } from "socket.io";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
  ServicePayload,
} from "../types/socket.types";

type AppServer = Server<ClientToServerEvents, ServerToClientEvents>;
type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, any, SocketData>;

const ALLOWED_ROLES = ["ADMIN", "PASTOR", "SECRETARY"];

export const registerServiceEvents = (io: AppServer, socket: AppSocket) => {
  const { role, email } = socket.data;

  // ── service:start ─────────────────────────────────────
  socket.on("service:start", (payload: ServicePayload) => {
    if (!ALLOWED_ROLES.includes(role)) {
      socket.emit("service:start", {
        ...payload,
        title: "UNAUTHORIZED",
        startedBy: email,
      });
      console.warn(`[socket] Unauthorized service:start attempt by ${email} (${role})`);
      return;
    }

    const enriched: ServicePayload = {
      ...payload,
      startedBy: email,
      startedAt: new Date().toISOString(),
    };

    console.log(`[socket] service:start — "${enriched.title}" by ${email}`);
    // Broadcast to ALL connected clients including sender
    io.emit("service:start", enriched);
  });

  // ── service:end ───────────────────────────────────────
  socket.on("service:end", (payload: ServicePayload) => {
    if (!ALLOWED_ROLES.includes(role)) {
      console.warn(`[socket] Unauthorized service:end attempt by ${email} (${role})`);
      return;
    }

    const enriched: ServicePayload = {
      ...payload,
      endedAt: new Date().toISOString(),
    };

    console.log(`[socket] service:end — "${enriched.title}" by ${email}`);
    io.emit("service:end", enriched);
  });
};