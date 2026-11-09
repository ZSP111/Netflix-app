import { Link } from 'react-router-dom'
import Logo from '../../components/Logo/Logo'

const NotFound = () => (
  <div className="not-found">
    <Logo size="lg" />
    <h1>Lost your way?</h1>
    <p>Sorry, we can’t find that page. You’ll find lots to explore on the home page.</p>
    <Link to="/browse" className="btn btn-light">
      Box of Movies Home
    </Link>
    <span className="muted">Error code: 404</span>
  </div>
)

export default NotFound
