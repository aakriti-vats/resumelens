import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Page not found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <p>
          <Link className={styles.homeLink} to="/">Go home</Link>
        </p>
      </section>
    </main>
  )
}
