import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/context'

export function LoginPage() {
  const { user, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  if (loading) return <div className="loading-screen">Opening your local lab…</div>
  if (user) return <Navigate to="/admin/dashboard" replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const success = await signIn(username, password)
      if (success) {
        const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
        navigate(from || '/admin/dashboard', { replace: true })
      } else {
        setError('Username or password is incorrect. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-screen">
      <section className="login-card">
        <div className="login-brand"><div className="brand-mark">T</div><div><strong>Techlith Lab</strong><span>SOFTWARE TESTING LABORATORY</span></div></div>
        <div className="login-intro"><div className="eyebrow">ADMIN WORKSPACE</div><h1>Welcome back</h1><p>Sign in to manage your local testing laboratory.</p></div>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="username">Username</label><input id="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
          <label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="button button-primary login-submit" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}<span>→</span></button>
        </form>
        <div className="login-note"><span className="status-dot" />Your data stays in this browser</div>
      </section>
      <div className="login-footer">A focused workspace for learning software quality.</div>
    </main>
  )
}
