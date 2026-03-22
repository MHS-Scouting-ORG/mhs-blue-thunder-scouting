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

const DEFAULT_PROFILE = {
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
    avgPoints: 0.46,
    avgAutoPts: 0.26,
    avgEndgamePts: 0.18,
    opr: 0.05,
    reliability: 0.05
  }
}

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
  ridgeLambda: 0.35,

  normalizationCaps: {
    ballsShotMax: 18,
    shootingCyclesMax: 10,
    teleopTravelMidMax: 6
  },

  metricWeights: {
    ...DEFAULT_PROFILE.metricWeights
  },
  seedWeights: {
    ...DEFAULT_PROFILE.seedWeights
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

const normalizeCentered = (value, labelsInOrder = []) => {
  const labels = labelsInOrder.map((label) => safeLower(label))
  if (labels.length < 2) return 0

  const idx = labels.findIndex((label) => label === safeLower(value))
  if (idx < 0) return 0

  const center = (labels.length - 1) / 2
  const top = labels.length - 1
  const distanceToTop = Math.max(1e-9, top - center)
  return clamp((idx - center) / distanceToTop, -1, 1)
}

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

const mapFeatureWeightAliases = (featureWeights) => {
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
  const normalizedOptions = { ...(options || {}) }
  delete normalizedOptions.gameProfile

  const metricOverride = {
    ...mapFeatureWeightAliases(normalizedOptions.featureWeights),
    ...(normalizedOptions.metricWeights || {})
  }

  const metricWeights = normalizeWeights(
    mergeWeights(DEFAULT_PROFILE.metricWeights, metricOverride),
    DEFAULT_PROFILE.metricWeights
  )

  const seedWeights = normalizeWeights(
    mergeWeights(DEFAULT_PROFILE.seedWeights, normalizedOptions.seedWeights),
    DEFAULT_PROFILE.seedWeights
  )

  return {
    ...DEFAULT_OPTIONS,
    ...normalizedOptions,
    normalizationCaps: {
      ...DEFAULT_OPTIONS.normalizationCaps,
      ...(normalizedOptions.normalizationCaps || {})
    },
    metricWeights,
    seedWeights,
    featureWeights: {
      ...DEFAULT_OPTIONS.featureWeights,
      ...(normalizedOptions.featureWeights || {})
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
  if (v.includes('very fast')) return 1
  if (v.includes('fast')) return 0.5
  if (v.includes('average') || v.includes('medium')) return 0
  if (v.includes('very slow')) return -1
  if (v.includes('slow')) return -0.5
  return 0
}

const parseDriverSkillScore = (skill) => {
  const v = safeLower(skill)
  if (v.includes('excellent')) return 1
  if (v.includes('good')) return 0.5
  if (v.includes('average')) return 0
  if (v.includes('very poor')) return -1
  if (v.includes('poor')) return -0.5
  return 0
}

const parseTeamImpactScore = (impact) => {
  const v = safeLower(impact)
  if (v.includes('very high')) return 1
  if (v.includes('high')) return 0.5
  if (v.includes('medium')) return 0
  if (v.includes('nothing')) return -1
  if (v.includes('low')) return -0.5
  return 0
}

const parseAutoScore = (autoStrat) => {
  // Handle array-based AutoStrat (new format)
  if (Array.isArray(autoStrat)) {
    if (autoStrat.length === 0) return 0
    // Give points for each auto action: ScoredInGoal=1, MovedInAuto=0.3, Nothing=0
    let maxScore = 0
    for (const action of autoStrat) {
      const v = safeLower(action)
      if (v.includes('scored') || v.includes('goal')) {
        maxScore = Math.max(maxScore, 1)
      } else if (v.includes('crossed') || v.includes('bump') || v.includes('trench')) {
        maxScore = Math.max(maxScore, 0.6)
      } else if (v.includes('movedinauto') || v.includes('moved') || v.includes('left') || v.includes('starting') || v.includes('zone')) {
        maxScore = Math.max(maxScore, 0.3)
      }
    }
    return maxScore
  }
  
  // Handle string-based AutoStrat (backwards compatibility)
  const v = safeLower(autoStrat)
  if (v.includes('scored') || v.includes('goal')) return 1
  if (v.includes('crossed') || v.includes('bump') || v.includes('trench')) return 0.6
  if (v.includes('movedinauto') || v.includes('moved') || v.includes('left') || v.includes('starting') || v.includes('zone')) return 0.3
  return 0
}

const parseAutoHangScore = (autoHang) => {
  const v = safeLower(autoHang)
  // Current form only captures auto hang as Level1 on/off.
  if (v.includes('level1')) return 1
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

  const scoreForStrategy = (strategy) => {
    const v = safeLower(strategy)
    if (v.includes('scoring')) return 1
    if (v.includes('defending mid')) return 0.8
    if (v.includes('defending')) return 0.75
    if (v.includes('blocking')) return 0.7
    if (v.includes('hoarding')) return 0.65
    return 0.45
  }

  const quality = avg(strategies.map(scoreForStrategy))
  const breadth = clamp(strategies.length / 3, 0, 1)
  return clamp((0.7 * quality) + (0.3 * breadth), 0, 1)
}

const strategyExecutionScore = (activeStrategies, inactiveStrategies) => {
  const active = strategyQualityScore(activeStrategies)
  if (!Array.isArray(inactiveStrategies) || inactiveStrategies.length === 0) {
    return active
  }

  const inactive = strategyQualityScore(inactiveStrategies)
  // Keep active role primary while still reflecting inactive role usefulness.
  return clamp((0.75 * active) + (0.25 * inactive), 0, 1)
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

const isQualificationMatch = (match, matchId) => {
  const matchType = safeLower(match?.MatchType)
  if (matchType === 'q' || matchType === 'qm' || matchType === 'qualification' || matchType === 'qualifications') {
    return true
  }

  const compLevel = safeLower(match?.comp_level ?? match?.CompLevel)
  if (compLevel === 'qm') return true

  const id = String(matchId || '').trim().toLowerCase()
  return /^qm\d+$/.test(id) || /_qm\d+$/.test(id)
}

const extractNumeric = (...values) => {
  for (const value of values) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

const getAllianceAndOpponentScore = (match) => {
  const allianceScore = extractNumeric(
    match?.AllianceScore,
    match?.allianceScore,
    match?.Scores?.Alliance,
    match?.Score?.Alliance
  )
  const opponentScore = extractNumeric(
    match?.OpponentScore,
    match?.opponentScore,
    match?.Scores?.Opponent,
    match?.Score?.Opponent
  )
  return { allianceScore, opponentScore }
}

const getAutoImpactValue = (match) => {
  return match?.AutoImpact ?? null
}

const getAutoWinValue = (match) => {
  return match?.AutoWin ?? null
}

const getAutoActionPoints = (autoStrat) => {
  const actions = Array.isArray(autoStrat)
    ? autoStrat
    : (typeof autoStrat === 'string' ? autoStrat.split(',') : [])

  if (actions.length === 0) return 0
  let points = 0
  actions.forEach((action) => {
    const v = safeLower(action)
    if (v.includes('scored') || v.includes('goal')) points += 8
    else if (v.includes('crossed') || v.includes('bump') || v.includes('trench')) points += 5
    else if (v.includes('movedinauto') || v.includes('moved') || v.includes('left') || v.includes('starting') || v.includes('zone')) points += 3
  })
  return points
}

const getAutoHangPoints = (autoHang) => {
  const v = safeLower(autoHang)
  if (v.includes('level1')) return 15
  return 0
}

const getEndgamePoints = (endgame) => {
  const v = safeLower(endgame)
  if (v.includes('level3')) return 30
  if (v.includes('level2')) return 20
  if (v.includes('level1')) return 10
  return 0
}

const getAutoWinScore = (value) => {
  return normalizeCentered(value, ['lose', 'tie', 'win'])
}

const normalizeQualEntriesFromTeams = (teamsData) => {
  const entries = []

  ;(teamsData || []).forEach((team) => {
    const teamNumber = normalizeTeamNumber(team?.TeamNumber ?? team?.id ?? team?.Team)
    if (!teamNumber) return

    const seen = new Set()
    const teamMatches = extractTeamMatches(team)
    teamMatches.forEach((match, index) => {
      const matchId = String(match?.MatchId || match?.id || '').trim()
      if (!matchId || matchId === 'matchEntry.MatchId') return
      if (!isQualificationMatch(match, matchId)) return

      const dedupeKey = `${teamNumber}|${matchId}`
      if (seen.has(dedupeKey)) return
      seen.add(dedupeKey)

      const { allianceScore, opponentScore } = getAllianceAndOpponentScore(match)

      entries.push({
        teamNumber,
        matchId,
        matchOrder: parseMatchOrder(matchId) || (index + 1),
        match,
        matchResult: safeLower(match?.MatchResult),
        allianceScore,
        opponentScore
      })
    })
  })

  return entries.sort((a, b) => {
    if (a.matchOrder !== b.matchOrder) return a.matchOrder - b.matchOrder
    if (a.matchId !== b.matchId) return a.matchId.localeCompare(b.matchId)
    return a.teamNumber.localeCompare(b.teamNumber)
  })
}

const splitAllianceByScorePairs = (rows) => {
  const groups = new Map()
  rows.forEach((row) => {
    if (!Number.isFinite(row.allianceScore) || !Number.isFinite(row.opponentScore)) return
    const key = `${row.allianceScore}|${row.opponentScore}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(row)
  })

  const candidates = [...groups.values()]
    .sort((a, b) => b.length - a.length)
    .slice(0, 2)

  if (candidates.length < 2) return null
  if (candidates[0].length < 2 || candidates[1].length < 2) return null

  const teamsA = new Set(candidates[0].map((r) => r.teamNumber))
  const teamsB = new Set(candidates[1].map((r) => r.teamNumber))
  const overlap = [...teamsA].some((team) => teamsB.has(team))
  if (overlap) return null

  return [
    { members: candidates[0].slice(0, 3) },
    { members: candidates[1].slice(0, 3) }
  ]
}

const splitAllianceByResult = (rows) => {
  const wins = rows.filter((r) => r.matchResult === 'win')
  const losses = rows.filter((r) => r.matchResult === 'lose')
  if (wins.length >= 2 && losses.length >= 2) {
    return [
      { members: wins.slice(0, 3) },
      { members: losses.slice(0, 3) }
    ]
  }
  return null
}

const inferMatchAlliances = (rows) => {
  if (!Array.isArray(rows) || rows.length < 4) return []
  const uniqueRows = []
  const seen = new Set()
  rows.forEach((row) => {
    const key = `${row.teamNumber}|${row.matchId}`
    if (seen.has(key)) return
    seen.add(key)
    uniqueRows.push(row)
  })

  const byScores = splitAllianceByScorePairs(uniqueRows)
  if (byScores) return byScores

  const byResult = splitAllianceByResult(uniqueRows)
  if (byResult) return byResult

  if (uniqueRows.length >= 6) {
    const sorted = [...uniqueRows].sort((a, b) => a.teamNumber.localeCompare(b.teamNumber))
    return [
      { members: sorted.slice(0, 3) },
      { members: sorted.slice(3, 6) }
    ]
  }

  return []
}

const buildAllianceRows = (entries) => {
  const byMatch = new Map()
  entries.forEach((entry) => {
    if (!byMatch.has(entry.matchId)) byMatch.set(entry.matchId, [])
    byMatch.get(entry.matchId).push(entry)
  })

  const allianceRows = []

  byMatch.forEach((rows, matchId) => {
    const alliances = inferMatchAlliances(rows)
    if (alliances.length !== 2) return

    const [a, b] = alliances
    if (a.members.length !== 3 || b.members.length !== 3) return

    const summarizeAlliance = (alliance, opponent) => {
      const teams = alliance.members.map((m) => m.teamNumber)
      const scoreCandidates = alliance.members
        .map((m) => m.allianceScore)
        .filter((s) => Number.isFinite(s))

      if (scoreCandidates.length === 0) {
        opponent.members.forEach((m) => {
          if (Number.isFinite(m.opponentScore)) scoreCandidates.push(m.opponentScore)
        })
      }

      const totalScore = scoreCandidates.length > 0 ? avg(scoreCandidates) : null
      const scoreSpread = scoreCandidates.length > 1
        ? Math.max(...scoreCandidates) - Math.min(...scoreCandidates)
        : 0

      const autoActionPoints = alliance.members.reduce((sum, row) => {
        return sum + getAutoActionPoints(row?.match?.Autonomous?.AutoStrat)
      }, 0)

      const autoHangPoints = alliance.members.reduce((sum, row) => {
        return sum + getAutoHangPoints(row?.match?.Autonomous?.AutoHang)
      }, 0)

      const endgamePoints = alliance.members.reduce((sum, row) => {
        return sum + getEndgamePoints(row?.match?.Teleop?.Endgame)
      }, 0)

      const fuel = alliance.members.reduce((sum, row) => sum + toNumber(row?.match?.RobotInfo?.BallsShot, 0), 0)
      const cycles = alliance.members.reduce((sum, row) => sum + toNumber(row?.match?.RobotInfo?.ShootingCycles, 0), 0)
      const teleopMobility = alliance.members.reduce((sum, row) => sum + toNumber(row?.match?.Teleop?.TravelMid, 0), 0)

      const winSignal = avg(alliance.members.map((row) => {
        const result = safeLower(row?.match?.MatchResult)
        if (result === 'win') return 1
        if (result === 'tie') return 0.5
        if (result === 'lose') return 0
        return 0.5
      }))

      const completenessSignals = alliance.members.map((row) => {
        const match = row?.match
        let present = 0
        let total = 7
        if (Array.isArray(match?.Autonomous?.AutoStrat) && match.Autonomous.AutoStrat.length > 0) present += 1
        if (safeLower(match?.Autonomous?.AutoHang)) present += 1
        if (Number.isFinite(toNumber(match?.RobotInfo?.BallsShot, NaN))) present += 1
        if (Number.isFinite(toNumber(match?.RobotInfo?.ShootingCycles, NaN))) present += 1
        if (safeLower(match?.Teleop?.Endgame)) present += 1
        if (safeLower(match?.RobotInfo?.DriverSkill)) present += 1
        if (safeLower(match?.TeamImpact)) present += 1
        return present / total
      })

      const avgCompleteness = avg(completenessSignals)
      const scoreAgreement = clamp(1 - (scoreSpread / 35), 0, 1)
      const evidenceWeight = clamp(
        0.5 + 0.35 * avgCompleteness + 0.15 * scoreAgreement,
        0.25,
        1
      )

      return {
        matchId,
        teams,
        totalScore,
        autoActionPoints,
        autoHangPoints,
        endgamePoints,
        fuel,
        cycles,
        teleopMobility,
        winSignal,
        evidenceWeight
      }
    }

    allianceRows.push(summarizeAlliance(a, b))
    allianceRows.push(summarizeAlliance(b, a))
  })

  return allianceRows
}

const createZeroMatrix = (rows, cols) => Array.from({ length: rows }, () => Array(cols).fill(0))

const solveLinearSystem = (matrix, vector) => {
  const n = matrix.length
  if (n === 0) return []

  const a = matrix.map((row, i) => [...row, toNumber(vector[i], 0)])

  for (let col = 0; col < n; col += 1) {
    let pivot = col
    for (let row = col + 1; row < n; row += 1) {
      if (Math.abs(a[row][col]) > Math.abs(a[pivot][col])) pivot = row
    }

    if (Math.abs(a[pivot][col]) < 1e-9) continue
    if (pivot !== col) {
      const temp = a[col]
      a[col] = a[pivot]
      a[pivot] = temp
    }

    const pivotVal = a[col][col]
    for (let j = col; j <= n; j += 1) {
      a[col][j] /= pivotVal
    }

    for (let row = 0; row < n; row += 1) {
      if (row === col) continue
      const factor = a[row][col]
      if (Math.abs(factor) < 1e-9) continue
      for (let j = col; j <= n; j += 1) {
        a[row][j] -= factor * a[col][j]
      }
    }
  }

  return a.map((row) => (Number.isFinite(row[n]) ? row[n] : 0))
}

const solveContributionMetric = ({ allianceRows, teamIndex, ridgeLambda, valueAccessor }) => {
  const validRows = allianceRows.filter((row) => row.teams.length === 3 && Number.isFinite(valueAccessor(row)))
  if (validRows.length === 0) return null

  const n = teamIndex.size
  const ata = createZeroMatrix(n, n)
  const atb = Array(n).fill(0)

  validRows.forEach((row) => {
    const b = valueAccessor(row)
    const w = clamp(toNumber(row?.evidenceWeight, 1), 0.1, 1)
    const idx = row.teams
      .map((team) => teamIndex.get(team))
      .filter((x) => Number.isInteger(x))

    if (idx.length !== 3) return

    idx.forEach((i) => {
      atb[i] += w * b
      idx.forEach((j) => {
        ata[i][j] += w
      })
    })
  })

  for (let i = 0; i < n; i += 1) {
    ata[i][i] += ridgeLambda
  }

  const solution = solveLinearSystem(ata, atb)
  const result = new Map()
  teamIndex.forEach((idx, team) => {
    result.set(team, toNumber(solution[idx], 0))
  })

  return result
}

const normalizeByCap = (value, cap) => clamp(toNumber(value, 0) / Math.max(1, toNumber(cap, 1)), 0, 1)

const getTeamQualMatches = (team) => {
  const teamMatches = extractTeamMatches(team)
  return teamMatches.filter((match) => {
    const matchId = String(match?.MatchId || match?.id || '').trim()
    return isQualificationMatch(match, matchId)
  })
}

const computeTeamScoutAverages = (team, options) => {
  const quals = getTeamQualMatches(team)
  if (quals.length === 0) {
    return {
      matchCount: 0,
      reliability: 0,
      robotSpeed: 0,
      shooterSpeed: 0,
      driverSkill: 0,
      teamImpact: 0,
      autoImpact: 0,
      strategyExecution: 0,
      winRate: 0,
      autoWinRate: 0,
      avgPenaltySeverity: 1
    }
  }

  const penaltySeverity = quals.map(getPenaltySeverity)

  return {
    matchCount: quals.length,
    reliability: clamp(1 - avg(penaltySeverity), 0, 1),
    robotSpeed: avg(quals.map((m) => parseSpeedScore(m?.RobotInfo?.RobotSpeed))),
    shooterSpeed: avg(quals.map((m) => parseSpeedScore(m?.RobotInfo?.ShooterSpeed))),
    driverSkill: avg(quals.map((m) => parseDriverSkillScore(m?.RobotInfo?.DriverSkill))),
    teamImpact: avg(quals.map((m) => parseTeamImpactScore(m?.TeamImpact))),
    strategyExecution: avg(quals.map((m) => strategyExecutionScore(m?.ActiveStrat, m?.InactiveStrat))),
    winRate: avg(quals.map((m) => {
      return normalizeCentered(m?.MatchResult, ['lose', 'tie', 'win'])
    })),
    autoImpact: avg(quals.map((m) => parseTeamImpactScore(getAutoImpactValue(m)))),
    autoWinRate: avg(quals.map((m) => getAutoWinScore(getAutoWinValue(m)))),
    avgPenaltySeverity: avg(penaltySeverity)
  }
}

const indexTeams = (teamsData) => {
  const teamIndex = new Map()
  ;(teamsData || []).forEach((team) => {
    const teamNumber = normalizeTeamNumber(team?.TeamNumber ?? team?.id ?? team?.Team)
    if (!teamNumber) return
    if (!teamIndex.has(teamNumber)) teamIndex.set(teamNumber, teamIndex.size)
  })
  return teamIndex
}

const normalizeMetricMap = (metricMap) => {
  if (!metricMap || metricMap.size === 0) return new Map()
  const values = [...metricMap.values()].map((v) => toNumber(v, 0))
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = Math.max(1e-9, max - min)
  const normalized = new Map()
  metricMap.forEach((value, team) => {
    normalized.set(team, clamp((toNumber(value, 0) - min) / span, 0, 1))
  })
  return normalized
}

const buildLeastSquaresRatings = (teamsData, options) => {
  const entries = normalizeQualEntriesFromTeams(teamsData)
  const allianceRows = buildAllianceRows(entries)
  const teamIndex = indexTeams(teamsData)
  const ridgeLambda = Math.max(0.05, toNumber(options?.ridgeLambda, 0.35))

  const totalScore = solveContributionMetric({
    allianceRows,
    teamIndex,
    ridgeLambda,
    valueAccessor: (row) => row.totalScore
  })

  const autoActionsScore = solveContributionMetric({
    allianceRows,
    teamIndex,
    ridgeLambda,
    valueAccessor: (row) => row.autoActionPoints
  })

  const autoHangScore = solveContributionMetric({
    allianceRows,
    teamIndex,
    ridgeLambda,
    valueAccessor: (row) => row.autoHangPoints
  })

  const endgameScore = solveContributionMetric({
    allianceRows,
    teamIndex,
    ridgeLambda,
    valueAccessor: (row) => row.endgamePoints
  })

  const fuelScore = solveContributionMetric({
    allianceRows,
    teamIndex,
    ridgeLambda,
    valueAccessor: (row) => row.fuel
  })

  const cycleScore = solveContributionMetric({
    allianceRows,
    teamIndex,
    ridgeLambda,
    valueAccessor: (row) => row.cycles
  })

  const mobilityScore = solveContributionMetric({
    allianceRows,
    teamIndex,
    ridgeLambda,
    valueAccessor: (row) => row.teleopMobility
  })

  const winContribution = solveContributionMetric({
    allianceRows,
    teamIndex,
    ridgeLambda,
    valueAccessor: (row) => row.winSignal
  })

  return {
    entries,
    allianceRows,
    totalScore: normalizeMetricMap(totalScore || new Map()),
    autoActionsScore: normalizeMetricMap(autoActionsScore || new Map()),
    autoHangScore: normalizeMetricMap(autoHangScore || new Map()),
    endgameScore: normalizeMetricMap(endgameScore || new Map()),
    fuelScore: normalizeMetricMap(fuelScore || new Map()),
    cycleScore: normalizeMetricMap(cycleScore || new Map()),
    mobilityScore: normalizeMetricMap(mobilityScore || new Map()),
    winContribution: normalizeMetricMap(winContribution || new Map())
  }
}

export function calculateTeamScore(teamData, options = {}) {
  const mergedOptions = resolveRankingOptions(options)

  const teamMatches = getTeamQualMatches(teamData)
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

  const ls = buildLeastSquaresRatings(teamsData, mergedOptions)
  const metricWeights = normalizeWeights(mergedOptions.metricWeights, DEFAULT_OPTIONS.metricWeights)

  return teamsData
    .map((team) => {
      const teamNumber = normalizeTeamNumber(team?.TeamNumber ?? team?.id ?? team?.Team)
      const teamMatches = getTeamQualMatches(team)
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

      const scout = computeTeamScoutAverages(team, mergedOptions)
      const aggregateSeed = getAggregateSeedScoreWithOptions(team, mergedOptions)

      const weightedSkill =
        toNumber(metricWeights.autoActions, 0) * toNumber(ls.autoActionsScore.get(teamNumber), 0) +
        toNumber(metricWeights.autoHang, 0) * toNumber(ls.autoHangScore.get(teamNumber), 0) +
        toNumber(metricWeights.teleopMobility, 0) * toNumber(ls.mobilityScore.get(teamNumber), 0) +
        toNumber(metricWeights.endgame, 0) * toNumber(ls.endgameScore.get(teamNumber), 0) +
        toNumber(metricWeights.ballsShot, 0) * toNumber(ls.fuelScore.get(teamNumber), 0) +
        toNumber(metricWeights.shootingCycles, 0) * toNumber(ls.cycleScore.get(teamNumber), 0) +
        toNumber(metricWeights.robotSpeed, 0) * scout.robotSpeed +
        toNumber(metricWeights.shooterSpeed, 0) * scout.shooterSpeed +
        toNumber(metricWeights.driverSkill, 0) * scout.driverSkill +
        toNumber(metricWeights.teamImpact, 0) * Math.max(scout.teamImpact, scout.autoImpact) +
        toNumber(metricWeights.strategyExecution, 0) * scout.strategyExecution +
        toNumber(metricWeights.reliability, 0) * scout.reliability

      const scoreDrivenBoost =
        0.2 * toNumber(ls.totalScore.get(teamNumber), 0) +
        0.1 * toNumber(ls.winContribution.get(teamNumber), 0) +
        0.7 * aggregateSeed

      // Favor objective match outcomes and scoring over subjective scouting fields.
      const skillRating = clamp((0.35 * weightedSkill + 0.65 * scoreDrivenBoost) * 100, 0, 100)

      const uncertaintyFromSample = clamp(
        mergedOptions.maxUncertainty - (Math.log2(1 + scout.matchCount) * 6),
        mergedOptions.minUncertainty,
        mergedOptions.maxUncertainty
      )

      const inconsistency = clamp((1 - scout.reliability) * 20, 0, 20)
      const conservativeRating =
        skillRating -
        (mergedOptions.uncertaintyPenalty * 0.45) * uncertaintyFromSample -
        (mergedOptions.inconsistencyPenalty * 0.5) * inconsistency

      const confidence = clamp(1 - (uncertaintyFromSample / mergedOptions.maxUncertainty), 0, 1)

      return {
        ...team,
        allianceScore: conservativeRating,
        skillRating,
        uncertainty: uncertaintyFromSample,
        confidence,
        matchesRated: scout.matchCount
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
  const normalizedEntries = Array.isArray(newMatchEntries) ? newMatchEntries : []
  if (normalizedEntries.length === 0) return existingRatings

  const teamsById = new Map()
  normalizedEntries.forEach((entry) => {
    const teamNumber = normalizeTeamNumber(entry?.teamNumber ?? entry?.Team ?? entry?.team ?? entry?.TeamNumber)
    if (!teamNumber) return
    if (!teamsById.has(teamNumber)) {
      teamsById.set(teamNumber, {
        TeamNumber: teamNumber,
        TeamMatches: []
      })
    }

    const match = entry?.match || entry
    teamsById.get(teamNumber).TeamMatches.push({
      ...match,
      MatchId: String(entry?.matchId ?? entry?.MatchId ?? match?.MatchId ?? '').trim()
    })
  })

  const ranked = rankTeamsForAllianceSelection([...teamsById.values()], options)
  const result = { ...existingRatings }
  ranked.forEach((team) => {
    const teamNumber = normalizeTeamNumber(team?.TeamNumber ?? team?.id ?? team?.Team)
    if (!teamNumber) return
    result[teamNumber] = {
      rating: toNumber(team.skillRating, 0),
      uncertainty: toNumber(team.uncertainty, 0),
      inconsistency: 0,
      conservativeRating: toNumber(team.allianceScore, 0),
      confidence: toNumber(team.confidence, 0),
      matchesPlayed: toNumber(team.matchesRated, 0)
    }
  })

  return result
}

export function getDefaultAllianceRankingOptions() {
  return {
    ...DEFAULT_OPTIONS,
    metricWeights: { ...DEFAULT_PROFILE.metricWeights },
    seedWeights: { ...DEFAULT_PROFILE.seedWeights },
    normalizationCaps: { ...DEFAULT_OPTIONS.normalizationCaps }
  }
}