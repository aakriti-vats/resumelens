import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ScoreRing from '../components/ScoreRing'
import { useAnalysis } from '../context/AnalysisContext'
import { deleteAnalysis, selectHistoryEntries } from '../store/historySlice'
import { formatDate } from '../utils/formatDate'
import styles from './History.module.css'

export default function History() {
  const dispatch = useDispatch()
  const entries = useSelector(selectHistoryEntries)
  const { setCurrentAnalysis } = useAnalysis()

  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const normalizedQuery = searchTerm.trim().toLowerCase()

  const filteredEntries = normalizedQuery
    ? entries.filter((entry) => {
        const matchJob = (entry.jobTitle || '').toLowerCase().includes(normalizedQuery)
        const matchResume = (entry.resumeName || '').toLowerCase().includes(normalizedQuery)
        return matchJob || matchResume
      })
    : entries

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortBy === 'newest') {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return timeB - timeA
    }
    if (sortBy === 'oldest') {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return timeA - timeB
    }
    if (sortBy === 'highest') {
      const scoreA = Number(a.score) || 0
      const scoreB = Number(b.score) || 0
      const scoreDiff = scoreB - scoreA
      if (scoreDiff !== 0) return scoreDiff
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return timeB - timeA
    }
    if (sortBy === 'lowest') {
      const scoreA = Number(a.score) || 0
      const scoreB = Number(b.score) || 0
      const scoreDiff = scoreA - scoreB
      if (scoreDiff !== 0) return scoreDiff
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return timeB - timeA
    }
    return 0
  })

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
          <div className={styles.toolbar}>
            <div className={styles.searchControl}>
              <label htmlFor="history-search" className={styles.toolbarLabel}>
                Search
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="history-search"
                  type="search"
                  className={styles.searchInput}
                  placeholder="Search by job title or resume name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search analyses by job title or resume name"
                />
                {searchTerm && (
                  <button
                    type="button"
                    className={styles.clearInputBtn}
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search input"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className={styles.sortControl}>
              <label htmlFor="history-sort" className={styles.toolbarLabel}>
                Sort by
              </label>
              <select
                id="history-sort"
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort analyses"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Score</option>
                <option value="lowest">Lowest Score</option>
              </select>
            </div>
          </div>

          {sortedEntries.length === 0 ? (
            <div className={styles.noResults}>
              <p>No analyses found matching &ldquo;{searchTerm}&rdquo;.</p>
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <ul className={styles.list}>
              {sortedEntries.map((entry) => (
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
                          onClick={() => setCurrentAnalysis(entry)}
                        >
                          View
                        </Link>
                        <Link className={styles.iconButton} to="/compare" aria-label="Compare versions">
                          Compare
                        </Link>
                        <button
                          type="button"
                          className={styles.iconButton}
                          onClick={() => dispatch(deleteAnalysis(entry.id))}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  )
}
