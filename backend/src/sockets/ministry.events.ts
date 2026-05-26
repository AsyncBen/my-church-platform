import { Server, Socket } from 'socket.io'
import { ServerToClientEvents, ClientToServerEvents, SocketData } from '../types/socket.types'

type AppServer = Server<ClientToServerEvents, ServerToClientEvents>
type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, any, SocketData>

export const registerMinistryEvents = (io: AppServer, socket: AppSocket) => {
  socket.on('ministry:join_room', ({ groupId }) => {
    socket.join(`ministry:${groupId}`)
    console.log(`[socket] ${socket.data.email} joined ministry room: ${groupId}`)
  })

  socket.on('ministry:leave_room', ({ groupId }) => {
    socket.leave(`ministry:${groupId}`)
  })
}

export const broadcastMinistryMessage = (
  io: AppServer,
  groupId: string,
  message: { id: string; text: string; createdAt: string; user: { name: string } }
) => {
  io.to(`ministry:${groupId}`).emit('ministry:message', { groupId, message })
}