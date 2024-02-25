import { getMatchesForRegional} from "../../../api";
import { getTeamsInRegional, } from "../../../api/bluealliance";
import { arrMode, calcAvg, getCan, getReliability, getMatchesOfPenalty } from "./CalculationUtils"

async function getTeams (regional) {
  try {
  const data = await getTeamsInRegional(regional)

     return data.map(obj => {
       const teamNumObj = {
        TeamNumber: obj.team_number,
       // Matches: '',
        OPR: "",
        
        TeamNum: `frc${obj.team_number}`,
      
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
        AutoStart: '1',
        AutoCollide: 'Yes',
        //most common
       // MostCommonScoring: 'Amp',
        //===Field RobotInfo==//
        MostCommonScoredElement: "Amp",
        AutoStart: '1',
        StagePosition: 'Center',
        //===Penalties===//
        Fouls: '1',
        Tech: '1',
        YellowCard: '1',
        RedCard: '1',
        BrokenRobot: '1',
        //reliability
        rRobotSpeed: '1',
        rRobotHang: '1',
        rRobotSpeaker: '1',
        rRobotAmp: '1',
        rRobotTrap: '1',
        rRobotDefense: '1',
        rRobotUnderStage: '1',
        rRobotAutoStart: '1',
        rRobotStagePos: '1',

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

      const avgPoints = calcAvg(teamStats.map((team) => team.TotalPoints))
      const avgAutoPoints = calcAvg(teamStats.map((team) => team.Autonomous.PointsScored.Points))

      //Robot Performance
      const mcRobotSpeed = arrMode(teamStats.map((team) => team.RobotInfo.FasterThanUs !== null ? team.RobotInfo.FasterThanUs : 0 ))
      
      const mcRobotHang = arrMode(teamStats.map((team) => team.RobotInfo.HangsFaster !== null ? team.RobotInfo.HangsFaster : 0))
      const mcRobotSpeaker = arrMode(teamStats.map((team) => team.RobotInfo.BetterSpeaker !== null ? team.RobotInfo.BetterSpeaker : 0))
      const mcRobotAmp = arrMode(teamStats.map((team) => team.RobotInfo.BetterAmp !== null ? team.RobotInfo.BetterAmp : 0))
      const mcRobotTrap = arrMode(teamStats.map((team) => team.RobotInfo.BetterTrap !== null ? team.RobotInfo.BetterTrap : 0))
      //custom robot stats
      const avgCycles = calcAvg(teamStats.map((team) => team.Teleop.AmountScored.Cycles !== null ? team.Teleop.AmountScored.Cycles : 0))
      const avgSpeaker = calcAvg(teamStats.map((team) => team.Teleop.PointsScored.SpeakerPoints !== null ? team.Scoring.PointsScored.SpeakerPoints : 0))
      const avgAmp = calcAvg(teamStats.map((team) => team.Teleop.PointsScored.Amp !== null ? team.Teleop.PointsScored.Amp : 0))
      //robot capabilities 
      const mcDefend = arrMode(teamStats.map((team) => team.RobotInfo.CanDefend !== null ? team.RobotInfo.CanDefend : 0))
      //custom robot capabilities
      const mcUnderStage = arrMode(teamStats.map((team) => team.RobotInfo.PassesUnderStage !== null ? team.RobotInfo.PassesUnderStage : 0))
      //internal calc
      const canHang = getCan(teamStats.map((team) => team.Teleop.EndGame.StageResult !== null ? team.Teleop.EndGame.StageResult : 0))
      //change calc
      const canSpeaker = getCan(teamStats.map((team) => team.Teleop.PointsScored.SpeakerPoints !== null ? team.Teleop.PointsScored.SpeakerPoints : 0))
      const canAmp = getCan(teamStats.map((team) => team.Teleop.PointsScored.AmpPoints !== null ? team.Teleop.PointScored.AmpPoints : 0))
      //change calc
      const canTrap = getCan(teamStats.map((team) => team.Teleop.EndGame.TrapScored !== null ? team.Teleop.EndGame.TrapScored : 0))
      //Auto
      const mcAutoStart = arrMode(teamStats.map((team) => team.Autonomous.StartingPosition !== null ? team.Autonomous.StartingPosition : 0 ))
      //const mcScoring = arrMode((team) => team.Auto.ScoringElement !== null ? team.Auto.ScoringElement : 0 )
      //field info
      const mcStagePosition = arrMode(teamStats.map((team) => team.EndGame.StagePosition !== null ? team.EndGame.Position : 0 ))
      //penalties
      const fouls = teamStats.map(team => team.Penalties.Fouls)
      const techs = teamStats.map(team => team.Penalties.Techs)
      const yellowCards = teamStats.map(team => team.Penalties.PenaltiesComitted)
      const redCards = teamStats.map(team => team.Penalties.PenaltiesCommitted)
      const brokenRobots = teamStats.map(team => team.Penalties.PenaltiesCommitted)

      const disabledRobots = getMatchesOfPenalty(teamStats,"Disabled")
      const disqualifiedRobots = getMatchesOfPenalty(teamStats,"DQ")
      const noShowRobots = getMatchesOfPenalty(teamStats,"NoShow")
    
      const reliableRobotSpeed= getReliability(teamStats.map((team) => team.RobotInfo.FasterThanUs !== null ? team.RobotInfo.FasterThanUs : 0 ), mcRobotSpeed)
      const reliableRobotHang = getReliability(teamStats.map((team) => team.RobotInfo.HangsFaster !== null ? team.RobotInfo.HangsFaster : 0), mcRobotHang)
      const reliableRobotSpeaker = getReliability(teamStats.map((team) => team.RobotInfo.BetterSpeaker !== null ? team.RobotInfo.BetterSpeaker : 0), mcRobotSpeaker)
      const reliableRobotAmp = getReliability(teamStats.map((team) => team.RobotInfo.BetterAmp !== null ? team.RobotInfo.BetterAmp : 0), mcRobotAmp)
      const reliableRobotTrap = getReliability(teamStats.map((team) => team.RobotInfo.BetterTrap !== null ? team.RobotInfo.BetterTrap : 0), mcRobotTrap)
      const reliableDefense = getReliability(teamStats.map((team) => team.RobotInfo.CanDefend !== null ? team.RobotInfo.CanDefend : 0), mcDefend)
      const reliableRobotUnderStage = getReliability(teamStats.map((team) => team.RobotInfo.PassesUnderStage !== null ? team.RobotInfo.PassesUnderStage : 0), mcUnderStage)
      const reliableAutoStart = getReliability(teamStats.map((team) => team.Autonomous.StartingPosition !== null ? team.Autonomous.StartingPosition : 0 ), mcAutoStart)
      const reliableStagePosition = getReliability(teamStats.map((team) => team.EndGame.StagePosition !== null ? team.EndGame.Position : 0 ), mcStagePosition)

      console.log(mcRobotSpeed) // test

      const tableDataObj = {
        TeamNumber: team.TeamNumber,
       // Matches: team.Matches,
        OPR: oprList[team.TeamNum] ? (oprList[team.TeamNum]).toFixed(2) : null,
        //==Robot Performance==/
        RobotSpeed: mcRobotSpeed,
        //RobotStrength: mcRobotStrength,
        //RobotSize: te,
        //custom//
        RobotHang: mcRobotHang,
        RobotSpeaker: mcRobotSpeaker,
        RobotAmp: mcRobotAmp,
        RobotTrap: mcRobotTrap,
        //===Stats==/ 
        AvgPoints: avgPoints,
        AvgAutoPts: avgAutoPoints,
        //custom//
        AvgCycles: avgCycles,
        AvgSpeaker: avgSpeaker,
        AvgAmp: avgAmp, 
        //======Capabilities======//
        CanDefend: mcDefend, //TBD
        //custom
        CanUnderStage: mcUnderStage,
        //determined interanally not from form dependent on presence of points
        CanHang: canHang,
        CanSpeaker: canSpeaker,
        CanAmp: canAmp,
        CanTrap: canTrap,
        //===auto==//
        AutoStart: mcAutoStart,
        StagePosition: mcStagePosition,
        //===Penalties===//
        Fouls: fouls, 
        Tech: techs,
        YellowCard: yellowCards,
        RedCard: redCards,
        BrokenRobot: brokenRobots,
        //reliability
        rRobotSpeed: reliableRobotSpeed,
        rRobotHang: reliableRobotHang,
        rRobotSpeaker: reliableRobotSpeaker,
        rRobotAmp: reliableRobotAmp,
        rRobotTrap: reliableRobotTrap,
        rRobotDefense: reliableDefense,
        rRobotUnderStage: reliableRobotUnderStage,
        rRobotAutoStart: reliableAutoStart,
        rRobotStagePos: reliableStagePosition,
      }
      return tableDataObj;
    })
  }
  catch(err) {
    console.log(err)
  }
  }

export { getTeams,getTeamsMatchesAndTableData, } 