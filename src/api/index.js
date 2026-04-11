//import { graphqlOperation, API } from 'aws-amplify'
import { generateClient } from 'aws-amplify/api'
import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm"
import {getTeam, listTeams, } from '../graphql/queries'
import {createTeam, updateTeam, deleteTeam} from '../graphql/mutations'
import {buildMatchEntry, buildTeamEntry} from './builder'
import {
  getMatchesForRegional as fetchMatchesForRegional,
  getTeamsInRegional as fetchTeamsInRegional,
  getSimpleTeamsForRegional as fetchSimpleTeamsForRegional,
  getRankingsForRegional as fetchRankingsForRegional,
} from './bluealliance'
import { normalizeTeamId } from '../utils/teamId'
import { getTeamEventPrediction, getEventPredictions, getCachedTeamEventPrediction, warmTeamEventPredictions } from './stats'

const NOTES_TEAM_PREFIX = 'notes-'

const isNotesTeamId = (teamId) => String(teamId || '').startsWith(NOTES_TEAM_PREFIX)

const toNotesTeamId = (teamId) => {
  const normalized = normalizeTeamId(teamId)
  return normalized ? `${NOTES_TEAM_PREFIX}${normalized}` : ''
}

const fromNotesTeamId = (teamId) => {
  const value = String(teamId || '')
  if (isNotesTeamId(value)) return normalizeTeamId(value.slice(NOTES_TEAM_PREFIX.length))
  return normalizeTeamId(value)
}

const isBaseTeamId = (teamId) => {
  const normalized = normalizeTeamId(teamId)
  return Boolean(normalized) && !isNotesTeamId(normalized)
}

import * as Auth from 'aws-amplify/auth'

let client
const getClient = () => {
  if (!client) client = generateClient()
  return client
}

let isSigningOutForAuthError = false

const validateAndRefreshAuthSession = async () => {
  try {
    await Auth.getCurrentUser()
    await Auth.fetchAuthSession({ forceRefresh: true })
    return true
  } catch (_) {
    return false
  }
}

const forceSignOutForAuthError = async () => {
  if (isSigningOutForAuthError) return
  isSigningOutForAuthError = true

  try {
    await Auth.signOut()
  } catch (_) {
    // unimportant errors
  } finally {
    if (typeof window !== 'undefined') {
      window.location.assign('/')
    }
  }
}

let regionalKey
const HISTORICAL_MATCH_METADATA_BACKFILL_SCOPE = 'all-regionals'
const historicalMatchMetadataBackfillInFlight = new Map()
const historicalMatchMetadataBackfillCompleted = new Set()

const extractGraphQLErrorMessages = (errors) => {
  if (!Array.isArray(errors)) return []
  return errors
    .map(err => String(err?.message || err?.errorType || '').trim())
    .filter(Boolean)
}

const isAuthRelatedMessage = (message) => {
  const text = String(message || '').toLowerCase()
  if (!text) return false
  return (
    text.includes('security token') ||
    text.includes('invalid token') ||
    text.includes('token is invalid') ||
    text.includes('expired') ||
    text.includes('unauthorized') ||
    text.includes('not authorized') ||
    text.includes('forbidden') ||
    text.includes('credential') ||
    text.includes('no current user')
  )
}

const hasAuthErrorInGraphQLPayload = (errors) => {
  const messages = extractGraphQLErrorMessages(errors)
  return messages.some(isAuthRelatedMessage)
}

const throwGraphQLError = (responseOrErrors) => {
  const errors = Array.isArray(responseOrErrors)
    ? responseOrErrors
    : (responseOrErrors?.errors || [])
  const messages = extractGraphQLErrorMessages(errors)
  const error = new Error(messages[0] || 'GraphQL request failed')
  error.graphQLErrors = errors
  throw error
}

