import { useEffect, useId, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/#how-it-works', label: 'How It Works', hash: true },
  { to: '/history', label: 'History' },
  { to: '/compare', label: 'Compare' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const location = useLocation()
  const signInDialogRef = useRef(null)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  function openSignInDialog() {
    setOpen(false)
    signInDialogRef.current?.showModal()
  }

  function closeSignInDialog() {
    signInDialogRef.current?.close()
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Primary">
        <NavLink to="/" className={styles.brand} end>
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
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.active : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              )}
            </li>
          ))}
          <li className={styles.mobileOnly}>
            <button type="button" className={styles.signIn} onClick={openSignInDialog}>
              Sign In
            </button>
          </li>
        </ul>

        <div className={styles.actions}>
          <button type="button" className={styles.signIn} onClick={openSignInDialog}>
            Sign In
          </button>
          <NavLink to="/" className={styles.cta}>
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
        <h2 id="signin-dialog-title">Sign in to ResumeLens</h2>
        <p>
          Accounts are not set up in this version yet. Your analyses stay saved
          privately in this browser.
        </p>
        <button type="button" className={styles.cta} onClick={closeSignInDialog}>
          Got it
        </button>
      </dialog>
    </header>
  )
}