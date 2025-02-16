import { apigetMatchesForRegional} from "../../../api";
import { getTeamsInRegional, } from "../../../api/bluealliance";
import { arrMode, calcAvg, getCan, getReliability, getMatchesOfPenalty, getMax, uniqueArr, getSummary } from "./CalculationUtils"

async function getTeams (regional) {
  try {
  const data = await getTeamsInRegional(regional)

     return data.map(obj => {
       const teamNumObj = {
        TeamNumber: obj.team_number,
        TeamNum: `frc${obj.team_number}`,
       }

       return teamNumObj
     })
  }
  catch(err){
   console.log(err)
  }
}

async function getTeamsMatchesAndTableData(teamNumbers, oprList, mtable, regional) {
    try {
    const data = await apigetMatchesForRegional(regional)
    
    const tableData = mtable

    return teamNumbers.map(team => {

      const teamMatchData = data.data.teamMatchesByRegional.items;
      const teamStats = teamMatchData.filter(x => x.Team === team.TeamNum)
      //console.log("teamStats", teamStats)
      //general
      const avgPoints = calcAvg(teamStats.map((team) => team.TotalPoints !== null ? team.TotalPoints : 0))
      const avgAutoPoints = calcAvg(teamStats.map((team) => team.Autonomous.PointsScored.Points !== null ? team.Autonomous.PointsScored.Points : 0))

      //Robot Performance
      const mcRobotSpeed = arrMode(teamStats.map((team) => team.RobotInfo.RobotSpeed !== null ? team.RobotInfo.RobotSpeed : 0 ))

      //custom robot stats
      const avgCycles = calcAvg(teamStats.map((team) => team.Teleop.AmountScored.Cycles !== null ? team.Teleop.AmountScored.Cycles : 0))
      const avgTeleCoral = calcAvg(teamStats.map((team) => team.Teleop.PointsScored.CoralPoints !== null ? team.Teleop.PointsScored.CoralPoints : 0))
      const avgAutoCoral = calcAvg(teamStats.map((team) => team.Autonomous.PointsScored.CoralPoints !== null ? team.Autonomous.PointsScored.CoralPoints : 0))
      const avgCoral = (avgTeleCoral + avgAutoCoral) / 2

      const avgTeleAlgae = calcAvg(teamStats.map((team) => team.Teleop.PointsScored.AlgaePoints !== null ? team.Teleop.PointsScored.AlgaePoints : 0))
      const avgAutoAlgae = calcAvg(teamStats.map((team) => team.Autonomous.PointsScored.AlgaePoints !== null ? team.Autonomous.PointsScored.AlgaePoints : 0))
      const avgAlgae = (avgTeleAlgae + avgAutoAlgae) / 2

      const avgEndgame = calcAvg(teamStats.map((team) => team.Teleop.PointsScored.EndgamePoints !== null ? team.Teleop.PointsScored.EndgamePoints : 0))

      //amount
      /* Coral Levels */
      const avgMadeTeleCoralL1 = calcAvg(teamStats.map((team) => team.Teleop.AmountScored.CoralL1 !== null ? team.Teleop.AmountScored.CoralL1 : 0))
      const avgMadeTeleCoralL2= calcAvg(teamStats.map((team) => team.Teleop.AmountScored.CoralL2 !== null ? team.Teleop.AmountScored.CoralL2 : 0))
      const avgMadeTeleCoralL3 = calcAvg(teamStats.map((team) => team.Teleop.AmountScored.CoralL3 !== null ? team.Teleop.AmountScored.CoralL3 : 0))
      const avgMadeTeleCoralL4 = calcAvg(teamStats.map((team) => team.Teleop.AmountScored.CoralL4 !== null ? team.Teleop.AmountScored.CoralL4 : 0))

      const avgMadeAutoCoralL1 = calcAvg(teamStats.map((team) => team.Autonomous.AmountScored.CoralL1 !== null ? team.Autonomous.AmountScored.CoralL1 : 0))
      const avgMadeAutoCoralL2 = calcAvg(teamStats.map((team) => team.Autonomous.AmountScored.CoralL2 !== null ? team.Autonomous.AmountScored.CoralL2 : 0))
      const avgMadeAutoCoralL3 = calcAvg(teamStats.map((team) => team.Autonomous.AmountScored.CoralL3 !== null ? team.Autonomous.AmountScored.CoralL3 : 0))
      const avgMadeAutoCoralL4 = calcAvg(teamStats.map((team) => team.Autonomous.AmountScored.CoralL4 !== null ? team.Autonomous.AmountScored.CoralL4 : 0))

      const avgMadeCoralL1 = (avgMadeTeleCoralL1 + avgMadeAutoCoralL1) / 2
      const avgMadeCoralL2 = (avgMadeTeleCoralL2 + avgMadeAutoCoralL2) / 2
      const avgMadeCoralL3 = (avgMadeTeleCoralL3 + avgMadeAutoCoralL3) / 2
      const avgMadeCoralL4 = (avgMadeTeleCoralL4 + avgMadeAutoCoralL4) / 2
      const avgMadeCoral = (avgMadeCoralL1 + avgMadeCoralL2 + avgMadeCoralL3 + avgMadeCoralL4) / 4

      /* Algae */
      const avgMadeTeleProcessor = calcAvg(teamStats.map((team) => team.Teleop.AmountScored.Processor !== null ? team.Teleop.AmountScored.Processor : 0))
      const avgMadeAutoProcessor = calcAvg(teamStats.map((team) => team.Autonomous.AmountScored.Processor !== null ? team.Autonomous.AmountScored.Processor : 0))

      const avgMadeProcessor = (avgMadeTeleProcessor + avgMadeAutoProcessor) / 2

      const avgMadeTeleNet = calcAvg(teamStats.map((team) => team.Teleop.AmountScored.Net !== null ? team.Teleop.AmountScored.Net : 0))
      const avgMadeAutoNet = calcAvg(teamStats.map((team) => team.Autonomous.AmountScored.Processor !== null ? team.Autonomous.AmountScored.Processor : 0))

      const avgMadeNet = (avgMadeTeleNet + avgMadeAutoNet) / 2

      const avgMadeAlgae = (avgMadeProcessor + avgMadeNet) / 2


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
      const reliableRobotSpeed = getReliability(teamStats.map((team) => team.RobotInfo.RobotSpeed !== null ? team.RobotInfo.RobotSpeed : 'Average' ), mcRobotSpeed)

      const evaluations = getSummary(teamStats)

      //grade
      const maxCoral = getMax(tableData.map(team => team.AvgCoral))
      const maxAlgae = getMax(tableData.map(team => team.AvgAlgae))
      const maxCycles = getMax(tableData.map(team => team.AvgCycles))
      const maxPts = getMax(tableData.map(team => team.AvgPoints))
      const maxAutoPts = getMax(tableData.map(team => team.AvgAutoPts))
      const maxEndgamePts = getMax(tableData.map(team => team.AvgEndgamePts))
      const maxCoralPts = getMax(tableData.map(team => team.AvgCoralPts))
      const maxAlgaePts = getMax(tableData.map(team => team.AvgAlgaePts))

      const rCoral = avgMadeCoral / maxCoral
      const rAlgae = avgMadeAlgae / maxAlgae
      const rCycles = avgCycles / maxCycles
      const rPts = avgPoints / maxPts
      const rAutoPts = avgAutoPoints / maxAutoPts
      const rEndgamePts = avgEndgame/ maxEndgamePts
      const rCoralPoints = avgCoral / maxCoralPts 
      const rAlgaePoints = avgAlgae / maxAlgaePts

      const tableDataObj = {
        TeamNumber: team.TeamNumber,
       // Matches: team.Matches,
        OPR: oprList[team.TeamNum] ? (oprList[team.TeamNum]).toFixed(2) : null,
        //==Robot Performance==/
        RobotSpeed: mcRobotSpeed === null ? '' : mcRobotSpeed + ' ' + (isNaN(reliableRobotSpeed) ? '' : reliableRobotSpeed + '%' ),
        //===Stats==/ 
        AvgPoints: isNaN(avgPoints) ? 0 : avgPoints,
        AvgAutoPts: isNaN(avgAutoPoints) ? 0 :  avgAutoPoints,
        AvgEndgamePts: isNaN(avgEndgame) ? 0 : avgEndgame,
        AvgCoralPts: isNaN(avgCoral) ? 0 : avgCoral,
        AvgAlgaePts: isNaN(avgAlgae) ? 0 : avgAlgae,
        //Made//
        AvgCycles: isNaN(avgCycles) ? 0 : avgCycles,
        AvgCoral: isNaN(avgMadeCoral) ? 0 : avgMadeCoral,
        AvgAlgae: isNaN(avgMadeAlgae) ? 0 : avgMadeAlgae,
        //===auto==//
        AutoStart: mcAutoStart,
        //===Penalties===//
        Fouls: isNaN(fouls) ? 0 : fouls, 
        Tech: isNaN(techs) ? 0 : techs,
        YellowCard: yellowCards,
        RedCard: redCards,
        BrokenRobot: brokenRobots,
        Disabled: disabledRobots,
        DQ: disqualifiedRobots,
        NoShow: noShowRobots,

        
        Evaluations: evaluations, 
        SumPriorities: team.SumPriorities, //grade

        NCoral: isNaN(rCoral) ? 0 : rCoral,
        NAlgae: isNaN(rAlgae) ? 0 : rAlgae,
        NCycles: isNaN(rCycles) ? 0 : rCycles,
        NPts: isNaN(rPts) ? 0 : rPts,
        NAutoPts: isNaN(rAutoPts) ? 0 : rAutoPts,
        NEndgamePts: isNaN(rEndgamePts) ? 0 : rEndgamePts,
        NCoralPts: isNaN(rCoralPoints) ? 0 : rCoralPoints,
        NAlgaePts: isNaN(rAlgaePoints) ? 0 : rAlgaePoints,

      }
      return tableDataObj;
    })
  }
  catch(err) {
    console.log(err)
  }
  }

export { getTeams,getTeamsMatchesAndTableData, }