const runGraphQL = async ({ query, variables, allowPartialData = false }) => {
  let hasRetriedAfterRefresh = false

  try {
    while (true) {
      const response = await getClient().graphql({ query, variables })

      if (Array.isArray(response?.errors) && response.errors.length > 0) {
        const authPayloadError = hasAuthErrorInGraphQLPayload(response.errors)

        if (authPayloadError && !hasRetriedAfterRefresh) {
          hasRetriedAfterRefresh = true
          const hasValidSession = await validateAndRefreshAuthSession()
          if (hasValidSession) continue
        }

        if (authPayloadError) {
          await forceSignOutForAuthError()
          throw new Error('Authentication session is invalid or expired. Signed out user.')
        }

        if (allowPartialData && response?.data) {
          return response
        }

        throwGraphQLError(response)
      }

      return response
    }
  } catch (err) {
    if (allowPartialData && err?.data) {
      return err
    }

    if (isAuthRelatedMessage(err?.message)) {
      if (!hasRetriedAfterRefresh) {
        hasRetriedAfterRefresh = true
        const hasValidSession = await validateAndRefreshAuthSession()
        if (hasValidSession) {
          const retryResponse = await getClient().graphql({ query, variables })
          if (Array.isArray(retryResponse?.errors) && retryResponse.errors.length > 0) {
            if (hasAuthErrorInGraphQLPayload(retryResponse.errors)) {
              await forceSignOutForAuthError()
              throw new Error('Authentication session is invalid or expired. Signed out user.')
            }

            if (allowPartialData && retryResponse?.data) {
              return retryResponse
            }

            throwGraphQLError(retryResponse)
          }
          return retryResponse
        }
      }

      await forceSignOutForAuthError()
      throw new Error('Authentication session is invalid or expired. Signed out user.')
    }

    const hasValidSession = await validateAndRefreshAuthSession()
    if (!hasValidSession) {
      await forceSignOutForAuthError()
      throw new Error('Authentication session is invalid or expired. Signed out user.')
    }

    throw err
  }
}

const normalizeStratList = (value) => {
  const allowed = ["Hoarding", "Defense", "Aggressive", "Support", "Shooting", "None"]
  const strategyMap = {
    Hoarding: "Hoarding",
    Defending: "Defense",
    Defense: "Defense",
    Offensive: "Aggressive",
    Aggressive: "Aggressive",
    Scoring: "Shooting",
    Shooting: "Shooting",
    Support: "Support",
    None: "None",
  }

  if (Array.isArray(value)) {
    const cleaned = value
      .map(v => (typeof v === 'string' ? strategyMap[v.trim()] : ''))
      .filter(v => allowed.includes(v) && v !== '')
    return cleaned.length > 0 ? cleaned : ["None"]
  }

  if (typeof value === 'string') {
    const cleaned = value
      .split(',')
      .map(v => strategyMap[v.trim()])
      .filter(v => allowed.includes(v) && v !== '')
    return cleaned.length > 0 ? cleaned : ["None"]
  }

  return ["None"]
}

const normalizeAutoStrat = (value) => {
  const allowed = ["MovedInAuto", "ScoredInGoal", "Nothing"]
  const autoMap = {
    WentMid: "MovedInAuto",
    CrossedMid: "MovedInAuto",
    "Crossed Bump/Trench": "MovedInAuto",
    "Left Starting Zone": "MovedInAuto",
    LeftStartingZone: "MovedInAuto",
    MovedInAuto: "MovedInAuto",
    Moved: "MovedInAuto",
    Scored: "ScoredInGoal",
    ScoredInGoal: "ScoredInGoal",
    Nothing: "Nothing",
    None: "Nothing",
  }

  const raw = Array.isArray(value)
    ? value
    : (typeof value === 'string'
      ? value.split(',')
      : (value ? [value] : []))

  const cleaned = raw
    .map(v => (typeof v === 'string' ? autoMap[v.trim()] || '' : ''))
    .filter(v => allowed.includes(v))

  if (cleaned.length === 0) return ["Nothing"]
  return [...new Set(cleaned)]
}

const normalizeMatchResult = (value) => {
  const token = String(value || '').trim().toLowerCase()
  if (token === 'win') return 'Win'
  if (token === 'lose' || token === 'loss') return 'Lose'
  if (token === 'tie') return 'Tie'
  return null
}

const normalizeTeamImpact = (value) => {
  const token = String(value || '').trim().toLowerCase()
  if (!token || token === 'nothing' || token === 'none') return null
  if (token === 'low') return 'Low'
  if (token === 'medium') return 'Medium'
  if (token === 'high' || token === 'very high' || token === 'veryhigh') return 'High'
  return null
}

const normalizeAutoHang = (value) => {
  const token = String(value || '').trim().toLowerCase()
  if (token === 'level1') return 'Level1'
  return 'None'
}

