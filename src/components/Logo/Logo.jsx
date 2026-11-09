import './Logo.css'

/** "Box of Movies" wordmark: an open box with a play button + text. */
const Logo = ({ size = 'md' }) => (
  <span className={`logo logo-${size}`} aria-label="Box of Movies">
    <svg className="logo-mark" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="bom-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb347" />
          <stop offset="1" stopColor="#ff5e2b" />
        </linearGradient>
      </defs>
      <path d="M6 16 24 7l18 9v18l-18 9-18-9Z" fill="url(#bom-g)" />
      <path d="M6 16l18 9 18-9M24 25v18" stroke="#1a0b05" strokeWidth="2" fill="none" opacity=".35" />
      <path d="M19 19.5v11l9-5.5Z" fill="#fff" />
    </svg>
    <span className="logo-text">
      BOX<span className="logo-of">of</span>MOVIES
    </span>
  </span>
)

export default Logo
