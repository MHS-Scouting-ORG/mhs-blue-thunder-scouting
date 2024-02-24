import React, { useEffect } from 'react'
import { getMatchesForRegional} from "../../../api";
import { getTeamsInRegional, } from "../../../api/bluealliance";
import { arrMode, calcAvg, getCan, } from "./CalculationUtils"

async function getTeams (regional) {
  try {
  const data = await getTeamsInRegional(regional)

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

        //=======ROBOT PERFORMANCE PROPS=========//
        RobotSpeed: 'Faster',
        RobotStrength: 'Stronger',
        RobotSize: 'Biggger',
        //custom for each year, scoring elements
        RobotHang: 'Better',
        RobotSpeaker: 'Better',
        RobotAmp: 'Better',
        RobotTrap: 'Better',
        //=======Stats=========//
        AvgPoints: 0,
        AvgAutoPts: 0,
        //custom//
        AvgCycles: 0,
        AvgSpeaker: 0,
        AvgAmp: 0, 
        //======Capabilities======//
        CanDefend: 'TBD',
        //custom
        CanUnderStage: 'Yes',
        //determined internally not from form dependent on presence of points
        CanHang: 'Yes',
        CanSpeaker: 'Yes',
        CanAmp: 'Yes',
        CanTrap: 'Yes',
        //======Auto====//
        //ln46 auto pts
        AutoStart: '1',
        AutoCollide: 'Yes',
        MostCommonScoring: 'Amp',
        //===Field RobotInfo==//
        MostCommonScoredElement: "Amp",
        AutoStart: '1',
        StagePosition: 'Center',
        //===Penalties===//
        Fouls: '1',
        Tech: '1',
        YellowCard: '1',
        RedCard: '1',
        BrokenRobot: '1'
       }

       return teamNumObj
     })
  }
  catch(err){
   console.log(err) 
  }
}

