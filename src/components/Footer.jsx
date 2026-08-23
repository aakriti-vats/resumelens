import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.brand}>ResumeLens</p>
        <nav aria-label="Footer">
          <ul className={styles.links}>
            <li>
              <Link to="/">Analyze Resume</Link>
            </li>
            <li>
              <Link to="/compare">Compare Versions</Link>
            </li>
            <li>
              <Link to="/history">Analysis History</Link>
            </li>
          </ul>
        </nav>
        <p className={styles.copy}>© {year} ResumeLens. All rights reserved.</p>
      </div>
    </footer>
  )
}