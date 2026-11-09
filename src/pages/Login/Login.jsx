import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './Login.css'
import Logo from '../../components/Logo/Logo'
import Spinner from '../../components/Spinner/Spinner'
import { authErrorMessage, login, resetPassword, signup } from '../../firebase'
import useTmdb from '../../hooks/useTmdb'
import { img } from '../../api/tmdb'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Login = () => {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup' | 'reset'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const location = useLocation()
  const { data } = useTmdb('/trending/all/week')
  const posters = (data?.results || []).filter((m) => m.poster_path).slice(0, 18)

  useEffect(() => {
    document.title = mode === 'signup' ? 'Sign Up - Box of Movies' : 'Sign In - Box of Movies'
  }, [mode])

  const validate = () => {
    const e = {}
    if (mode === 'signup' && !name.trim()) e.name = 'Please enter your name.'
    if (!EMAIL_RE.test(email)) e.email = 'Please enter a valid email address.'
    if (mode !== 'reset' && password.length < 6) e.password = 'Your password must contain at least 6 characters.'
    setErrors(e)
    return !Object.keys(e).length
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      if (mode === 'reset') {
        await resetPassword(email)
        toast.success('Check your inbox for a link to reset your password.')
        setMode('signin')
      } else {
        if (mode === 'signin') await login(email, password, remember)
        else await signup(name.trim(), email, password, remember)
        navigate('/profiles', { replace: true, state: location.state })
      }
    } catch (error) {
      console.error(error)
      toast.error(authErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (m) => {
    setMode(m)
    setErrors({})
  }

  const heading = { signin: 'Sign In', signup: 'Sign Up', reset: 'Forgot Password' }[mode]

  return (
    <div className="login">
      <div className="login-bg" aria-hidden="true">
        {posters.map((p) => (
          <img key={p.id} src={img(p.poster_path, 'w342')} alt="" />
        ))}
      </div>
      <div className="login-shade" />
      <header className="login-header">
        <Logo size="lg" />
      </header>
      <div className="login-form">
        {loading && (
          <div className="login-loading">
            <Spinner />
          </div>
        )}
        <h1>{heading}</h1>
        {mode === 'reset' && <p className="login-sub">Enter your email and we’ll send you a link to reset your password.</p>}
        <form onSubmit={submit} noValidate>
          {mode === 'signup' && (
            <div className="field">
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Your name" autoComplete="name" />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
          )}
          <div className="field">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address" autoComplete="email" />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          {mode !== 'reset' && (
            <div className="field field-password">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
              <button type="button" className="show-pass" onClick={() => setShowPassword((s) => !s)}>
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
          )}
          <button type="submit" className="btn btn-accent login-submit" disabled={loading}>
            {mode === 'reset' ? 'Email Me' : heading}
          </button>
          {mode !== 'reset' && (
            <div className="form-help">
              <label className="remember">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>
              <button type="button" className="link-btn" onClick={() => switchMode('reset')}>
                Forgot password?
              </button>
            </div>
          )}
        </form>
        <div className="form-switch">
          {mode === 'signin' ? (
            <p>
              New to Box of Movies? <button className="link-btn strong" onClick={() => switchMode('signup')}>Sign up now.</button>
            </p>
          ) : (
            <p>
              {mode === 'signup' ? 'Already have an account?' : 'Remembered it?'}{' '}
              <button className="link-btn strong" onClick={() => switchMode('signin')}>Sign in now.</button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
