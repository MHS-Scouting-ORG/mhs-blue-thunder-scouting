import { apigetMatchesForRegional, apiGetTeam, apiGetTeamsInRegional, toNotesTeamId } from "../../../api";
import { arrMode, calcAvg, getMatchesOfPenalty, getReliability, getMax, getSummary } from "./CalculationUtils"
import { isSameTeam } from "../../../utils/teamId"

const safeLower = (value) => String(value || '').toLowerCase()

const normalizeAutoActions = (autoStrat) => {
  if (Array.isArray(autoStrat)) return autoStrat.map((x) => String(x || '').trim())
  if (typeof autoStrat === 'string') return autoStrat.split(',').map((x) => x.trim()).filter(Boolean)
  return []
}

const getAutoPoints = (match) => {
  const actions = normalizeAutoActions(match?.Autonomous?.AutoStrat)

  const actionPoints = actions.reduce((sum, action) => {
    const value = safeLower(action)
    if (value.includes('scored') || value.includes('goal')) return sum + 8
    if (value.includes('left') || value.includes('starting') || value.includes('zone')) return sum + 3
    return sum
  }, 0)

  const autoHang = safeLower(match?.Autonomous?.AutoHang)
  const autoHangPoints = autoHang.includes('level1') ? 15 : 0

  return actionPoints + autoHangPoints
}

const getEndgamePoints = (match) => {
  const endgame = match?.Teleop?.Endgame || 'None'
  if (endgame === 'Level3') return 30
  if (endgame === 'Level2') return 20
  if (endgame === 'Level1') return 10
  return 0
}

const getTravelPoints = (match) => {
  return (match?.Teleop?.TravelMid || 0) * 2
}

const getShotPoints = (match) => {
  return Number(match?.RobotInfo?.BallsShot || 0)
}

