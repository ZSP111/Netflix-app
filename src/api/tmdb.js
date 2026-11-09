import { TMDB_TOKEN } from '../config'

const BASE = 'https://api.themoviedb.org/3'
const cache = new Map()

/** GET a TMDB endpoint. Responses are cached for the session. */
export function tmdb(path, params = {}) {
  const url = new URL(BASE + path)
  url.searchParams.set('language', 'en-US')
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
  })
  const key = url.toString()
  if (cache.has(key)) return cache.get(key)

  const request = fetch(key, {
    headers: { accept: 'application/json', Authorization: `Bearer ${TMDB_TOKEN}` },
  }).then((res) => {
    if (!res.ok) throw new Error(`TMDB request failed (${res.status})`)
    return res.json()
  })
  cache.set(key, request)
  request.catch(() => cache.delete(key))
  return request
}

export const img = (path, size = 'w500') => (path ? `https://image.tmdb.org/t/p/${size}${path}` : null)

export const mediaTypeOf = (item, fallback) =>
  item.media_type || fallback || (item.first_air_date !== undefined || (item.name && !item.title) ? 'tv' : 'movie')

export const titleOf = (item) => item.title || item.name || item.original_title || item.original_name || ''

export const yearOf = (item) => (item.release_date || item.first_air_date || '').slice(0, 4)

export const matchOf = (item) => (item.vote_average ? Math.round(item.vote_average * 10) : null)

/** Keep only the fields we need when saving an item locally. */
export const slim = (item, type) => ({
  id: item.id,
  media_type: mediaTypeOf(item, type),
  title: item.title,
  name: item.name,
  overview: item.overview,
  backdrop_path: item.backdrop_path,
  poster_path: item.poster_path,
  vote_average: item.vote_average,
  release_date: item.release_date,
  first_air_date: item.first_air_date,
  genre_ids: item.genre_ids || (item.genres || []).map((g) => g.id),
})

/** Pick the best YouTube video: official trailer > trailer > teaser > anything. */
export const pickTrailer = (videos = []) => {
  const yt = videos.filter((v) => v.site === 'YouTube')
  return (
    yt.find((v) => v.type === 'Trailer' && v.official) ||
    yt.find((v) => v.type === 'Trailer') ||
    yt.find((v) => v.type === 'Teaser') ||
    yt[0] ||
    null
  )
}

let genrePromise
export const getGenres = () => {
  if (!genrePromise) {
    genrePromise = Promise.all([tmdb('/genre/movie/list'), tmdb('/genre/tv/list')])
      .then(([m, t]) => {
        const map = {}
        ;[...m.genres, ...t.genres].forEach((g) => (map[g.id] = g.name))
        return map
      })
      .catch(() => {
        genrePromise = undefined
        return {}
      })
  }
  return genrePromise
}
