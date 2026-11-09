import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { slim } from '../api/tmdb'

// eslint-disable-next-line react-refresh/only-export-components
export const AVATAR_COLORS = ['#e8a33d', '#3d8fe8', '#d64560', '#3dbb7a', '#8a5cf6', '#e86a3d', '#2fb8c4']

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode) – ignore */
  }
}

const ProfileContext = createContext(null)

const newId = () => Math.random().toString(36).slice(2, 10)

export function ProfileProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.uid
  const [profiles, setProfiles] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [loadedFor, setLoadedFor] = useState(null)
  const [list, setList] = useState([])
  const [history, setHistory] = useState([])

  // Load profiles whenever the signed in user changes.
  useEffect(() => {
    if (!uid) {
      setProfiles([])
      setActiveId(null)
      setLoadedFor(null)
      return
    }
    let stored = read(`bom:profiles:${uid}`, null)
    if (!stored || !stored.length) {
      const name = user.displayName || user.email?.split('@')[0] || 'Me'
      stored = [
        { id: newId(), name: name.charAt(0).toUpperCase() + name.slice(1), color: AVATAR_COLORS[0], kids: false },
        { id: newId(), name: 'Kids', color: AVATAR_COLORS[3], kids: true },
      ]
      write(`bom:profiles:${uid}`, stored)
    }
    setProfiles(stored)
    const savedActive = read(`bom:active:${uid}`, null)
    setActiveId(stored.some((p) => p.id === savedActive) ? savedActive : null)
    setLoadedFor(uid)
  }, [uid, user])

  const ready = !!uid && loadedFor === uid

  const profile = profiles.find((p) => p.id === activeId) || null
  const scope = uid && profile ? `${uid}:${profile.id}` : null

  // Load the active profile's list + watch history.
  useEffect(() => {
    setList(scope ? read(`bom:list:${scope}`, []) : [])
    setHistory(scope ? read(`bom:history:${scope}`, []) : [])
  }, [scope])

  const saveProfiles = useCallback(
    (next) => {
      setProfiles(next)
      write(`bom:profiles:${uid}`, next)
    },
    [uid],
  )

  const selectProfile = useCallback(
    (id) => {
      setActiveId(id)
      write(`bom:active:${uid}`, id)
    },
    [uid],
  )

  const addProfile = (data) => {
    const p = { id: newId(), color: AVATAR_COLORS[profiles.length % AVATAR_COLORS.length], kids: false, ...data }
    saveProfiles([...profiles, p])
    return p
  }
  const updateProfile = (id, data) => saveProfiles(profiles.map((p) => (p.id === id ? { ...p, ...data } : p)))
  const removeProfile = (id) => {
    saveProfiles(profiles.filter((p) => p.id !== id))
    if (id === activeId) selectProfile(null)
    try {
      localStorage.removeItem(`bom:list:${uid}:${id}`)
      localStorage.removeItem(`bom:history:${uid}:${id}`)
    } catch {
      /* ignore */
    }
  }

  const keyOf = (item) => `${item.media_type}-${item.id}`

  const inList = useCallback((id, type) => list.some((i) => i.id === id && i.media_type === type), [list])

  const toggleList = useCallback(
    (item, type) => {
      if (!scope) return false
      const s = slim(item, type)
      const exists = list.some((i) => keyOf(i) === keyOf(s))
      const next = exists ? list.filter((i) => keyOf(i) !== keyOf(s)) : [s, ...list]
      setList(next)
      write(`bom:list:${scope}`, next)
      return !exists
    },
    [scope, list],
  )

  const addToHistory = useCallback(
    (item, type) => {
      if (!scope) return
      const s = slim(item, type)
      setHistory((prev) => {
        const next = [s, ...prev.filter((i) => keyOf(i) !== keyOf(s))].slice(0, 20)
        write(`bom:history:${scope}`, next)
        return next
      })
    },
    [scope],
  )

  const value = useMemo(
    () => ({
      ready,
      profiles,
      profile,
      selectProfile,
      addProfile,
      updateProfile,
      removeProfile,
      list,
      inList,
      toggleList,
      history,
      addToHistory,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ready, profiles, profile, list, history, inList, toggleList, addToHistory, selectProfile],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProfiles = () => useContext(ProfileContext)
