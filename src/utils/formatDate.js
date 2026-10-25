/**
 * Date formatting helpers shared across pages.
 * Keeps timestamp display consistent (History list, Results header, etc.).
 */

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

/** "Aug 23, 2026" */
export function formatDate(iso) {
  try {
    if (!iso) return 'Recently'
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return 'Recently'
    return dateFormatter.format(d)
  } catch {
    return 'Recently'
  }
}

/** "Aug 23, 2026, 9:15 PM" */
export function formatDateTime(iso) {
  try {
    if (!iso) return 'Active session'
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return 'Active session'
    return dateTimeFormatter.format(d)
  } catch {
    return 'Active session'
  }
}