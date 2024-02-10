import React, { useEffect } from 'react'
import { getMatchesForRegional} from "../../../api";
import { getTeamsInRegional, } from "../../../api/bluealliance";
import { getMax, calcDeviation, calcLowCubeAcc, calcLowCubeGrid, calcLowConeAcc, calcLowConeGrid, calcLowAcc, calcLowGrid, calcMidCubeAcc, calcMidCubeGrid, calcMidConeAcc, calcMidConeGrid, calcMidGridAcc, calcMidGrid, calcUpperCubeAcc, calcUpperCubeGrid, calcUpperConeAcc, calcUpperConeGrid, calcUpperGridAcc, calcUpperGrid, calcAvgCS, calcAvgCubeAcc, calcAvgCubePts, calcAvgConeAcc, calcAvgConePts, calcAvgGrid, calcAvgPoints, getPenalties, getPriorities } from "./CalculationUtils"

async function getTeams () {
  try {
  const data = await getTeamsInRegional('2023azva')

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
  }
  catch(err){
   console.log(err) 
  }
}

async function getTeamsMatchesAndTableData(teamNumbers, oprList, ccwmList, dprList, mtable) {
  //return await (getMatchesForRegional('2023azva'))
  ///.catch(err => console.log(err))
  //.then(data => {
    try {
    const data = await getMatchesForRegional('2023azva')

    let tableData = mtable//tableDataForUtils()  //testing 

    return teamNumbers/*same as teamsData from maintable*/.map(team => { 
      
      const teamMatchData = data.data.teamMatchesByRegional.items;
      const teamStats = teamMatchData.filter(x => x.Team === team.TeamNum) ///same as teamstats
      //console.log(teamStats)
      //console.log(teamMatchData)

      const points = teamStats.map(x => x.Teleop.ScoringTotal.Total) //for deviation
      const gridPoints = teamStats.map(x => x.Teleop.ScoringTotal.GridPoints)
      const conePts = teamStats.map(x => x.Teleop.ScoringTotal.Cones)
      const cubePts = teamStats.map(x => x.Teleop.ScoringTotal.Cubes)
      const coneAcc = teamStats.map(x => x.Teleop.ConesAccuracy.Overall)
      const cubeAcc = teamStats.map(x => x.Teleop.CubesAccuracy.Overall)

      const mGridPoints = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgGridPoints.substring(2,8))
      const mConePoints = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgConePts.substring(2,8))
      const mConeAcc = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgConeAcc.substring(2,8)) // for sorts
      const mCubePoints = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgCubePts.substring(2,8))
      const mCubeAcc = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgCubeAcc.substring(2,8))
      const mCSPoints = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgCSPoints)

      const avgPoints = calcAvgPoints(teamStats)
      const avgGridPoints = calcAvgGrid(teamStats)
      const avgConePoints = calcAvgConePts(teamStats)
      const avgConeAcc = calcAvgConeAcc(teamStats) //tableData
      const avgCubePoints = calcAvgCubePts(teamStats)
      const avgCubeAcc = calcAvgCubeAcc(teamStats)
      const avgCSPoints = calcAvgCS(teamStats)

      const priorities = getPriorities(teamStats)
      const penalties = getPenalties(teamStats)

      const upperGridPts = calcUpperGrid(teamStats)
      const upperGridAcc = calcUpperGridAcc(teamStats)
      const midGridPts = calcMidGrid(teamStats)
      const midGridAcc = calcMidGridAcc(teamStats)
      const lowerGridPts = calcLowGrid(teamStats)
      const lowerGridAcc = calcLowAcc(teamStats)

      const upperConeAcc = calcUpperConeAcc(teamStats)
      const midConeAcc = calcMidConeAcc(teamStats)
      const lowerConeAcc = calcLowConeAcc(teamStats)

      const upperConePts = calcUpperConeGrid(teamStats)
      const midConePts = calcMidConeGrid(teamStats)
      const lowerConePts = calcLowConeGrid(teamStats)

      const upperCubeAcc = calcUpperCubeAcc(teamStats)
      const midCubeAcc = calcMidCubeAcc(teamStats)
      const lowerCubeAcc = calcLowCubeAcc(teamStats)

      const upperCubePts = calcUpperCubeGrid(teamStats)
      const midCubePts = calcMidCubeGrid(teamStats)
      const lowerCubePts = calcLowCubeGrid(teamStats)

      const maxGridPoints = getMax(tableData.map(team => team.AvgGridPoints.substring(2,8)))
      const maxConePoints = getMax(tableData.map(team => team.AvgConePts.substring(2,8)))
      const maxConeAcc = getMax(tableData.map(team => team.AvgConeAcc.substring(2,8))) //for sorts
      const maxCubePoints = getMax(tableData.map(team => team.AvgCubePts.substring(2,8)))
      const maxCubeAcc = getMax(tableData.map(team => team.AvgCubeAcc.substring(2,8)))
      const maxCSPoints = getMax(tableData.map(team => team.AvgCSPoints))

      const rGridPoints = mGridPoints / maxGridPoints
      const rConePoints = mConePoints / maxConePoints
      const rConeAcc = mConeAcc / maxConeAcc //for sorts
      const rCubePoints = mCubePoints / maxCubePoints
      const rCubeAcc = mCubeAcc / maxCubeAcc
      const rCSPoints = mCSPoints / maxCSPoints

      const tableDataObj = {
        TeamNumber: team.TeamNumber,
        Matches: team.Matches,
        OPR: oprList[team.TeamNum] ? (oprList[team.TeamNum]).toFixed(2) : null,
        Priorities: priorities.join(', '),
        CCWM: ccwmList[team.TeamNum] ? (ccwmList[team.TeamNum]).toFixed(2) : null, 
        AvgPoints: avgPoints !== 0 && isNaN(avgPoints) !== true ? `μ=${avgPoints}, σ=${calcDeviation(points, avgPoints)}` : '', 
        AvgGridPoints: avgGridPoints !== 0 && isNaN(avgGridPoints) !== true ? `μ=${avgGridPoints}, σ=${calcDeviation(gridPoints, avgGridPoints)}` : '',
        AvgCSPoints: avgCSPoints !== 0 && isNaN(avgCSPoints) !== true ? avgCSPoints : '',
        AvgConePts: avgConePoints !== 0 && isNaN(avgConePoints) !== true ? `μ=${avgConePoints}, σ=${calcDeviation(conePts, avgConePoints)}` : '', 
        AvgConeAcc: avgConeAcc !== 0 && isNaN(avgConeAcc) !== true ? `μ=${avgConeAcc}, σ=${calcDeviation(coneAcc, avgConeAcc)}` : '', 
        AvgCubePts: avgCubePoints !== 0 && isNaN(avgCubePoints) !== true ? `μ=${avgCubePoints}, σ=${calcDeviation(cubePts, avgCubePoints)}` : '', 
        AvgCubeAcc: avgCubeAcc !== 0 && isNaN(avgCubeAcc) !== true ? `μ=${avgCubeAcc}, σ=${calcDeviation(cubeAcc, avgCubeAcc)}` : '', 
        DPR: dprList[team.TeamNum] ? (dprList[team.TeamNum]).toFixed(2) : null, 
        Penalties: penalties.join(', '),

        AvgUpper: upperGridPts,
        AvgUpperAcc: upperGridAcc,
        AvgMid: midGridPts, //for inner tables
        AvgMidAcc: midGridAcc,
        AvgLower: lowerGridPts,
        AvgLowerAcc: lowerGridAcc,

        AvgUpperConeAcc: upperConeAcc,
        AvgMidConeAcc: midConeAcc,
        AvgLowerConeAcc: lowerConeAcc,

        AvgUpperConePts: upperConePts,
        AvgMidConePts: midConePts,
        AvgLowerConePts: lowerConePts,

        AvgUpperCubeAcc: upperCubeAcc,
        AvgMidCubeAcc: midCubeAcc,
        AvgLowerCubeAcc: lowerCubeAcc,

        AvgUpperCubePts: upperCubePts,
        AvgMidCubePts: midCubePts,
        AvgLowerCubePts: lowerCubePts,

        NGridPoints: isNaN(rGridPoints) !== true ? rGridPoints : 0,
        NConePoints: isNaN(rConePoints) !== true ? rConePoints : 0, 
        NConeAccuracy: isNaN(rConeAcc) !== true ? rConeAcc : 0, //for sorts
        NCubePoints: isNaN(rCubePoints) !== true ? rCubePoints : 0, 
        NCubeAccuracy: isNaN(rCubeAcc) !== true ? rCubeAcc : 0,
        NChargeStation: isNaN(rCSPoints) !== true ? rCSPoints : 0,
      }
      return tableDataObj;
    })
  }
  catch(err) {
    console.log(err)
  }
  }

export { getTeams,getTeamsMatchesAndTableData, } 