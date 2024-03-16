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
      //console.log('teamMatchData: ', teamMatchData)
      const teamStats = teamMatchData.filter(x => x.Team === team.TeamNum)
      //general
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

      const avgTeleAmp = calcAvg(teamStats.map((team) => team.Teleop.PointsScored.AmpPoints !== null ? team.Teleop.PointsScored.AmpPoints : 0))
      const avgAutoAmp = calcAvg(teamStats.map((team) => team.Autonomous.PointsScored.AmpPoints !== null ? team.Autonomous.PointsScored.AmpPoints : 0))
      const avgAmp = (avgTeleAmp + avgAutoAmp) / 2

      const hangPoints = teamStats.map((team) => team.Teleop.Endgame.StageResult === "Onstage" ? 2 : 0)
      const avgHang = calcAvg(hangPoints.length === 0 ? [0] : hangPoints)

      //amount
      const avgMadeTeleSpeaker = calcAvg(teamStats.map((team) => team.Teleop.AmountScored.Speaker !== null ? team.Teleop.AmountScored.Speaker : 0))
      const avgMadeAutoSpeaker = calcAvg(teamStats.map((team) => team.Autonomous.AmountScored.Speaker !== null ? team.Autonomous.AmountScored.Speaker : 0))
      const avgMadeSpeaker = (avgMadeTeleSpeaker + avgMadeAutoSpeaker) / 2
      const avgMadeTeleAmp = calcAvg(teamStats.map((team) => team.Teleop.AmountScored.Amp !== null ? team.Teleop.AmountScored.Amp : 0))
      const avgMadeAutoAmp = calcAvg(teamStats.map((team) => team.Autonomous.AmountScored.Amp !== null ? team.Autonomous.AmountScored.Amp : 0))
      const avgMadeAmp = (avgMadeTeleAmp + avgMadeAutoAmp) / 2
      //robot capabilities 
      const canDefend = getCan(teamStats.map((team) => team.RobotInfo.CanDefend !== null ? team.RobotInfo.CanDefend : 0))
      //custom robot capabilities
      const canUnderStage = getCan(teamStats.map((team) => team.RobotInfo.PassesUnderStage !== null ? team.RobotInfo.PassesUnderStage : 0))
      //internal calc
      const canHang = getCan(teamStats.map((team) => team.Teleop.Endgame.StageResult !== null ? team.Teleop.Endgame.StageResult : 0))
      const canSpeaker = getCan(teamStats.map((team) => team.Teleop.PointsScored.SpeakerPoints !== null ? team.Teleop.PointsScored.SpeakerPoints : 0))
      const canAmp = getCan(teamStats.map((team) => team.Teleop.PointsScored.AmpPoints !== null ? team.Teleop.PointsScored.AmpPoints : 0))
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

      //reliable 
      const reliableRobotSpeed= getReliability(teamStats.map((team) => team.RobotInfo.RobotSpeed !== null ? team.RobotInfo.RobotSpeed : 'Average' ), mcRobotSpeed)
      const reliableRobotHang = getReliability(teamStats.map((team) => team.RobotInfo.HangRating !== null ? team.RobotInfo.HangRating : 'Average'), mcRobotHang)
      const reliableRobotSpeaker = getReliability(teamStats.map((team) => team.RobotInfo.SpeakerRating !== null ? team.RobotInfo.SpeakerRating : 'Average'), mcRobotSpeaker)
      const reliableRobotAmp = getReliability(teamStats.map((team) => team.RobotInfo.AmpRating !== null ? team.RobotInfo.AmpRating : 'Average'), mcRobotAmp)
      const reliableRobotTrap = getReliability(teamStats.map((team) => team.RobotInfo.TrapRating !== null ? team.RobotInfo.TrapRating : 'Average'), mcRobotTrap)
      const reliableDefense = getReliability(teamStats.map((team) => team.RobotInfo.CanDefend !== null ? team.RobotInfo.CanDefend : false), canDefend === 'yes')
      const reliableIntake = getReliability(teamStats.map((team) => team.RobotInfo.IntakeRating !== null ? team.RobotInfo.IntakeRating : 'Average'), mcIntakeRating)
      const reliableAlignment = getReliability(teamStats.map((team) => team.RobotInfo.LineupSpeed !== null ? team.RobotInfo.LineupSpeed : 'Average'), mcAlignmentSpeed)

      //grade
      const maxSpeaker = getMax(tableData.map(team => team.AvgSpeaker))
      const maxAmp = getMax(tableData.map(team => team.AvgAmp))
      const maxCycles = getMax(tableData.map(team => team.AvgCycles))
      const maxPts = getMax(tableData.map(team => team.AvgPoints))
      const maxAutoPts = getMax(tableData.map(team => team.AvgAutoPts))
      const maxHangPts = getMax(tableData.map(team => team.AvgHangPts))
      const maxSpeakerPts = getMax(tableData.map(team => team.AvgSpeakerPts))
      const maxAmpPts = getMax(tableData.map(team => team.AvgAmpPts))

      const rSpeaker = avgMadeSpeaker / maxSpeaker
      const rAmp = avgMadeAmp / maxAmp
      const rCycles = avgCycles / maxCycles
      const rPts = avgPoints / maxPts
      const rAutoPts = avgAutoPoints / maxAutoPts
      const rHang = avgHang / maxHangPts
      const rSpeakerPoints = avgSpeaker / maxSpeakerPts 
      const rAmpPts = avgAmp / maxAmpPts

      const tableDataObj = {
        TeamNumber: team.TeamNumber,
       // Matches: team.Matches,
        OPR: 1, //oprList[team.TeamNum] ? (oprList[team.TeamNum]).toFixed(2) : null,
        //==Robot Performance==/
        RobotSpeed: mcRobotSpeed === null ? '' : mcRobotSpeed + ' ' + (isNaN(reliableRobotSpeed) ? '' : reliableRobotSpeed + '%' ) ,
        RobotHang: (mcRobotHang === null ? '' : mcRobotHang) + ' ' + (isNaN(reliableRobotHang) ? '' : reliableRobotHang + '%'), 
        RobotSpeaker:(mcRobotSpeaker === null ? '' : mcRobotSpeaker) + ' ' + (isNaN(reliableRobotSpeaker) ? '' : reliableRobotSpeaker + '%'), //=== true ? 'Better': 'Worse'  + ' ' + (isNaN(reliableRobotSpeaker) ? '' : reliableRobotSpeaker), 
        RobotAmp: (mcRobotAmp === null ? '' : mcRobotAmp) + ' ' + (isNaN(reliableRobotAmp) ? '' : reliableRobotAmp + '%'), //=== true ? 'Better': 'Worse'  + ' ' + (isNaN(reliableRobotAmp) ? '' : reliableRobotAmp),
        RobotTrap: (mcRobotTrap === null ? '' : mcRobotTrap) + ' ' +  (isNaN(reliableRobotTrap) ? '' : reliableRobotTrap + '%'), //=== true ? 'Better': 'Worse'  + ' ' +  (isNaN(reliableRobotTrap) ? '' : reliableRobotTrap),
        IntakeRating: (mcIntakeRating === null ? '' : mcIntakeRating) + ' ' + (isNaN(reliableIntake) ? '' : reliableRobotTrap + '%'),
        AlignmentSpeed: (mcAlignmentSpeed === null ? '' : mcAlignmentSpeed) + ' ' + (isNaN(reliableAlignment) ? '' : reliableRobotTrap + '%'),
        //===Stats==/ 
        AvgPoints: isNaN(avgPoints) ? null : avgPoints,
        AvgAutoPts: isNaN(avgAutoPoints) ? null :  avgAutoPoints,
        AvgHangPts: isNaN(avgHang) ? null : avgHang,
        AvgSpeakerPts: isNaN(avgSpeaker) ? null : avgSpeaker,
        AvgAmpPts: isNaN(avgAmp) ? null : avgAmp,
        //custom//
        AvgCycles: isNaN(avgCycles) ? null : avgCycles,
        AvgSpeaker: isNaN(avgMadeSpeaker) ? null : avgMadeSpeaker,
        AvgAmp: isNaN(avgMadeAmp) ? null : avgMadeAmp, 
        //======Capabilities======//
        CanDefend: (canDefend === 'no' ? '' : canDefend)  + ' ' +  (isNaN(reliableDefense) || canDefend === "no" ? '' : reliableDefense + "%"), //TBD
        //custom
        CanUnderStage: canUnderStage  === 'no' ? '' : canUnderStage,
        //determined interanally not from form dependent on presence of points
        CanHang: canHang === 'no' ? '' : canHang,
        CanSpeaker: canSpeaker === 'no' ? '' : canSpeaker,
        CanAmp: canAmp === 'no' ? '' : canAmp,
        CanTrap: canTrap === 'no' ? '' : canTrap,
        //===auto==//
        AutoStart: mcAutoStart,
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
        NPts: isNaN(rPts) ? 0 : rPts,
        NAutoPts: isNaN(rAutoPts) ? 0 : rAutoPts,
        NHangPts: isNaN(rHang) ? 0 : rHang,
        NSpeakerPts: isNaN(rSpeakerPoints) ? 0 : rSpeakerPoints,
        NAmpPts: isNaN(rAmpPts) ? 0 : rAmpPts
      }
      return tableDataObj;
    })
  }
  catch(err) {
    console.log(err)
  }
  }

export { getTeams,getTeamsMatchesAndTableData, }