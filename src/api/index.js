//import { graphqlOperation, API } from 'aws-amplify'
import { generateClient } from 'aws-amplify/api'
import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm"
import { /* teamMatchesByRegional, */ getTeam, listTeams, /*getTeamMatch */ } from '../graphql/queries'
import { /*deleteTeamMatch, updateTeamMatch, createTeamMatch,*/ createTeam, updateTeam} from '../graphql/mutations'
import { /*onCreateTeamMatch, onUpdateTeamMatch */ } from '../graphql/subscriptions'
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
  return await getClient().graphql({ query: getTeam, variables: { id: normalizedTeamId } })
}


/*
 * Add a team to our database
 */
const apiAddTeam = async function (team) {
  await getClient().graphql({ query: createTeam, variables: { input: team } })
}


const apiUpdateTeamEntry = async function (team, data) {
  console.log(...data, "...data")
  await getClient().graphql({
    query: updateTeam, variables: {
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

/*
 * create a new team match entry
 * parameters
 * - regionalId - the regional id
 * - teamId - the team id
 * - matchid - the match id
 */
/*const apiCreateTeamMatchEntry = async function (regionalId, teamId, matchId, matchType, matchNumber, alliance) {
  if (regionalId === undefined) {
    throw new Error("Regional not provided")
  }
  if (teamId === undefined) {
    throw new Error("Team Id not provided")
  }
  if (matchId === undefined) {
    throw new Error(`MatchId not provided; matchId ${matchId}`)
  }

  console.log("building match entry")

  const normalizedTeamId = normalizeTeamId(teamId)

  return getClient().graphql({
    query: createTeam, variables: { //changed from createTeamMatch to createTeam since the match entry is created as part of the team entry
      input: buildMatchEntry(regionalId, normalizedTeamId, matchId, matchType, matchNumber, alliance),
    }
  })
}*/


/* Creates team entry for our database*/
const apiCreateTeamEntry = async function (teamNumber, data, type) {
  if (teamNumber === undefined) {
    throw new Error("Team Number not provided")
  } 

  return getClient().graphql({
    query: createTeam, variables: {
      input: buildTeamEntry(teamNumber, data, type)
    }
  })
}

/*
const apiUpdateTeamMatch = async function (regionalId, teamId, matchId, data) {
  if (!regionalId) {
    throw new Error("Regional not provided")
  }
  if (!teamId) {
    throw new Error("Team Id not provided")
  }
  if (!matchId) {
    throw new Error("MatchId not provided")
  }

  console.log("the data: ", data)

  const normalizedTeamId = normalizeTeamId(teamId)

  const input = {
    ...data,
    id: matchId,
    Team: normalizedTeamId,
    Regional: regionalId,
  }

  console.log("provided input: ", input)

  return getClient().graphql({
    query: updateTeamMatch, variables: {
      input
    }
  })

 
} */

// const apiDeleteTeamMatch = async function (regionalId, teamId, matchId) {
//   const normalizedTeamId = normalizeTeamId(teamId)
//   await getClient().graphql({
//     query: deleteTeamMatch, variables: {
//       input: {
//         id: matchId,
//         Team: normalizedTeamId,
//         Regional: regionalId
//       }
//     }
//   })
// }

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

export {apiGetTeam, apiAddTeam, apiListTeams, apigetMatchesForRegional, /*apiUpdateTeamMatch, */ apiUpdateTeamEntry, apiUpdateRegional, apiGetRegional, apiCreateTeamEntry }
