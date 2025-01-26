
const apiStatsURL = 'https://api.statbotics.io/v3/'

const _fetch = async function(endpoint) {
    const res = await fetch(`${apiStatsURL}${endpoint}`)
}

/* 

Get TeamEvent from Statbotics Rest API 
Contains EPA for Single Team 

*/
const getTeamEvent = async function(teamNumber, eventKey) {
    return _fetch(`team_event/${teamNumber}${eventKey}`)
}