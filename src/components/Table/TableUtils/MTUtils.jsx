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

    return teamNumbers.map(team => {
      //teamMatchesByRegional is left undefined
      const teamMatchData = data.data.teamMatchesByRegional.items;
      const teamStats = teamMatchData.filter(x => isSameTeam(x.Team, team.TeamNumber))
      const totalMatches = teamStats.length

      //const pointsByMatch = teamStats.map(m => scoreAuto(m) + scoreEndgame(m) + scoreTravel(m) + scoreBalls(m))
      //console.log("teamStats", teamStats)
      //general (might not need avg points/avg auto pts since tba has)
      //const avgPoints = calcAvg(pointsByMatch)
      //const avgAutoPoints = calcAvg(teamStats.map(m => scoreAuto(m)))

      //Robot Performance
      const mcRobotSpeed = arrMode(teamStats.map(m => m?.RobotInfo?.RobotSpeed ?? null))
      const mcRobotHang = arrMode(teamStats.map(m => m?.Teleop?.Endgame ?? null))
      //const mcShooterSpeed = arrMode(teamStats.map((team) => team.Teleop.RobotInfo.ShooterSpeed !== null ?  team.RobotInfo.RobotSpeed : null))

      //custom robot stats
      // (get from notes) const avgCycles = calcAvg(teamStats.map((team) => team.Teleop.AmountScored.Cycles !== null ? team.Teleop.AmountScored.Cycles : 0))

      //amount
  
      //Auto
      //const mcAutoStart = arrMode(teamStats.map(m => m?.Autonomous?.AutoStrat ?? 'None' ))

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
      const maxCoral = getMax(tableData.map(team => team.AvgCoral))
      const maxAlgae = getMax(tableData.map(team => team.AvgAlgae))
      const maxCycles = getMax(tableData.map(team => team.AvgCycles))
      const maxPts = getMax(tableData.map(team => team.AvgPoints))
      const maxAutoPts = getMax(tableData.map(team => team.AvgAutoPts))
      const maxEndgamePts = getMax(tableData.map(team => team.AvgEndgamePts))
      const maxCoralPts = getMax(tableData.map(team => team.AvgCoralPts))
      const maxAlgaePts = getMax(tableData.map(team => team.AvgAlgaePts))

      // //const rCoral = avgMadeCoral / maxCoral
      // //const rAlgae = avgMadeAlgae / maxAlgae
      // const rCycles = avgCycles / maxCycles
      // const rPts = avgPoints / maxPts

      const tableDataObj = {
        TeamNumber: team.TeamNumber,
        photo: team.photo,
       // Matches: team.Matches,
        //==Robot Performance==/
        RobotSpeed: mcRobotSpeed === null ? '' : mcRobotSpeed + ' ' + (isNaN(reliableRobotSpeed) ? '' : reliableRobotSpeed + '%' ),
        RobotHang: mcRobotHang === null ? '' : mcRobotHang + ' ' + (isNaN(reliableRobotEndgame) ? '' : reliableRobotEndgame + '%' ),
       
        //===Stats==/ 
        //AvgPoints: isNaN(avgPoints) ? 0 : avgPoints,

        //Made//
        //AvgCycles: isNaN(avgCycles) ? 0 : avgCycles,

        //===auto==//
        //AutoStart: mcAutoStart,

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
        //NPts: isNaN(rPts) ? 0 : 67,//rPts,

      }
      return tableDataObj;
    })
  }
  catch(err) {
    console.log(err)
    return []
  }
  }

export { getTeams,getTeamsMatchesAndTableData}