async function getTeamsMatchesAndTableData(teamNumbers, oprList, ccwmList, dprList, mtable, regional) {
    try {
    const data = await getMatchesForRegional(regional)

    const tableData = mtable

    return teamNumbers.map(team => { 
      
      const teamMatchData = data.data.teamMatchesByRegional.items;
      const teamStats = teamMatchData.filter(x => x.Team === team.TeamNum) 
      //console.log(teamStats)
      //console.log(teamMatchData)

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

      //Robot Performance
      const mcRobotSpeed = arrMode(teamStats.map((team) => team.RobotInfo.FasterThanUs !== null ? team.RobotInfo.FasterThanUs : 0 ))
      //const mcRobotStrength = arrMode(teamStats.map((team) => team.RobotInfo.RobotStrength !== null ? team.RobotInfo.RobotStrength : 0 ))
      //const mcRobotSize = arrMode(teamStats.map((team) => team.RobotInfo.RobotSize !== null ? team.RobotInfo.RobotSize : 0 ))

      const mcRobotHang = arrMode(teamStats.map((team) => team.RobotInfo.HangsFaster !== null ? team.RobotInfo.HangsFaster : 0))
      const mcRobotSpeaker = arrMode(teamStats.map((team) => team.RobotInfo.BetterSpeaker !== null ? team.RobotInfo.BetterSpeaker : 0))
      const mcRobotAmp = arrMode(teamStats.map((team) => team.RobotInfo.BetterAmp !== null ? team.RobotInfo.BetterAmp : 0))
      const mcRobotTrap = arrMode(teamStats.map((team) => team.RobotInfo.BetterTrap !== null ? team.RobotInfo.BetterTrap : 0))
      //custom robot stats
      const avgCycles = calcAvg(teamStats.map((team) => team.Teleop.AmountScored.Cycles !== null ? team.Teleop.AmountScored.Cycles : 0))
      const avgSpeaker = calcAvg(teamStats.map((team) => team.Teleop.PointsScored.SpeakerPoints !== null ? team.Scoring.PointsScored.SpeakerPoints : 0))
      const avgAmp = calcAvg(teamStats.map((team) => team.Teleop.PointsScored.Amp !== null ? team.Teleop.PointsScored.Amp : 0))
      //robot capabilities 
      const mcDefend = arrMode(teamStats.map(team => team.RobotInfo.CanDefend !== null ? team.RobotInfo.CanDefend : 0))
      //custom robot capabilities
      const mcUnderStage = arrMode(teamStats.map(team => team.RobotInfo.PassesUnderStage !== null ? team.RobotInfo.PassesUnderStage : 0))
      //internal calc
      const canHang = getCan(teamStats.map((team) => team.Teleop.EndGame.StageResult !== null ? team.Teleop.EndGame.StageResult : 0))
      //change calc
      const canSpeaker = getCan(teamStats.map((team) => team.Teleop.PointsScored.SpeakerPoints !== null ? team.Teleop.PointsScored.SpeakerPoints : 0))
      const canAmp = getCan(teamStats.map((team) => team.Teleop.PointsScored.AmpPoints !== null ? team.Teleop.PointScored.AmpPoints : 0))
      //change calc
      const canTrap = getCan(teamStats.map((team) => team.Teleop.EndGame.TrapScored !== null ? team.Teleop.EndGame.TrapScored : 0))
      //Auto
      const autoStart = arrMode(teamStats.map((team) => team.Autonomous.StartingPosition !== null ? team.Autonomous.StartingPosition : 0 ))
      //const mcScoring = arrMode((team) => team.Auto.ScoringElement !== null ? team.Auto.ScoringElement : 0 )
      //field info
      const mcStagePosition = arrMode(teamStats.map((team) => team.EndGame.StagePosition !== null ? team.EndGame.Position : 0 ))
      //penalties
      const fouls = teamStats.map(team => team.Penalties.Fouls)
      const techs = teamStats.map(team => team.Penalties.Techs)
      const yellowCards = teamStats.map(team => team.Penalties.PenaltiesComitted)
      const redCards = teamStats.map(team => team.Penalties.PenaltiesCommitted)
      const brokenRobots = teamStats.map(team => team.Penalties.PenaltiesCommitted)
    
      console.log(mcRobotSpeed)

      //const mcSpeed = modeSpeed(teamStats)

      const tableDataObj = {
        TeamNumber: team.TeamNumber,
        Matches: team.Matches,
        OPR: oprList[team.TeamNum] ? (oprList[team.TeamNum]).toFixed(2) : null,
        // Priorities: priorities.join(', '),
        // CCWM: ccwmList[team.TeamNum] ? (ccwmList[team.TeamNum]).toFixed(2) : null, 
        // AvgPoints: avgPoints !== 0 && isNaN(avgPoints) !== true ? `μ=${avgPoints}, σ=${calcDeviation(points, avgPoints)}` : '', 
        // AvgGridPoints: avgGridPoints !== 0 && isNaN(avgGridPoints) !== true ? `μ=${avgGridPoints}, σ=${calcDeviation(gridPoints, avgGridPoints)}` : '',
        // AvgCSPoints: avgCSPoints !== 0 && isNaN(avgCSPoints) !== true ? avgCSPoints : '',
        // AvgConePts: avgConePoints !== 0 && isNaN(avgConePoints) !== true ? `μ=${avgConePoints}, σ=${calcDeviation(conePts, avgConePoints)}` : '', 
        // AvgConeAcc: avgConeAcc !== 0 && isNaN(avgConeAcc) !== true ? `μ=${avgConeAcc}, σ=${calcDeviation(coneAcc, avgConeAcc)}` : '', 
        // AvgCubePts: avgCubePoints !== 0 && isNaN(avgCubePoints) !== true ? `μ=${avgCubePoints}, σ=${calcDeviation(cubePts, avgCubePoints)}` : '', 
        // AvgCubeAcc: avgCubeAcc !== 0 && isNaN(avgCubeAcc) !== true ? `μ=${avgCubeAcc}, σ=${calcDeviation(cubeAcc, avgCubeAcc)}` : '', 
        //DPR: dprList[team.TeamNum] ? (dprList[team.TeamNum]).toFixed(2) : null, 
        //Penalties: penalties.join(', '),

        // AvgUpper: upperGridPts,
        // AvgUpperAcc: upperGridAcc,
        // AvgMid: midGridPts, //for inner tables
        // AvgMidAcc: midGridAcc,
        // AvgLower: lowerGridPts,
        // AvgLowerAcc: lowerGridAcc,

        // AvgUpperConeAcc: upperConeAcc,
        // AvgMidConeAcc: midConeAcc,
        // AvgLowerConeAcc: lowerConeAcc,

        // AvgUpperConePts: upperConePts,
        // AvgMidConePts: midConePts,
        // AvgLowerConePts: lowerConePts,

        // AvgUpperCubeAcc: upperCubeAcc,
        // AvgMidCubeAcc: midCubeAcc,
        // AvgLowerCubeAcc: lowerCubeAcc,

        // AvgUpperCubePts: upperCubePts,
        // AvgMidCubePts: midCubePts,
        // AvgLowerCubePts: lowerCubePts,

        // NGridPoints: isNaN(rGridPoints) !== true ? rGridPoints : 0,
        // NConePoints: isNaN(rConePoints) !== true ? rConePoints : 0, 
        // NConeAccuracy: isNaN(rConeAcc) !== true ? rConeAcc : 0, //for sorts
        // NCubePoints: isNaN(rCubePoints) !== true ? rCubePoints : 0, 
        // NCubeAccuracy: isNaN(rCubeAcc) !== true ? rCubeAcc : 0,
        // NChargeStation: isNaN(rCSPoints) !== true ? rCSPoints : 0,

        //accessing same/initalized data for now//

        //==Robot Performance==/
        RobotSpeed: team.RobotSpeed,
        RobotStrength: team.RobotStrength,
        RobotSize: team.RobotSize,
        //custom//
        RobotHang: team.RobotHang,
        RobotSpeaker: team.RobotSpeaker,
        RobotAmp: team.RobotAmp,
        RobotTrap: team.RobotTrap,
        //===Stats==/ 
        AvgPoints: team.AvgPoints,
        AvgAutoPts: team.AvgAutoPts,
        //custom//
        AvgCycles: team.AvgCycles,
        AvgSpeaker: team.AvgSpeaker,
        AvgAmp: team.AvgAmp, 
        //======Capabilities======//
        CanDefend: team.CanDefend, //TBD
        //custom
        CanUnderStage: team.CanUnderStage,
        //determined interanally not from form dependent on presence of points
        CanHang: team.CanHang,
        CanSpeaker: team.CanSpeaker,
        CanAmp: team.CanAmp,
        CanTrap: team.CanTrap,
        //===auto==//
        AutoStart: team.AutoStart,
        //AutoCollide: team.AutoCollide,
        //MostCommonScoring: team.MostCommonScoring,
        //===Field RobotInfo==//
        //MostCommonScoredElement: team.MostCommonScoredElement,
        AutoStart: team.AutoStart,
        StagePosition: team.StagePosition,
        //===Penalties===//
        Fouls: team.Fouls, 
        Tech: team.Tech,
        YellowCard: team.YellowCard,
        RedCard: team.RedCard,
        BrokenRobot: team.BrokenRobot
      }
      return tableDataObj;
    })
  }
  catch(err) {
    console.log(err)
  }
  }

export { getTeams,getTeamsMatchesAndTableData, } 