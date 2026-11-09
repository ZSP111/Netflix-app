import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import './Player.css'
import { pickTrailer, titleOf, tmdb } from '../../api/tmdb'
import { useProfiles } from '../../context/ProfileContext'
import Spinner from '../../components/Spinner/Spinner'
import { ArrowLeft } from '../../components/Icons'

const Player = () => {
  const { type: rawType, id } = useParams()
  const type = rawType === 'tv' ? 'tv' : 'movie'
  const [params] = useSearchParams()
  const season = params.get('s')
  const episode = params.get('e')
  const navigate = useNavigate()
  const { addToHistory } = useProfiles()
  const [state, setState] = useState({ loading: true, video: null, item: null, error: null })

  useEffect(() => {
    let alive = true
    setState({ loading: true, video: null, item: null, error: null })
    const details = tmdb(`/${type}/${id}`, { append_to_response: 'videos' })
    const episodeVideos =
      type === 'tv' && season && episode
        ? tmdb(`/tv/${id}/season/${season}/episode/${episode}/videos`).catch(() => ({ results: [] }))
        : Promise.resolve({ results: [] })

    Promise.all([details, episodeVideos])
      .then(([item, epVideos]) => {
        if (!alive) return
        const video = pickTrailer(epVideos.results) || pickTrailer(item.videos?.results)
        setState({ loading: false, video, item, error: null })
        addToHistory(item, type)
        document.title = `${titleOf(item)} - Box of Movies`
      })
      .catch((error) => alive && setState({ loading: false, video: null, item: null, error }))
    return () => {
      alive = false
    }
  }, [type, id, season, episode, addToHistory])

  const back = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/browse'))

  const { loading, video, item, error } = state
  const subtitle = type === 'tv' && season && episode ? `S${season}:E${episode}` : video?.name

  return (
    <div className="player">
      <button className="player-back" onClick={back} aria-label="Back">
        <ArrowLeft size={34} />
      </button>
      {loading && <Spinner full />}
      {!loading && video && (
        <>
          <iframe
            src={`https://www.youtube.com/embed/${video.key}?autoplay=1&rel=0&modestbranding=1&playsinline=1&origin=${encodeURIComponent(window.location.origin)}`}
            title={video.name}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <div className="player-info">
            <strong>{item && titleOf(item)}</strong>
            <span>{subtitle}</span>
            <span>{video.type}</span>
            {video.published_at && <span>{video.published_at.slice(0, 10)}</span>}
          </div>
        </>
      )}
      {!loading && !video && (
        <div className="player-empty">
          <h2>{error ? 'Something went wrong' : 'No video available'}</h2>
          <p>
            {error
              ? 'We couldn’t load this title. Please check your connection and try again.'
              : `There’s no trailer available for ${item ? `“${titleOf(item)}”` : 'this title'} yet.`}
          </p>
          <Link className="btn btn-light" to="/browse">
            Back to Browse
          </Link>
        </div>
      )}
    </div>
  )
}

export default Player
