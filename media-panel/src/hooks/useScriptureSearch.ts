import { useMemo } from 'react'
import { useScriptureStore } from '../store/scripture.store'
import { SCRIPTURES_DB } from '../utils/media-data'
import type { Scripture } from '../types/media.types'

export function useScriptureSearch() {
  const query = useScriptureStore((state) => state.query)
  const setQuery = useScriptureStore((state) => state.setQuery)

  const results = useMemo(() => {
    if (query.length < 2) {
      return [] as Scripture[]
    }

    const search = query.toLowerCase()
    return SCRIPTURES_DB.filter((scripture) => scripture.ref.toLowerCase().includes(search) || scripture.text.toLowerCase().includes(search)).slice(0, 5)
  }, [query])

  const clearSearch = () => setQuery('')

  return { query, setQuery, results, clearSearch }
}
