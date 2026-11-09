import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProfiles } from '../../context/ProfileContext'
import Spinner from '../Spinner/Spinner'

/** Only signed-in users may pass. */
export const RequireAuth = () => {
  const { user, ready } = useAuth()
  const location = useLocation()
  if (!ready) return <Spinner full />
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

/** A profile must be chosen ("Who's watching?") before browsing. */
export const RequireProfile = () => {
  const { profile, ready } = useProfiles()
  const location = useLocation()
  if (!ready) return <Spinner full />
  if (!profile) return <Navigate to="/profiles" replace state={{ from: location }} />
  return <Outlet />
}

/** Signed-in users skip the login page. */
export const GuestOnly = () => {
  const { user, ready } = useAuth()
  if (!ready) return <Spinner full />
  if (user) return <Navigate to="/profiles" replace />
  return <Outlet />
}
