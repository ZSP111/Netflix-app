import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Grid from '../../components/Grid/Grid'
import { useProfiles } from '../../context/ProfileContext'

const MyList = () => {
  const { list } = useProfiles()
  useEffect(() => {
    document.title = 'My List - Box of Movies'
  }, [])

  return (
    <div className="page">
      <h1 className="page-title">My List</h1>
      {list.length ? (
        <Grid items={list} />
      ) : (
        <div className="empty-state">
          <p>You haven’t added any titles to your list yet.</p>
          <p className="muted">Tap the + button on any movie or show to save it here.</p>
          <Link to="/browse" className="btn btn-accent">
            Browse titles
          </Link>
        </div>
      )}
    </div>
  )
}

export default MyList
