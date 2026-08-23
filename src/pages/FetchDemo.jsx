import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'
import styles from './FetchDemo.module.css'
import homeStyles from './Home.module.css'
import { extractKeywords, analyzeResume } from '../hooks/useKeywordMatch'
import { useLocalHistory } from '../hooks/useLocalHistory'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export default function FetchDemo() {
  const [jobs, setJobs] = useState([])
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [resumeName, setResumeName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileRef = useRef(null)
  const navigate = useNavigate()
  const { addEntry } = useLocalHistory()

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch('/job-samples.json')
        if (!res.ok) throw new Error('Failed to load job samples')
        const json = await res.json()
        setJobs(json)
        setError(null)
      } catch (err) {
        setError(err.message)
      }
    }

    loadJobs()
  }, [])

  function handleSelect(job) {
    setSelected(job)
    setAnalysis(null)
    setJobTitle(job.title || '')
    setJobDescription(job.description || '')
  }

  function handleClear() {
    setResumeText('')
    setResumeName('')
    setAnalysis(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function extractTextFromPdf(file) {
    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise
    const parts = []

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber)
      const content = await page.getTextContent()
      const pageText = content.items.map((item) => item.str).join(' ')
      parts.push(pageText)
    }

    return parts.join('\n\n')
  }

  async function processFileObject(file) {
    if (!file) return

    const files = file instanceof File ? [file] : Array.from(file)
    if (!files.length) return

    const names = files.map((f) => f.name)
    setResumeName(names.join(', '))
    setError('')

    for (const f of files) {
      if (f.size > 5 * 1024 * 1024) {
        setError('Max file size is 5MB.')
        return
      }

      try {
        if (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) {
          const extractedText = await extractTextFromPdf(f)
          setResumeText((prev) => (prev ? `${prev}\n\n${extractedText}` : extractedText))
          continue
        }

        if (f.type.startsWith('text/') || f.name.toLowerCase().endsWith('.txt')) {
          const text = await f.text()
          setResumeText((prev) => (prev ? `${prev}\n\n${text}` : text))
        }
      } catch {
        setError(`Could not read ${f.name}. Please paste the text manually.`)
      }
    }
  }

  function handleFile(event) {
    const files = event.target.files
    processFileObject(files)
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    processFileObject(e.dataTransfer?.files)
    setDragActive(false)
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDragEnter(e) {
    e.preventDefault()
    setDragActive(true)
  }

  function handleDragLeave(e) {
    e.preventDefault()
    setDragActive(false)
  }

  function handleAnalyze() {
    if (!jobDescription.trim() && !jobTitle.trim()) return setError('Pick or enter a job description first')

    const result = analyzeResume({
      resumeText,
      jobDescription,
      jobTitle,
      resumeName,
    })

    setAnalysis(result)
    setError(null)

    const isAuth = localStorage.getItem('resumelens-auth') === '1'
    if (!isAuth) {
      try {
        sessionStorage.setItem('resumelens-pending-analysis', JSON.stringify(result))
      } catch {}
      navigate('/signin', { state: { from: '/results' } })
      return
    }

    addEntry(result)
    navigate('/results')
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="fetch-heading">
        <h1 id="fetch-heading">Job samples & analysis</h1>
        <p>Fetches local job samples and demonstrates keyword extraction and resume matching.</p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={homeStyles.form} style={{ alignItems: 'start' }}>
          <div>
            <h2>Job samples</h2>
            <ul>
              {jobs.map((job) => (
                <li key={job.id}>
                  <button type="button" onClick={() => handleSelect(job)}>
                    {job.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2>Selected</h2>
            {selected ? (
              <article>
                <h3>{selected.title}</h3>
                <p>{selected.description}</p>
                <p>
                  <strong>Extracted keywords:</strong>{' '}
                  {extractKeywords(selected.description).join(', ')}
                </p>
              </article>
            ) : (
              <p>No job selected</p>
            )}
          </div>
        </div>

        <hr style={{ margin: '18px 0' }} />

        <div onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}>
          <h2>Analyze a resume</h2>
          <div className={homeStyles.form}>
            <article className={homeStyles.card}>
              <div
                className={`${homeStyles.dropzone} ${dragActive ? styles.dropzoneActive : ''}`}
                role="button"
                onClick={() => fileRef.current?.click()}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    fileRef.current?.click()
                  }
                }}
              >
                <strong>{resumeName || 'Drag & drop a file here or click to upload'}</strong>
                <small>Supported formats: PDF, DOCX, TXT. Max file size 5MB.</small>
              </div>
              <input ref={fileRef} className={homeStyles.fileInput} type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleFile} multiple />

              <label className={homeStyles.label}>
                Resume text
                <textarea className={homeStyles.textarea} value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
              </label>
            </article>

            <article className={homeStyles.card}>
              <label className={homeStyles.label}>
                Job Title (optional)
                <input className={homeStyles.input} value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
              </label>

              <label className={`${homeStyles.label} ${homeStyles.spacedLabel}`}>
                Job Details
                <textarea className={homeStyles.textarea} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
              </label>

              <div className={homeStyles.submitRow} style={{ marginTop: 12 }}>
                <button className={homeStyles.submit} onClick={handleAnalyze}>Analyze Resume</button>
              </div>
            </article>
          </div>
        </div>

        {analysis && (
          <section className={styles.result} aria-labelledby="analysis-heading">
            <h2 id="analysis-heading">Analysis results</h2>
            <p>
              Score: <strong>{analysis.score}</strong>
            </p>
            <p>
              Matched: <strong>{analysis.matched.length}</strong> — {analysis.matched.join(', ')}
            </p>
            <p>
              Missing: <strong>{analysis.missing.length}</strong> — {analysis.missing.join(', ')}
            </p>
          </section>
        )}
      </section>
    </main>
  )
}
