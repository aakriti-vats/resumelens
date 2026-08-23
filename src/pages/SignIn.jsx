import { useLocation, useNavigate } from 'react-router-dom'
import styles from './SignIn.module.css'
import { useLocalHistory } from '../hooks/useLocalHistory'
import { useState } from 'react'

export default function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addEntry } = useLocalHistory()

  const fromState = location.state?.from ?? '/'
  const from = typeof fromState === 'string' ? fromState : fromState.pathname ?? '/'

  function handleSignIn() {
    const user = { id: email || demoId, name: name || demoId, email: email || '', createdAt: new Date().toISOString() }
    try {
      localStorage.setItem('resumelens-auth', '1')
      localStorage.setItem('resumelens-user', JSON.stringify(user))
      const raw = localStorage.getItem('resumelens-users')
      const arr = raw ? JSON.parse(raw) : []
      const exists = arr.find((u) => u.id === user.id)
      if (!exists) arr.push(user)
      localStorage.setItem('resumelens-users', JSON.stringify(arr))
    } catch {}

    // If there's a pending analysis from an unauthenticated submit, commit it and go to results
    try {
      const raw = sessionStorage.getItem('resumelens-pending-analysis')
      if (raw) {
        const parsed = JSON.parse(raw)
        addEntry(parsed)
        sessionStorage.removeItem('resumelens-pending-analysis')
        navigate('/results', { replace: true })
        return
      }
    } catch {}

    navigate(from, { replace: true })
  }

  const [demoId, setDemoId] = useState('demo-student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="signin-heading">
        <h1 id="signin-heading">Sign In</h1>
        <p className={styles.note}>This demo uses a local demo account to demonstrate protected routes. Provide a name and email to create a demo account.</p>
        <label className={styles.label}>
          Name
          <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className={styles.label}>
          Email
          <input className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className={styles.label}>
          Password
          <input type="password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <div className={styles.actions}>
          <button className={styles.primary} onClick={handleSignIn}>Sign in</button>
        </div>
      </section>
    </main>
  )
}
