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

const DEFAULT_GAME_PROFILE = 'frc2026Rebuilt'

const DEFAULT_GAME_PROFILES = {
  legacy: {
    metricWeights: {
      autoActions: 0.16,
      autoHang: 0.04,
      teleopMobility: 0.08,
      endgame: 0.12,
      ballsShot: 0.27,
      shootingCycles: 0.08,
      robotSpeed: 0.09,
      shooterSpeed: 0.04,
      driverSkill: 0.03,
      teamImpact: 0.03,
      strategyExecution: 0.03,
      reliability: 0.03
    },
    seedWeights: {
      avgPoints: 0.35,
      avgAutoPts: 0.25,
      avgEndgamePts: 0.25,
      opr: 0.1,
      reliability: 0.05
    }
  },
  frc2026Rebuilt: {
    metricWeights: {
      autoActions: 0.17,
      autoHang: 0.06,
      teleopMobility: 0.07,
      endgame: 0.16,
      ballsShot: 0.16,
      shootingCycles: 0.1,
      robotSpeed: 0.07,
      shooterSpeed: 0.04,
      driverSkill: 0.05,
      teamImpact: 0.04,
      strategyExecution: 0.05,
      reliability: 0.03
    },
    seedWeights: {
      avgPoints: 0.34,
      avgAutoPts: 0.24,
      avgEndgamePts: 0.24,
      opr: 0.1,
      reliability: 0.08
    }
  }
}

