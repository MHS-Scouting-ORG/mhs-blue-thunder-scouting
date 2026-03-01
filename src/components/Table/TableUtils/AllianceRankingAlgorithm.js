/**
 * Alliance Selection Ranking Algorithm
 * 
 * Our ranking strategy is to prioritize more recent match results, in order
 * to have more accurate current ranks. We also devalue teams that have high
 * variability in favor of equally skilled teams that are more consistent.
 * 
 * The result is a conservative ranking score:
 *   allianceScore = skillRating - uncertaintyPenalty
 */

const DEFAULT_OPTIONS = {
  initialRating: 50,
  initialUncertainty: 18,
  minUncertainty: 4,
  maxUncertainty: 35,

  baseK: 0.2,
  recencyHalfLife: 8,
  opponentStrengthWeight: 0.35,
  minDifficultyMultiplier: 0.75,
  maxDifficultyMultiplier: 1.35,

  uncertaintyDecay: 0.08,
  uncertaintyShockWeight: 0.012,
  inconsistencyAlpha: 0.25,

  uncertaintyPenalty: 0.7,
  inconsistencyPenalty: 0.25,

  aggregateSeedSpread: 24,

  featureWeights: {
    ballsShot: 0.35,
    cycles: 0.25,
    robotSpeed: 0.1,
    activeStrategies: 0.1,
    auto: 0.1,
    endgame: 0.1
  }
}

const toNumber = (value, fallback = 0) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const safeLower = (value) => String(value || '').toLowerCase()

const avg = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return 0
  return arr.reduce((sum, x) => sum + toNumber(x, 0), 0) / arr.length
}

const parseMatchOrder = (matchId) => {
  const id = String(matchId || '')
  const matchNumber = id.match(/m(\d+)$/i) || id.match(/_(\d+)$/)
  if (matchNumber) return toNumber(matchNumber[1], 0)
  const anyDigits = id.match(/(\d+)/)
  return anyDigits ? toNumber(anyDigits[1], 0) : 0
}

const parseSpeedScore = (speed) => {
  const v = safeLower(speed)
  if (v.includes('fast')) return 1
  if (v.includes('average') || v.includes('medium')) return 0.6
  if (v.includes('slow')) return 0.3
  return 0
}

const parseAutoScore = (autoStrat) => {
  const v = safeLower(autoStrat)
  if (v.includes('scored')) return 1
  if (v.includes('wentmid') || v.includes('crossedmid')) return 0.45
  return 0
}

const parseEndgameScore = (endgame) => {
  const v = safeLower(endgame)
  if (v.includes('level1')) return 1
  if (v.includes('level2')) return 0.67
  if (v.includes('level3')) return 0.34
  return 0
}

const strategyQualityScore = (strategies) => {
  if (!Array.isArray(strategies) || strategies.length === 0) return 0
  const qualityKeywords = ['score', 'shoot', 'cycle', 'defense', 'climb', 'amp', 'speaker', 'trap']
  const hits = strategies.filter((strategy) =>
    qualityKeywords.some((keyword) => safeLower(strategy).includes(keyword))
  ).length
  const breadth = clamp(strategies.length / 4, 0, 1)
  const quality = clamp(hits / Math.max(1, strategies.length), 0, 1)
  return 0.5 * breadth + 0.5 * quality
}

const getPenaltySeverity = (match) => {
  const committed = match?.Penalties?.PenaltiesCommitted || {}
  const fouls = toNumber(match?.Penalties?.Fouls, 0)
  const techs = toNumber(match?.Penalties?.Tech, 0)
  let severity = 0
  severity += 0.08 * fouls
  severity += 0.2 * techs
  if (committed?.YellowCard) severity += 0.2
  if (committed?.RedCard) severity += 0.5
  if (committed?.Broken) severity += 0.35
  if (committed?.Disabled) severity += 0.3
  if (committed?.DQ) severity += 0.6
  if (committed?.NoShow) severity += 0.6
  return clamp(severity, 0, 0.85)
}

