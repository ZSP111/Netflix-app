import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext({ user: null, ready: false })

export function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, ready: false })

  useEffect(() => onAuthStateChanged(auth, (user) => setState({ user, ready: true })), [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
