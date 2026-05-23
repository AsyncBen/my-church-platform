import { Server, Socket } from "socket.io";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
  ScripturePayload,
} from "../types/socket.types";

type AppServer = Server<ClientToServerEvents, ServerToClientEvents>;
type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, any, SocketData>;

// Only MEDIA and above can push scripture to the screens
const ALLOWED_ROLES = ["ADMIN", "PASTOR", "MEDIA"];

export const registerScriptureEvents = (io: AppServer, socket: AppSocket) => {
  const { role, email } = socket.data;

  socket.on("scripture:update", (payload: ScripturePayload) => {
    if (!ALLOWED_ROLES.includes(role)) {
      console.warn(`[socket] Unauthorized scripture:update attempt by ${email} (${role})`);
      return;
    }

    if (!payload.reference || !payload.text) {
      console.warn(`[socket] scripture:update missing fields from ${email}`);
      return;
    }

    console.log(`[socket] scripture:update — ${payload.reference} by ${email}`);

    // Broadcast to ALL — congregation screens update instantly
    io.emit("scripture:update", {
      reference: payload.reference,
      text:      payload.text,
    });
  });
};