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
  return dateFormatter.format(new Date(iso))
}

/** "Aug 23, 2026, 9:15 PM" */
export function formatDateTime(iso) {
  return dateTimeFormatter.format(new Date(iso))
}