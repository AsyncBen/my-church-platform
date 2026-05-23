import { Server, Socket } from "socket.io";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
  AnnouncementPayload,
} from "../types/socket.types";

type AppServer = Server<ClientToServerEvents, ServerToClientEvents>;
type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, any, SocketData>;

const ALLOWED_ROLES = ["ADMIN", "PASTOR", "SECRETARY"];

export const registerAnnouncementEvents = (io: AppServer, socket: AppSocket) => {
  const { role, email } = socket.data;

  socket.on("announcement:update", (payload: AnnouncementPayload) => {
    if (!ALLOWED_ROLES.includes(role)) {
      console.warn(`[socket] Unauthorized announcement:update attempt by ${email} (${role})`);
      return;
    }

    if (!payload.title || !payload.body) {
      console.warn(`[socket] announcement:update missing fields from ${email}`);
      return;
    }

    const enriched: AnnouncementPayload = {
      ...payload,
      postedBy: email,
      postedAt: new Date().toISOString(),
    };

    console.log(`[socket] announcement:update — "${enriched.title}" by ${email}`);

    // Broadcast to ALL connected clients
    io.emit("announcement:update", enriched);
  });
};