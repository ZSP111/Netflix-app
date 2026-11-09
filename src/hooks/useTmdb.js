import { useEffect, useState } from 'react'
import { tmdb } from '../api/tmdb'

/** Fetch a TMDB endpoint and track loading / error state. Pass a falsy path to skip. */
export default function useTmdb(path, params) {
  const key = path ? path + JSON.stringify(params || {}) : null
  const [state, setState] = useState({ data: null, loading: !!path, error: null, key: null })

  useEffect(() => {
    if (!path) return
    let alive = true
    setState((s) => ({ ...s, loading: true, error: null }))
    tmdb(path, params)
      .then((data) => alive && setState({ data, loading: false, error: null, key }))
      .catch((error) => alive && setState({ data: null, loading: false, error, key }))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return state
}
