import { useEffect } from 'react'
import { socket } from '../services/socket'

export function useSocket<EventPayload extends any[]>(event: string, callback: (...args: EventPayload) => void) {
  useEffect(() => {
    socket.on(event, callback)
    return () => {
      socket.off(event, callback)
    }
  }, [event, callback])
}
