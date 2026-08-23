import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.brand}>ResumeLens</p>
        <nav aria-label="Footer">
          <ul className={styles.links}>
            <li>
              <a href="#privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="#terms">Terms of Service</a>
            </li>
            <li>
              <a href="#support">Contact Support</a>
            </li>
            <li>
              <a href="#api">API Documentation</a>
            </li>
          </ul>
        </nav>
        <p className={styles.copy}>© 2024 ResumeLens. All rights reserved.</p>
      </div>
    </footer>
  )
}
