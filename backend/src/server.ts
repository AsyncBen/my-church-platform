import http from 'http';
import app from './app';
import { PORT } from './config/env';
import { initSocket } from './config/socket';

const server = http.createServer(app);
const io = initSocket(server);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
