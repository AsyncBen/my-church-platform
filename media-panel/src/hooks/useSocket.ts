import { useEffect } from 'react'
import { socketService } from '../services/socket'

export function useSocket<EventPayload extends any[]>(event: string, callback: (...args: EventPayload) => void) {
  useEffect(() => {
    const socket = socketService.getSocket()
    if (!socket) return

    socket.on(event, callback as any)
    return () => {
      socket.off(event, callback as any)
    }
  }, [event, callback])
}