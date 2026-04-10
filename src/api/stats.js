const apiStatsURL = 'https://api.statbotics.io/v3/'
const STATBOTICS_CACHE_NAMESPACE = 'statbotics-team-event-v1'
const STATBOTICS_CACHE_MAX_AGE_MS = 5 * 60 * 1000
const statboticsPredictionMemoryCache = new Map()

const EMPTY_STATBOTICS_PREDICTION = Object.freeze({
  statboticsPredictedWins: 0,
  statboticsPredictedLosses: 0,
  statboticsWinRate: 0,
  statboticsScore: 0,
  statboticsRank: 0
})

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

const clonePrediction = (prediction = EMPTY_STATBOTICS_PREDICTION) => ({
  ...EMPTY_STATBOTICS_PREDICTION,
  ...(prediction || {})
})

const getCacheStorage = () => {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage
  } catch (_) {
    return null
  }
}

const getPredictionCacheKey = (teamNumber, eventKey) => {
  if (!teamNumber || !eventKey) return ''
  return `${STATBOTICS_CACHE_NAMESPACE}:${eventKey}:${teamNumber}`
}

const readPredictionCacheEntry = (cacheKey) => {
  if (!cacheKey) return null

  if (statboticsPredictionMemoryCache.has(cacheKey)) {
    return statboticsPredictionMemoryCache.get(cacheKey)
  }

  const storage = getCacheStorage()
  if (!storage) return null

  try {
    const rawValue = storage.getItem(cacheKey)
    if (!rawValue) return null
    const parsed = JSON.parse(rawValue)
    if (!parsed || typeof parsed !== 'object') return null

    const entry = {
      fetchedAt: Number(parsed.fetchedAt) || 0,
      prediction: clonePrediction(parsed.prediction)
    }

    statboticsPredictionMemoryCache.set(cacheKey, entry)
    return entry
  } catch (_) {
    return null
  }
}

const writePredictionCacheEntry = (cacheKey, prediction) => {
  if (!cacheKey) return null

  const entry = {
    fetchedAt: Date.now(),
    prediction: clonePrediction(prediction)
  }

  statboticsPredictionMemoryCache.set(cacheKey, entry)

  const storage = getCacheStorage()
  if (storage) {
    try {
      storage.setItem(cacheKey, JSON.stringify(entry))
    } catch (_) {
      // ignore storage failures so network fetches still work
    }
  }

  return entry
}

const isCacheFresh = (entry, maxAgeMs = STATBOTICS_CACHE_MAX_AGE_MS) => {
  if (!entry?.fetchedAt) return false
  return Date.now() - entry.fetchedAt <= maxAgeMs
}

const normalizeStatboticsPrediction = (data) => {
  if (!data || typeof data !== 'object') return clonePrediction()

  const recordQual = data?.record?.qual || {}
  const winRate = toNumber(recordQual.winrate ?? recordQual.win_rate ?? 0, 0)
  const wins = toNumber(recordQual.wins ?? 0, 0)
  const losses = toNumber(recordQual.losses ?? 0, 0)
  const score = toNumber(data?.epa?.total_points?.mean ?? data?.epa?.unitless ?? 0, 0)
  const rank = toNumber(recordQual.rank ?? 0, 0)

  return clonePrediction({
    statboticsPredictedWins: wins,
    statboticsPredictedLosses: losses,
    statboticsWinRate: winRate,
    statboticsScore: score,
    statboticsRank: rank
  })
}

const getCachedTeamEventPrediction = function(teamNumber, eventKey, { allowStale = true, maxAgeMs = STATBOTICS_CACHE_MAX_AGE_MS } = {}) {
  const cacheKey = getPredictionCacheKey(teamNumber, eventKey)
  const entry = readPredictionCacheEntry(cacheKey)
  if (!entry) return null
  if (!allowStale && !isCacheFresh(entry, maxAgeMs)) return null
  return clonePrediction(entry.prediction)
}

const refreshTeamEventPrediction = async function(teamNumber, eventKey) {
  if (!teamNumber || !eventKey) return null

  const response = await _fetch(`team_event/${teamNumber}/${eventKey}`)
  if (!response) return null

  const prediction = normalizeStatboticsPrediction(response)
  writePredictionCacheEntry(getPredictionCacheKey(teamNumber, eventKey), prediction)
  return prediction
}

const getTeamEventPrediction = async function(teamNumber, eventKey, { preferCache = true, maxAgeMs = STATBOTICS_CACHE_MAX_AGE_MS } = {}) {
  if (!teamNumber || !eventKey) return clonePrediction()

  if (preferCache) {
    const cachedPrediction = getCachedTeamEventPrediction(teamNumber, eventKey, { allowStale: false, maxAgeMs })
    if (cachedPrediction) return cachedPrediction
  }

  const refreshedPrediction = await refreshTeamEventPrediction(teamNumber, eventKey)
  if (refreshedPrediction) return refreshedPrediction

  return getCachedTeamEventPrediction(teamNumber, eventKey, { allowStale: true, maxAgeMs }) || clonePrediction()
}

const getEventPredictions = async function(eventKey) {
  if (!eventKey) return null
  return await _fetch(`event/${eventKey}/predictions`)
}

const runWithConcurrency = async (items, worker, concurrency = 6) => {
  const queue = [...items]
  const workers = Array.from({ length: Math.min(concurrency, queue.length || 1) }, async () => {
    while (queue.length > 0) {
      const nextItem = queue.shift()
      if (nextItem === undefined) return
      await worker(nextItem)
    }
  })

  await Promise.all(workers)
}

const warmTeamEventPredictions = async function(teamNumbers, eventKey, { maxAgeMs = STATBOTICS_CACHE_MAX_AGE_MS, concurrency = 6 } = {}) {
  if (!eventKey) return []

  const uniqueTeamNumbers = [...new Set(
    (Array.isArray(teamNumbers) ? teamNumbers : [])
      .map((teamNumber) => String(teamNumber || '').trim())
      .filter(Boolean)
  )]

  const staleTeamNumbers = uniqueTeamNumbers.filter((teamNumber) => {
    return !getCachedTeamEventPrediction(teamNumber, eventKey, { allowStale: false, maxAgeMs })
  })

  await runWithConcurrency(staleTeamNumbers, async (teamNumber) => {
    await refreshTeamEventPrediction(teamNumber, eventKey)
  }, concurrency)

  return uniqueTeamNumbers.map((teamNumber) => ({
    teamNumber,
    prediction: getCachedTeamEventPrediction(teamNumber, eventKey, { allowStale: true, maxAgeMs }) || clonePrediction()
  }))
}

export { getTeamEventPrediction, getEventPredictions, getCachedTeamEventPrediction, warmTeamEventPredictions }
