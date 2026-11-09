import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './DetailsModal.css'
import useTmdb from '../../hooks/useTmdb'
import { img, matchOf, titleOf, yearOf } from '../../api/tmdb'
import { useProfiles } from '../../context/ProfileContext'
import useDetails from '../../hooks/useDetails'
import Spinner from '../Spinner/Spinner'
import { CheckIcon, CloseIcon, PlayIcon, PlusIcon } from '../Icons'

const certificationOf = (data, type) => {
  if (type === 'tv') return data.content_ratings?.results?.find((r) => r.iso_3166_1 === 'US')?.rating
  const us = data.release_dates?.results?.find((r) => r.iso_3166_1 === 'US')
  return us?.release_dates?.find((d) => d.certification)?.certification
}

const runtimeOf = (data, type) => {
  if (type === 'tv') {
    const n = data.number_of_seasons
    return n ? `${n} Season${n > 1 ? 's' : ''}` : null
  }
  if (!data.runtime) return null
  const h = Math.floor(data.runtime / 60)
  return `${h ? `${h}h ` : ''}${data.runtime % 60}m`
}

const Episodes = ({ show }) => {
  const seasons = (show.seasons || []).filter((s) => s.season_number > 0 && s.episode_count > 0)
  const [season, setSeason] = useState(seasons[0]?.season_number)
  const { data, loading } = useTmdb(season ? `/tv/${show.id}/season/${season}` : null)
  const navigate = useNavigate()
  if (!seasons.length) return null

  return (
    <section className="dm-section">
      <div className="dm-episodes-head">
        <h3>Episodes</h3>
        <select value={season} onChange={(e) => setSeason(Number(e.target.value))} aria-label="Season">
          {seasons.map((s) => (
            <option key={s.id} value={s.season_number}>
              {s.name} ({s.episode_count} Episodes)
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <ol className="dm-episodes">
          {(data?.episodes || []).map((ep) => (
            <li key={ep.id} onClick={() => navigate(`/watch/tv/${show.id}?s=${season}&e=${ep.episode_number}`)}>
              <span className="ep-num">{ep.episode_number}</span>
              <div className="ep-still">
                {ep.still_path ? <img src={img(ep.still_path, 'w300')} alt="" loading="lazy" /> : null}
                <span className="ep-play"><PlayIcon size={18} /></span>
              </div>
              <div className="ep-body">
                <div className="ep-top">
                  <strong>{ep.name}</strong>
                  {ep.runtime ? <span>{ep.runtime}m</span> : null}
                </div>
                <p>{ep.overview || 'No description available.'}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

const DetailsModal = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const openDetails = useDetails()
  const { inList, toggleList } = useProfiles()
  const info = new URLSearchParams(location.search).get('info')
  const [type, id] = info ? info.split('-') : []
  const valid = (type === 'movie' || type === 'tv') && id
  const { data, loading, error } = useTmdb(valid ? `/${type}/${id}` : null, {
    append_to_response: `credits,similar,recommendations,${type === 'tv' ? 'content_ratings' : 'release_dates'}`,
  })

  const close = () => {
    const params = new URLSearchParams(location.search)
    params.delete('info')
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true })
  }

  useEffect(() => {
    if (!valid) return
    const onKey = (e) => e.key === 'Escape' && close()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valid, location.search])

  useEffect(() => {
    document.querySelector('.dm-dialog')?.scrollTo({ top: 0 })
  }, [info])

  if (!valid) return null

  const saved = data ? inList(data.id, type) : false
  const title = data ? titleOf(data) : ''
  const cert = data ? certificationOf(data, type) : null
  const more = data
    ? [...(data.recommendations?.results || []), ...(data.similar?.results || [])]
        .filter((v, i, a) => v.backdrop_path && a.findIndex((x) => x.id === v.id) === i)
        .slice(0, 12)
    : []
  const cast = data?.credits?.cast?.slice(0, 6) || []
  const creators =
    type === 'tv'
      ? data?.created_by?.map((c) => c.name)
      : data?.credits?.crew?.filter((c) => c.job === 'Director').map((c) => c.name)

  return (
    <div className="dm-overlay" onClick={close}>
      <div className="dm-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <button className="dm-close" onClick={close} aria-label="Close">
          <CloseIcon />
        </button>
        {loading && <Spinner />}
        {error && <p className="dm-error">Couldn’t load this title. Please try again later.</p>}
        {data && (
          <>
            <div className="dm-hero">
              {data.backdrop_path && <img src={img(data.backdrop_path, 'w1280')} alt="" />}
              <div className="dm-hero-shade" />
              <div className="dm-hero-content">
                <h2>{title}</h2>
                <div className="dm-btns">
                  <button className="btn btn-light" onClick={() => navigate(`/watch/${type}/${data.id}`)}>
                    <PlayIcon /> Play
                  </button>
                  <button
                    className="circle-btn dm-round"
                    aria-label={saved ? 'Remove from My List' : 'Add to My List'}
                    onClick={() => {
                      const added = toggleList(data, type)
                      toast.success(added ? `Added “${title}” to My List` : `Removed “${title}” from My List`, {
                        autoClose: 1800,
                      })
                    }}
                  >
                    {saved ? <CheckIcon /> : <PlusIcon />}
                  </button>
                </div>
              </div>
            </div>
            <div className="dm-body">
              <div className="dm-cols">
                <div>
                  <div className="dm-meta">
                    {matchOf(data) && <span className="match">{matchOf(data)}% Match</span>}
                    <span>{yearOf(data)}</span>
                    {cert && <span className="badge">{cert}</span>}
                    {runtimeOf(data, type) && <span>{runtimeOf(data, type)}</span>}
                    <span className="badge">HD</span>
                  </div>
                  {data.tagline && <p className="dm-tagline">{data.tagline}</p>}
                  <p className="dm-overview">{data.overview}</p>
                </div>
                <div className="dm-facts">
                  {cast.length > 0 && (
                    <p>
                      <span>Cast: </span>
                      {cast.map((c) => c.name).join(', ')}
                    </p>
                  )}
                  {data.genres?.length > 0 && (
                    <p>
                      <span>Genres: </span>
                      {data.genres.map((g) => g.name).join(', ')}
                    </p>
                  )}
                  {creators?.length > 0 && (
                    <p>
                      <span>{type === 'tv' ? 'Creators: ' : 'Director: '}</span>
                      {creators.join(', ')}
                    </p>
                  )}
                  {data.spoken_languages?.length > 0 && (
                    <p>
                      <span>Languages: </span>
                      {data.spoken_languages.map((l) => l.english_name).join(', ')}
                    </p>
                  )}
                </div>
              </div>

              {type === 'tv' && <Episodes key={data.id} show={data} />}

              {more.length > 0 && (
                <section className="dm-section">
                  <h3>More Like This</h3>
                  <div className="dm-more">
                    {more.map((m) => (
                      <button key={m.id} className="dm-more-card" onClick={() => openDetails(m.media_type || type, m.id)}>
                        <img src={img(m.backdrop_path, 'w500')} alt="" loading="lazy" />
                        <div className="dm-more-body">
                          <div className="dm-meta">
                            {matchOf(m) && <span className="match">{matchOf(m)}% Match</span>}
                            <span>{yearOf(m)}</span>
                          </div>
                          <strong>{titleOf(m)}</strong>
                          <p>{m.overview}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DetailsModal
