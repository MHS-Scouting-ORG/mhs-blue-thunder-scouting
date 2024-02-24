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