const normalizeHang = (value) => {
  const token = String(value || '').trim().toLowerCase()
  if (token === 'level3') return 'Level3'
  if (token === 'level2') return 'Level2'
  if (token === 'level1') return 'Level1'
  if (token === 'none') return 'None'
  return null
}

const normalizeSpeed = (value) => {
  const token = String(value || '').trim().toLowerCase()
  if (token === 'very slow' || token === 'slow') return 'Slow'
  if (token === 'average' || token === 'medium') return 'Average'
  if (token === 'very fast' || token === 'fast') return 'Fast'
  if (token === 'none') return 'None'
  return null
}

const normalizeDriverSkill = (value) => {
  const token = String(value || '').trim().toLowerCase()
  if (token === 'very poor' || token === 'poor') return 'Poor'
  if (token === 'average') return 'Average'
  if (token === 'good') return 'Good'
  if (token === 'excellent') return 'Excellent'
  return null
}

const normalizeDefenseEffectiveness = (value) => {
  const token = String(value || '').trim().toLowerCase()
  if (token === 'verypoor' || token === 'very poor') return 'VeryPoor'
  if (token === 'poor') return 'Poor'
  if (token === 'average') return 'Average'
  if (token === 'good') return 'Good'
  if (token === 'excellent') return 'Excellent'
  return null
}

const normalizeScoreValue = (value) => {
  if (value === '' || value === null || value === undefined) return null
  const parsed = Number.parseInt(String(value), 10)
  return Number.isNaN(parsed) ? null : parsed
}

const normalizeCapabilitiesList = (value) => {
  const allowed = ["Bump", "Trench", "None"]

  if (Array.isArray(value)) {
    return value
      .filter(v => typeof v === 'string')
      .map(v => v.trim())
      .filter(v => allowed.includes(v) && v !== 'None')
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed || trimmed === 'None') return []
    return allowed.includes(trimmed) ? [trimmed] : []
  }

  return []
}

const normalizeMatchType = (value) => {
  const type = String(value || '').trim().toLowerCase()
  if (!type) return null

  if (type === 'q' || type === 'qa' || type === 'qm' || type === 'qual' || type === 'quals' || type === 'qualification' || type === 'qualifications') return 'q'
  if (type === 'sf' || type === 'semi' || type === 'semis' || type === 'semifinal' || type === 'semifinals') return 'sf'
  if (type === 'f' || type === 'final' || type === 'finals') return 'f'
  if (type === 'p' || type === 'practice') return 'p'

  return null
}

const normalizeRegionals = (regionalsValue) => {
  const regionals = Array.isArray(regionalsValue)
    ? regionalsValue
    : (regionalsValue ? [regionalsValue] : [])

  return regionals
    .filter(regional => regional && typeof regional === 'object' && !Array.isArray(regional))
    .map(regional => {
      const teamMatches = Array.isArray(regional?.TeamMatches)
        ? regional.TeamMatches
        : (regional?.TeamMatches ? [regional.TeamMatches] : [])

      return {
        ...regional,
        TeamMatches: teamMatches
          .filter(match => match && typeof match === 'object' && !Array.isArray(match))
          .map(match => ({
            ...match,
            MatchType: normalizeMatchType(match?.MatchType),
            MatchResult: normalizeMatchResult(match?.MatchResult),
            AutoWin: normalizeMatchResult(match?.AutoWin),
            TeamImpact: normalizeTeamImpact(match?.TeamImpact),
            AutoImpact: normalizeTeamImpact(match?.AutoImpact),
            AllianceScore: normalizeScoreValue(match?.AllianceScore),
            OpponentScore: normalizeScoreValue(match?.OpponentScore),
            Autonomous: {
              ...match?.Autonomous,
              AutoStrat: normalizeAutoStrat(match?.Autonomous?.AutoStrat),
              AutoHang: normalizeAutoHang(match?.Autonomous?.AutoHang)
            },
            Teleop: {
              ...match?.Teleop,
              Endgame: normalizeHang(match?.Teleop?.Endgame)
            },
            RobotInfo: {
              ...match?.RobotInfo,
              RobotSpeed: normalizeSpeed(match?.RobotInfo?.RobotSpeed),
              ShooterSpeed: normalizeSpeed(match?.RobotInfo?.ShooterSpeed),
              DriverSkill: normalizeDriverSkill(match?.RobotInfo?.DriverSkill),
              DefenseEffectiveness: normalizeDefenseEffectiveness(match?.RobotInfo?.DefenseEffectiveness)
            },
            ActiveStrat: normalizeStratList(match?.ActiveStrat),
            InactiveStrat: normalizeStratList(match?.InactiveStrat)
          }))
      }
    })
}