/* Runs with getTeamsInRegional to find and set teams to return an array of object teamNumbers  */
async function getTeams (regional) {
  try {
  const data = await apiGetTeamsInRegional(regional)

     const teamsWithPhotos = await Promise.all(data.map(async obj => {
      const teamNumber = String(obj.team_number)
      const teamNumObj = {
       TeamNumber: obj.team_number,
       TeamNum: `frc${obj.team_number}`,
       TeamAttributes: {},
      }

       // Pull both base and notes records so table views can use data from both forms.
       try {
         const [dbTeam, notesTeam] = await Promise.all([
           apiGetTeam(teamNumber),
           apiGetTeam(toNotesTeamId(teamNumber)),
         ])

         const mergedAttrs = {
           ...(dbTeam?.TeamAttributes || {}),
           ...(notesTeam?.TeamAttributes || {}),
         }

         teamNumObj.TeamAttributes = mergedAttrs
         if (mergedAttrs?.Photo) {
           teamNumObj.photo = mergedAttrs.Photo
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

      const pointsByMatch = teamStats.map(m => getAutoPoints(m) + getEndgamePoints(m) + getTravelPoints(m) + getShotPoints(m))
      //console.log("teamStats", teamStats)
      //general (might not need avg points/avg auto pts since tba has)
      const avgPoints = calcAvg(pointsByMatch)
      const avgAutoPoints = calcAvg(teamStats.map(m => getAutoPoints(m)))

      //Robot Performance
      const mcRobotSpeed = arrMode(teamStats.map(m => m?.RobotInfo?.RobotSpeed ?? null))
      const mcRobotHang = arrMode(teamStats.map(m => m?.Teleop?.Endgame ?? null))
      const mcDriverSkill = arrMode(teamStats.map(m => m?.RobotInfo?.DriverSkill ?? null))
      const mcActiveStrat = arrMode(teamStats.map(m => m?.ActiveStrat ?? 'None' ))
      
      // For AutoStrat as array, get most common item
      const allAutoStrats = teamStats.flatMap(m => Array.isArray(m?.Autonomous?.AutoStrat) ? m.Autonomous.AutoStrat : [])
      const mcAutoStrat = arrMode(allAutoStrats.length > 0 ? allAutoStrats : ['None'])
      

      const avgEndgame = calcAvg(teamStats.map(m => getEndgamePoints(m)))
      //amount
  
      //Auto
      //const mcAutoStart = arrMode(teamStats.map(m => m?.Autonomous?.AutoStrat ?? 'None' ))

      //penalties
      const brokenRobots = getMatchesOfPenalty(teamStats, 'Broken')
      const disabledRobots = getMatchesOfPenalty(teamStats,"Disabled")
      const disqualifiedRobots = getMatchesOfPenalty(teamStats,"DQ")
      const noShowRobots = getMatchesOfPenalty(teamStats,"NoShow")
      const stuckOnBumpRobots = getMatchesOfPenalty(teamStats,"StuckOnBump")
      const stuckOnBallsRobots = getMatchesOfPenalty(teamStats,"StuckOnBalls")

      //reliable 
      const reliableRobotSpeed = getReliability(teamStats.map((team) => team?.RobotInfo?.RobotSpeed ?? 'Average'), mcRobotSpeed)
      const reliableRobotEndgame = getReliability(teamStats.map((team) => team?.Teleop?.Endgame ?? 'None'), mcRobotHang)

      const evaluations = getSummary(teamStats)
      const capabilities = Array.isArray(team?.TeamAttributes?.Capabilities)
        ? team.TeamAttributes.Capabilities
        : []
      const hasScoredAuto = teamStats.some((match) => {
        const actions = normalizeAutoActions(match?.Autonomous?.AutoStrat)
        return actions.some((action) => {
          const value = safeLower(action)
          return value.includes('scored') || value.includes('goal') || value.includes('left') || value.includes('zone')
        })
      })
      const canHangByForm = teamStats.some((match) => String(match?.Teleop?.Endgame || 'None') !== 'None')
      const canHangByNotes = String(team?.TeamAttributes?.MaxHang || 'None') !== 'None'
      const hasAutosByNotes = Number(team?.TeamAttributes?.NumAutos || 0) > 0

      //grade

      const maxPts = getMax(tableData.map(team => team.AvgPoints))
      const maxAutoPts = getMax(tableData.map(team => team.AvgAutoPts))
      const maxEndgamePts = getMax(tableData.map(team => team.AvgEndgamePts))



      const tableDataObj = {
        TeamNumber: team.TeamNumber,
        photo: team.photo,
        Matches: totalMatches,
        TeamMatches: teamStats,
        //==Robot Performance==/
        RobotSpeed: mcRobotSpeed === null ? '' : mcRobotSpeed + ' ' + (isNaN(reliableRobotSpeed) ? '' : reliableRobotSpeed + '%' ),
        DriverSkill: mcDriverSkill === null ? '' : mcDriverSkill,
        RobotHang: mcRobotHang === null ? '' : mcRobotHang + ' ' + (isNaN(reliableRobotEndgame) ? '' : reliableRobotEndgame + '%' ),
        //ActiveStrat: mcActiveStrat === 'None' ? '' : mcActiveStrat, needs to be fixed
       
        //===Stats==/ 
        AvgPoints: isNaN(avgPoints) ? 0 : avgPoints,

        //Made//
        AvgAutoPts: isNaN(avgAutoPoints) ? 0 : avgAutoPoints,
        AvgEndgamePts: isNaN(avgEndgame) ? 0 : avgEndgame,

        //===auto==//
        AutoStrat: mcAutoStrat,
        
        //===Penalties===//
        BrokenRobot: brokenRobots,
        Disabled: disabledRobots,
        DQ: disqualifiedRobots,
        NoShow: noShowRobots,
        StuckOnBump: stuckOnBumpRobots,
        StuckOnBalls: stuckOnBallsRobots,

        
        Evaluations: evaluations, 
        canHang: canHangByForm || canHangByNotes,
        canTrench: capabilities.includes('Trench'),
        hasAutos: hasScoredAuto || hasAutosByNotes,
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