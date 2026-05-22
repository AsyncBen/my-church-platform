import { useServiceStore } from '../store/service.store'

export function useLiveService() {
  const isLive = useServiceStore((state) => state.isLive)
  const setLive = useServiceStore((state) => state.setLive)

  return { isLive, setLive }
}