const DEFAULT_OPTIONS = {
  gameProfile: DEFAULT_GAME_PROFILE,

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

  normalizationCaps: {
    ballsShotMax: 18,
    shootingCyclesMax: 10,
    teleopTravelMidMax: 6
  },

  metricWeights: {
    ...DEFAULT_GAME_PROFILES.frc2026Rebuilt.metricWeights
  },
  seedWeights: {
    ...DEFAULT_GAME_PROFILES.frc2026Rebuilt.seedWeights
  },

  featureWeights: {
    ballsShot: 0.16,
    robotSpeed: 0.07,
    activeStrategies: 0.05,
    auto: 0.17,
    endgame: 0.16
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

const normalizeWeights = (weights, fallbackWeights) => {
  const source = weights && typeof weights === 'object' ? weights : fallbackWeights
  const keys = Object.keys(source || {})
  if (keys.length === 0) return {}

  const sanitized = {}
  let sum = 0
  keys.forEach((key) => {
    const weight = Math.max(0, toNumber(source[key], 0))
    sanitized[key] = weight
    sum += weight
  })

  if (sum <= 0) {
    const equal = 1 / keys.length
    keys.forEach((key) => {
      sanitized[key] = equal
    })
    return sanitized
  }

  keys.forEach((key) => {
    sanitized[key] = sanitized[key] / sum
  })

  return sanitized
}

const mergeWeights = (baseWeights, overrideWeights) => {
  if (!overrideWeights || typeof overrideWeights !== 'object') return { ...baseWeights }
  return {
    ...baseWeights,
    ...overrideWeights
  }
}

const mapLegacyFeatureWeights = (featureWeights) => {
  if (!featureWeights || typeof featureWeights !== 'object') return {}

  return {
    autoActions: featureWeights.auto,
    ballsShot: featureWeights.ballsShot,
    robotSpeed: featureWeights.robotSpeed,
    strategyExecution: featureWeights.activeStrategies,
    endgame: featureWeights.endgame
  }
}

const resolveRankingOptions = (options = {}) => {
  const profileName = options.gameProfile || DEFAULT_OPTIONS.gameProfile
  const profile = DEFAULT_GAME_PROFILES[profileName] || DEFAULT_GAME_PROFILES[DEFAULT_GAME_PROFILE]

  const metricOverride = {
    ...mapLegacyFeatureWeights(options.featureWeights),
    ...(options.metricWeights || {})
  }

  const metricWeights = normalizeWeights(
    mergeWeights(profile.metricWeights, metricOverride),
    profile.metricWeights
  )

  const seedWeights = normalizeWeights(
    mergeWeights(profile.seedWeights, options.seedWeights),
    profile.seedWeights
  )

  return {
    ...DEFAULT_OPTIONS,
    ...options,
    gameProfile: profileName,
    normalizationCaps: {
      ...DEFAULT_OPTIONS.normalizationCaps,
      ...(options.normalizationCaps || {})
    },
    metricWeights,
    seedWeights,
    featureWeights: {
      ...DEFAULT_OPTIONS.featureWeights,
      ...(options.featureWeights || {})
    }
  }
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

const parseDriverSkillScore = (skill) => {
  const v = safeLower(skill)
  if (v.includes('excellent')) return 1
  if (v.includes('good')) return 0.75
  if (v.includes('average')) return 0.5
  if (v.includes('poor')) return 0.25
  return 0
}

const parseTeamImpactScore = (impact) => {
  const v = safeLower(impact)
  if (v.includes('high')) return 1
  if (v.includes('medium')) return 0.6
  if (v.includes('low')) return 0.3
  return 0
}

const parseAutoScore = (autoStrat) => {
  // Handle array-based AutoStrat (new format)
  if (Array.isArray(autoStrat)) {
    if (autoStrat.length === 0) return 0
    // Give points for each auto action: ScoredInGoal=1, LeftStartingZone=0.3, Nothing=0
    let maxScore = 0
    for (const action of autoStrat) {
      const v = safeLower(action)
      if (v.includes('scored') || v.includes('goal')) {
        maxScore = Math.max(maxScore, 1)
      } else if (v.includes('left') || v.includes('starting') || v.includes('zone')) {
        maxScore = Math.max(maxScore, 0.3)
      }
    }
    return maxScore
  }
  
  // Handle string-based AutoStrat (backwards compatibility)
  const v = safeLower(autoStrat)
  if (v.includes('scored') || v.includes('goal')) return 1
  if (v.includes('left') || v.includes('starting') || v.includes('zone')) return 0.3
  if (v.includes('wentmid') || v.includes('crossedmid')) return 0.45
  return 0
}

const parseAutoHangScore = (autoHang) => {
  const v = safeLower(autoHang)
  if (v.includes('level3')) return 1
  if (v.includes('level2')) return 0.7
  if (v.includes('level1')) return 0.45
  return 0
}

const parseEndgameScore = (endgame) => {
  const v = safeLower(endgame)
  if (v.includes('level3')) return 1
  if (v.includes('level2')) return 0.7
  if (v.includes('level1')) return 0.45
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

const strategyExecutionScore = (activeStrategies, inactiveStrategies) => {
  const active = strategyQualityScore(activeStrategies)
  if (!Array.isArray(inactiveStrategies) || inactiveStrategies.length === 0) {
    return active
  }

  const inactivePenalty = clamp(inactiveStrategies.length / 5, 0, 0.35)
  return clamp(active - inactivePenalty, 0, 1)
}

const getPenaltySeverity = (match) => {
  const committed = match?.Penalties?.PenaltiesCommitted || {}
  let severity = 0
  if (committed?.Broken) severity += 0.35
  if (committed?.Disabled) severity += 0.3
  if (committed?.DQ) severity += 0.6
  if (committed?.NoShow) severity += 0.6
  if (committed?.StuckOnBump) severity += 0.25
  if (committed?.StuckOnBalls) severity += 0.25
  return clamp(severity, 0, 0.85)
}

const getMatchPerformanceScore = (match, options) => {
  const weights = options.metricWeights
  const caps = options.normalizationCaps

  const ballsShot = clamp(toNumber(match?.RobotInfo?.BallsShot, 0) / Math.max(1, toNumber(caps?.ballsShotMax, 18)), 0, 1)
  const shootingCycles = clamp(toNumber(match?.RobotInfo?.ShootingCycles, 0) / Math.max(1, toNumber(caps?.shootingCyclesMax, 10)), 0, 1)
  const teleopMobility = clamp(toNumber(match?.Teleop?.TravelMid, 0) / Math.max(1, toNumber(caps?.teleopTravelMidMax, 6)), 0, 1)

  const robotSpeed = parseSpeedScore(match?.RobotInfo?.RobotSpeed)
  const shooterSpeed = parseSpeedScore(match?.RobotInfo?.ShooterSpeed)
  const driverSkill = parseDriverSkillScore(match?.RobotInfo?.DriverSkill)
  const teamImpact = parseTeamImpactScore(match?.TeamImpact)

  const autoActions = parseAutoScore(match?.Autonomous?.AutoStrat)
  const autoHang = parseAutoHangScore(match?.Autonomous?.AutoHang)
  const endgame = parseEndgameScore(match?.Teleop?.Endgame)
  const strategyExecution = strategyExecutionScore(match?.ActiveStrat, match?.InactiveStrat)

  const penaltySeverity = getPenaltySeverity(match)
  const reliability = 1 - penaltySeverity

  const metrics = {
    autoActions,
    autoHang,
    teleopMobility,
    endgame,
    ballsShot,
    shootingCycles,
    robotSpeed,
    shooterSpeed,
    driverSkill,
    teamImpact,
    strategyExecution,
    reliability
  }

  const rawPerformance = Object.entries(metrics)
    .reduce((sum, [key, value]) => {
      const weight = toNumber(weights?.[key], 0)
      return sum + (value * weight)
    }, 0)

  return clamp(rawPerformance * 100, 0, 100)
}

const getAggregateSeedScoreWithOptions = (teamData, options) => {
  if (!teamData) return 0.5

  const totalMatches = Math.max(1, toNumber(teamData.Matches, 0))
  const broken = Array.isArray(teamData.BrokenRobot) ? teamData.BrokenRobot.length : toNumber(teamData.BrokenRobot, 0)
  const disabled = Array.isArray(teamData.Disabled) ? teamData.Disabled.length : toNumber(teamData.Disabled, 0)
  const dq = Array.isArray(teamData.DQ) ? teamData.DQ.length : toNumber(teamData.DQ, 0)
  const reliability = clamp(1 - ((broken + disabled + dq) / totalMatches), 0, 1)

  const seed = {
    avgPoints: clamp(toNumber(teamData.AvgPoints, 0) / 50, 0, 1),
    avgAutoPts: clamp(toNumber(teamData.AvgAutoPts, 0) / 15, 0, 1),
    avgEndgamePts: clamp(toNumber(teamData.AvgEndgamePts, 0) / 30, 0, 1),
    opr: clamp(toNumber(teamData.OPR, 0) / 60, 0, 1),
    reliability
  }

  const weights = normalizeWeights(options.seedWeights, DEFAULT_OPTIONS.seedWeights)

  const normalized =
    seed.avgPoints * toNumber(weights.avgPoints, 0) +
    seed.avgAutoPts * toNumber(weights.avgAutoPts, 0) +
    seed.avgEndgamePts * toNumber(weights.avgEndgamePts, 0) +
    seed.opr * toNumber(weights.opr, 0) +
    seed.reliability * toNumber(weights.reliability, 0)

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
  const mergedOptions = resolveRankingOptions(options)

  const teamMatches = extractTeamMatches(teamData)
  if (teamMatches.length === 0) {
    return 0
  }

  const ranked = rankTeamsForAllianceSelection([teamData], mergedOptions)
  return ranked[0]?.allianceScore ?? mergedOptions.initialRating
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

  const mergedOptions = resolveRankingOptions(options)

  const stateMap = new Map()
  teamsData.forEach((team) => {
    const teamNumber = normalizeTeamNumber(team?.TeamNumber ?? team?.id ?? team?.Team)
    if (!teamNumber) return
    const seed = getAggregateSeedScoreWithOptions(team, mergedOptions)
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
  const mergedOptions = resolveRankingOptions(options)

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

export function getDefaultAllianceRankingOptions(gameProfile = DEFAULT_GAME_PROFILE) {
  const profile = DEFAULT_GAME_PROFILES[gameProfile] || DEFAULT_GAME_PROFILES[DEFAULT_GAME_PROFILE]
  return {
    ...DEFAULT_OPTIONS,
    gameProfile,
    metricWeights: { ...profile.metricWeights },
    seedWeights: { ...profile.seedWeights },
    normalizationCaps: { ...DEFAULT_OPTIONS.normalizationCaps }
  }
}