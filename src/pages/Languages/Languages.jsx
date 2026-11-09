import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Grid from '../../components/Grid/Grid'
import Spinner from '../../components/Spinner/Spinner'
import { tmdb } from '../../api/tmdb'
import './Languages.css'

const LANGUAGES = [
  ['en', 'English'], ['es', 'Spanish'], ['fr', 'French'], ['ko', 'Korean'], ['ja', 'Japanese'],
  ['hi', 'Hindi'], ['te', 'Telugu'], ['ta', 'Tamil'], ['it', 'Italian'], ['de', 'German'],
  ['tr', 'Turkish'], ['zh', 'Chinese'], ['pt', 'Portuguese'], ['ar', 'Arabic'], ['yo', 'Yoruba'],
  ['sv', 'Swedish'], ['da', 'Danish'], ['th', 'Thai'], ['pl', 'Polish'], ['nl', 'Dutch'],
]
const SORTS = [
  ['popularity.desc', 'Suggestions for you'],
  ['primary_release_date.desc', 'Release date'],
  ['vote_average.desc', 'Top rated'],
  ['title.asc', 'A–Z'],
]

const Languages = () => {
  const [params, setParams] = useSearchParams()
  const lang = params.get('lang') || 'ko'
  const type = params.get('type') === 'tv' ? 'tv' : 'movie'
  const sort = params.get('sort') || 'popularity.desc'
  const [state, setState] = useState({ items: [], page: 0, totalPages: 1, loading: true, error: null })

  const sortParam = type === 'tv' ? sort.replace('primary_release_date', 'first_air_date').replace('title', 'name') : sort

  const load = (page, reset) => {
    setState((s) => ({ ...s, loading: true, error: null }))
    tmdb(`/discover/${type}`, {
      with_original_language: lang,
      sort_by: sortParam,
      page,
      'vote_count.gte': sort.startsWith('vote') ? 200 : 10,
      include_adult: false,
    })
      .then((res) =>
        setState((s) => ({
          items: [...(reset ? [] : s.items), ...res.results.filter((r) => r.backdrop_path || r.poster_path)],
          page,
          totalPages: res.total_pages,
          loading: false,
          error: null,
        })),
      )
      .catch((error) => setState((s) => ({ ...s, loading: false, error })))
  }

  useEffect(() => {
    document.title = 'Browse by Languages - Box of Movies'
    load(1, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, type, sort])

  const set = (key, value) => {
    const next = new URLSearchParams(params)
    next.set(key, value)
    setParams(next, { replace: true })
  }

  return (
    <div className="page">
      <div className="lang-head">
        <h1 className="page-title">Browse by Languages</h1>
        <div className="lang-controls">
          <label>
            Type
            <select value={type} onChange={(e) => set('type', e.target.value)}>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>
          </label>
          <label>
            Language
            <select value={lang} onChange={(e) => set('lang', e.target.value)}>
              {LANGUAGES.map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </label>
          <label>
            Sort by
            <select value={sort} onChange={(e) => set('sort', e.target.value)}>
              {SORTS.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <Grid items={state.items} type={type} />
      {state.loading && <Spinner />}
      {state.error && <p className="muted">Couldn’t load titles. Please try again.</p>}
      {!state.loading && !state.items.length && !state.error && <p className="empty-state">No titles found.</p>}
      {!state.loading && state.page < state.totalPages && state.items.length > 0 && (
        <div className="load-more">
          <button className="btn btn-gray" onClick={() => load(state.page + 1)}>
            Load more
          </button>
        </div>
      )}
    </div>
  )
}

export default Languages
