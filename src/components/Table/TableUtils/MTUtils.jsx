import { apigetMatchesForRegional, apiGetTeam, apiGetTeamsInRegional } from "../../../api";
import { arrMode, calcAvg, getMatchesOfPenalty, getReliability, getMax, getSummary } from "./CalculationUtils"
import { isSameTeam } from "../../../utils/teamId"

/* Runs with getTeamsInRegional to find and set teams to return an array of object teamNumbers  */
async function getTeams (regional) {
  try {
  const data = await apiGetTeamsInRegional(regional)

     const teamsWithPhotos = await Promise.all(data.map(async obj => {
      const teamNumObj = {
       TeamNumber: obj.team_number,
       TeamNum: `frc${obj.team_number}`,
      }

       // Try to get photo from database
       try {
         const dbTeam = await apiGetTeam(obj.team_number.toString());
         if (dbTeam?.TeamAttributes?.Photo) {
           teamNumObj.photo = dbTeam.TeamAttributes.Photo;
         }
       } catch (_) {
         // most teams dont have a photo yet so dont display error
       }

       return teamNumObj
     }))

     return teamsWithPhotos;
  }
  catch(err){
   console.log(err)
  }
}
/* 
consolidates all calculations, averages, and sets the object for each team(row) and their properties(stats) 
*/
async function getTeamsMatchesAndTableData(teamNumbers, mtable, regional) {
    try {
    const data = await apigetMatchesForRegional(regional)

    console.log("getTeamMatchesAndTableDataFunc", data)
    
    const tableData = mtable

    const scoreAuto = (match) => {
      const auto = match?.Autonomous?.AutoStrat || 'None'
      if (auto === 'Scored') return 8
      if (auto === 'WentMid' || auto === 'CrossedMid') return 2
      return 0
    }

    const scoreEndgame = (match) => {
      const endgame = match?.Teleop?.Endgame || 'None'
      if (endgame === 'Level1') return 30
      if (endgame === 'Level2') return 20
      if (endgame === 'Level3') return 10
      return 0
    }

    const scoreTravel = (match) => {
      return (match?.Teleop?.TravelMid || 0) * 2
    }

    const scoreBalls = (match) => {
      return Number(match?.RobotInfo?.BallsShot || 0)
    }

    return teamNumbers.map(team => {

      const teamMatchData = data.data.teamMatchesByRegional.items;
      const teamStats = teamMatchData.filter(x => isSameTeam(x.Team, team.TeamNumber))
      const totalMatches = teamStats.length

      const pointsByMatch = teamStats.map(m => scoreAuto(m) + scoreEndgame(m) + scoreTravel(m) + scoreBalls(m))
      //console.log("teamStats", teamStats)
      //general (might not need avg points/avg auto pts since tba has)
      const avgPoints = calcAvg(pointsByMatch)
      const avgAutoPoints = calcAvg(teamStats.map(m => scoreAuto(m)))

      //Robot Performance
      const mcRobotSpeed = arrMode(teamStats.map(m => m?.RobotInfo?.RobotSpeed ?? null))
      const mcRobotHang = arrMode(teamStats.map(m => m?.Teleop?.Endgame ?? null))
      //const mcShooterSpeed = arrMode(teamStats.map((team) => team.Teleop.RobotInfo.ShooterSpeed !== null ?  team.RobotInfo.RobotSpeed : null))


      //custom robot stats
      const avgCycles = calcAvg(teamStats.map(m => Number(m?.RobotInfo?.ShootingCycles || 0)))
      const avgTeleCoral = calcAvg(teamStats.map(m => Number(m?.RobotInfo?.BallsShot || 0)))
      const avgAutoCoral = calcAvg(teamStats.map(m => scoreAuto(m)))
      const avgCoral = avgTeleCoral

      const avgTeleAlgae = calcAvg(teamStats.map(m => Number(m?.Teleop?.TravelMid || 0)))
      const avgAutoAlgae = calcAvg(teamStats.map(m => Number(m?.Autonomous?.TravelMid || 0)))
      const avgAlgae = (avgTeleAlgae + avgAutoAlgae) / 2

      const avgEndgame = calcAvg(teamStats.map(m => scoreEndgame(m)))
      //amount
      /* Coral Levels */
      const avgMadeTeleCoralL1 = avgTeleCoral
      const avgMadeTeleCoralL2= 0
      const avgMadeTeleCoralL3 = 0
      const avgMadeTeleCoralL4 = 0

      const avgMadeAutoCoralL1 = avgAutoCoral
      const avgMadeAutoCoralL2 = 0
      const avgMadeAutoCoralL3 = 0
      const avgMadeAutoCoralL4 = 0

      const avgMadeCoralL1 = (avgMadeTeleCoralL1 + avgMadeAutoCoralL1) / 2
      const avgMadeCoralL2 = (avgMadeTeleCoralL2 + avgMadeAutoCoralL2) / 2
      const avgMadeCoralL3 = (avgMadeTeleCoralL3 + avgMadeAutoCoralL3) / 2
      const avgMadeCoralL4 = (avgMadeTeleCoralL4 + avgMadeAutoCoralL4) / 2
      const avgMadeCoral = (avgMadeCoralL1 + avgMadeCoralL2 + avgMadeCoralL3 + avgMadeCoralL4) / 4

      /* Algae */
      const avgMadeTeleProcessor = avgTeleAlgae
      const avgMadeAutoProcessor = avgAutoAlgae

      const avgMadeProcessor = (avgMadeTeleProcessor + avgMadeAutoProcessor) / 2

      const avgMadeTeleNet = 0
      const avgMadeAutoNet = 0

      const avgMadeNet = (avgMadeTeleNet + avgMadeAutoNet) / 2

      const avgMadeAlgae = (avgMadeProcessor + avgMadeNet) / 2


      //Auto
      const mcAutoStart = arrMode(teamStats.map(m => m?.Autonomous?.AutoStrat ?? 'None' ))

      //penalties
      const fouls = calcAvg(teamStats.map(m => m?.Penalties?.Fouls ?? 0))
      const techs = calcAvg(teamStats.map(m => m?.Penalties?.Tech ?? 0))
      const yellowCards = getMatchesOfPenalty(teamStats, 'YellowCard')
      const redCards = getMatchesOfPenalty(teamStats, 'RedCard')
      const brokenRobots = getMatchesOfPenalty(teamStats, 'Broken')

      const disabledRobots = getMatchesOfPenalty(teamStats,"Disabled")
      const disqualifiedRobots = getMatchesOfPenalty(teamStats,"DQ")
      const noShowRobots = getMatchesOfPenalty(teamStats,"NoShow")

      //reliable 
      const reliableRobotSpeed = getReliability(teamStats.map((team) => team?.RobotInfo?.RobotSpeed ?? 'Average'), mcRobotSpeed)
      const reliableRobotEndgame = getReliability(teamStats.map((team) => team?.Teleop?.Endgame ?? 'None'), mcRobotHang)

      const evaluations = getSummary(teamStats)

      //grade
      const maxCoral = getMax(tableData.map(team => team.AvgCoral)) || 1
      const maxAlgae = getMax(tableData.map(team => team.AvgAlgae)) || 1
      const maxCycles = getMax(tableData.map(team => team.AvgCycles)) || 1
      const maxPts = getMax(tableData.map(team => team.AvgPoints)) || 1
      const maxAutoPts = getMax(tableData.map(team => team.AvgAutoPts)) || 1
      const maxEndgamePts = getMax(tableData.map(team => team.AvgEndgamePts)) || 1
      const maxCoralPts = getMax(tableData.map(team => team.AvgCoralPts)) || 1
      const maxAlgaePts = getMax(tableData.map(team => team.AvgAlgaePts)) || 1

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
        photo: team.photo,
        Matches: totalMatches,
        OPR: 0,
        //==Robot Performance==/
        RobotSpeed: mcRobotSpeed === null ? '' : mcRobotSpeed + ' ' + (isNaN(reliableRobotSpeed) ? '' : reliableRobotSpeed + '%' ),
        RobotHang: mcRobotHang === null ? '' : mcRobotHang + ' ' + (isNaN(reliableRobotEndgame) ? '' : reliableRobotEndgame + '%' ),
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
        /* Grade */
        SumPriorities: team.SumPriorities,
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
    return []
  }
  }

export { getTeams,getTeamsMatchesAndTableData, }