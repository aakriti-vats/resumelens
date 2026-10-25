import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuth } from '../context/AuthContext'
import { selectHistoryByProfile } from '../store/historySlice'
import { formatDateTime } from '../utils/formatDate'
import styles from './Profile.module.css'

export default function Profile() {
  const { user, logout } = useAuth()
  const entries = useSelector((state) => selectHistoryByProfile(state, user?.id))
  const navigate = useNavigate()

  function handleSignOut() {
    logout()
    navigate('/')
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="profile-heading">
        <header className={styles.header}>
          <span className={styles.badge}>Demo Session</span>
          <h1 id="profile-heading">User Profile</h1>
          <p className={styles.subtitle}>
            This local demo session demonstrates user context and state
            persistence across browser refreshes.
          </p>
        </header>

        {user ? (
          <div className={styles.content}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Name</span>
              <strong className={styles.value}>{user.name || 'Demo User'}</strong>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Email</span>
              <strong className={styles.value}>{user.email}</strong>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Saved Scans</span>
              <strong className={styles.value}>
                {entries.length} {entries.length === 1 ? 'scan' : 'scans'}
              </strong>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Session Started</span>
              <span className={styles.value}>
                {user.createdAt ? formatDateTime(user.createdAt) : 'Active session'}
              </span>
            </div>

            <div className={styles.infoBox}>
              <p>
                Each demo profile manages its own resume history. Signing out will
                not delete your saved scans; signing back in with {user.email} will
                restore them immediately.
              </p>
            </div>

            <div className={styles.actions}>
              <Link to="/" className={styles.primary}>
                Analyze Resume
              </Link>
              <Link to="/history" className={styles.secondary}>
                View History
              </Link>
              <button
                type="button"
                className={styles.signOut}
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.empty}>
            <p>You do not have an active demo profile.</p>
            <p className={styles.emptyNote}>
              You can start a local demo session by clicking &ldquo;Sign In&rdquo;
              in the navigation bar.
            </p>
            <Link to="/" className={styles.primary}>
              Go to Home
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