const normalizeTeamRead = (team) => {
  if (!team || typeof team !== 'object') return team
  return {
    ...team,
    TeamAttributes: {
      ...(team.TeamAttributes || {}),
      Capabilities: normalizeCapabilitiesList(team?.TeamAttributes?.Capabilities),
      CanAutoHang: team?.TeamAttributes?.CanAutoHang,
      ShooterType: team?.TeamAttributes?.ShooterType,
      Turret: team?.TeamAttributes?.Turret,
    },
    Regionals: normalizeRegionals(team.Regionals)
  }
}

const normalizeBlueAllianceTeam = (team) => {
  if (!team || typeof team !== 'object') return null

  const normalizedTeamNumber = normalizeTeamId(team?.team_number ?? team?.TeamNumber)
  if (!normalizedTeamNumber) return null

  const numericTeamNumber = Number.parseInt(normalizedTeamNumber, 10)

  return {
    ...team,
    TeamNumber: normalizedTeamNumber,
    team_number: Number.isNaN(numericTeamNumber) ? team?.team_number : numericTeamNumber,
    key: String(team?.key || `frc${normalizedTeamNumber}`),
    nickname: typeof team?.nickname === 'string' ? team.nickname : '',
  }
}

const normalizeBlueAllianceTeams = (teams) => {
  const seen = new Set()

  return (Array.isArray(teams) ? teams : [])
    .map(normalizeBlueAllianceTeam)
    .filter(Boolean)
    .filter((team) => {
      if (seen.has(team.TeamNumber)) return false
      seen.add(team.TeamNumber)
      return true
    })
    .sort((left, right) => Number(left.team_number) - Number(right.team_number))
}

/**
 * Subscribe to create and update events
 * @param {*} updateFn
 * @param {*} errorFn
 */
const apiSubscribeToMatchUpdates = async function (updateFn, errorFn) {
  getClient().graphql({ query: onCreateTeamMatch }).subscribe({
    next: ({ value }) => updateFn(value),
    error: (errorFn || (err => console.log(err)))
  })
  getClient().graphql({ query: onUpdateTeamMatch }).subscribe({
    next: updateFn,
    error: (errorFn || (err => console.log(err)))
  })
}

/*
 * Get a Team by their TeamNumber  that are currently in our database
 */
const apiGetTeam = async function (teamNumber) {
  const normalizedTeamId = normalizeTeamId(teamNumber)
  try {
    const response = await runGraphQL({ query: getTeam, variables: { id: normalizedTeamId }, allowPartialData: true })
    return normalizeTeamRead(response?.data?.getTeam || null)
  } catch (err) {
    if (err?.data?.getTeam) {
      return normalizeTeamRead(err.data.getTeam)
    }
    throw err
  }
}


/*
 * Add a team to our database
 */
const apiAddTeam = async function (team) {
  await runGraphQL({ query: createTeam, variables: { input: team } })
}

const sanitizeTeamInput = (data, teamIdOverride) => {
  const input = {
    id: teamIdOverride || data?.id,
    description: data?.description ?? null,
    Comment: data?.Comment ?? null,
    TeamAttributes: data?.TeamAttributes,
    Regionals: data?.Regionals,
  }

  if (data?._version !== undefined && data?._version !== null) {
    input._version = data._version
  }

  const stripTypename = (value) => {
    if (!value) return value
    if (Array.isArray(value)) return value.map(stripTypename)
    if (typeof value !== 'object') return value
    const { __typename, createdAt, updatedAt, _lastChangedAt, _deleted, ...rest } = value
    return Object.fromEntries(
      Object.entries(rest).map(([key, val]) => [key, stripTypename(val)])
    )
  }

  const normalized = stripTypename(input)

  normalized.Regionals = normalizeRegionals(normalized?.Regionals)

  return normalized
}


const apiUpdateTeamEntry = async function (team, data) {
  const input = sanitizeTeamInput(data, team)
  console.log({ ...input }, "...data")
  await runGraphQL({ query: updateTeam, variables: { input } })
}

