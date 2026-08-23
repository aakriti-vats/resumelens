import styles from './KeywordBadge.module.css'

export default function KeywordBadge({ label, variant = 'matched' }) {
  const tone = variant === 'missing' ? styles.missing : styles.matched

  return <span className={`${styles.badge} ${tone}`}>{label}</span>
}
