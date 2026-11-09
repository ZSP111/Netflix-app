import { useEffect, useRef, useState } from 'react'
import './Row.css'
import Card from '../Card/Card'
import useTmdb from '../../hooks/useTmdb'
import { ChevronLeft, ChevronRight } from '../Icons'

/** A horizontally scrolling row of titles. Pass either `items` or a TMDB `path`. */
const Row = ({ title, path, params, type, items, top10 = false }) => {
  const { data, loading, error } = useTmdb(items ? null : path, params)
  const ref = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  let list = items || (data?.results || []).filter((i) => i.backdrop_path || i.poster_path)
  if (top10) list = list.slice(0, 10)

  const updateEdges = () => {
    const el = ref.current
    if (!el) return
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
  }
  useEffect(updateEdges, [list.length])

  const scroll = (dir) => {
    const el = ref.current
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' })
  }

  if (!items && !loading && (error || !list.length)) return null
  if (items && !items.length) return null

  return (
    <section className="row">
      <h2 className="row-title">{title}</h2>
      <div className="row-viewport">
        {!edges.start && (
          <button className="row-arrow left" onClick={() => scroll(-1)} aria-label="Scroll left">
            <ChevronLeft />
          </button>
        )}
        <div className={`row-track ${top10 ? 'row-top10' : ''}`} ref={ref} onScroll={updateEdges}>
          {loading
            ? Array.from({ length: 8 }, (_, i) => <div key={i} className="card-skeleton" />)
            : list.map((item, i) => (
                <Card key={`${item.media_type || type}-${item.id}`} item={item} type={type} rank={top10 ? i + 1 : null} />
              ))}
        </div>
        {!edges.end && (
          <button className="row-arrow right" onClick={() => scroll(1)} aria-label="Scroll right">
            <ChevronRight />
          </button>
        )}
      </div>
    </section>
  )
}

export default Row
