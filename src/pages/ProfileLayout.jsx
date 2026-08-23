import { Link, Outlet } from 'react-router-dom'
import styles from './Profile.module.css'

export default function ProfileLayout() {
  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="profiles-heading">
        <h1 id="profiles-heading">Profiles</h1>
        <p>Example nested route index. Select a profile:</p>
        <ul className={styles.list}>
          <li>
            <Link to="1">Profile 1</Link>
          </li>
          <li>
            <Link to="2">Profile 2</Link>
          </li>
          <li>
            <Link to="3">Profile 3</Link>
          </li>
          <li>
            <Link to="me">My Profile</Link>
          </li>
        </ul>
        <Outlet />
      </section>
    </main>
  )
}
