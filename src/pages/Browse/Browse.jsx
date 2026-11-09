import { useEffect } from 'react'
import Hero from '../../components/Hero/Hero'
import Row from '../../components/Row/Row'
import { PAGES } from '../../api/rows'
import { useProfiles } from '../../context/ProfileContext'

const TITLES = { home: 'Home', tv: 'TV Shows', movies: 'Movies', latest: 'New & Popular', kids: 'Kids' }

const Browse = ({ page = 'home' }) => {
  const config = PAGES[page]
  const { list, history } = useProfiles()

  useEffect(() => {
    document.title = `${TITLES[page]} - Box of Movies`
  }, [page])

  return (
    <div className="browse">
      <Hero key={page} path={config.heroPath} params={config.heroParams} type={config.heroType} />
      <div className="browse-rows">
        {config.rows.map((row) =>
          row.local ? (
            <Row key={row.id} title={row.title} items={row.local === 'list' ? list : history} />
          ) : (
            <Row key={row.id} {...row} />
          ),
        )}
      </div>
    </div>
  )
}

export default Browse