const getMatchPerformanceScore = (match, options) => {
  const weights = options.featureWeights
  const ballsShot = clamp(toNumber(match?.RobotInfo?.BallsShot, 0) / 18, 0, 1)
  const cycles = clamp(toNumber(match?.RobotInfo?.ShootingCycles, 0) / 10, 0, 1)
  const robotSpeed = parseSpeedScore(match?.RobotInfo?.RobotSpeed)
  const activeStrategies = strategyQualityScore(match?.ActiveStrat)
  const auto = parseAutoScore(match?.Autonomous?.AutoStrat)
  const endgame = parseEndgameScore(match?.Teleop?.Endgame)

  const rawPerformance =
    ballsShot * weights.ballsShot +
    cycles * weights.cycles +
    robotSpeed * weights.robotSpeed +
    activeStrategies * weights.activeStrategies +
    auto * weights.auto +
    endgame * weights.endgame

  const penaltySeverity = getPenaltySeverity(match)
  const reliabilityMultiplier = 1 - penaltySeverity

  return clamp(rawPerformance * reliabilityMultiplier * 100, 0, 100)
}

const getAggregateSeedScore = (teamData) => {
  if (!teamData) return 0.5

  const totalMatches = Math.max(1, toNumber(teamData.Matches, 0))
  const broken = Array.isArray(teamData.BrokenRobot) ? teamData.BrokenRobot.length : toNumber(teamData.BrokenRobot, 0)
  const disabled = Array.isArray(teamData.Disabled) ? teamData.Disabled.length : toNumber(teamData.Disabled, 0)
  const dq = Array.isArray(teamData.DQ) ? teamData.DQ.length : toNumber(teamData.DQ, 0)
  const reliability = clamp(1 - ((broken + disabled + dq) / totalMatches), 0, 1)

  const normalized =
    clamp(toNumber(teamData.AvgPoints, 0) / 50, 0, 1) * 0.35 +
    clamp(toNumber(teamData.AvgAutoPts, 0) / 15, 0, 1) * 0.2 +
    clamp(toNumber(teamData.AvgEndgamePts, 0) / 30, 0, 1) * 0.2 +
    clamp(toNumber(teamData.AvgCycles, 0) / 10, 0, 1) * 0.15 +
    clamp(toNumber(teamData.OPR, 0) / 60, 0, 1) * 0.05 +
    reliability * 0.05

  return clamp(normalized, 0, 1)
}

const normalizeTeamNumber = (value) => String(value ?? '').trim()

const extractTeamMatches = (team) => {
  if (!team) return []
  if (Array.isArray(team.TeamMatches)) return team.TeamMatches
  if (Array.isArray(team.matches)) return team.matches
  if (Array.isArray(team.MatchHistory)) return team.MatchHistory
  return []
}

const normalizeMatchEntriesFromTeams = (teamsData) => {
  const entries = []

  ;(teamsData || []).forEach((team) => {
    const teamNumber = normalizeTeamNumber(team?.TeamNumber ?? team?.id ?? team?.Team)
    if (!teamNumber) return

    const teamMatches = extractTeamMatches(team)
    teamMatches.forEach((match, index) => {
      const matchId = String(match?.MatchId || match?.id || '').trim()
      if (!matchId || matchId === 'matchEntry.MatchId') return

      entries.push({
        teamNumber,
        matchId,
        matchOrder: parseMatchOrder(matchId) || (index + 1),
        match
      })
    })
  })

  return entries.sort((a, b) => {
    if (a.matchOrder !== b.matchOrder) return a.matchOrder - b.matchOrder
    if (a.matchId !== b.matchId) return a.matchId.localeCompare(b.matchId)
    return a.teamNumber.localeCompare(b.teamNumber)
  })
}

const buildMatchBuckets = (entries) => {
  const matchBuckets = new Map()
  entries.forEach((entry) => {
    if (!matchBuckets.has(entry.matchId)) matchBuckets.set(entry.matchId, [])
    matchBuckets.get(entry.matchId).push(entry)
  })
  return matchBuckets
}

const createInitialState = (seedScore, options) => {
  const centered = (seedScore - 0.5) * options.aggregateSeedSpread
  return {
    rating: options.initialRating + centered,
    uncertainty: options.initialUncertainty,
    inconsistency: options.initialUncertainty * 0.25,
    matchesPlayed: 0
  }
}

const ensureTeamState = (stateMap, teamNumber, seedScore, options) => {
  if (!stateMap.has(teamNumber)) {
    stateMap.set(teamNumber, createInitialState(seedScore, options))
  }
  return stateMap.get(teamNumber)
}

