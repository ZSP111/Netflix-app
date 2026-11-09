// Central app configuration. Every value can be overridden with a Vite env
// variable (see .env.example) so you can plug in your own keys.

export const APP_NAME = 'Box of Movies'

export const TMDB_TOKEN =
  import.meta.env.VITE_TMDB_TOKEN ||
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OTRlZGE1YWY0OTI2MjNlOGFhMjk2ZmEwYjI5MjA3NiIsIm5iZiI6MTczNDI3NTk1OC42NDk5OTk5LCJzdWIiOiI2NzVlZjM3Njk3N2I5ZjI2YTQxOGE1YmMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.KA7zfJaEpo5PCR4NmPtmvCeqtG3SYSjAHB49Zdxcafw'

export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBKlUGtTxqfwdY8Nccfi4rsU6tJ77bQoDo',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'netflix-clone-c126a.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'netflix-clone-c126a',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'netflix-clone-c126a.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '146450881420',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:146450881420:web:27ae38b01fe9e91c0b94a9',
}
