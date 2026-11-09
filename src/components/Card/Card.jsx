import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './Card.css'
import { getGenres, img, matchOf, mediaTypeOf, titleOf, yearOf } from '../../api/tmdb'
import { useProfiles } from '../../context/ProfileContext'
import useDetails from '../../hooks/useDetails'
import { CheckIcon, ChevronDown, PlayIcon, PlusIcon } from '../Icons'

const Card = ({ item, type, rank }) => {
  const navigate = useNavigate()
  const openDetails = useDetails()
  const { inList, toggleList } = useProfiles()
  const [genres, setGenres] = useState({})
  const mediaType = mediaTypeOf(item, type)
  const title = titleOf(item)
  const saved = inList(item.id, mediaType)
  const image = rank
    ? img(item.poster_path, 'w342') || img(item.backdrop_path, 'w500')
    : img(item.backdrop_path, 'w500') || img(item.poster_path, 'w342')
  const match = matchOf(item)

  useEffect(() => {
    getGenres().then(setGenres)
  }, [])

  const play = (e) => {
    e.stopPropagation()
    navigate(`/watch/${mediaType}/${item.id}`)
  }
  const toggle = (e) => {
    e.stopPropagation()
    const added = toggleList(item, mediaType)
    toast.success(added ? `Added “${title}” to My List` : `Removed “${title}” from My List`, { autoClose: 1800 })
  }
  const info = (e) => {
    e.stopPropagation()
    openDetails(mediaType, item.id)
  }

  return (
    <div
      className={`card ${rank ? 'card-ranked' : ''}`}
      onClick={info}
      onKeyDown={(e) => e.key === 'Enter' && info(e)}
      role="button"
      tabIndex={0}
      aria-label={title}
    >
      {rank && <span className="card-rank">{rank}</span>}
      <div className="card-media">
        {image ? (
          <img src={image} alt={title} loading="lazy" />
        ) : (
          <div className="card-fallback">{title}</div>
        )}
        <p className="card-title">{title}</p>
        <div className="card-hover">
          <div className="card-actions">
            <button className="circle-btn circle-btn-light" onClick={play} aria-label={`Play ${title}`}>
              <PlayIcon size={16} />
            </button>
            <button className="circle-btn" onClick={toggle} aria-label={saved ? 'Remove from My List' : 'Add to My List'}>
              {saved ? <CheckIcon size={16} /> : <PlusIcon size={16} />}
            </button>
            <button className="circle-btn push-right" onClick={info} aria-label="More info">
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="card-meta">
            {match && <span className="match">{match}% Match</span>}
            {yearOf(item) && <span>{yearOf(item)}</span>}
            <span className="badge">{mediaType === 'tv' ? 'Series' : 'Movie'}</span>
          </div>
          <div className="card-genres">
            {(item.genre_ids || [])
              .slice(0, 3)
              .map((g) => genres[g])
              .filter(Boolean)
              .join(' • ')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
