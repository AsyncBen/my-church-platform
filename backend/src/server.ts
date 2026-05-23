import http from "http";
import app from "./app";
import { PORT } from "./config/env";
import { initSocket } from "./config/socket";

const server = http.createServer(app);

// Socket.IO — all connection logging is inside initSocket
initSocket(server);

server.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT}`);
});