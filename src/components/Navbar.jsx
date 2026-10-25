import { useId, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/#how-it-works', label: 'How It Works', hash: true },
  { to: '/history', label: 'History' },
  { to: '/compare', label: 'Compare' },
]

export default function Navbar() {
  const { user, login, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const menuId = useId()
  const location = useLocation()
  const signInDialogRef = useRef(null)

  function closeMenu() {
    setOpen(false)
  }

  function openSignInDialog() {
    setName('')
    setEmail('')
    setErrors({})
    setOpen(false)
    signInDialogRef.current?.showModal()
  }

  function closeSignInDialog() {
    setErrors({})
    signInDialogRef.current?.close()
  }

  function handleSignOut() {
    logout()
    closeMenu()
  }

  function handleSignInSubmit(e) {
    e.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const nextErrors = {}

    if (!trimmedName) {
      nextErrors.name = 'Name is required'
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    login({
      name: trimmedName,
      email: trimmedEmail,
      createdAt: new Date().toISOString(),
    })
    closeSignInDialog()
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Primary">
        <NavLink to="/" className={styles.brand} end onClick={closeMenu}>
          <span className={styles.logoMark} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <path
                d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          ResumeLens
        </NavLink>

        <ul id={menuId} className={`${styles.links} ${open ? styles.linksOpen : ''}`}>
          {links.map((link) => (
            <li key={link.label}>
              {link.hash ? (
                <a
                  href={link.to}
                  onClick={closeMenu}
                  className={`${styles.link} ${
                    location.pathname === '/' && location.hash === '#how-it-works'
                      ? styles.active
                      : ''
                  }`}
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.active : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              )}
            </li>
          ))}

          {user ? (
            <>
              <li className={styles.mobileOnly}>
                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.active : ''}`
                  }
                >
                  Profile ({user.name || user.email || 'User'})
                </NavLink>
              </li>
              <li className={styles.mobileOnly}>
                <button
                  type="button"
                  className={styles.mobileSignOut}
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li className={styles.mobileOnly}>
              <button
                type="button"
                className={styles.signIn}
                onClick={openSignInDialog}
              >
                Sign In
              </button>
            </li>
          )}
        </ul>

        <div className={styles.actions}>
          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${styles.profileLink} ${isActive ? styles.activeProfile : ''}`
                }
                onClick={closeMenu}
              >
                <span className={styles.avatarIcon} aria-hidden="true">
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </span>
                <span className={styles.profileName}>{user.name || user.email || 'Demo User'}</span>
              </NavLink>
              <button
                type="button"
                className={styles.signOutBtn}
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              type="button"
              className={styles.signIn}
              onClick={openSignInDialog}
            >
              Sign In
            </button>
          )}

          <NavLink to="/" className={styles.cta} onClick={closeMenu}>
            Analyze Resume
          </NavLink>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <dialog
        ref={signInDialogRef}
        className={styles.signInDialog}
        aria-labelledby="signin-dialog-title"
      >
        <div className={styles.dialogHeader}>
          <h2 id="signin-dialog-title">Demo Profile Sign In</h2>
          <button
            type="button"
            className={styles.dialogClose}
            onClick={closeSignInDialog}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>
        <p className={styles.demoNotice}>
          This is a local demo session stored in your browser. No password or
          backend server is required.
        </p>
        <form
          className={styles.dialogForm}
          onSubmit={handleSignInSubmit}
          noValidate
        >
          <div className={styles.field}>
            <label htmlFor="signin-name" className={styles.fieldLabel}>
              Name
            </label>
            <input
              id="signin-name"
              type="text"
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: undefined }))
                }
              }}
              placeholder="e.g. Alex Doe"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'signin-name-error' : undefined}
            />
            {errors.name && (
              <span id="signin-name-error" className={styles.errorText} role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="signin-email" className={styles.fieldLabel}>
              Email
            </label>
            <input
              id="signin-email"
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }))
                }
              }}
              placeholder="alex@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'signin-email-error' : undefined}
            />
            {errors.email && (
              <span id="signin-email-error" className={styles.errorText} role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className={styles.dialogActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={closeSignInDialog}
            >
              Cancel
            </button>
            <button type="submit" className={styles.cta}>
              Sign In
            </button>
          </div>
        </form>
      </dialog>
    </header>
  )
}