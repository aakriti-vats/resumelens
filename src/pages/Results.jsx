import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import KeywordBadge from '../components/KeywordBadge'
import ScoreRing from '../components/ScoreRing'
import { useAnalysis } from '../context/AnalysisContext'
import { selectHistoryEntries } from '../store/historySlice'
import { formatDateTime } from '../utils/formatDate'
import styles from './Results.module.css'

function matchLabel(score) {
  if (score >= 80) return 'Strong Match'
  if (score >= 60) return 'Solid Match'
  return 'Needs Work'
}

export default function Results() {
  const { currentAnalysis } = useAnalysis()
  const entries = useSelector(selectHistoryEntries)
  const analysis = currentAnalysis ?? entries[0]

  if (!analysis) {
    return (
      <main className={styles.page}>
        <div className={styles.empty}>
          <h1>No analysis yet</h1>
          <p>
            Upload a resume and paste a job description to see your ATS match
            dashboard.
          </p>
          <Link className={styles.primary} to="/">
            Analyze Resume
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <header className={styles.heading}>
        <h1>Resume Analysis</h1>
        <p>Reviewing your resume against “{analysis.jobTitle}”.</p>
        <ul className={styles.meta}>
          <li>{analysis.resumeName}</li>
          <li>{analysis.jobTitle}</li>
          <li>
            {analysis.createdAt ? (
              <time dateTime={analysis.createdAt}>
                {formatDateTime(analysis.createdAt)}
              </time>
            ) : (
              'Recently analyzed'
            )}
          </li>
        </ul>
      </header>

      <section className={styles.overview} aria-labelledby="score-heading">
        <article className={styles.scoreCard}>
          <h2 id="score-heading" className={styles.kicker}>
            Overall match score
          </h2>
          <ScoreRing score={analysis.score} size={180} strokeWidth={12} />
          <p className={styles.badge}>{matchLabel(analysis.score)}</p>
          <p>
            {analysis.score >= 80
              ? 'Your resume is well aligned with this role. Tighten remaining gaps to improve ATS ranking.'
              : 'Solid foundation, but missing keywords and specifics may hold this version back.'}
          </p>
        </article>
        <aside className={styles.statStack}>
          <article>
            <strong>{analysis.matched.length}</strong>
            <span>Matched Keywords</span>
          </article>
          <article>
            <strong>{analysis.missing.length}</strong>
            <span>Missing Keywords</span>
          </article>
          <article>
            <strong>{analysis.suggestions.length}</strong>
            <span>Suggestions</span>
          </article>
        </aside>
      </section>

      <section className={styles.keywords} aria-labelledby="keywords-heading">
        <h2 id="keywords-heading" className={styles.srOnly}>
          Keyword analysis
        </h2>
        <article className={styles.card}>
          <h3>Matched Keywords</h3>
          <div className={styles.badges}>
            {analysis.matched.length ? (
              analysis.matched.map((keyword) => (
                <KeywordBadge key={keyword} label={keyword} variant="matched" />
              ))
            ) : (
              <p>No overlapping keywords yet.</p>
            )}
          </div>
        </article>
        <article className={styles.card}>
          <h3>Missing Keywords</h3>
          <div className={styles.badges}>
            {analysis.missing.length ? (
              analysis.missing.map((keyword) => (
                <KeywordBadge key={keyword} label={keyword} variant="missing" />
              ))
            ) : (
              <p>No missing keywords detected.</p>
            )}
          </div>
        </article>
      </section>

      <section aria-labelledby="recs-heading">
        <h2 id="recs-heading">Actionable Recommendations</h2>
        <div className={styles.recs}>
          {analysis.suggestions.map((item) => (
            <article key={item.title} className={styles.rec}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <div className={styles.actions}>
        <Link className={styles.primary} to="/">
          Edit Resume Now
        </Link>
        <Link className={styles.secondary} to="/compare">
          Compare Versions
        </Link>
      </div>
    </main>
  )
}
