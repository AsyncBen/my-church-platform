import { Server } from 'socket.io';

export function initSocket(server: any) {
  return new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
}
