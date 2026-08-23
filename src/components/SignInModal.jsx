import { useState } from 'react'
import styles from './SignInModal.module.css'

export default function SignInModal({ open, onClose, onSignedIn, target }) {
  const [demoId, setDemoId] = useState('demo-student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (!open) return null

  function handleSignIn() {
    try {
      const user = { id: email || demoId, name: name || demoId, email: email || '', createdAt: new Date().toISOString() }
      localStorage.setItem('resumelens-auth', '1')
      localStorage.setItem('resumelens-user', JSON.stringify(user))
      // add to resumelens-users list
      try {
        const raw = localStorage.getItem('resumelens-users')
        const arr = raw ? JSON.parse(raw) : []
        const exists = arr.find((u) => u.id === user.id)
        if (!exists) arr.push(user)
        localStorage.setItem('resumelens-users', JSON.stringify(arr))
      } catch {}
    } catch {}

    if (onSignedIn) onSignedIn(target)
    onClose()
  }

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>Sign in to continue</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close">×</button>
        </header>

        <div className={styles.body}>
          <p>Use a demo ID to sign in (this is a classroom demo).
          This will save your analysis locally in the browser.</p>

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

          <label className={styles.label}>
            Demo ID
            <input
              className={styles.input}
              value={demoId}
              onChange={(e) => setDemoId(e.target.value)}
            />
          </label>

          <div className={styles.actions}>
            <button className={styles.primary} onClick={handleSignIn}>Sign in</button>
            <button className={styles.secondary} onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
