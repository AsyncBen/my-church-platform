import http from "http";
import app from "./app";
import { PORT } from "./config/env";
import { initSocket } from "./config/socket";

const server = http.createServer(app);

// Socket.IO — all connection logging is inside initSocket
const io = initSocket(server);

// Store io instance in app for access in controllers
app.set('io', io);

server.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT}`);
});