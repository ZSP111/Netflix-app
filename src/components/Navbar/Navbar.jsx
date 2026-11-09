import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'
import Logo from '../Logo/Logo'
import Avatar from '../Avatar/Avatar'
import { BellIcon, ChevronDown, CloseIcon, PencilIcon, SearchIcon } from '../Icons'
import { logout } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { useProfiles } from '../../context/ProfileContext'
import useTmdb from '../../hooks/useTmdb'
import useDetails from '../../hooks/useDetails'
import { img, titleOf } from '../../api/tmdb'

const LINKS = [
  { to: '/browse', label: 'Home', end: true },
  { to: '/browse/tv', label: 'TV Shows' },
  { to: '/browse/movies', label: 'Movies' },
  { to: '/latest', label: 'New & Popular' },
  { to: '/my-list', label: 'My List' },
  { to: '/languages', label: 'Browse by Languages' },
]

const useClickOutside = (ref, onOutside) => {
  useEffect(() => {
    const handler = (e) => ref.current && !ref.current.contains(e.target) && onOutside()
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onOutside])
}

const SearchBox = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const onSearch = location.pathname === '/search'
  const [open, setOpen] = useState(onSearch)
  const [value, setValue] = useState(onSearch ? params.get('q') || '' : '')
  const inputRef = useRef(null)
  const from = useRef('/browse')

  useEffect(() => {
    if (!onSearch) {
      from.current = location.pathname + location.search
    }
  }, [onSearch, location.pathname, location.search])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const update = (q) => {
    setValue(q)
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q)}`, { replace: onSearch })
    else if (onSearch) navigate(from.current.startsWith('/search') ? '/browse' : from.current, { replace: true })
  }

  return (
    <div className={`searchbox ${open ? 'open' : ''}`}>
      <button
        className="icon-btn"
        aria-label="Search"
        onClick={() => {
          setOpen(true)
          inputRef.current?.focus()
        }}
      >
        <SearchIcon />
      </button>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => update(e.target.value)}
        onBlur={() => !value && setOpen(false)}
        placeholder="Titles, people, genres"
        aria-label="Search titles"
      />
      {open && value && (
        <button className="icon-btn search-clear" aria-label="Clear search" onClick={() => update('')}>
          <CloseIcon size={18} />
        </button>
      )}
    </div>
  )
}

const Notifications = () => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const openDetails = useDetails()
  const { data } = useTmdb('/movie/upcoming')
  const [seen, setSeen] = useState(() => {
    try {
      return localStorage.getItem('bom:notif-seen') === new Date().toDateString()
    } catch {
      return false
    }
  })
  useClickOutside(ref, () => setOpen(false))
  const items = (data?.results || []).filter((i) => i.backdrop_path).slice(0, 5)

  const toggle = () => {
    setOpen((o) => !o)
    setSeen(true)
    try {
      localStorage.setItem('bom:notif-seen', new Date().toDateString())
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="nav-menu" ref={ref}>
      <button className="icon-btn" aria-label="Notifications" onClick={toggle}>
        <BellIcon />
        {!seen && items.length > 0 && <span className="notif-dot">{items.length}</span>}
      </button>
      {open && (
        <div className="dropdown dropdown-notif">
          <p className="dropdown-heading">Coming soon</p>
          {items.map((i) => (
            <button
              key={i.id}
              className="notif-item"
              onClick={() => {
                setOpen(false)
                openDetails('movie', i.id)
              }}
            >
              <img src={img(i.backdrop_path, 'w300')} alt="" />
              <span>
                <strong>New Arrival</strong>
                {titleOf(i)}
                <small>{new Date(i.release_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</small>
              </span>
            </button>
          ))}
          {!items.length && <p className="notif-empty">No new notifications</p>}
        </div>
      )}
    </div>
  )
}

const ProfileMenu = () => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile, profiles, selectProfile } = useProfiles()
  useClickOutside(ref, () => setOpen(false))

  return (
    <div className="nav-menu" ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="profile-btn" onClick={() => setOpen(true)} aria-label="Account menu">
        <Avatar profile={profile} size={32} />
        <span className={`caret ${open ? 'up' : ''}`}>
          <ChevronDown size={16} />
        </span>
      </button>
      {open && (
        <div className="dropdown dropdown-profile">
          {profiles
            .filter((p) => p.id !== profile?.id)
            .map((p) => (
              <button
                key={p.id}
                className="dropdown-item"
                onClick={() => {
                  selectProfile(p.id)
                  setOpen(false)
                  navigate(p.kids ? '/kids' : '/browse')
                }}
              >
                <Avatar profile={p} size={28} /> {p.name}
              </button>
            ))}
          <button className="dropdown-item" onClick={() => navigate('/profiles?manage=1')}>
            <PencilIcon size={18} /> Manage Profiles
          </button>
          <p className="dropdown-email">{user?.email}</p>
          <button
            className="dropdown-item dropdown-signout"
            onClick={async () => {
              await logout()
              navigate('/login')
            }}
          >
            Sign out of Box of Movies
          </button>
        </div>
      )}
    </div>
  )
}

const Navbar = () => {
  const [dark, setDark] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileRef = useRef(null)
  const location = useLocation()
  const { profile } = useProfiles()
  useClickOutside(mobileRef, () => setMobileOpen(false))

  useEffect(() => {
    const onScroll = () => setDark(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const links = profile?.kids ? [{ to: '/kids', label: 'Home', end: true }, LINKS[4]] : LINKS
  const current = links.find((l) => location.pathname === l.to)?.label || 'Browse'

  return (
    <nav className={`navbar ${dark ? 'nav-dark' : ''}`}>
      <div className="navbar-left">
        <Link to={profile?.kids ? '/kids' : '/browse'} className="navbar-logo">
          <Logo />
        </Link>
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="nav-mobile" ref={mobileRef}>
          <button onClick={() => setMobileOpen((o) => !o)}>
            {current} <ChevronDown size={16} />
          </button>
          {mobileOpen && (
            <ul className="dropdown nav-mobile-menu">
              {[...links, ...(profile?.kids ? [] : [{ to: '/kids', label: 'Kids' }])].map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.end}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="navbar-right">
        <SearchBox />
        {!profile?.kids && (
          <NavLink to="/kids" className="nav-kids">
            Kids
          </NavLink>
        )}
        <Notifications />
        <ProfileMenu />
      </div>
    </nav>
  )
}

export default Navbar
