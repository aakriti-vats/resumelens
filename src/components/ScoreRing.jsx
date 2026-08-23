import { useEffect, useMemo, useState } from 'react'
import styles from './ScoreRing.module.css'

export default function ScoreRing({
  score = 0,
  size = 160,
  strokeWidth = 10,
  label,
}) {
  const clamped = Math.max(0, Math.min(100, Number(score) || 0))
  const [progress, setProgress] = useState(0)

  const { radius, circumference } = useMemo(() => {
    const nextRadius = (size - strokeWidth) / 2
    return {
      radius: nextRadius,
      circumference: 2 * Math.PI * nextRadius,
    }
  }, [size, strokeWidth])

  useEffect(() => {
    const frame = requestAnimationFrame(() => setProgress(clamped))
    return () => cancelAnimationFrame(frame)
  }, [clamped])

  const offset = circumference - (progress / 100) * circumference
  const center = size / 2

  return (
    <figure className={styles.wrap} style={{ width: size, height: size }}>
      <svg
        className={styles.svg}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Match score ${clamped} out of 100`}
      >
        <circle
          className={styles.track}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className={styles.progress}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <figcaption className={styles.caption}>
        <strong>{clamped}</strong>
        {label ? <span>{label}</span> : <span>/ 100</span>}
      </figcaption>
    </figure>
  )
}
