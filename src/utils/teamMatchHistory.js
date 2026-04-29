const toRegionalsArray = (teamOrRegionals) => {
  if (Array.isArray(teamOrRegionals)) return teamOrRegionals
  if (Array.isArray(teamOrRegionals?.Regionals)) return teamOrRegionals.Regionals
  if (teamOrRegionals?.Regionals) return [teamOrRegionals.Regionals]
  return []
}

const toMatchesArray = (matches) => {
  if (Array.isArray(matches)) return matches
  if (matches) return [matches]
  return []
}

const normalizeMatchId = (matchId) => String(matchId || '').trim()

const annotateMatchesWithRegional = (matches, regionalId) => {
  return toMatchesArray(matches)
    .filter((match) => match && typeof match === 'object' && !Array.isArray(match))
    .map((match) => ({
      ...match,
      SourceRegionalId: String(regionalId || '').trim(),
    }))
}

const isQualificationMatchEntry = (entry) => {
  const matchType = String(entry?.MatchType || '').trim().toLowerCase()
  if (matchType === 'q' || matchType === 'qm') return true

  const matchId = normalizeMatchId(entry?.MatchId || entry?.id)
  return /(?:^|_)qm\d+/i.test(matchId)
}

const getMatchesForRegionalBucket = (teamOrRegionals, regionalId) => {
  const normalizedRegionalId = String(regionalId || '').trim()
  if (!normalizedRegionalId) return []

  const regionals = toRegionalsArray(teamOrRegionals)
  const currentRegional = regionals.find((entry) => String(entry?.RegionalId || '').trim() === normalizedRegionalId)
  return annotateMatchesWithRegional(currentRegional?.TeamMatches, normalizedRegionalId)
}

const getHistoricalQualificationMatches = (teamOrRegionals, activeRegionalId) => {
  const normalizedActiveRegionalId = String(activeRegionalId || '').trim()

  return toRegionalsArray(teamOrRegionals)
    .filter((entry) => String(entry?.RegionalId || '').trim() !== normalizedActiveRegionalId)
    .flatMap((entry) => annotateMatchesWithRegional(entry?.TeamMatches, entry?.RegionalId))
    .filter((entry) => isQualificationMatchEntry(entry))
}

const getPreferredQualificationMatches = (teamOrRegionals, activeRegionalId) => {
  const currentRegionalQuals = getMatchesForRegionalBucket(teamOrRegionals, activeRegionalId)
    .filter((entry) => isQualificationMatchEntry(entry))

  if (currentRegionalQuals.length > 0) return currentRegionalQuals
  return getHistoricalQualificationMatches(teamOrRegionals, activeRegionalId)
}

const getPreferredScoutingMatches = (teamOrRegionals, activeRegionalId) => {
  const currentRegionalMatches = getMatchesForRegionalBucket(teamOrRegionals, activeRegionalId)
  if (currentRegionalMatches.length > 0) return currentRegionalMatches
  return getHistoricalQualificationMatches(teamOrRegionals, activeRegionalId)
}

const hasCurrentRegionalScoutData = (teamOrRegionals, activeRegionalId) => {
  return getMatchesForRegionalBucket(teamOrRegionals, activeRegionalId).length > 0
}

export {
  getHistoricalQualificationMatches,
  getMatchesForRegionalBucket,
  getPreferredQualificationMatches,
  getPreferredScoutingMatches,
  hasCurrentRegionalScoutData,
  isQualificationMatchEntry,
  normalizeMatchId,
}