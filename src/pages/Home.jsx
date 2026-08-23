import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ScoreRing from '../components/ScoreRing'
import { analyzeResume } from '../hooks/useKeywordMatch'
import { useLocalHistory } from '../hooks/useLocalHistory'
import styles from './Home.module.css'
import SignInModal from '../components/SignInModal'

export default function Home() {
  const navigate = useNavigate()
  const { addEntry } = useLocalHistory()
  const fileRef = useRef(null)
  const [resumeName, setResumeName] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('resumelens-pending-form')
      if (raw) {
        const parsed = JSON.parse(raw)
        setResumeText(parsed.resumeText || '')
        setJobDescription(parsed.jobDescription || '')
        setJobTitle(parsed.jobTitle || '')
        setResumeName(parsed.resumeName || '')
        sessionStorage.removeItem('resumelens-pending-form')
      }
    } catch {}
  }, [])

  function requireSignInFor(action = 'use this feature') {
    const isAuth = localStorage.getItem('resumelens-auth') === '1'
    if (isAuth) return true
    // save current form state so we can restore after sign-in
    try {
      sessionStorage.setItem(
        'resumelens-pending-form',
        JSON.stringify({ resumeText, jobDescription, jobTitle, resumeName }),
      )
    } catch {}
    setSignInTarget('/#analyze')
    setShowSignInModal(true)
    return false
  }

  async function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Max file size is 5MB.')
      return
    }
    setResumeName(file.name)
    setError('')
    if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
      setResumeText(await file.text())
    }
  }

  function handleClearResume() {
    const ok = requireSignInFor('clear the resume')
    if (!ok) return
    setResumeName('')
    setResumeText('')
    setError('')
    // File inputs are uncontrolled; React state cannot clear the FileList.
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!resumeText.trim() && !jobDescription.trim()) {
      setError('Paste resume text and a job description to analyze.')
      return
    }
    const analysis = analyzeResume({
      resumeText,
      jobDescription,
      jobTitle,
      resumeName,
    })

    const isAuth = localStorage.getItem('resumelens-auth') === '1'
    if (!isAuth) {
      // store pending analysis and redirect to sign-in
      try {
        sessionStorage.setItem('resumelens-pending-analysis', JSON.stringify(analysis))
      } catch {}
      navigate('/signin', { state: { from: '/results' } })
      return
    }

    addEntry(analysis)
    navigate('/results')
  }

  function handleAnalyzeClick(e) {
    e.preventDefault()
    const isAuth = localStorage.getItem('resumelens-auth') === '1'
    if (!isAuth) {
      setSignInTarget('/#analyze')
      setShowSignInModal(true)
      return
    }
    const node = document.getElementById('analyze')
    if (node) node.scrollIntoView({ behavior: 'smooth' })
  }

  function handleDropzoneClick(e) {
    const ok = requireSignInFor('upload a file')
    if (!ok) return
    fileRef.current?.click()
  }

  function handleInputClick(e) {
    const ok = requireSignInFor('upload a file')
    if (!ok) e.preventDefault()
  }

  function handleFieldFocus() {
    requireSignInFor('edit this field')
  }

  const [showSignInModal, setShowSignInModal] = useState(false)
  const [signInTarget, setSignInTarget] = useState(null)

  function handleModalClose() {
    setShowSignInModal(false)
    setSignInTarget(null)
  }

  function handleModalSignedIn(target) {
    // commit pending analysis if present
    try {
      const raw = sessionStorage.getItem('resumelens-pending-analysis')
      if (raw) {
        const parsed = JSON.parse(raw)
        addEntry(parsed)
        sessionStorage.removeItem('resumelens-pending-analysis')
        // go to results
        navigate('/results')
        return
      }
    } catch {}

    // restore form if present
    try {
      const rawForm = sessionStorage.getItem('resumelens-pending-form')
      if (rawForm) {
        const parsed = JSON.parse(rawForm)
        setResumeText(parsed.resumeText || '')
        setJobDescription(parsed.jobDescription || '')
        setJobTitle(parsed.jobTitle || '')
        setResumeName(parsed.resumeName || '')
        sessionStorage.removeItem('resumelens-pending-form')
      }
    } catch {}

    // navigate or scroll depending on target
    if (target === '/results') {
      navigate('/results')
    } else if (target && target.includes('#analyze')) {
      const node = document.getElementById('analyze')
      if (node) node.scrollIntoView({ behavior: 'smooth' })
    } else if (target) {
      navigate(target)
    }
  }

  return (
    <>
    <main>
      <div className={styles.page}>
        <section className={styles.hero} aria-labelledby="hero-heading">
          <div>
            <p className={styles.eyebrow}>AI-powered resume optimization</p>
            <h1 id="hero-heading">
              Make your resume <span className={styles.accent}>match the job.</span>
            </h1>
            <p className={styles.lede}>
              Upload your resume and a target job description to get ATS-focused
              keyword analysis and actionable recommendations.
            </p>
            <div className={styles.heroActions}>
              <button type="button" className={styles.primary} onClick={handleAnalyzeClick}>
                Analyze My Resume
              </button>
              <a className={styles.secondary} href="#how-it-works">
                See How It Works
              </a>
            </div>
            <ul className={styles.trust}>
              <li>ATS-focused analysis</li>
              <li>Instant insights</li>
              <li>Actionable recommendations</li>
            </ul>
          </div>
          <aside className={styles.preview} aria-label="Sample analysis preview">
            <div className={styles.previewHeader}>
              <div>
                <h2>Analysis Complete</h2>
                <p>Senior Product Designer Role</p>
              </div>
              <ScoreRing score={87} size={96} strokeWidth={8} />
            </div>
            <div className={styles.stats}>
              <p className={`${styles.stat} ${styles.matched}`}>
                <strong>24</strong>
                <span>Matched Keywords</span>
              </p>
              <p className={`${styles.stat} ${styles.missing}`}>
                <strong>6</strong>
                <span>Missing Keywords</span>
              </p>
            </div>
          </aside>
        </section>

        <section id="analyze" aria-labelledby="analyze-heading">
          <h1 id="analyze-heading">Analyze Resume</h1>
          <p className={styles.lede}>
            Upload your resume and the target job description to get AI-powered
            feedback.
          </p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <article className={styles.card}>
              <div className={styles.cardHeading}>
                <h2>
                  <span className={styles.icon} aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path d="M14 3v6h6" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </span>
                  Your Resume
                </h2>
                <button
                  type="button"
                  className={styles.clear}
                  onClick={handleClearResume}
                  disabled={!resumeName && !resumeText}
                >
                  Clear resume
                </button>
              </div>
              <button
                type="button"
                className={styles.dropzone}
                onClick={handleDropzoneClick}
              >
                <strong>
                  {resumeName || 'Drag & drop your file here'}
                </strong>
                <small>Supported formats: PDF, DOCX, TXT. Max file size 5MB.</small>
              </button>
              <input
                ref={fileRef}
                className={styles.fileInput}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFile}
                onClick={handleInputClick}
              />
              <p className={styles.divider}>OR PASTE TEXT</p>
              <label className={styles.label} htmlFor="resume-text">
                Resume text
              </label>
              <textarea
                id="resume-text"
                className={styles.textarea}
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(event) => setResumeText(event.target.value)}
                onFocus={handleFieldFocus}
              />
            </article>

            <article className={styles.card}>
              <h2>
                <span className={styles.icon} aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1M4 7h16v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
                Job Description
              </h2>
              <label className={styles.label} htmlFor="job-title">
                Job Title (Optional)
              </label>
              <input
                id="job-title"
                className={styles.input}
                placeholder="e.g. Senior Product Designer"
                value={jobTitle}
                onChange={(event) => setJobTitle(event.target.value)}
                onFocus={handleFieldFocus}
              />
              <label className={`${styles.label} ${styles.spacedLabel}`} htmlFor="job-details">
                Job Details
              </label>
              <textarea
                id="job-details"
                className={styles.textarea}
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                onFocus={handleFieldFocus}
              />
            </article>
            {error ? (
              <p className={styles.error} role="alert">
                {error}
              </p>
            ) : null}
            <div className={styles.submitRow}>
              <button className={styles.submit} type="submit">
                Analyze Resume
              </button>
            </div>
          </form>
        </section>

        <section id="how-it-works" className={styles.how} aria-labelledby="how-heading">
          <h2 id="how-heading">From resume to ready-to-apply.</h2>
          <div className={styles.steps}>
            <article className={styles.step}>
              <p className={styles.stepNumber}>1</p>
              <h3>Upload Resume</h3>
              <p>Add a PDF, Word file, or paste the text of your current resume.</p>
            </article>
            <article className={styles.step}>
              <p className={styles.stepNumber}>2</p>
              <h3>Add Job Details</h3>
              <p>Paste the target role and job description you want to match.</p>
            </article>
            <article className={styles.step}>
              <p className={styles.stepNumber}>3</p>
              <h3>Get Insights</h3>
              <p>Review your score, keywords, and suggestions, then iterate.</p>
            </article>
          </div>
          <p className={styles.historyLink}>
            <Link to="/history">View analysis history</Link>
          </p>
        </section>
      </div>
    </main>
    <SignInModal
      open={showSignInModal}
      onClose={handleModalClose}
      onSignedIn={handleModalSignedIn}
      target={signInTarget}
    />
    </>
  )
}
