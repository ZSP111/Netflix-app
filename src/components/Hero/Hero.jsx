import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './Hero.css'
import useTmdb from '../../hooks/useTmdb'
import { img, matchOf, mediaTypeOf, tmdb, titleOf, yearOf } from '../../api/tmdb'
import { useProfiles } from '../../context/ProfileContext'
import useDetails from '../../hooks/useDetails'
import { CheckIcon, InfoIcon, PlayIcon, PlusIcon } from '../Icons'

const Hero = ({ path, params, type }) => {
  const { data, loading } = useTmdb(path, params)
  const navigate = useNavigate()
  const openDetails = useDetails()
  const { inList, toggleList } = useProfiles()
  const [logo, setLogo] = useState(null)
  const [seed] = useState(() => Math.random())

  const item = useMemo(() => {
    const pool = (data?.results || []).filter((i) => i.backdrop_path && i.overview).slice(0, 10)
    return pool.length ? pool[Math.floor(seed * pool.length)] : null
  }, [data, seed])

  const mediaType = item ? mediaTypeOf(item, type) : null

  useEffect(() => {
    setLogo(null)
    if (!item) return
    tmdb(`/${mediaType}/${item.id}/images`, { include_image_language: 'en,null', language: '' })
      .then((res) => {
        const l = (res.logos || []).find((x) => x.iso_639_1 === 'en') || res.logos?.[0]
        if (l) setLogo(img(l.file_path, 'w500'))
      })
      .catch(() => {})
  }, [item, mediaType])

  if (loading) return <div className="hero hero-loading" />
  if (!item) return <div className="hero-spacer" />

  const title = titleOf(item)
  const saved = inList(item.id, mediaType)

  return (
    <header className="hero">
      <img className="hero-bg" src={img(item.backdrop_path, 'original')} alt="" />
      <div className="hero-shade" />
      <div className="hero-content">
        {logo ? <img className="hero-logo" src={logo} alt={title} /> : <h1 className="hero-title">{title}</h1>}
        <div className="hero-meta">
          {matchOf(item) && <span className="match">{matchOf(item)}% Match</span>}
          <span>{yearOf(item)}</span>
          <span className="badge">{mediaType === 'tv' ? 'Series' : 'Movie'}</span>
        </div>
        <p className="hero-overview">{item.overview}</p>
        <div className="hero-btns">
          <button className="btn btn-light" onClick={() => navigate(`/watch/${mediaType}/${item.id}`)}>
            <PlayIcon /> Play
          </button>
          <button className="btn btn-gray" onClick={() => openDetails(mediaType, item.id)}>
            <InfoIcon /> More Info
          </button>
          <button
            className="circle-btn hero-list-btn"
            aria-label={saved ? 'Remove from My List' : 'Add to My List'}
            onClick={() => {
              const added = toggleList(item, mediaType)
              toast.success(added ? `Added “${title}” to My List` : `Removed “${title}” from My List`, { autoClose: 1800 })
            }}
          >
            {saved ? <CheckIcon /> : <PlusIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Hero
