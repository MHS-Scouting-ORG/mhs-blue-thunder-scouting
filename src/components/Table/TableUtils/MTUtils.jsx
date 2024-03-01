import { getMatchesForRegional} from "../../../api";
import { getTeamsInRegional, } from "../../../api/bluealliance";
import { arrMode, calcAvg, getCan, getReliability, getMatchesOfPenalty, getMax, calcColumnSort } from "./CalculationUtils"

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
    console.log("getTeamsMatchesAndTableData: ", data)

    const tableData = mtable

    return teamNumbers.map(team => {

      const teamMatchData = data.data.teamMatchesByRegional.items;
      //console.log('teamMatchData: ', teamMatchData)
      const teamStats = teamMatchData.filter(x => x.Team === team.TeamNum)

      const avgPoints = calcAvg(teamStats.map((team) => team.TotalPoints !== null ? team.TotalPoints : 0))
      const avgAutoPoints = calcAvg(teamStats.map((team) => team.Autonomous.PointsScored.Points !== null ? team.Autonomous.PointsScored.Points : 0))

      //Robot Performance
      const mcRobotSpeed = arrMode(teamStats.map((team) => team.RobotInfo.RobotSpeed !== null ? team.RobotInfo.RobotSpeed : 0 ))
      const mcRobotHang = arrMode(teamStats.map((team) => team.RobotInfo.HangRating !== null ? team.RobotInfo.HangRating : 0))
      const mcRobotSpeaker = arrMode(teamStats.map((team) => team.RobotInfo.SpeakerRating !== null ? team.RobotInfo.SpeakerRating : 0))
      const mcRobotAmp = arrMode(teamStats.map((team) => team.RobotInfo.AmpRating !== null ? team.RobotInfo.AmpRating : 0))
      const mcRobotTrap = arrMode(teamStats.map((team) => team.RobotInfo.TrapRating !== null ? team.RobotInfo.TrapRating : 0))
      const mcIntakeRating = arrMode(teamStats.map((team) => team.RobotInfo.IntakeRating !== null ? team.RobotInfo.IntakeRating : 0))
      const mcAlignmentSpeed = arrMode(teamStats.map((team) => team.RobotInfo.LineupSpeed !== null ? team.RobotInfo.LineupSpeed : 0))
      //custom robot stats
      const avgCycles = calcAvg(teamStats.map((team) => team.Teleop.AmountScored.Cycles !== null ? team.Teleop.AmountScored.Cycles : 0))
      const avgTeleSpeaker = calcAvg(teamStats.map((team) => team.Teleop.PointsScored.SpeakerPoints !== null ? team.Teleop.PointsScored.SpeakerPoints : 0))
      const avgAutoSpeaker = calcAvg(teamStats.map((team) => team.Autonomous.PointsScored.SpeakerPoints !== null ? team.Autonomous.PointsScored.SpeakerPoints : 0))
      const avgSpeaker = (avgTeleSpeaker + avgAutoSpeaker) / 2 
      const avgTeleAmp = calcAvg(teamStats.map((team) => team.Teleop.PointsScored.Amp !== null ? team.Teleop.PointsScored.Amp : 0))
      const avgAutoAmp = calcAvg(teamStats.map((team) => team.Autonomous.PointsScored.Amp !== null ? team.Autonomous.PointsScored.Amp : 0))
      const avgAmp = (avgTeleAmp + avgAutoAmp) / 2
      //robot capabilities 
      const mcDefend = getCan(teamStats.map((team) => team.RobotInfo.CanDefend !== null ? team.RobotInfo.CanDefend : 0))
      //custom robot capabilities
      const mcUnderStage = getCan(teamStats.map((team) => team.RobotInfo.PassesUnderStage !== null ? team.RobotInfo.PassesUnderStage : 0))
      //internal calc
      const canHang = getCan(teamStats.map((team) => team.Teleop.Endgame.StageResult !== null ? team.Teleop.Endgame.StageResult : 0))
      //change calc
      const canSpeaker = getCan(teamStats.map((team) => team.Teleop.PointsScored.SpeakerPoints !== null ? team.Teleop.PointsScored.SpeakerPoints : 0))
      const canAmp = getCan(teamStats.map((team) => team.Teleop.PointsScored.AmpPoints !== null ? team.Teleop.PointsScored.AmpPoints : 0))
      //change calc
      const canTrap = getCan(teamStats.map((team) => team.Teleop.Endgame.TrapScored !== null ? team.Teleop.Endgame.TrapScored : 0))
      //Auto
      const mcAutoStart = arrMode(teamStats.map((team) => team.Autonomous.StartingPosition !== null ? team.Autonomous.StartingPosition : 0 ))
      //penalties
      const fouls = calcAvg(teamStats.map(team => team.Penalties.Fouls))
      const techs = calcAvg(teamStats.map(team => team.Penalties.Techs))
      const yellowCards = getMatchesOfPenalty(teamStats, 'YellowCard')
      const redCards = getMatchesOfPenalty(teamStats, 'RedCard')
      const brokenRobots = getMatchesOfPenalty(teamStats, 'Broken')

      const disabledRobots = getMatchesOfPenalty(teamStats,"Disabled")
      const disqualifiedRobots = getMatchesOfPenalty(teamStats,"DQ")
      const noShowRobots = getMatchesOfPenalty(teamStats,"NoShow")

      const reliableRobotSpeed= getReliability(teamStats.map((team) => team.RobotInfo.FasterThanUs !== null ? team.RobotInfo.FasterThanUs : 0 ), mcRobotSpeed)
      const reliableRobotHang = getReliability(teamStats.map((team) => team.RobotInfo.HangsFaster !== null ? team.RobotInfo.HangsFaster : 0), mcRobotHang)
      const reliableRobotSpeaker = getReliability(teamStats.map((team) => team.RobotInfo.BetterSpeaker !== null ? team.RobotInfo.BetterSpeaker : 0), mcRobotSpeaker)
      const reliableRobotAmp = getReliability(teamStats.map((team) => team.RobotInfo.BetterAmp !== null ? team.RobotInfo.BetterAmp : 0), mcRobotAmp)
      const reliableRobotTrap = getReliability(teamStats.map((team) => team.RobotInfo.BetterTrap !== null ? team.RobotInfo.BetterTrap : 0), mcRobotTrap)
      const reliableDefense = getReliability(teamStats.map((team) => team.RobotInfo.CanDefend !== null ? team.RobotInfo.CanDefend : 0), mcDefend)
     /// const reliableStagePosition = getReliability(teamStats.map((team) => team.Endgame.StagePosition !== null ? team.Endgame.Position : 0 ), mcStagePosition)

      //grade
      const maxSpeaker = getMax(tableData.map(team => team.AvgSpeaker))
      const maxAmp = getMax(tableData.map(team => team.AvgAmp))
      const maxCycles = getMax(tableData.map(team => team.AvgCycles))

      const rSpeaker = avgSpeaker / maxSpeaker
      const rAmp = avgAmp / maxAmp
      const rCycles = avgCycles / maxCycles
      //console.log(avgPoints)
      //console.log(isNaN(avgPoints) ? null : avgPoints)

      const tableDataObj = {
        TeamNumber: team.TeamNumber,
       // Matches: team.Matches,
        OPR: oprList[team.TeamNum] ? (oprList[team.TeamNum]).toFixed(2) : null,
        //==Robot Performance==/
        RobotSpeed: mcRobotSpeed === true ? 'Better': 'Worse' + ' ' + (isNaN(reliableRobotSpeed) ? '' : reliableRobotSpeed),
        //custom//
        RobotHang: mcRobotHang === true ? 'Better': 'Worse' + ' ' + (isNaN(reliableRobotHang) ? '' : reliableRobotHang),
        RobotSpeaker: mcRobotSpeaker === true ? 'Better': 'Worse'  + ' ' + (isNaN(reliableRobotSpeaker) ? '' : reliableRobotSpeaker), 
        RobotAmp: mcRobotAmp === true ? 'Better': 'Worse'  + ' ' + (isNaN(reliableRobotAmp) ? '' : reliableRobotAmp),
        RobotTrap: mcRobotTrap === true ? 'Better': 'Worse'  + ' ' +  (isNaN(reliableRobotTrap) ? '' : reliableRobotTrap),
        IntakeRating: mcIntakeRating,
        AlignmentSpeed: mcAlignmentSpeed,
        //===Stats==/ 
        AvgPoints: isNaN(avgPoints) ? null : avgPoints,
        AvgAutoPts: isNaN(avgAutoPoints) ? null :  avgAutoPoints,
        //custom//
        AvgCycles: isNaN(avgCycles) ? null : avgCycles,
        AvgSpeaker: isNaN(avgSpeaker) ? null : avgSpeaker,
        AvgAmp: isNaN(avgAmp) ? null : avgAmp, 
        //======Capabilities======//
        CanDefend: mcDefend  + ' ' +  (isNaN(reliableDefense) ? '' : reliableDefense), //TBD
        //custom
        CanUnderStage: mcUnderStage,
        //determined interanally not from form dependent on presence of points
        CanHang: canHang,
        CanSpeaker: canSpeaker,
        CanAmp: canAmp,
        CanTrap: canTrap,
        //===auto==//
        AutoStart: mcAutoStart,
        //StagePosition: mcStagePosition,
        //===Penalties===//
        Fouls: isNaN(fouls) ? null : fouls, 
        Tech: isNaN(techs) ? null : techs,
        YellowCard: yellowCards,
        RedCard: redCards,
        BrokenRobot: brokenRobots,
        Disabled: disabledRobots,
        DQ: disqualifiedRobots,
        NoShow: noShowRobots,

        SumPriorities: team.SumPriorities,


        NSpeaker: isNaN(rSpeaker) ? 0 : rSpeaker,
        NAmp: isNaN(rAmp) ? 0 : rAmp,
        NCycles: isNaN(rCycles) ? 0 : rCycles,

      }
      return tableDataObj;
    })
  }
  catch(err) {
    console.log(err)
  }
  }

export { getTeams,getTeamsMatchesAndTableData, }