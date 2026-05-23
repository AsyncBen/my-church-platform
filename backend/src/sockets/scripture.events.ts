import { Server, Socket } from "socket.io";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
  ScripturePayload,
} from "../types/socket.types";
import { liveState } from "../services/live-state.store";
import { validate, scripturePayloadSchema } from "../modules/live-service/validators/event.validators";

type AppServer = Server<ClientToServerEvents, ServerToClientEvents>;
type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, any, SocketData>;

const ALLOWED_ROLES = ["ADMIN", "PASTOR", "MEDIA"];

export const registerScriptureEvents = (io: AppServer, socket: AppSocket) => {
  const { role, email } = socket.data;

  socket.on("scripture:update", (raw) => {
    if (!ALLOWED_ROLES.includes(role)) {
      console.warn(`[socket] Unauthorized scripture:update by ${email} (${role})`);
      return;
    }
    try {
      const payload = validate(scripturePayloadSchema, raw);
      liveState.updateScripture(payload);
      console.log(`[socket] scripture:update — ${payload.reference} by ${email}`);
      // Congregation + leadership + media — not admin-only tools
      io.to("role:MEMBER")
        .to("role:MEDIA")
        .to("role:PASTOR")
        .to("role:SECRETARY")
        .to("role:ADMIN")
        .emit("scripture:update", payload);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid payload";
      console.warn(`[socket] scripture:update error from ${email}: ${msg}`);
    }
  });
};