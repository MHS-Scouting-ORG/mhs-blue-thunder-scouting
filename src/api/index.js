//import { graphqlOperation, API } from 'aws-amplify'
import { generateClient } from 'aws-amplify/api'
import { teamMatchesByRegional, getTeam, listTeams } from '../graphql/queries'
import { deleteTeamMatch, updateTeamMatch, createTeamMatch, createTeam, updateTeam } from '../graphql/mutations'
import { onCreateTeamMatch, onUpdateTeamMatch } from '../graphql/subscriptions'
import buildMatchEntry from './builder'

const client = generateClient()

/**
 * Subscribe to create and update events
 * @param {*} updateFn
 * @param {*} errorFn
 */
const apiSubscribeToMatchUpdates = async function (updateFn, errorFn) {

    client.graphql({ query: onCreateTeamMatch }).subscribe({
        next: ({ value }) => updateFn(value),
        error: (errorFn || (err => console.log(err)))
    })
    client.graphql({ query: onUpdateTeamMatch }).subscribe({
        next: updateFn,
        error: (errorFn || (err => console.log(err)))
    })
}

/*
 * Get a Team by their TeamNumber  that are currently in our database
 */
const apiGetTeam = async function (teamNumber) {
    return await client.graphql({ query: getTeam, variables: { id: teamNumber } })
}

/*
 * Add a team to our database
 */
const apiAddTeam = async function (team) {
    await client.graphql({ query: createTeam, variables: { input: team } })
}

const apiUpdateTeam = async function (team, data) {
    await client.graphql({
        query: updateTeam, variables: {
            input: {
                ...data,
                id: team.id,
            }
        }
    })
}

/*
 * Get All the teams in our database
 */
const apiListTeams = async function () {
    return client.graphql({ query: listTeams })
}

/*
 * Get all entered matches for a regional;  optionally filter them down by team
 * parameters:
 * - regionalId - the regional id;  this is identified by the same id used in the bluealliance api
 * - teamNumber (optional) - the teamNumber
 */
const getMatchesForRegional = async function (regionalId, teamNumber) {
    if (!teamNumber) {
        return client.graphql({
            query: teamMatchesByRegional, variables: {
                Regional: regionalId,
            }
        })
    }
    return client.graphql({
        query: teamMatchesByRegional, variables: {
            Regional: regionalId,
            filter: {
                Team: {
                    eq: teamNumber
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
const apiCreateTeamMatchEntry = async function (regionalId, teamId, matchId) {
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

    return client.graphql({
        query: createTeamMatch, variables: {
            input: buildMatchEntry(regionalId, teamId, matchId),
        }
    })
}


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

    const input = {
        ...data,
        id: matchId,
        name: "",
        Team: teamId,
        Regional: regionalId,
    }

    console.log("provided input: ", input)

    return client.graphql({
        query: updateTeamMatch, variables: {
            input
        }
    })


}

const apiDeleteTeamMatch = async function (regionalId, teamId, matchId) {
    await client.graphql({
        query: deleteTeamMatch, variables: {
            input: {
                id: matchId,
                Team: teamId,
                Regional: regionalId
            }
        }
    })
}

export { apiDeleteTeamMatch, apiSubscribeToMatchUpdates, apiGetTeam, apiAddTeam, apiListTeams, getMatchesForRegional, apiCreateTeamMatchEntry, apiUpdateTeamMatch, apiUpdateTeam }