const apiUpdateTeamEntryMatch = async function (team, data) {
  const input = sanitizeTeamInput(data, team)
  console.log({ ...input }, "...data")
  await runGraphQL({ query: updateTeam, variables: { input } })
}

const apiDeleteTeam = async function (teamId) {
  await runGraphQL({ query: deleteTeam, variables: { input: { id: teamId } } })
}

const apiDeleteMatchSubmission = async function ({ teamId, regionalId, matchId }) {
  const team = await apiGetTeam(teamId)
  if (!team) throw new Error(`Team not found: ${teamId}`)

  const updated = JSON.parse(JSON.stringify(team))
  let didRemove = false

  const regionals = Array.isArray(updated.Regionals) ? updated.Regionals : (updated.Regionals ? [updated.Regionals] : [])
  updated.Regionals = regionals.map((reg) => {
    if (String(reg?.RegionalId) !== String(regionalId)) return reg

    const matches = Array.isArray(reg?.TeamMatches)
      ? reg.TeamMatches
      : (reg?.TeamMatches ? [reg.TeamMatches] : [])

    const remaining = matches.filter((m) => String(m?.MatchId) !== String(matchId))
    if (remaining.length !== matches.length) {
      didRemove = true
    }

    return {
      ...reg,
      TeamMatches: remaining.length ? remaining : undefined,
    }
  })

  if (!didRemove) {
    return
  }

  await apiUpdateTeamEntry(teamId, updated)
}

/*
 * Get All the teams in our database
 */
const apiListTeams = async function ({ limit = 1000, filter, nextToken: startingNextToken } = {}) {
  let allItems = []
  let nextToken = startingNextToken
  let lastResponse = null

  do {
    const response = await runGraphQL({
      query: listTeams,
      variables: {
        limit,
        filter,
        nextToken,
      },
      allowPartialData: true,
    })

    lastResponse = response
    const items = (response?.data?.listTeams?.items || []).map(normalizeTeamRead)
    allItems = allItems.concat(items)
    nextToken = response?.data?.listTeams?.nextToken
  } while (nextToken)

  const listTeamsPayload = {
    ...(lastResponse?.data?.listTeams || {}),
    items: allItems,
    nextToken,
  }

  return {
    ...lastResponse,
    data: {
      ...lastResponse?.data,
      listTeams: listTeamsPayload,
    },
  }
}

/*
 * Get all entered matches for a regional;  optionally filter them down by team
 * parameters:
 * - regionalId - the regional id;  this is identified by the same id used in the bluealliance api
 * - teamNumber (optional) - the teamNumber
 */


const apigetMatchesForRegional = async function (regionalId, teamNumber) {

  const full = await apiListTeams();
  const items = full?.data?.listTeams?.items || [];

  const normalizedTeamId = normalizeTeamId(teamNumber);
  const matches = [];
  const isValidMatchId = (value) => {
    if (typeof value !== 'string') return false
    const trimmed = value.trim()
    if (!trimmed) return false
    if (trimmed === 'matchEntry.MatchId') return false
    return true
  }

  items.forEach(team => {
    const regArray = Array.isArray(team.Regionals) ? team.Regionals : (team.Regionals ? [team.Regionals] : []);
    regArray.forEach(r => {
      if (r.RegionalId === regionalId) {
        const teamMatches = Array.isArray(r.TeamMatches) ? r.TeamMatches : (r.TeamMatches ? [r.TeamMatches] : []);
        teamMatches.forEach(m => {
          if (!isValidMatchId(m?.MatchId)) return
          if (!normalizedTeamId) {
            matches.push(m);
          } else {
            // each match record has a Team field containing the team id
            if (normalizeTeamId(m.Team) === normalizedTeamId) {
              matches.push(m);
            }
          }
        });
      }
    });
  });

  return { data: { teamMatchesByRegional: { items: matches } } };
} 

/*
 * Get qualification and elimination matches from Blue Alliance
 * parameters:
 * - regionalId - the regional id; this is identified by the same id used in the bluealliance api
 */
const apiGetMatchesForRegional = async function (regionalId) {
  if (!regionalId) return []
  return fetchMatchesForRegional(regionalId)
}

