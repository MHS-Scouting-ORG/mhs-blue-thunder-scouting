//import { graphqlOperation, API } from 'aws-amplify'
import { generateClient } from 'aws-amplify/api'
import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm"
import {getTeam, listTeams, } from '../graphql/queries'
import {createTeam, updateTeam} from '../graphql/mutations'
import {buildMatchEntry, buildTeamEntry} from './builder'
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


const apiUpdateTeamEntry = async function (team, data) {
  console.log({...data}, "...data")
  await getClient().graphql({
    query: updateTeam,  
    variables: {
      input: {
        ...data,
        id: team,
      }
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

/* Creates team entry for our database*/
const apiCreateTeamEntry = async function (teamNumber, data, type, regional) {
  if (teamNumber === undefined) {
    throw new Error("Team Number not provided")
  } 

  return getClient().graphql({
    query: createTeam, variables: {
      input: buildTeamEntry(teamNumber, data, type, regional)
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

export {apiGetTeam, apiAddTeam, apiListTeams, apigetMatchesForRegional, apiUpdateTeamEntry, apiUpdateRegional, apiGetRegional, apiCreateTeamEntry }