const applyMatchUpdate = ({ teamState, rawPerformance, recencyWeight, opponentMean, options }) => {
  const relativeOpponentStrength = (opponentMean - options.initialRating) / 25
  const difficultyMultiplier = clamp(
    1 + options.opponentStrengthWeight * relativeOpponentStrength,
    options.minDifficultyMultiplier,
    options.maxDifficultyMultiplier
  )

  const observedPerformance = clamp(rawPerformance * difficultyMultiplier, 0, 100)
  const residual = observedPerformance - teamState.rating

  const uncertaintyFactor = 1 + (teamState.uncertainty / options.initialUncertainty)
  const effectiveK = options.baseK * recencyWeight * uncertaintyFactor
  teamState.rating = clamp(teamState.rating + (effectiveK * residual), 0, 100)

  teamState.inconsistency =
    (1 - options.inconsistencyAlpha) * teamState.inconsistency +
    options.inconsistencyAlpha * Math.abs(residual)

  const newUncertainty =
    teamState.uncertainty * (1 - options.uncertaintyDecay * recencyWeight) +
    options.uncertaintyShockWeight * (Math.abs(residual) ** 2)

  teamState.uncertainty = clamp(newUncertainty, options.minUncertainty, options.maxUncertainty)
  teamState.matchesPlayed += 1
}

const finalizeTeamState = (teamState, options) => {
  const conservativeRating =
    teamState.rating -
    options.uncertaintyPenalty * teamState.uncertainty -
    options.inconsistencyPenalty * teamState.inconsistency

  const confidence = clamp(1 - (teamState.uncertainty / options.maxUncertainty), 0, 1)

  return {
    rating: teamState.rating,
    uncertainty: teamState.uncertainty,
    inconsistency: teamState.inconsistency,
    conservativeRating,
    confidence,
    matchesPlayed: teamState.matchesPlayed
  }
}

const runRatingUpdates = (entries, initialStateMap, options) => {
  const matchBuckets = buildMatchBuckets(entries)
  const stateMap = initialStateMap
  const latestOrder = entries.reduce((max, entry) => Math.max(max, entry.matchOrder), 0)

  entries.forEach((entry) => {
    const teamState = stateMap.get(entry.teamNumber)
    if (!teamState) return

    const age = Math.max(0, latestOrder - entry.matchOrder)
    const recencyWeight = Math.exp(-age / options.recencyHalfLife)

    const teammatesAndOpponents = matchBuckets.get(entry.matchId) || []
    const opponentRatings = teammatesAndOpponents
      .filter((other) => other.teamNumber !== entry.teamNumber)
      .map((other) => stateMap.get(other.teamNumber)?.rating)
      .filter((value) => Number.isFinite(value))

    const opponentMean = opponentRatings.length > 0
      ? avg(opponentRatings)
      : options.initialRating

    const rawPerformance = getMatchPerformanceScore(entry.match, options)

    applyMatchUpdate({
      teamState,
      rawPerformance,
      recencyWeight,
      opponentMean,
      options
    })
  })

  const finalized = new Map()
  stateMap.forEach((state, teamNumber) => {
    finalized.set(teamNumber, finalizeTeamState(state, options))
  })

  return finalized
}

export function calculateTeamScore(teamData, options = {}) {
  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    featureWeights: {
      ...DEFAULT_OPTIONS.featureWeights,
      ...(options.featureWeights || {})
    }
  }

  const teamMatches = extractTeamMatches(teamData)
  if (teamMatches.length === 0) {
    return 0
  }

  if (teamMatches.length > 0) {
    const ranked = rankTeamsForAllianceSelection([teamData], mergedOptions)
    return ranked[0]?.allianceScore ?? mergedOptions.initialRating
  }

  const seed = getAggregateSeedScore(teamData)
  const baselineState = createInitialState(seed, mergedOptions)
  const baselineFinal = finalizeTeamState(baselineState, mergedOptions)
  return baselineFinal.conservativeRating
}

/**
 * Re-rank teams using match-by-match updates.
 *
 * Input:
 *  - teamsData: [{ TeamNumber, TeamMatches: [...] }, ...]
 *
 * Output fields added to each team row:
 *  - allianceScore: conservative rating (primary sort key)
 *  - skillRating: current estimated skill
 *  - uncertainty: rating uncertainty
 *  - confidence: 0..1 certainty estimate
 *  - matchesRated: number of matches used in updates
 */