const apiGetRegionalTeams = async function (regionalId) {
  const resolvedRegionalId = regionalId || apiGetRegional()
  if (!resolvedRegionalId) return []

  let lastError = null

  try {
    const simpleTeams = normalizeBlueAllianceTeams(await fetchSimpleTeamsForRegional(resolvedRegionalId))
    if (simpleTeams.length > 0) return simpleTeams
  } catch (err) {
    lastError = err
  }

  try {
    const teams = normalizeBlueAllianceTeams(await fetchTeamsInRegional(resolvedRegionalId))
    if (teams.length > 0) return teams
  } catch (err) {
    lastError = err
  }

  if (lastError) throw lastError
  return []
}

const apiGetTeamsInRegional = async function (regionalId) {
  return apiGetRegionalTeams(regionalId)
}

const apiGetSimpleTeamsForRegional = async function (regionalId) {
  return apiGetRegionalTeams(regionalId)
}

const apiGetRankingsForRegional = async function (regionalId) {
  if (!regionalId) return []
  return fetchRankingsForRegional(regionalId)
}

const apiGetStatboticsTeamEventPrediction = async function (teamNumber, eventKey, options) {
  return getTeamEventPrediction(teamNumber, eventKey, options)
}

const apiGetStatboticsEventPredictions = async function (eventKey) {
  return getEventPredictions(eventKey)
}

const apiGetCachedStatboticsTeamEventPrediction = function (teamNumber, eventKey, options) {
  return getCachedTeamEventPrediction(teamNumber, eventKey, options)
}

const apiWarmStatboticsTeamEventPredictions = async function (teamNumbers, eventKey, options) {
  return warmTeamEventPredictions(teamNumbers, eventKey, options)
}

const apiGetAllianceSelection = async function (regionalId) {
  if (!regionalId) return null
  const allianceId = `alliances-${regionalId}`

  const team = await apiGetTeam(allianceId)
  if (!team?.description) return null

  try {
    return JSON.parse(team.description)
  } catch (_) {
    return null
  }
}

const apiSaveAllianceSelection = async function (regionalId, alliances) {
  if (!regionalId) throw new Error('Regional not provided')

  const allianceId = `alliances-${regionalId}`
  let team = await apiGetTeam(allianceId)

  if (!team) {
    await apiCreateTeamEntry(allianceId, regionalId)
    team = await apiGetTeam(allianceId)
  }

  if (!team) {
    throw new Error('Failed to initialize alliance storage team')
  }

  const merged = {
    ...team,
    description: JSON.stringify(alliances)
  }

  await apiUpdateTeamEntry(allianceId, merged)
  return true
}

/* Creates team entry for our database*/
const apiCreateTeamEntry = async function (teamNumber, regional) {
  if (teamNumber === undefined) {
    throw new Error("Team Number not provided")
  } 

  return runGraphQL({
    query: createTeam,
    variables: {
      input: buildTeamEntry(teamNumber, regional)
    }
  })
}

const apiUpdateRegional = async function () {
  //console.log(import.meta.env.MODE)
  const { credentials } = await Auth.fetchAuthSession()
  const client = new SSMClient({ region: 'us-west-1', credentials: credentials })
  const command = new GetParameterCommand({
    Name: `regionalKey-${import.meta.env.VITE_AWS_ENV}`
  })
  const response = await client.send(command)
  regionalKey = response.Parameter.Value
}

const apiGetRegional = () => {
  return regionalKey
}

const isBaseScoutingTeamId = (teamId) => {
  const normalized = normalizeTeamId(teamId)
  return Boolean(normalized) && /^\d+$/.test(normalized) && !isNotesTeamId(String(teamId || ''))
}

const isOfficialBackfillableMatchId = (matchId) => {
  const value = String(matchId || '').trim().toLowerCase()
  if (!value || value === 'matchentry.matchid') return false
  if (/_pm\d+$/i.test(value)) return false
  return /_(qm\d+|sf\d+m\d+|f\d+m\d+)$/i.test(value)
}

const hasStoredMatchResult = (value) => {
  const normalized = normalizeMatchResult(value)
  return normalized === 'Win' || normalized === 'Lose' || normalized === 'Tie'
}

const getStoredScorePair = (match) => {
  const allianceScore = normalizeScoreValue(match?.AllianceScore)
  const opponentScore = normalizeScoreValue(match?.OpponentScore)
  return {
    allianceScore,
    opponentScore,
    hasScores: allianceScore !== null && opponentScore !== null,
  }
}

