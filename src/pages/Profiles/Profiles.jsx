import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import './Profiles.css'
import Logo from '../../components/Logo/Logo'
import Avatar from '../../components/Avatar/Avatar'
import { PencilIcon, PlusIcon } from '../../components/Icons'
import { AVATAR_COLORS, useProfiles } from '../../context/ProfileContext'

const MAX_PROFILES = 5

const ProfileEditor = ({ initial, onSave, onCancel, onDelete }) => {
  const [name, setName] = useState(initial?.name || '')
  const [color, setColor] = useState(initial?.color || AVATAR_COLORS[1])
  const [kids, setKids] = useState(initial?.kids || false)

  return (
    <div className="profiles-page">
      <form
        className="profile-editor"
        onSubmit={(e) => {
          e.preventDefault()
          if (name.trim()) onSave({ name: name.trim(), color, kids })
        }}
      >
        <h1>{initial ? 'Edit Profile' : 'Add Profile'}</h1>
        <p className="muted">{initial ? 'Change the name, color or maturity setting.' : 'Add a profile for another person watching Box of Movies.'}</p>
        <div className="editor-main">
          <Avatar profile={{ color, kids }} size={120} />
          <div className="editor-fields">
            <input autoFocus value={name} maxLength={20} onChange={(e) => setName(e.target.value)} placeholder="Name" aria-label="Profile name" />
            <div className="color-picker" role="radiogroup" aria-label="Avatar color">
              {AVATAR_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  role="radio"
                  aria-checked={c === color}
                  aria-label={`Color ${c}`}
                  className={c === color ? 'selected' : ''}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
            <label className="kids-toggle">
              <input type="checkbox" checked={kids} onChange={(e) => setKids(e.target.checked)} />
              Kids profile <span className="muted">— only shows titles for children</span>
            </label>
          </div>
        </div>
        <div className="editor-actions">
          <button type="submit" className="btn btn-light" disabled={!name.trim()}>
            Save
          </button>
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          {onDelete && (
            <button type="button" className="btn btn-outline" onClick={onDelete}>
              Delete Profile
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

const Profiles = () => {
  const { profiles, selectProfile, addProfile, updateProfile, removeProfile } = useProfiles()
  const navigate = useNavigate()
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const manage = params.get('manage') === '1'
  const [editing, setEditing] = useState(null) // profile object or 'new'

  useEffect(() => {
    document.title = 'Who’s watching? - Box of Movies'
  }, [])

  const choose = (p) => {
    if (manage) return setEditing(p)
    selectProfile(p.id)
    const from = location.state?.from
    const target = from && from.pathname !== '/profiles' ? from.pathname + (from.search || '') : p.kids ? '/kids' : '/browse'
    navigate(target, { replace: true })
  }

  if (editing) {
    const isNew = editing === 'new'
    return (
      <ProfileEditor
        initial={isNew ? null : editing}
        onCancel={() => setEditing(null)}
        onSave={(data) => {
          if (isNew) addProfile(data)
          else updateProfile(editing.id, data)
          setEditing(null)
        }}
        onDelete={
          !isNew && profiles.length > 1
            ? () => {
                if (window.confirm(`Delete the profile “${editing.name}”? Their My List and history will be removed.`)) {
                  removeProfile(editing.id)
                  setEditing(null)
                }
              }
            : null
        }
      />
    )
  }

  return (
    <div className="profiles-page">
      <div className="profiles-logo">
        <Logo />
      </div>
      <h1>{manage ? 'Manage Profiles:' : 'Who’s watching?'}</h1>
      <ul className="profile-list">
        {profiles.map((p) => (
          <li key={p.id}>
            <button className="profile-tile" onClick={() => choose(p)}>
              <span className="profile-avatar">
                <Avatar profile={p} size={140} />
                {manage && (
                  <span className="profile-edit-overlay">
                    <PencilIcon size={36} />
                  </span>
                )}
              </span>
              <span className="profile-name">{p.name}</span>
            </button>
          </li>
        ))}
        {profiles.length < MAX_PROFILES && (
          <li>
            <button className="profile-tile" onClick={() => setEditing('new')}>
              <span className="profile-avatar profile-add">
                <PlusIcon size={64} />
              </span>
              <span className="profile-name">Add Profile</span>
            </button>
          </li>
        )}
      </ul>
      <button
        className={`btn ${manage ? 'btn-light' : 'btn-outline'} manage-btn`}
        onClick={() => setParams(manage ? {} : { manage: '1' }, { replace: true })}
      >
        {manage ? 'Done' : 'Manage Profiles'}
      </button>
    </div>
  )
}

export default Profiles
