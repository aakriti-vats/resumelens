import { Link } from 'react-router-dom'
import ScoreRing from '../components/ScoreRing'
import { useLocalHistory } from '../hooks/useLocalHistory'
import { formatDate } from '../utils/formatDate'
import styles from './History.module.css'

export default function History() {
  const { entries, removeEntry, setLastAnalysis } = useLocalHistory()

  return (
    <main className={styles.page}>
      <header className={styles.heading}>
        <div>
          <h1>Analysis History</h1>
          <p>Your recent resume reviews, stored locally in this browser.</p>
        </div>
        <Link className={styles.primary} to="/">
          + New Analysis
        </Link>
      </header>

      {entries.length === 0 ? (
        <section className={styles.empty}>
          <h2>No scans yet</h2>
          <p>Analyze a resume to start building local history.</p>
          <Link className={styles.primary} to="/">
            Analyze Resume
          </Link>
        </section>
      ) : (
        <section aria-label="Past analyses">
          <ul className={styles.list}>
            {entries.map((entry) => (
              <li key={entry.id}>
                <article className={styles.card}>
                  <div className={styles.top}>
                    <div>
                      <h2>{entry.resumeName}</h2>
                      <p>{entry.jobTitle}</p>
                    </div>
                    <ScoreRing score={entry.score} size={72} strokeWidth={7} />
                  </div>
                  <div className={styles.bottom}>
                    <time dateTime={entry.createdAt}>{formatDate(entry.createdAt)}</time>
                    <div className={styles.actions}>
                      <Link
                        className={styles.iconButton}
                        to="/results"
                        aria-label={`View results for ${entry.resumeName}`}
                        onClick={() => setLastAnalysis(entry)}
                      >
                        View
                      </Link>
                      <Link className={styles.iconButton} to="/compare" aria-label="Compare versions">
                        Compare
                      </Link>
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => removeEntry(entry.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
