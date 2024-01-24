import React, { useEffect } from 'react'
import { getMatchesForRegional} from "../../api";
import { getTeamsInRegional, getOprs } from "../../api/bluealliance";
//import { buildErrorMessage } from 'vite';
  //seperate file for when we figure out prior problems(passing function)

function getOprList (){
  getOprs('2023azva')
  .then(data => {

  })
}

async function getTeams () {
  return await (getTeamsInRegional('2023azva'))
   .catch(err => console.log(err))
   .then(data => {
     return data.map(obj => {
       const teamNumObj = {
         TeamNumber: obj.team_number,
         Matches: '',
         OPR: "", 
         Priorities: '',
         CCWM: "", 
         AvgPoints: 0,
         AvgGridPoints: 0,
         AvgConePts: 0,
         AvgConeAcc: 0,
         AvgCubePts: 0,
         AvgCubeAcc: 0,
         AvgCSPoints: 0,
         DPR: "",
         Penalties: "",
         TeamNum: `frc${obj.team_number}`,

         NGridPoints: 0,
         NConePoints: 0, 
         NConeAccuracy: 0, 
         NCubePoints: 0, 
         NCubeAccuracy: 0, 
         NChargeStation: 0,
       }

       return teamNumObj
     })
   })
   .catch(err => console.log(err))
}

async function getTeamsMatches(teamNumbers) {
  return await (getMatchesForRegional('2023azva'))
  .catch(err => console.log(err))
  .then(data => {
    return teamNumbers.map(team => { //same as teamsData from maintable

      const teamMatchData = data.data.teamMatchesByRegional.items;
      const teamStats = teamMatchData.filter(x => x.Team === team.TeamNum) ///same as teamstats

      console.log(indivTeamStats)
      console.log(teamMatchData)

      // const points = teamStats.map(x => x.Teleop.ScoringTotal.Total) //for deviation
      // const gridPoints = teamStats.map(x => x.Teleop.ScoringTotal.GridPoints)
      // const conePts = teamStats.map(x => x.Teleop.ScoringTotal.Cones)
      // const cubePts = teamStats.map(x => x.Teleop.ScoringTotal.Cubes)
      // const coneAcc = teamStats.map(x => x.Teleop.ConesAccuracy.Overall)
      // const cubeAcc = teamStats.map(x => x.Teleop.CubesAccuracy.Overall)

      // const mGridPoints = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgGridPoints.substring(2,8))
      // const mConePoints = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgConePts.substring(2,8))
      // const mConeAcc = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgConeAcc.substring(2,8)) // for sorts
      // const mCubePoints = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgCubePts.substring(2,8))
      // const mCubeAcc = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgCubeAcc.substring(2,8))
      // const mCSPoints = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgCSPoints)

      // const avgPoints = calcAvgPoints(teamStats)
      // const avgGridPoints = calcAvgGrid(teamStats)
      // const avgConePoints = calcAvgConePts(teamStats)
      // const avgConeAcc = calcAvgConeAcc(teamStats) //tableData
      // const avgCubePoints = calcAvgCubePts(teamStats)
      // const avgCubeAcc = calcAvgCubeAcc(teamStats)
      // const avgCSPoints = calcAvgCS(teamStats)

      // const priorities = getPriorities(teamStats)
      // const penalties = getPenalties(teamStats)

      // const upperGridPts = calcUpperGrid(teamStats)
      // const upperGridAcc = calcUpperGridAcc(teamStats)
      // const midGridPts = calcMidGrid(teamStats)
      // const midGridAcc = calcMidGridAcc(teamStats)
      // const lowerGridPts = calcLowGrid(teamStats)
      // const lowerGridAcc = calcLowAcc(teamStats)

      // const upperConeAcc = calcUpperConeAcc(teamStats)
      // const midConeAcc = calcMidConeAcc(teamStats)
      // const lowerConeAcc = calcLowConeAcc(teamStats)

      // const upperConePts = calcUpperConeGrid(teamStats)
      // const midConePts = calcMidConeGrid(teamStats)
      // const lowerConePts = calcLowConeGrid(teamStats)

      // const upperCubeAcc = calcUpperCubeAcc(teamStats)
      // const midCubeAcc = calcMidCubeAcc(teamStats)
      // const lowerCubeAcc = calcLowCubeAcc(teamStats)

      // const upperCubePts = calcUpperCubeGrid(teamStats)
      // const midCubePts = calcMidCubeGrid(teamStats)
      // const lowerCubePts = calcLowCubeGrid(teamStats)

      // const maxGridPoints = getMax(tableData.map(team => team.AvgGridPoints.substring(2,8)))
      // const maxConePoints = getMax(tableData.map(team => team.AvgConePts.substring(2,8)))
      // const maxConeAcc = getMax(tableData.map(team => team.AvgConeAcc.substring(2,8))) //for sorts
      // const maxCubePoints = getMax(tableData.map(team => team.AvgCubePts.substring(2,8)))
      // const maxCubeAcc = getMax(tableData.map(team => team.AvgCubeAcc.substring(2,8)))
      // const maxCSPoints = getMax(tableData.map(team => team.AvgCSPoints))

      // const rGridPoints = mGridPoints / maxGridPoints
      // const rConePoints = mConePoints / maxConePoints
      // const rConeAcc = mConeAcc / maxConeAcc //for sorts
      // const rCubePoints = mCubePoints / maxCubePoints
      // const rCubeAcc = mCubeAcc / maxCubeAcc
      // const rCSPoints = mCSPoints / maxCSPoints

      const teamMatObj = {
        TeamNumber: teamNumbers.TeamNumber,
        Matches: '',
        OPR: teamNumbers.OPR, 
        Priorities: teamNumbers.Priorities,
        CCWM: teamNumbers.CCWM, 
        AvgPoints: teamNumbers.AvgPoints,
        AvgGridPoints: teamNumbers.AvgGridPoints,
        AvgConePts: teamNumbers.AvgConePts,
        AvgConeAcc: teamNumbers.AvgConeAcc,
        AvgCubePts: teamNumbers.AvgCubePts,
        AvgCubeAcc: teamNumbers.AvgCubeAcc,
        AvgCSPoints: teamNumbers.CSPoints,
        DPR: teamNumbers.DPR,
        Penalties: teamNumbers.Penalties,
        TeamNum: teamNumbers.TeamNum,

        NGridPoints: 0,
        NConePoints: 0, 
        NConeAccuracy: 0, 
        NCubePoints: 0, 
        NCubeAccuracy: 0, 
        NChargeStation: 0,
      }
      console.log(teamMatObj)
    return teamMatObj;
    })
  })
}
export { getTeams,getTeamsMatches } 