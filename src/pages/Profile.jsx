import { useParams } from 'react-router-dom'
import styles from './Profile.module.css'

export default function Profile() {
  const { id } = useParams()
  if (!id || id === 'me') {
    return (
      <section className={styles.profile} aria-labelledby={`profile-me`}>
        <h2 id={`profile-me`}>Your Profile</h2>
        <p>Use the edit profile page to update your information.</p>
      </section>
    )
  }

  return (
    <section className={styles.profile} aria-labelledby={`profile-${id}`}>
      <h2 id={`profile-${id}`}>Profile {id}</h2>
      <p>This demonstrates a dynamic route param: id = {id}</p>
    </section>
  )
}
