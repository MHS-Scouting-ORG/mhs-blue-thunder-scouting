import config from '../config.json'
import * as Auth from 'aws-amplify/auth'
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'



const { bluealliance_api_endpoint, year } = config

/**
 * Get OPR
 * @param {*} event_key 
 * @returns 
 */
async function getOprs(event_key) {
  if (!event_key || event_key.length === 0)
    throw new Error("Event Key not provided")
  return _fetch(`/event/${event_key}/oprs`)
}

// get bluealliance api key
async function getApiKey() {
  //  const user = await Auth.currentAuthenticatedUser()
  //  const credentials = await Auth.currentCredentials(user)
  const { credentials } = await Auth.fetchAuthSession()
  console.log(credentials)
  const client = new SecretsManagerClient({
    region: 'us-west-1',
    credentials,
  })

  return await client.send(new GetSecretValueCommand({
    SecretId: `bluealliance-apikey-dev`
  }))
}

const _fetch = async function (endpoint) {
  const api_key = await getApiKey()
  const res = await fetch(`${bluealliance_api_endpoint}${endpoint}`, { headers: { 'x-tba-auth-key': api_key.SecretString }, mode: "cors" })
  return res.json()

}

/* 
 * Get BlueThunder Information
 */
const getTeamInfo = async function () {
  return _fetch("/team/frc2443")

}

/*
 * Get all regionals for the year
 */
const getRegionals = async function () {
  return _fetch(`/events/${year}`)
}

/*
 * Get all teams in a regional
 * parameter
 * - regional - regional id from bluealliance
 */
const getTeamsInRegional = async function (regional) {
  if (!regional || regional.length === 0)
    throw new Error(`regional not provided ${regional}`)
  return _fetch(`/event/${regional}/teams`)
}

const getMatchesForRegional = async function (regional) {
  return _fetch(`/event/${regional}/matches`)
}

const getRankingsForRegional = async function (regional) {
  return  _fetch(`/event/${regional}/rankings`)
}

export { getMatchesForRegional, getOprs, getTeamInfo, getRegionals, getTeamsInRegional, getRankingsForRegional } 