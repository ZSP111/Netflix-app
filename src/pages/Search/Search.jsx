import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Grid from '../../components/Grid/Grid'
import Spinner from '../../components/Spinner/Spinner'
import useTmdb from '../../hooks/useTmdb'

const useDebounced = (value, delay = 350) => {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return v
}

const Search = () => {
  const [params] = useSearchParams()
  const q = useDebounced((params.get('q') || '').trim())
  const { data, loading, error } = useTmdb(q ? '/search/multi' : '/trending/all/day', q ? { query: q, include_adult: false } : undefined)

  useEffect(() => {
    document.title = q ? `“${q}” - Search - Box of Movies` : 'Search - Box of Movies'
  }, [q])

  const results = (data?.results || []).flatMap((r) =>
    r.media_type === 'person' ? (r.known_for || []).map((k) => ({ ...k })) : [r],
  )
  const unique = results.filter(
    (r, i, a) =>
      (r.media_type === 'movie' || r.media_type === 'tv') &&
      (r.backdrop_path || r.poster_path) &&
      a.findIndex((x) => x.id === r.id && x.media_type === r.media_type) === i,
  )

  return (
    <div className="page">
      <h1 className="page-title">{q ? <>Results for “{q}”</> : 'Popular searches'}</h1>
      {loading && <Spinner />}
      {error && <p className="muted">Search is unavailable right now. Please try again.</p>}
      {!loading && !error && (unique.length ? <Grid items={unique} /> : <p className="empty-state">Your search for “{q}” did not have any matches. Try different keywords.</p>)}
    </div>
  )
}

export default Search
