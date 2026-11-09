import { Link } from 'react-router-dom'
import './Footer.css'
import youtube_icon from '../../assets/youtube_icon.png'
import twitter_icon from '../../assets/twitter_icon.png'
import instagram_icon from '../../assets/instagram_icon.png'
import facebook_icon from '../../assets/facebook_icon.png'

const LINKS = [
  ['FAQ', '/info#faq'],
  ['Help Center', '/info#help'],
  ['Account', '/profiles?manage=1'],
  ['Media Center', '/info#about'],
  ['Ways to Watch', '/info#devices'],
  ['Terms of Use', '/info#terms'],
  ['Privacy', '/info#privacy'],
  ['Cookie Preferences', '/info#privacy'],
  ['Corporate Information', '/info#about'],
  ['Contact Us', '/info#contact'],
  ['Speed Test', '/info#devices'],
  ['Legal Notices', '/info#terms'],
]

const Footer = () => (
  <footer className="footer">
    <div className="footer-icons">
      <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
        <img src={facebook_icon} alt="" />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
        <img src={instagram_icon} alt="" />
      </a>
      <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X / Twitter">
        <img src={twitter_icon} alt="" />
      </a>
      <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
        <img src={youtube_icon} alt="" />
      </a>
    </div>
    <ul>
      {LINKS.map(([label, to]) => (
        <li key={label}>
          <Link to={to}>{label}</Link>
        </li>
      ))}
    </ul>
    <p className="footer-tmdb">
      Movie and TV data provided by{' '}
      <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
        TMDB
      </a>
      . This product uses the TMDB API but is not endorsed or certified by TMDB.
    </p>
    <p className="copyright-text">© {new Date().getFullYear()} Box of Movies</p>
  </footer>
)

export default Footer
