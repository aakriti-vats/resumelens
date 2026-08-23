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
  'role',
  'job',
  'work',
  'team',
  'plus',
  'such',
  'ability',
  'experience',
  'required',
  'preferred',
  'including',
  'using',
  'must',
  'should',
  'years',
])

export function extractKeywords(text) {
  if (!text) return []

  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/[\s,/|]+/)
    .map((token) => token.trim())
    .filter(
      (token) =>
        token.length >= 3 &&
        !STOPWORDS.has(token) &&
        !/^\d+$/.test(token),
    )

  return [...new Set(tokens)].slice(0, 24)
}

export function analyzeResume({
  resumeText,
  jobDescription,
  jobTitle,
  resumeName,
}) {
  const keywords = extractKeywords(`${jobTitle ?? ''} ${jobDescription ?? ''}`)
  const haystack = (resumeText ?? '').toLowerCase()

  const matched = keywords.filter((keyword) => haystack.includes(keyword))
  const missing = keywords.filter((keyword) => !haystack.includes(keyword))
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
