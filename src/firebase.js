import { initializeApp } from 'firebase/app'
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { addDoc, collection, getFirestore } from 'firebase/firestore'
import { FIREBASE_CONFIG } from './config'

const app = initializeApp(FIREBASE_CONFIG)
const auth = getAuth(app)
const db = getFirestore(app)

const FRIENDLY_ERRORS = {
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/missing-password': 'Please enter your password.',
  'auth/weak-password': 'Your password must contain at least 6 characters.',
  'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
  'auth/invalid-credential': 'Incorrect email or password. Please try again.',
  'auth/wrong-password': 'Incorrect email or password. Please try again.',
  'auth/user-not-found': 'No account found with this email. Sign up to create one.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
}

export const authErrorMessage = (error) =>
  FRIENDLY_ERRORS[error?.code] ||
  (error?.code ? error.code.split('/')[1].split('-').join(' ') : 'Something went wrong. Please try again.')

const applyPersistence = (remember) =>
  setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence)

const signup = async (name, email, password, remember = true) => {
  await applyPersistence(remember)
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  if (name) await updateProfile(user, { displayName: name })
  // Storing the profile in Firestore is best-effort: the account works even if
  // the database rules reject the write.
  addDoc(collection(db, 'user'), { uid: user.uid, name, authProvider: 'local', email }).catch((e) =>
    console.warn('Could not save user profile', e),
  )
  return user
}

const login = async (email, password, remember = true) => {
  await applyPersistence(remember)
  const { user } = await signInWithEmailAndPassword(auth, email, password)
  return user
}

const resetPassword = (email) => sendPasswordResetEmail(auth, email)

const logout = () => signOut(auth)

export { auth, db, login, signup, logout, resetPassword }
