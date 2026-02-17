import { apigetMatchesForRegional} from "../../../api";
import { getTeamsInRegional, } from "../../../api/bluealliance";
import { apiGetTeam } from "../../../api";
import { arrMode, calcAvg, getReliability, getMatchesOfPenalty, getMax, getSummary } from "./CalculationUtils"
import { isSameTeam } from "../../../utils/teamId"

/* Runs with getTeamsInRegional to find and set teams to return an array of object teamNumbers  */
async function getTeams (regional) {

}
/* 
consolidates all calculations, averages, and sets the object for each team(row) and their properties(stats) 
*/
async function getTeamsMatchesAndTableData(teamNumbers, mtable, regional) {
    try {
    const tableData = mtable
    
    return teamNumbers.map(team => {

      //Robot Performance

      //custom robot stats

      //Auto

      //penalties

      //reliable 

      //grade
      const maxFuel = getMax(tableData.map(team => team.x)) // fix team.x

      const rPts = avgPoints / maxPts

      const rFuel = avgFuel / maxFuel

      const tableDataObj = {
        TeamNumber: team.TeamNumber,
        photo: team.photo,

       // Matches: team.Matches,
        //==Robot Performance==/
        RobotSpeed: mcRobotSpeed === null ? '' : mcRobotSpeed + ' ' + (isNaN(reliableRobotSpeed) ? '' : reliableRobotSpeed + '%' ),
        RobotHang: mcRobotHang === null ? '' : mcRobotHang + ' ' + (isNaN(reliableRobotEndgame) ? '' : reliableRobotEndgame + '%' ),
        //===Stats==/
        AvgPoints: isNaN(avgPoints) ? 0 : avgPoints,
        AvgFuel: isNaN(avgFuel) ? 0 : avgFuel,
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
        NPts: isNaN(rPts) ? 0 : rPts,

        NFuel: isNaN(rFuel) ? 0 : rFuel,
      }
      return tableDataObj;
    })
  }
  catch(err) {
    console.log(err)
  }
  }

export { getTeams,getTeamsMatchesAndTableData, }