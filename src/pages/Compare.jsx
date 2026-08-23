import { Link } from 'react-router-dom'
import ScoreRing from '../components/ScoreRing'
import { useLocalHistory } from '../hooks/useLocalHistory'
import styles from './Compare.module.css'

export default function Compare() {
  const { entries } = useLocalHistory()
  const versionB = entries[0]
  const versionA = entries[1]

  if (!versionB) {
    return (
      <main className={styles.page}>
        <h1>Compare Versions</h1>
        <p>Run at least one analysis to compare resume versions.</p>
        <Link to="/">Analyze Resume</Link>
      </main>
    )
  }

  const improved = versionA ? versionB.score - versionA.score : 0
  const winnerIsB = !versionA || versionB.score >= versionA.score

  return (
    <main className={styles.page}>
      <header>
        <h1>Compare Versions</h1>
        <p>Reviewing changes for “{versionB.jobTitle}”.</p>
      </header>

      {versionA ? (
        <aside className={styles.banner} aria-live="polite">
          <strong>
            {winnerIsB ? 'Version B Performs Better' : 'Version A Still Leads'}
          </strong>
          <p>
            {improved >= 0
              ? `The revised version shows a +${improved} point improvement in ATS compatibility.`
              : `The latest version scored ${Math.abs(improved)} points lower than the previous scan.`}
          </p>
        </aside>
      ) : (
        <aside className={styles.banner}>
          <strong>Only one version so far</strong>
          <p>Run another analysis to unlock a side-by-side comparison.</p>
        </aside>
      )}

      <section className={styles.grid}>
        <VersionCard
          title="Version B"
          subtitle="Revised"
          analysis={versionB}
          winner={winnerIsB}
        />
        {versionA ? (
          <VersionCard
            title="Version A"
            subtitle="Original"
            analysis={versionA}
            winner={!winnerIsB}
            muted
          />
        ) : (
          <article className={`${styles.card} ${styles.muted}`}>
            <h2>Version A</h2>
            <p>No earlier scan in local history yet.</p>
          </article>
        )}
      </section>
    </main>
  )
}

function VersionCard({ title, subtitle, analysis, winner, muted }) {
  return (
    <article className={`${styles.card} ${winner ? styles.winner : ''} ${muted ? styles.muted : ''}`}>
      <header className={styles.cardHeader}>
        <div>
          <p className={styles.version}>
            {title}
            {winner ? <span className={styles.winnerBadge}>Winner</span> : null}
          </p>
          <p>{subtitle}</p>
        </div>
        <ScoreRing score={analysis.score} size={88} strokeWidth={8} />
      </header>
      <ul className={styles.metrics}>
        <li>
          <span>Keyword match</span>
          <strong>
            {analysis.matched.length} / {analysis.matched.length + analysis.missing.length}
          </strong>
        </li>
        <li>
          <span>Missing keywords</span>
          <strong className={analysis.missing.length > 5 ? styles.alert : ''}>
            {analysis.missing.length}
          </strong>
        </li>
        <li>
          <span>Suggestions</span>
          <strong>{analysis.suggestions.length}</strong>
        </li>
      </ul>
      <Link className={winner ? styles.primary : styles.secondary} to="/results">
        {winner ? 'View details' : 'View details'}
      </Link>
    </article>
  )
}
