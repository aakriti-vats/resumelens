import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Profile.module.css'

export default function ProfileMe() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('resumelens-user')
      if (raw) {
        const parsed = JSON.parse(raw)
        setUser(parsed)
        setName(parsed.name || '')
        setEmail(parsed.email || '')
      }
    } catch {}
  }, [])

  function handleSignIn(e) {
    e?.preventDefault()
    const newUser = { id: email || `user-${Date.now()}`, name: name || email || 'User', email: email || '', createdAt: new Date().toISOString() }
    try {
      localStorage.setItem('resumelens-auth', '1')
      localStorage.setItem('resumelens-user', JSON.stringify(newUser))
      const raw = localStorage.getItem('resumelens-users')
      const arr = raw ? JSON.parse(raw) : []
      if (!arr.find((u) => u.id === newUser.id)) arr.push(newUser)
      localStorage.setItem('resumelens-users', JSON.stringify(arr))
    } catch {}
    setUser(newUser)
    navigate('/profile/me')
  }

  function handleSignOut() {
    localStorage.removeItem('resumelens-auth')
    localStorage.removeItem('resumelens-user')
    setUser(null)
    navigate('/profile')
  }

  function handleDeleteAccount() {
    try {
      const raw = localStorage.getItem('resumelens-users')
      const arr = raw ? JSON.parse(raw) : []
      const filtered = arr.filter((u) => u.id !== user.id)
      localStorage.setItem('resumelens-users', JSON.stringify(filtered))
    } catch {}
    handleSignOut()
  }

  function handleSave(e) {
    e.preventDefault()
    const updated = { ...(user || {}), name, email, updatedAt: new Date().toISOString() }
    try {
      localStorage.setItem('resumelens-user', JSON.stringify(updated))
    } catch {}
    navigate('/profile')
  }

  if (!user) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <h1>Create or Sign in</h1>
          <p className={styles.note}>Create a local demo account to save analyses to your profile in this browser.</p>
          <form className={styles.form} onSubmit={handleSignIn}>
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
              <button className={styles.primary} type="submit">Create account / Sign in</button>
            </div>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1>Your Profile</h1>
        <form onSubmit={handleSave} className={styles.form}>
          <label className={styles.label}>
            Name
            <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className={styles.label}>
            Email
            <input className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <div className={styles.actions}>
            <button className={styles.primary} type="submit">Save</button>
            <button type="button" className={styles.secondary} onClick={handleSignOut}>Sign out</button>
            <button type="button" className={styles.secondary} onClick={handleDeleteAccount}>Delete account</button>
          </div>
        </form>
      </section>
    </main>
  )
}
