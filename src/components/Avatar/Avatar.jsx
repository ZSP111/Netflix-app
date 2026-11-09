import './Avatar.css'

/** Generated profile avatar: colored tile with a friendly face. */
const Avatar = ({ profile, size = 32 }) => (
  <span className="avatar" style={{ width: size, height: size, background: profile?.color || '#e8a33d' }}>
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="13" cy="15" r="2.6" fill="#fff" />
      <circle cx="27" cy="15" r="2.6" fill="#fff" />
      <path d="M11 24c4.5 6 13.5 6 18 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
    {profile?.kids && (
      <span className="avatar-kids" style={{ fontSize: Math.max(7, size * 0.15) }}>
        KIDS
      </span>
    )}
  </span>
)

export default Avatar