const needsHistoricalMatchMetadataBackfill = (match) => {
  if (!isOfficialBackfillableMatchId(match?.MatchId)) return false

  const { allianceScore, opponentScore, hasScores } = getStoredScorePair(match)
  const hasPlaceholderZeroScores = hasScores && allianceScore === 0 && opponentScore === 0

  return !hasStoredMatchResult(match?.MatchResult) || !hasScores || hasPlaceholderZeroScores
}

const getOfficialScoreValue = (match, allianceColor) => {
  const score = Number(match?.alliances?.[allianceColor]?.score)
  if (!Number.isFinite(score) || score < 0) return null
  return score
}

const deriveOfficialMatchMetadataForTeam = (officialMatch, teamNumber) => {
  const normalizedTeamNumber = normalizeTeamId(teamNumber)
  if (!normalizedTeamNumber || !officialMatch) return null

  const redTeams = Array.isArray(officialMatch?.alliances?.red?.team_keys)
    ? officialMatch.alliances.red.team_keys.map(normalizeTeamId)
    : []
  const blueTeams = Array.isArray(officialMatch?.alliances?.blue?.team_keys)
    ? officialMatch.alliances.blue.team_keys.map(normalizeTeamId)
    : []

  let allianceColor = null
  if (redTeams.includes(normalizedTeamNumber)) allianceColor = 'red'
  if (blueTeams.includes(normalizedTeamNumber)) allianceColor = 'blue'
  if (!allianceColor) return null

  const opponentColor = allianceColor === 'red' ? 'blue' : 'red'
  const allianceScore = getOfficialScoreValue(officialMatch, allianceColor)
  const opponentScore = getOfficialScoreValue(officialMatch, opponentColor)

  if (allianceScore === null || opponentScore === null) return null

  let matchResult = 'Tie'
  if (allianceScore > opponentScore) matchResult = 'Win'
  else if (allianceScore < opponentScore) matchResult = 'Lose'

  return {
    allianceScore,
    opponentScore,
    matchResult,
  }
}

