import { apiGetTeamsInRegional, apiListTeams, apiGetCachedStatboticsTeamEventPrediction, apiWarmStatboticsTeamEventPredictions, toNotesTeamId } from "../../../api";
import { arrMode, calcAvg, getMatchesOfPenalty, getReliability, getSummary } from "./CalculationUtils"
import { getShooterTypeFromAttributes } from "../../../utils/shooterType";
import { getHistoricalQualificationMatches, getMatchesForRegionalBucket, getPreferredScoutingMatches, hasCurrentRegionalScoutData } from '../../../utils/teamMatchHistory';

const safeLower = (value) => String(value || '').toLowerCase()

const normalizeAutoActions = (autoStrat) => {
  if (Array.isArray(autoStrat)) return autoStrat.map((x) => String(x || '').trim())
  if (typeof autoStrat === 'string') return autoStrat.split(',').map((x) => x.trim()).filter(Boolean)
  return []
}

const isAutoMobilityAction = (value) => {
  return value.includes('movedinauto') || value.includes('moved') || value.includes('left') || value.includes('starting') || value.includes('zone')
}

const getAutoPoints = (match) => {
  const actions = normalizeAutoActions(match?.Autonomous?.AutoStrat)

  const actionPoints = actions.reduce((sum, action) => {
    const value = safeLower(action)
    if (value.includes('scored') || value.includes('goal')) return sum + 8
    if (isAutoMobilityAction(value)) return sum + 3
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

const EMPTY_STATBOTICS_PREDICTION = {
  statboticsPredictedWins: 0,
  statboticsPredictedLosses: 0,
  statboticsWinRate: 0,
  statboticsScore: 0,
  statboticsRank: 0,
  statboticsEPA: 0,
  statboticsAutoEPA: 0,
}

/* Runs with getTeamsInRegional to find and set teams to return an array of object teamNumbers  */
async function getTeams (regional) {
  try {
  const [data, listTeamsResponse] = await Promise.all([
    apiGetTeamsInRegional(regional),
    apiListTeams(),
  ])

     const allTeamEntries = listTeamsResponse?.data?.listTeams?.items || []
     const teamEntriesById = new Map(
      allTeamEntries
        .map((entry) => [String(entry?.id || '').trim(), entry])
        .filter(([id]) => Boolean(id))
     )

     const teamsWithPhotos = await Promise.all(data.map(async obj => {
      const teamNumber = String(obj.team_number)
      const teamNumObj = {
       TeamNumber: obj.team_number,
       TeamNum: `frc${obj.team_number}`,
       TeamAttributes: {},
         Regionals: [],
      }

       const dbTeam = teamEntriesById.get(teamNumber)
       const notesTeam = teamEntriesById.get(toNotesTeamId(teamNumber))

       const mergedAttrs = {
         ...(dbTeam?.TeamAttributes || {}),
         ...(notesTeam?.TeamAttributes || {}),
       }

       teamNumObj.TeamAttributes = mergedAttrs
       teamNumObj.Regionals = Array.isArray(dbTeam?.Regionals)
         ? dbTeam.Regionals
         : (dbTeam?.Regionals ? [dbTeam.Regionals] : [])
       if (mergedAttrs?.Photo) {
         teamNumObj.photo = mergedAttrs.Photo
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
async function getTeamsMatchesAndTableData(teamNumbers, mtable, regional, onStatboticsUpdate) {  
  try {
    const buildTableRows = (statboticsByTeam) => teamNumbers.map(team => {
      const teamStats = getPreferredScoutingMatches(team, regional)
      const currentRegionalMatches = getMatchesForRegionalBucket(team, regional)
      const historicalTeamMatches = getHistoricalQualificationMatches(team, regional)
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
      const mcDefenseEffectiveness = arrMode(teamStats.map(m => m?.RobotInfo?.DefenseEffectiveness ?? null))
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
      const hasAutonomousActivity = teamStats.some((match) => {
        const actions = normalizeAutoActions(match?.Autonomous?.AutoStrat)
        return actions.some((action) => {
          const value = safeLower(action)
          return value.includes('scored') || value.includes('goal') || isAutoMobilityAction(value)
        })
      })
      const canHangByForm = teamStats.some((match) => String(match?.Teleop?.Endgame || 'None') !== 'None')
      const canHangByNotes = String(team?.TeamAttributes?.MaxHang || 'None') !== 'None'
      const hasAutosByNotes = Number(team?.TeamAttributes?.NumAutos || 0) > 0
      const shooterType = getShooterTypeFromAttributes(team?.TeamAttributes)

      //grade

      const statboticsPrediction = statboticsByTeam.get(String(team.TeamNumber)) || EMPTY_STATBOTICS_PREDICTION
      const tableDataObj = {
        TeamNumber: team.TeamNumber,
        photo: team.photo,
        Matches: totalMatches,
        TeamMatches: teamStats,
        CurrentRegionalMatches: currentRegionalMatches,
        HistoricalTeamMatches: historicalTeamMatches,
        CurrentRegionalMatchCount: currentRegionalMatches.length,
        HistoricalMatchCount: historicalTeamMatches.length,
        HasCurrentRegionalScoutData: hasCurrentRegionalScoutData(team, regional),
        StatboticsPredictedWins: statboticsPrediction.statboticsPredictedWins || 0,
        StatboticsPredictedLosses: statboticsPrediction.statboticsPredictedLosses || 0,
        StatboticsWinRate: statboticsPrediction.statboticsWinRate || 0,
        StatboticsScore: statboticsPrediction.statboticsScore || 0,
        StatboticsRank: statboticsPrediction.statboticsRank || 0,
        StatboticsEPA: statboticsPrediction.statboticsEPA || statboticsPrediction.statboticsScore || 0,
        StatboticsAutoEPA: statboticsPrediction.statboticsAutoEPA || 0,
        //==Robot Performance==/
        RobotSpeed: mcRobotSpeed === null ? '' : mcRobotSpeed + ' ' + (isNaN(reliableRobotSpeed) ? '' : reliableRobotSpeed + '%' ),
        DriverSkill: mcDriverSkill === null ? '' : mcDriverSkill,
        DefenseEffectiveness: mcDefenseEffectiveness === null ? '' : mcDefenseEffectiveness,
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
        hasAutos: hasAutonomousActivity || hasAutosByNotes,
        ShooterType: shooterType,
        Turret: shooterType ? shooterType === 'Turret' : (typeof team?.TeamAttributes?.Turret === 'boolean' ? team.TeamAttributes.Turret : null),
        /* Grade */
        SumPriorities: team.SumPriorities,
        //NPts: isNaN(rPts) ? 0 : 67,//rPts,

      }
      return tableDataObj;
    })

    const cachedStatboticsByTeam = new Map(
      teamNumbers.map((team) => [
        String(team.TeamNumber),
        apiGetCachedStatboticsTeamEventPrediction(team.TeamNumber, regional, { allowStale: true }) || EMPTY_STATBOTICS_PREDICTION,
      ])
    )

    const initialTableRows = buildTableRows(cachedStatboticsByTeam)

    void apiWarmStatboticsTeamEventPredictions(
      teamNumbers.map((team) => team.TeamNumber),
      regional,
      { maxAgeMs: 5 * 60 * 1000, concurrency: 6 }
    ).then((results) => {
      if (!Array.isArray(results) || typeof onStatboticsUpdate !== 'function') return

      const refreshedStatboticsByTeam = new Map(
        results.map((item) => [String(item.teamNumber), item.prediction || EMPTY_STATBOTICS_PREDICTION])
      )

      onStatboticsUpdate(buildTableRows(refreshedStatboticsByTeam))
    }).catch((err) => {
      console.warn('Statbotics background refresh failed', err)
    })

    return initialTableRows
  }
  catch(err) {
    console.log(err)
    return []
  }
  }

export { getTeams,getTeamsMatchesAndTableData}