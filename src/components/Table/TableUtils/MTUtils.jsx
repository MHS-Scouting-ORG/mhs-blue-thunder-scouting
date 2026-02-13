import { apigetMatchesForRegional} from "../../../api";
import { getTeamsInRegional, } from "../../../api/bluealliance";
import { apiGetTeam } from "../../../api";
import { arrMode, calcAvg, getReliability, getMatchesOfPenalty, getMax, getSummary } from "./CalculationUtils"
import { isSameTeam } from "../../../utils/teamId"

/* Runs with getTeamsInRegional to find and set teams to return an array of object teamNumbers  */
async function getTeams (regional) {
  try {
  const data = await getTeamsInRegional(regional)

     const teamsWithPhotos = await Promise.all(data.map(async obj => {
      const teamNumObj = {
       TeamNumber: obj.team_number,
       TeamNum: `frc${obj.team_number}`,
      }

       // Try to get photo from database
       try {
         const dbTeam = await apiGetTeam(obj.team_number.toString());
         if (dbTeam.data.getTeam?.photo) {
           teamNumObj.photo = dbTeam.data.getTeam.photo;
         }
       } catch (err) {
         console.log(`No photo found for team ${obj.team_number}`);
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

      const teamMatchData = data.data.teamMatchesByRegional.items;
      const teamStats = teamMatchData.filter(x => isSameTeam(x.Team, team.TeamNumber))
      //console.log("teamStats", teamStats)
      //general (might not need avg points/avg auto pts since tba has)
      const avgPoints = calcAvg(teamStats.map((team) => team.TotalPoints !== null ? team.TotalPoints : 0))
      const avgAutoPoints = calcAvg(teamStats.map((team) => team.Autonomous.PointsScored.Points !== null ? team.Autonomous.PointsScored.Points : 0))

      //Robot Performance
      const mcRobotSpeed = arrMode(teamStats.map((team) => team.RobotInfo.RobotSpeed !== null ? team.RobotInfo.RobotSpeed : null ))
      const mcRobotHang = arrMode(teamStats.map((team) => team.Teleop.Endgame.EndGameResult !== null ?  team.Teleop.Endgame.EndGameResult : null))
      const test=null
      //const mcShooterSpeed = arrMode(teamStats.map((team) => team.Teleop.RobotInfo.ShooterSpeed !== null ?  team.RobotInfo.RobotSpeed : null))

      // Todo Change all the old scoring methods to new, also change it in teamStats.jsx as it does not match up in
      //custom robot stats
      const crossMid = calcAvg(teamStats.map((team) => team !== null ? team : 0))
      const fuelCap = calcAvg(teamStats.map((team) => team !== null ? team : 0))
      const avgFuel = (fuelCap * crossMid)

      const hangLevel = calcAvg(teamStats.map((team) => team !== null? team : 0))
      const multiHang = calcAvg(teamStats.map((team) => team !== null? team : 0))

      //Auto
      const mcAutoStart = arrMode(teamStats.map((team) => team.Autonomous.StartingPosition !== null ? team.Autonomous.StartingPosition : 0 ))

      //penalties
      const fouls = calcAvg(teamStats.map(team => team.Penalties.Fouls))
      const techs = calcAvg(teamStats.map(team => team.Penalties.Tech))
      const yellowCards = getMatchesOfPenalty(teamStats, 'YellowCard')
      const redCards = getMatchesOfPenalty(teamStats, 'RedCard')
      const brokenRobots = getMatchesOfPenalty(teamStats, 'Broken')

      const disabledRobots = getMatchesOfPenalty(teamStats,"Disabled")
      const disqualifiedRobots = getMatchesOfPenalty(teamStats,"DQ")
      const noShowRobots = getMatchesOfPenalty(teamStats,"NoShow")

      //reliable 
      const reliableRobotSpeed = getReliability(teamStats.map((team) => team.RobotInfo.RobotSpeed !== null ? team.RobotInfo.RobotSpeed : 'Average' ), mcRobotSpeed)
      const reliableRobotEndgame = getReliability(teamStats.map((team) => team.Teleop.Endgame.EndGameResult !== null ? team.Teleop.Endgame.EndGameResult : 'Cannot'), mcRobotHang)

      const evaluations = getSummary(teamStats)

      //grade
      const maxCoral = getMax(tableData.map(team => team.AvgCoral))

      const rPts = avgPoints / maxPts
      const rFuel = smoteihgn / other
      const rHang = fhfhfh / jdjdrhf
      //////Fix the top ... whatever it was

      const tableDataObj = {
        TeamNumber: team.TeamNumber,
        photo: team.photo,
        // Matches: team.Matches,


        //==Robot Performance==/
        RobotSpeed: mcRobotSpeed === null ? '' : mcRobotSpeed + ' ' + (isNaN(reliableRobotSpeed) ? '' : reliableRobotSpeed + '%' ),
        RobotHang: mcRobotHang === null ? '' : mcRobotHang + ' ' + (isNaN(reliableRobotEndgame) ? '' : reliableRobotEndgame + '%' ),
        //===Stats==/ 
        AvgPoints: isNaN(avgPoints) ? 0 : avgPoints,
        AvgFuelPts: isNaN(avgFuel) ? 0 : avgFuel,
        //Made//
        AvgCycles: isNaN(avgCycles) ? 0 : avgCycles,

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

        NAlgaePts: isNaN(rAlgaePoints) ? 0 : rAlgaePoints,

        // NHangLevel: isNaN(),
        // NMultiHang:,
        // NfuelCap:,
        // NCrossMid:,
        NPts: isNaN(rPts) ? 0 : rPts,

      }
      return tableDataObj;
    })
  }
  catch(err) {
    console.log(err)
  }
  }

export { getTeams,getTeamsMatchesAndTableData, }