export function rankTeamsForAllianceSelection(teamsData, options = {}) {
  if (!teamsData || !Array.isArray(teamsData)) return []

  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    featureWeights: {
      ...DEFAULT_OPTIONS.featureWeights,
      ...(options.featureWeights || {})
    }
  }

  const stateMap = new Map()
  teamsData.forEach((team) => {
    const teamNumber = normalizeTeamNumber(team?.TeamNumber ?? team?.id ?? team?.Team)
    if (!teamNumber) return
    const seed = getAggregateSeedScore(team)
    ensureTeamState(stateMap, teamNumber, seed, mergedOptions)
  })

  const entries = normalizeMatchEntriesFromTeams(teamsData)
  const finalRatings = entries.length > 0
    ? runRatingUpdates(entries, stateMap, mergedOptions)
    : (() => {
      const finalized = new Map()
      stateMap.forEach((state, teamNumber) => {
        finalized.set(teamNumber, finalizeTeamState(state, mergedOptions))
      })
      return finalized
    })()

  return teamsData
    .map((team) => {
      const teamNumber = normalizeTeamNumber(team?.TeamNumber ?? team?.id ?? team?.Team)
      const teamMatches = extractTeamMatches(team)

      if (teamMatches.length === 0) {
        return {
          ...team,
          allianceScore: 0,
          skillRating: 0,
          uncertainty: mergedOptions.maxUncertainty,
          confidence: 0,
          matchesRated: 0
        }
      }

      const rating = finalRatings.get(teamNumber)

      if (!rating) {
        return {
          ...team,
          allianceScore: 0,
          skillRating: 0,
          uncertainty: mergedOptions.maxUncertainty,
          confidence: 0,
          matchesRated: 0
        }
      }

      return {
        ...team,
        allianceScore: rating.conservativeRating,
        skillRating: rating.rating,
        uncertainty: rating.uncertainty,
        confidence: rating.confidence,
        matchesRated: rating.matchesPlayed
      }
    })
    .sort((a, b) => b.allianceScore - a.allianceScore)
}

/**
 * Continuous updater for incremental workflows.
 * Use this when new match submissions arrive and you want to update ratings
 * without reprocessing older events in a separate cache/service.
 */
export function updateRatingsWithNewMatches(existingRatings = {}, newMatchEntries = [], options = {}) {
  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    featureWeights: {
      ...DEFAULT_OPTIONS.featureWeights,
      ...(options.featureWeights || {})
    }
  }

  const stateMap = new Map()
  Object.entries(existingRatings || {}).forEach(([teamNumber, rating]) => {
    const normalizedTeam = normalizeTeamNumber(teamNumber)
    if (!normalizedTeam) return
    stateMap.set(normalizedTeam, {
      rating: clamp(toNumber(rating?.rating, mergedOptions.initialRating), 0, 100),
      uncertainty: clamp(
        toNumber(rating?.uncertainty, mergedOptions.initialUncertainty),
        mergedOptions.minUncertainty,
        mergedOptions.maxUncertainty
      ),
      inconsistency: Math.max(0, toNumber(rating?.inconsistency, mergedOptions.initialUncertainty * 0.25)),
      matchesPlayed: Math.max(0, toNumber(rating?.matchesPlayed, 0))
    })
  })

  const normalizedEntries = (Array.isArray(newMatchEntries) ? newMatchEntries : [])
    .map((entry, index) => {
      const teamNumber = normalizeTeamNumber(entry?.teamNumber ?? entry?.Team ?? entry?.team ?? entry?.TeamNumber)
      const matchId = String(entry?.matchId ?? entry?.MatchId ?? '').trim()
      const match = entry?.match || entry
      if (!teamNumber || !matchId) return null
      return {
        teamNumber,
        matchId,
        matchOrder: parseMatchOrder(matchId) || (index + 1),
        match
      }
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.matchOrder !== b.matchOrder) return a.matchOrder - b.matchOrder
      if (a.matchId !== b.matchId) return a.matchId.localeCompare(b.matchId)
      return a.teamNumber.localeCompare(b.teamNumber)
    })

  normalizedEntries.forEach((entry) => {
    ensureTeamState(stateMap, entry.teamNumber, 0.5, mergedOptions)
  })

  const finalRatings = runRatingUpdates(normalizedEntries, stateMap, mergedOptions)
  const result = {}

  finalRatings.forEach((value, teamNumber) => {
    result[teamNumber] = {
      rating: value.rating,
      uncertainty: value.uncertainty,
      inconsistency: value.inconsistency,
      conservativeRating: value.conservativeRating,
      confidence: value.confidence,
      matchesPlayed: value.matchesPlayed
    }
  })

  return result
}