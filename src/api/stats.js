const apiStatsURL = 'https://api.statbotics.io/v3/'

const toNumber = (value, fallback = 0) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

const _fetch = async function(endpoint) {
  try {
    const res = await fetch(`${apiStatsURL}${endpoint}`)
    if (!res.ok) {
      throw new Error(`Statbotics API request failed: ${res.status}`)
    }
    return await res.json()
  } catch (error) {
    console.warn('Statbotics fetch failed:', endpoint, error)
    return null
  }
}

const normalizeStatboticsPrediction = (data) => {
  if (!data || typeof data !== 'object') return {
    statboticsPredictedWins: 0,
    statboticsPredictedLosses: 0,
    statboticsWinRate: 0,
    statboticsScore: 0,
    statboticsRank: 0
  }

  const recordQual = data?.record?.qual || {}
  const winRate = toNumber(recordQual.winrate ?? recordQual.win_rate ?? 0, 0)
  const wins = toNumber(recordQual.wins ?? 0, 0)
  const losses = toNumber(recordQual.losses ?? 0, 0)
  const score = toNumber(data?.epa?.total_points?.mean ?? data?.epa?.unitless ?? 0, 0)
  const rank = toNumber(recordQual.rank ?? 0, 0)

  return {
    statboticsPredictedWins: wins,
    statboticsPredictedLosses: losses,
    statboticsWinRate: winRate,
    statboticsScore: score,
    statboticsRank: rank
  }
}

const getTeamEventPrediction = async function(teamNumber, eventKey) {
  if (!teamNumber || !eventKey) return null
  const response = await _fetch(`team_event/${teamNumber}/${eventKey}`)
  return normalizeStatboticsPrediction(response)
}

const getEventPredictions = async function(eventKey) {
  if (!eventKey) return null
  return await _fetch(`event/${eventKey}/predictions`)
}

export { getTeamEventPrediction, getEventPredictions }
