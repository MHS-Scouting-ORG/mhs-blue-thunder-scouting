import { getMatchesForRegional} from "../../../api";
import { getTeamsInRegional, } from "../../../api/bluealliance";
import { arrMode, calcAvg, getCan, getReliability, getMatchesOfPenalty, getMax } from "./CalculationUtils"

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
        RobotSpeed: '',
        //custom for each year, scoring elements
        RobotHang: '',
        RobotSpeaker: '',
        RobotAmp: '',
        RobotTrap: '',
        //=======Stats=========//
        AvgPoints: 0,
        AvgAutoPts: 0,
        //custom//
        AvgCycles: 0,
        AvgSpeaker: 0,
        AvgAmp: 0, 
        //======Capabilities======//
        CanDefend: '',
        //custom
        CanUnderStage: '',
        //determined internally not from form dependent on presence of points
        CanHang: '',
        CanSpeaker: '',
        CanAmp: '',
        CanTrap: '',
        //======Auto====//
        AutoStart: 0,
        AutoCollide: '',
        //most common
        //===Field RobotInfo==//
        //AutoStart: '1',
        StagePosition: '',
        //===Penalties===//
        Fouls: 0,
        Tech: 0,
        YellowCard: '',
        RedCard: '',
        BrokenRobot: '',
        //reliability
        relRobotSpeed: '',
        relRobotHang: '',
        relRobotSpeaker: '',
        relRobotAmp: '',
        relRobotTrap: '',
        relRobotDefense: '',
        relRobotUnderStage: '',
        relRobotAutoStart: '',
        relRobotStagePos: '',

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

      const avgTeleSpeaker = calcAvg(teamStats.map((team) => team.Teleop.PointsScored.SpeakerPoints !== null ? team.Teleop.PointsScored.SpeakerPoints : 0))
      const avgAutoSpeaker = calcAvg(teamStats.map((team) => team.Autonomous.PointsScored.SpeakerPoints !== null ? team.Autonomous.PointsScored.SpeakerPoints : 0))
      const avgSpeaker = (avgTeleSpeaker + avgAutoSpeaker) / 2 

      const avgTeleAmp = calcAvg(teamStats.map((team) => team.Teleop.PointsScored.Amp !== null ? team.Teleop.PointsScored.Amp : 0))
      const avgAutoAmp = calcAvg(teamStats.map((team) => team.Autonomous.PointsScored.Amp !== null ? team.Autonomous.PointsScored.Amp : 0))
      const avgAmp = (avgTeleAmp + avgAutoAmp) / 2
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
      //field info
      const mcStagePosition = arrMode(teamStats.map((team) => team.EndGame.StagePosition !== null ? team.EndGame.Position : 0 ))
      //penalties
      const fouls = calcAvg(teamStats.map(team => team.Penalties.Fouls))
      const techs = calcAvg(teamStats.map(team => team.Penalties.Techs))
      const yellowCards = getMatchesOfPenalty(teamStats, 'YellowCard')
      const redCards = getMatchesOfPenalty(teamStats, 'RedCard')
      const brokenRobots = getMatchesOfPenalty(teamStats, 'BrokenRobot')

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

      //grade
      const maxSpeaker = getMax(tableData.map(team => team.AvgSpeaker))
      const maxAmp = getMax(tableData.map(team => team.AvgAmp))
      const maxCycles = getMax(tableData.map(team => team.AvgCycles))
      
      const rSpeaker = avgSpeaker / maxSpeaker
      const rAmp = avgAmp / maxAmp 
      const rCycles = avgCycles / maxCycles

      console.log(mcRobotSpeed) // test

      const tableDataObj = {
        TeamNumber: team.TeamNumber,
       // Matches: team.Matches,
        OPR: oprList[team.TeamNum] ? (oprList[team.TeamNum]).toFixed(2) : null,
        //==Robot Performance==/
        RobotSpeed: mcRobotSpeed,
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
        Disabled: disabledRobots,
        DQ: disqualifiedRobots,
        NoShow: noShowRobots,
        //reliability
        relRobotSpeed: reliableRobotSpeed,
        relRobotHang: reliableRobotHang,
        relRobotSpeaker: reliableRobotSpeaker,
        relRobotAmp: reliableRobotAmp,
        relRobotTrap: reliableRobotTrap,
        relRobotDefense: reliableDefense,
        relRobotUnderStage: reliableRobotUnderStage,
        relRobotAutoStart: reliableAutoStart,
        relRobotStagePos: reliableStagePosition,

        NSpeaker: rSpeaker,
        NAmp: rAmp,
        NCycles: rCycles,

      }
      return tableDataObj;
    })
  }
  catch(err) {
    console.log(err)
  }
  }

export { getTeams,getTeamsMatchesAndTableData, } 