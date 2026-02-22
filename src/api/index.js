//import { graphqlOperation, API } from 'aws-amplify'
import { generateClient } from 'aws-amplify/api'
import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm"
import {getTeam, listTeams, } from '../graphql/queries'
import {createTeam, updateTeam} from '../graphql/mutations'
import {buildMatchEntry, buildTeamEntry} from './builder'
import { getMatchesForRegional as fetchMatchesForRegional } from './bluealliance'
import { normalizeTeamId } from '../utils/teamId'

import * as Auth from 'aws-amplify/auth'

let client
const getClient = () => {
  if (!client) client = generateClient()
  return client
}

let regionalKey

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
  const data = await getClient().graphql({ query: getTeam, variables: { id: normalizedTeamId } })
  return data.data.getTeam
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

  return stripTypename(input)
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
  return getClient().graphql({ query: listTeams })
}

/*
 * Get all entered matches for a regional;  optionally filter them down by team
 * parameters:
 * - regionalId - the regional id;  this is identified by the same id used in the bluealliance api
 * - teamNumber (optional) - the teamNumber
 */
const apigetMatchesForRegional = async function (regionalId, teamNumber) {
  const normalizedTeamId = normalizeTeamId(teamNumber)
  if (!normalizedTeamId) {
    return getClient().graphql({
      query: teamMatchesByRegional, variables: {
        Regional: regionalId,
      }
    })
  }
  return getClient().graphql({
    query: teamMatchesByRegional, variables: {
      Regional: regionalId,
      filter: {
        Team: {
          eq: normalizedTeamId
        }
      }
    }
  })
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

export {apiGetTeam, apiAddTeam, apiListTeams, apigetMatchesForRegional, apiGetMatchesForRegional, apiUpdateTeamEntry, apiUpdateRegional, apiGetRegional, apiCreateTeamEntry, apiUpdateTeamEntryMatch }