const apiBackfillHistoricalMatchMetadata = async function () {
  const scope = HISTORICAL_MATCH_METADATA_BACKFILL_SCOPE

  if (historicalMatchMetadataBackfillCompleted.has(scope)) {
    return {
      skipped: true,
      reason: 'already-completed-this-session',
      updatedTeams: 0,
      updatedMatches: 0,
      scannedMatches: 0,
      failedRegionals: [],
    }
  }

  if (historicalMatchMetadataBackfillInFlight.has(scope)) {
    return await historicalMatchMetadataBackfillInFlight.get(scope)
  }

  const task = (async () => {
    const response = await apiListTeams()
    const teams = response?.data?.listTeams?.items || []

    const candidateRegionals = new Set()

    teams.forEach((team) => {
      if (!isBaseScoutingTeamId(team?.id)) return

      const regionals = Array.isArray(team?.Regionals) ? team.Regionals : (team?.Regionals ? [team.Regionals] : [])
      regionals.forEach((regional) => {
        const teamMatches = Array.isArray(regional?.TeamMatches)
          ? regional.TeamMatches
          : (regional?.TeamMatches ? [regional.TeamMatches] : [])

        if (teamMatches.some((match) => needsHistoricalMatchMetadataBackfill(match))) {
          const regionalId = String(regional?.RegionalId || '').trim()
          if (regionalId) candidateRegionals.add(regionalId)
        }
      })
    })

    if (candidateRegionals.size === 0) {
      historicalMatchMetadataBackfillCompleted.add(scope)
      return {
        skipped: false,
        reason: 'no-candidates',
        updatedTeams: 0,
        updatedMatches: 0,
        scannedMatches: 0,
        failedRegionals: [],
      }
    }

    const officialMatchesByRegional = new Map()
    const failedRegionals = []

    for (const regionalId of candidateRegionals) {
      try {
        const matches = await apiGetMatchesForRegional(regionalId)
        const matchMap = new Map(
          (Array.isArray(matches) ? matches : [])
            .map((match) => [String(match?.key || '').trim(), match])
            .filter(([key]) => Boolean(key))
        )
        officialMatchesByRegional.set(regionalId, matchMap)
      } catch (error) {
        failedRegionals.push(regionalId)
        console.warn('Historical match metadata backfill failed to load regional matches', regionalId, error)
      }
    }

    let updatedTeams = 0
    let updatedMatches = 0
    let scannedMatches = 0
    let hadUpdateFailure = false

    for (const team of teams) {
      if (!isBaseScoutingTeamId(team?.id)) continue

      const normalizedRegionals = normalizeRegionals(team?.Regionals)
      let teamChanged = false

      const nextRegionals = normalizedRegionals.map((regional) => {
        const regionalId = String(regional?.RegionalId || '').trim()
        const officialMatchMap = officialMatchesByRegional.get(regionalId)
        if (!officialMatchMap) return regional

        const teamMatches = Array.isArray(regional?.TeamMatches)
          ? regional.TeamMatches
          : (regional?.TeamMatches ? [regional.TeamMatches] : [])

        let regionalChanged = false

        const nextTeamMatches = teamMatches.map((savedMatch) => {
          if (!needsHistoricalMatchMetadataBackfill(savedMatch)) return savedMatch

          scannedMatches += 1

          const matchId = String(savedMatch?.MatchId || '').trim()
          const officialMatch = officialMatchMap.get(matchId)
          if (!officialMatch) return savedMatch

          const derivedMetadata = deriveOfficialMatchMetadataForTeam(
            officialMatch,
            savedMatch?.Team || team?.id
          )

          if (!derivedMetadata) return savedMatch

          const storedScores = getStoredScorePair(savedMatch)
          const hasPlaceholderZeroScores = storedScores.hasScores && storedScores.allianceScore === 0 && storedScores.opponentScore === 0
          const needsScoreBackfill = !storedScores.hasScores || hasPlaceholderZeroScores
          const needsResultBackfill = !hasStoredMatchResult(savedMatch?.MatchResult)

          if (!needsScoreBackfill && !needsResultBackfill) return savedMatch

          regionalChanged = true
          teamChanged = true
          updatedMatches += 1

          return {
            ...savedMatch,
            MatchResult: needsResultBackfill ? derivedMetadata.matchResult : savedMatch?.MatchResult,
            AllianceScore: needsScoreBackfill ? derivedMetadata.allianceScore : savedMatch?.AllianceScore,
            OpponentScore: needsScoreBackfill ? derivedMetadata.opponentScore : savedMatch?.OpponentScore,
          }
        })

        if (!regionalChanged) return regional

        return {
          ...regional,
          TeamMatches: nextTeamMatches,
        }
      })

      if (!teamChanged) continue

      try {
        await apiUpdateTeamEntry(String(team.id), {
          ...team,
          Regionals: nextRegionals,
        })
        updatedTeams += 1
      } catch (error) {
        hadUpdateFailure = true
        console.warn('Historical match metadata backfill failed to update team', team?.id, error)
      }
    }

    if (!hadUpdateFailure && failedRegionals.length === 0) {
      historicalMatchMetadataBackfillCompleted.add(scope)
    }

    return {
      skipped: false,
      reason: hadUpdateFailure || failedRegionals.length > 0 ? 'partial' : 'completed',
      updatedTeams,
      updatedMatches,
      scannedMatches,
      failedRegionals,
    }
  })().finally(() => {
    historicalMatchMetadataBackfillInFlight.delete(scope)
  })

  historicalMatchMetadataBackfillInFlight.set(scope, task)
  return await task
}

export {
  apiGetTeam,
  apiAddTeam,
  apiListTeams,
  apigetMatchesForRegional,
  apiGetMatchesForRegional,
  apiGetRegionalTeams,
  apiGetTeamsInRegional,
  apiGetSimpleTeamsForRegional,
  apiGetRankingsForRegional,
  apiGetStatboticsTeamEventPrediction,
  apiGetStatboticsEventPredictions,
  apiGetCachedStatboticsTeamEventPrediction,
  apiWarmStatboticsTeamEventPredictions,
  apiGetAllianceSelection,
  apiSaveAllianceSelection,
  apiUpdateTeamEntry,
  apiDeleteTeam,
  apiDeleteMatchSubmission,
  apiUpdateRegional,
  apiGetRegional,
  apiBackfillHistoricalMatchMetadata,
  apiCreateTeamEntry,
  apiUpdateTeamEntryMatch,
  isNotesTeamId,
  toNotesTeamId,
  fromNotesTeamId,
  isBaseTeamId,
}
