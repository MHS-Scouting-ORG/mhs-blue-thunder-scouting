const normalizeText = (value) => String(value ?? '').toLowerCase().trim()

const toTokens = (value) => normalizeText(value).split(/[^a-z0-9]+/).filter(Boolean)

const scoreTextMatch = (term, value) => {
  const needle = normalizeText(term)
  const haystack = normalizeText(value)

  if (!needle || !haystack) return 0
  if (haystack === needle) return 120
  if (haystack.startsWith(needle)) return 100

  const tokens = toTokens(haystack)
  if (tokens.some(token => token.startsWith(needle))) return 90

  if (haystack.includes(needle)) return 75
  return 0
}

const toNumericSortValue = (value) => {
  const num = Number.parseInt(String(value ?? ''), 10)
  return Number.isNaN(num) ? Number.MAX_SAFE_INTEGER : num
}

export const getTopTeamSuggestions = ({
  term,
  dbTeams = [],
  simpleTeams = [],
  resolveDbTeamNumber,
  limit = 3,
}) => {
  const normalizedTerm = normalizeText(term)
  if (!normalizedTerm) return []

  const byTeamNumber = new Map()

  const addCandidate = ({ teamNumber, label, source, score }) => {
    const normalizedTeamNumber = String(teamNumber ?? '').trim()
    if (!normalizedTeamNumber || score <= 0) return

    const existing = byTeamNumber.get(normalizedTeamNumber)
    if (!existing || score > existing.score) {
      byTeamNumber.set(normalizedTeamNumber, {
        teamNumber: normalizedTeamNumber,
        label: String(label || normalizedTeamNumber),
        source,
        score,
      })
    }
  }

  dbTeams.forEach((team) => {
    const resolvedTeamNumber = resolveDbTeamNumber ? resolveDbTeamNumber(team) : String(team?.id || '')
    const displayName = String(team?.TeamAttributes?.name || '').trim()

    const score = Math.max(
      scoreTextMatch(normalizedTerm, resolvedTeamNumber),
      scoreTextMatch(normalizedTerm, displayName),
    ) + 2

    addCandidate({
      teamNumber: resolvedTeamNumber,
      label: displayName ? `${resolvedTeamNumber} - ${displayName}` : resolvedTeamNumber,
      source: 'db',
      score,
    })
  })

  simpleTeams.forEach((team) => {
    const teamNumber = String(team?.team_number || team?.TeamNumber || '').trim()
    const nickname = String(team?.nickname || team?.name || '').trim()

    const score = Math.max(
      scoreTextMatch(normalizedTerm, teamNumber),
      scoreTextMatch(normalizedTerm, nickname),
    )

    addCandidate({
      teamNumber,
      label: nickname ? `${teamNumber} - ${nickname}` : teamNumber,
      source: 'ba',
      score,
    })
  })

  return Array.from(byTeamNumber.values())
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return toNumericSortValue(a.teamNumber) - toNumericSortValue(b.teamNumber)
    })
    .slice(0, Math.max(1, limit))
}
