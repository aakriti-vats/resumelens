import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import ScoreRing from '../components/ScoreRing'
import { analyzeResume } from '../utils/keywordAnalysis'
import { extractTextFromPdf } from '../utils/pdfExtractor'
import { useAnalysis } from '../context/AnalysisContext'
import { useAuth } from '../context/AuthContext'
import { addAnalysis } from '../store/historySlice'
import styles from './Home.module.css'

const MAX_FILE_BYTES = 5 * 1024 * 1024

function getResumeFileKind(file) {
  const name = file.name.toLowerCase()
  const type = file.type

  if (name.endsWith('.txt') || type === 'text/plain') return 'txt'
  if (name.endsWith('.pdf') || type === 'application/pdf') return 'pdf'
  if (
    name.endsWith('.docx') ||
    type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'docx'
  }

  return null
}

function validateResumeFile(file) {
  if (!file) {
    return { ok: false, message: 'Choose a resume file to upload.' }
  }

  if (file.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      message: 'That file is too large. The maximum size is 5MB.',
    }
  }

  if (!getResumeFileKind(file)) {
    return {
      ok: false,
      message:
        'That file type is not supported. Please upload a PDF, DOCX, or TXT file.',
    }
  }

  return { ok: true }
}

export default function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { setCurrentAnalysis } = useAnalysis()
  const fileRef = useRef(null)
  const [resumeName, setResumeName] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [errors, setErrors] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [needsTextExtract, setNeedsTextExtract] = useState(false)
  const [isReadingFile, setIsReadingFile] = useState(false)

  function resetFileInput() {
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  async function applyResumeFile(file) {
    const result = validateResumeFile(file)
    if (!result.ok) {
      setErrors([result.message])
      resetFileInput()
      return
    }

    const kind = getResumeFileKind(file)
    setResumeName(file.name)
    setErrors([])

    if (kind === 'txt') {
      setIsReadingFile(true)
      try {
        setResumeText(await file.text())
        setNeedsTextExtract(false)
      } catch {
        setResumeName('')
        setErrors([
          'We could not read that file. Please try again or paste your resume text below.',
        ])
      } finally {
        setIsReadingFile(false)
      }
    } else if (kind === 'pdf') {
      setIsReadingFile(true)
      try {
        const text = await extractTextFromPdf(file)
        if (text && text.trim()) {
          setResumeText(text.trim())
          setNeedsTextExtract(false)
        } else {
          setNeedsTextExtract(true)
          setErrors([
            "We couldn't extract usable text from this file. Paste your resume text below to continue.",
          ])
        }
      } catch {
        setNeedsTextExtract(true)
        setErrors([
          "We couldn't extract usable text from this file. Paste your resume text below to continue.",
        ])
      } finally {
        setIsReadingFile(false)
      }
    } else {
      setNeedsTextExtract(true)
    }

    resetFileInput()
  }

  const hasResumeError = errors.some(
    (e) =>
      e.toLowerCase().includes('resume') ||
      e.toLowerCase().includes('extract') ||
      e.toLowerCase().includes('pdf') ||
      e.toLowerCase().includes('file'),
  )
  const hasJobError = errors.some((e) =>
    e.toLowerCase().includes('job description'),
  )

  function handleResumeTextChange(event) {
    setResumeText(event.target.value)
    if (hasResumeError) {
      setErrors((prev) =>
        prev.filter(
          (e) =>
            !e.toLowerCase().includes('resume') &&
            !e.toLowerCase().includes('extract') &&
            !e.toLowerCase().includes('pdf') &&
            !e.toLowerCase().includes('file'),
        ),
      )
    }
  }

  function handleJobDescriptionChange(event) {
    setJobDescription(event.target.value)
    if (hasJobError) {
      setErrors((prev) =>
        prev.filter((e) => !e.toLowerCase().includes('job description')),
      )
    }
  }

  function clearSelectedResume() {
    setResumeName('')
    setNeedsTextExtract(false)
    resetFileInput()
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    await applyResumeFile(file)
  }

  function handleDragOver(event) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(event) {
    event.preventDefault()
    setIsDragging(false)
  }

  async function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (!file) return
    await applyResumeFile(file)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = []

    if (!resumeText.trim()) {
      nextErrors.push(
        needsTextExtract
          ? "We couldn't extract usable text from this file. Paste your resume text below to continue."
          : 'Resume is required. Upload a PDF or TXT file, or paste your resume text.',
      )
    }

    if (!jobDescription.trim()) {
      nextErrors.push(
        'Job description is required. Paste the job details to continue.',
      )
    }

    if (nextErrors.length) {
      setErrors(nextErrors)
      return
    }

    setErrors([])
    const analysis = analyzeResume({
      resumeText,
      jobDescription,
      jobTitle,
      resumeName,
    })
    const record = {
      ...analysis,
      id: crypto.randomUUID(),
      profileId: user?.id ?? null,
      createdAt: new Date().toISOString(),
    }
    dispatch(addAnalysis(record))
    setCurrentAnalysis(record)
    navigate('/results')
  }

  return (
    <main>
      <div className={styles.page}>
        <section className={styles.hero} aria-labelledby="hero-heading">
          <div>
            <p className={styles.eyebrow}>ATS-focused resume optimization</p>
            <h1 id="hero-heading">
              Make your resume <span className={styles.accent}>match the job.</span>
            </h1>
            <p className={styles.lede}>
              Upload your resume and a target job description to get ATS-focused
              keyword analysis and actionable recommendations.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primary} href="#analyze">
                Analyze My Resume
              </a>
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
            Upload your resume and the target job description to get instant
            keyword feedback.
          </p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <article className={styles.card}>
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
                className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                disabled={isReadingFile}
              >
                <strong>
                  {resumeName || 'Drag & drop your file here'}
                </strong>
                <small>
                  {isReadingFile
                    ? 'Reading file…'
                    : 'Supported formats: PDF, DOCX, TXT. Max file size 5MB. PDF and TXT are read automatically; paste DOCX text below.'}
                </small>
              </button>
              <input
                ref={fileRef}
                id="resume-file"
                className={styles.fileInput}
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                aria-label="Upload resume file"
                onChange={handleFileChange}
              />
              {resumeName ? (
                <button
                  type="button"
                  className={styles.clearFile}
                  onClick={clearSelectedResume}
                >
                  Remove file
                </button>
              ) : null}
              {needsTextExtract ? (
                <p className={styles.extractNote}>
                  {resumeName.toLowerCase().endsWith('.docx')
                    ? 'DOCX text extraction is not currently supported. Paste your resume text below to continue.'
                    : "We couldn't extract usable text from this file. Paste your resume text below to continue."}
                </p>
              ) : null}
              <p className={styles.divider}>OR PASTE TEXT</p>
              <label className={styles.label} htmlFor="resume-text">
                Resume text
              </label>
              <textarea
                id="resume-text"
                className={styles.textarea}
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={handleResumeTextChange}
                aria-invalid={hasResumeError}
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
              />
              <label className={`${styles.label} ${styles.spacedLabel}`} htmlFor="job-details">
                Job Details
              </label>
              <textarea
                id="job-details"
                className={styles.textarea}
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                aria-invalid={hasJobError}
              />
            </article>
            {errors.length ? (
              <div className={styles.error} role="alert">
                {errors.map((message) => (
                  <p key={message}>{message}</p>
                ))}
              </div>
            ) : null}
            <div className={styles.submitRow}>
              <button
                className={styles.submit}
                type="submit"
                disabled={isReadingFile}
              >
                {isReadingFile ? 'Reading file…' : 'Analyze Resume'}
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
  )
}
