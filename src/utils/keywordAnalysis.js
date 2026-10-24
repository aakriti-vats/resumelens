/**
 * Pure keyword-analysis logic for ResumeLens.
 *
 * These functions have no React or browser dependencies, so they are easy to
 * test and reuse. React hooks live in src/hooks/, not here.
 */

const STOPWORDS = new Set([
  'about',
  'after',
  'and',
  'are',
  'for',
  'from',
  'have',
  'into',
  'the',
  'this',
  'that',
  'with',
  'your',
  'you',
  'our',
  'will',
  'all',
  'any',
  'both',
  'each',
  'more',
  'other',
  'some',
  'than',
  'them',
  'they',
  'what',
  'when',
  'where',
  'which',
  'who',
  'how',
  'role',
  'job',
  'work',
  'working',
  'team',
  'plus',
  'such',
  'ability',
  'experience',
  'experienced',
  'required',
  'requirement',
  'requirements',
  'preferred',
  'including',
  'using',
  'must',
  'should',
  'years',
  'looking',
  'candidate',
  'candidates',
  'skills',
  'skill',
  'strong',
  'knowledge',
  'responsibilities',
  'responsibility',
  'excellent',
  'good',
  'great',
  'join',
  'company',
  'position',
  'opportunity',
  'help',
  'build',
  'building',
  'support',
  'understanding',
  'environment',
  'seeking',
  'ideal',
  'successful',
  'demonstrated',
  'proven',
  // Generic job-title and seniority descriptors (prevent false score inflation)
  'developer',
  'developers',
  'engineer',
  'engineers',
  'analyst',
  'analysts',
  'senior',
  'junior',
  'lead',
])

/**
 * Recognized short domain acronyms / languages that would otherwise be filtered
 * by the token length threshold.
 */
const SHORT_EXCEPTIONS = new Set([
  'ai',
  'ui',
  'ux',
  'bi',
  'qa',
  'go',
  'r',
  'ci',
  'cd',
])

function extractTokens(text) {
  if (!text) return []

  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/[\s,/|]+/)
    .map((token) => token.trim().replace(/^\.+|\.+$/g, ''))
    .filter(Boolean)
}

export function extractKeywords(text) {
  if (!text) return []

  const tokens = extractTokens(text).filter(
    (token) =>
      (token.length >= 3 || SHORT_EXCEPTIONS.has(token)) &&
      !STOPWORDS.has(token) &&
      !/^\d+$/.test(token),
  )

  return [...new Set(tokens)]
}

function matchKeyword(keyword, resumeTokens) {
  if (resumeTokens.has(keyword)) return true

  // Allow simple singular/plural matches (e.g. api <-> apis) while guarding against false positives
  if (keyword.length > 3 && keyword.endsWith('s') && !keyword.endsWith('ss')) {
    if (resumeTokens.has(keyword.slice(0, -1))) return true
  } else if (keyword.length >= 3) {
    if (resumeTokens.has(`${keyword}s`)) return true
  }

  return false
}

export function analyzeResume({
  resumeText,
  jobDescription,
  jobTitle,
  resumeName,
}) {
  const keywords = extractKeywords(`${jobTitle ?? ''} ${jobDescription ?? ''}`)
  const resumeTokens = new Set(extractTokens(resumeText))

  const matched = keywords.filter((keyword) => matchKeyword(keyword, resumeTokens))
  const missing = keywords.filter((keyword) => !matchKeyword(keyword, resumeTokens))
  const score = keywords.length
    ? Math.round((matched.length / keywords.length) * 100)
    : 0

  return {
    resumeName: resumeName || 'Untitled resume',
    jobTitle: jobTitle || 'General role',
    resumeText: resumeText ?? '',
    jobDescription: jobDescription ?? '',
    score,
    matched,
    missing,
    suggestions: buildSuggestions(missing, score),
  }
}

function buildSuggestions(missing, score) {
  const items = [
    {
      title: 'Quantify your impact',
      body: 'Add metrics to recent bullets so ATS parsers and recruiters can see outcomes, not just duties.',
    },
  ]

  if (missing.length) {
    items.push({
      title: 'Integrate missing keywords',
      body: `Work in terms like ${missing.slice(0, 3).join(', ')} where they genuinely match your experience.`,
    })
  }

  if (score < 80) {
    items.push({
      title: 'Formatting check',
      body: 'Use a single-column layout, consistent dates, and standard section headings so ATS tools parse cleanly.',
    })
  }

  return items
}