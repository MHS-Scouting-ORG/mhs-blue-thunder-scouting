//import { graphqlOperation, API } from 'aws-amplify'
import { generateClient } from 'aws-amplify/api'
import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm"
import {getTeam, listTeams, } from '../graphql/queries'
import {createTeam, updateTeam} from '../graphql/mutations'
import {buildMatchEntry, buildTeamEntry} from './builder'
import {
  getMatchesForRegional as fetchMatchesForRegional,
  getTeamsInRegional as fetchTeamsInRegional,
  getSimpleTeamsForRegional as fetchSimpleTeamsForRegional,
  getRankingsForRegional as fetchRankingsForRegional,
} from './bluealliance'
import { normalizeTeamId } from '../utils/teamId'

import * as Auth from 'aws-amplify/auth'

let client
const getClient = () => {
  if (!client) client = generateClient()
  return client
}

let regionalKey

const runGraphQL = async ({ query, variables }) => {
  try {
    return await getClient().graphql({ query, variables })
  } catch (err) {
    if (err?.data) {
      return err
    }
    throw err
  }
}

const normalizeStratList = (value) => {
  const allowed = ["Hoarding", "Defense", "Offensive", "Support", "None"]

  if (Array.isArray(value)) {
    const cleaned = value
      .map(v => (typeof v === 'string' ? v.trim() : ''))
      .filter(v => allowed.includes(v) && v !== '')
    return cleaned.length > 0 ? cleaned : ["None"]
  }

  if (typeof value === 'string') {
    const cleaned = value
      .split(',')
      .map(v => v.trim())
      .filter(v => allowed.includes(v) && v !== '')
    return cleaned.length > 0 ? cleaned : ["None"]
  }

  return ["None"]
}

const normalizeAutoStrat = (value) => {
  const allowed = ["WentMid", "Scored", "CrossedMid", "None"]
  return allowed.includes(value) ? value : "None"
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
            Autonomous: {
              ...match?.Autonomous,
              AutoStrat: normalizeAutoStrat(match?.Autonomous?.AutoStrat)
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
    Regionals: normalizeRegionals(team.Regionals)
  }
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
  const response = await runGraphQL({ query: getTeam, variables: { id: normalizedTeamId } })
  return normalizeTeamRead(response?.data?.getTeam || null)
}


/*
 * Add a team to our database
 */
const apiAddTeam = async function (team) {
  await getClient().graphql({ query: createTeam, variables: { input: team } })
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
  await getClient().graphql({
    query: updateTeam,  
    variables: {
      input
    }
  })
}

const apiUpdateTeamEntryMatch = async function (team, data) {
  const input = sanitizeTeamInput(data, team)
  console.log({ ...input }, "...data")
  await getClient().graphql({
    query: updateTeam,  
    variables: {
      input
    }
  })
}

/*
 * Get All the teams in our database
 */
const apiListTeams = async function () {
  const response = await runGraphQL({ query: listTeams })
  const items = response?.data?.listTeams?.items || []

  return {
    ...response,
    data: {
      ...response?.data,
      listTeams: {
        ...(response?.data?.listTeams || {}),
        items: items.map(normalizeTeamRead)
      }
    }
  }
}

/*
 * Get all entered matches for a regional;  optionally filter them down by team
 * parameters:
 * - regionalId - the regional id;  this is identified by the same id used in the bluealliance api
 * - teamNumber (optional) - the teamNumber
 */


const apigetMatchesForRegional = async function (regionalId, teamNumber) {

  const full = await runGraphQL({ query: listTeams });
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

  items.map(normalizeTeamRead).forEach(team => {
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

const apiGetTeamsInRegional = async function (regionalId) {
  if (!regionalId) return []
  return fetchTeamsInRegional(regionalId)
}

const apiGetSimpleTeamsForRegional = async function (regionalId) {
  if (!regionalId) return []
  return fetchSimpleTeamsForRegional(regionalId)
}

const apiGetRankingsForRegional = async function (regionalId) {
  if (!regionalId) return []
  return fetchRankingsForRegional(regionalId)
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

  return getClient().graphql({
    query: createTeam, variables: {
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

export {
  apiGetTeam,
  apiAddTeam,
  apiListTeams,
  apigetMatchesForRegional,
  apiGetMatchesForRegional,
  apiGetTeamsInRegional,
  apiGetSimpleTeamsForRegional,
  apiGetRankingsForRegional,
  apiGetAllianceSelection,
  apiSaveAllianceSelection,
  apiUpdateTeamEntry,
  apiUpdateRegional,
  apiGetRegional,
  apiCreateTeamEntry,
  apiUpdateTeamEntryMatch,
}
