import { useScriptureStore } from '../store/scripture.store'

export function useScriptureSearch() {
  const query = useScriptureStore((state) => state.query)
  const setQuery = useScriptureStore((state) => state.setQuery)

  return { query, setQuery }
}
