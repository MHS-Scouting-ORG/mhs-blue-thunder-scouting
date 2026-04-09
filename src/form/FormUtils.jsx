import React from "react"
import * as Auth from 'aws-amplify/auth'
import { buildMatchEntry } from '../api/builder';
import { apiCreateTeamEntry, apiUpdateTeamEntry, apiGetTeam, apiGetMatchesForRegional } from '../api';
//import { generateRandomEntry } from "../api/builder";
import { normalizeTeamId } from "../utils/teamId";

/* GET MATCH TEAMS */

//CHANGE THE REGIONAL KEY VIA 'main.jsx'
/* gets given teams of a match */
export async function getMatchTeams(props) {
  let matchKey =  /*put this years event*/ props.regional + "_" + props.matchType + props.elmNum + "m" + props.matchNumber;

  if (!props.regional) return
  const data = await apiGetMatchesForRegional(props.regional)
  data.map((match) => {
    if (match.key === matchKey) {
      props.changeState(match)
    }
  })
}


/* COPY ARRAY */

export function copyArray(Array) {
  return [...Array]
}

/* SUBMISSION */

/**
 * creates a match entry which is passed to the table
 * @param {*} props the entire form component (i was too lazy to send through each and individual state through a newly created instance of an object)
 */

export async function submitState( //params are states of data from form
  regional,
  teamNumber,
  matchKey,
  apiListTeamData,
  matchType,
  matchNumber,
  allianceColor,
  autoActions,
  autoHang,
  autoWin,
  autoImpact,
  hangType,
  activeStrategy,
  inactiveStrategy,
  timesTravelledMidActive,
  timesTravelledMidInactive,
  shootingCycles,
  teamImpact,
  disable,
  dq,
  botBroke,
  noShow,
  stuckOnBump,
  stuckOnBalls,
  robotSpeed,
  driverSkill,
  defenseEffectiveness,
  fuelCapacity,
  shootingSpeed,
  estimatedBallsShot,
  robotInsight,
  robotBrokenComments
) {

  const normalizeAutoStratFromActions = (actions) => {
    if (!Array.isArray(actions) || actions.length === 0) return []
    const autoMap = {
      "Moved": "Nothing",
      "Scored": "ScoredInGoal",
      "Crossed Bump/Trench": "LeftStartingZone",
    }
    const normalized = actions
      .map(action => autoMap[action])
      .filter(Boolean)

    return [...new Set(normalized)]
  }

  const normalizeStratList = (value) => {
    const allowed = ["Hoarding", "Defense", "Aggressive", "Support", "Shooting", "None"]
    const strategyMap = {
      "Hoarding": "Hoarding",
      "Defending": "Defense",
      "Scoring": "Shooting",
      "Defending Mid": "Defense",
      "Blocking": "Support",
      "Defense": "Defense",
      "Aggressive": "Aggressive",
      "Support": "Support",
      "Shooting": "Shooting",
      "None": "None",
    }

    if (Array.isArray(value)) {
      const cleaned = value
        .map(v => (typeof v === "string" ? strategyMap[v.trim()] : ""))
        .filter(v => allowed.includes(v) && v !== "")
      return cleaned.length > 0 ? cleaned : ["None"]
    }

    if (typeof value === "string") {
      const parts = value
        .split(",")
        .map(v => strategyMap[v.trim()])
        .filter(v => allowed.includes(v) && v !== "")
      return parts.length > 0 ? parts : ["None"]
    }

    return ["None"]
  }

  const normalizeSpeedValue = (value) => {
    const speedMap = {
      "Very Slow": "Slow",
      "Slow": "Slow",
      "Average": "Average",
      "Fast": "Fast",
      "Very Fast": "Fast",
    }
    return speedMap[String(value || "").trim()] || ""
  }

  const normalizeDriverSkillValue = (value) => {
    const skillMap = {
      "Very Poor": "Poor",
      "Poor": "Poor",
      "Average": "Average",
      "Good": "Good",
      "Excellent": "Excellent",
    }
    return skillMap[String(value || "").trim()] || ""
  }

  const normalizeDefenseEffectivenessValue = (value) => {
    const effectivenessMap = {
      "VeryPoor": "VeryPoor",
      "Very Poor": "VeryPoor",
      "Poor": "Poor",
      "Average": "Average",
      "Good": "Good",
      "Excellent": "Excellent",
    }
    return effectivenessMap[String(value || "").trim()] || ""
  }

  const normalizeTeamImpactValue = (value) => {
    const impactMap = {
      "Nothing": null,
      "Low": "Low",
      "Medium": "Medium",
      "High": "High",
      "Very High": "High",
    }
    const normalized = impactMap[String(value || "").trim()]
    return normalized === undefined ? "" : normalized
  }

  const parseScore = (value) => {
    if (value === '' || value === null || value === undefined) return null
    const parsed = Number.parseInt(String(value), 10)
    return Number.isNaN(parsed) ? null : Math.max(0, parsed)
  }

  const normalizeAutoWinValue = (value) => {
    const v = String(value || '').trim()
    if (v === 'Win' || v === 'Tie' || v === 'Lose') return v
    return null
  }

  let windowAlertMsg = 'Form is incomplete, you still need to fill out: ';
  let incompleteForm = false;

  // variable used for API lookups; declared here to avoid block scope issues
  let data;


  /* Points Init */
  let autoPoints = 0;
  let endGamePoints = 0;
  let telePoints = 0;

  /* idk what this is - not mine (dom) */
  const normalizedTeamNumber = normalizeTeamId(teamNumber)
  const parsedMatchNumber = Number.parseInt(matchNumber, 10)
  const parsedFuelCapacity = Number.parseInt(fuelCapacity, 10)
  const parsedBallsShot = Number.parseInt(estimatedBallsShot, 10)
  const parsedShootingCycles = Number.parseInt(shootingCycles, 10)
  /* */

  /* Checks Match Selects */
  if (matchType === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nMatch Type (Qualifications, Semifinals, Finals or Practice)"
  }

  if (normalizedTeamNumber === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nTeam Number"
  }

  if (autoHang === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nAutonomous Hang"
  }

  if (hangType === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nEndgame Hang"
  }

  if (robotSpeed === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nRobot Speed"
  }

  if (shootingSpeed === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nShooting Speed"
  }

  if (driverSkill === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nDriver Skill"
  }

  if (defenseEffectiveness === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nDefense Effectiveness"
  }

  if (Number.isNaN(parsedFuelCapacity)) {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nFuel Capacity"
  }

  if (Number.isNaN(parsedBallsShot)) {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nEstimated Balls Shot"
  }

  if (Number.isNaN(parsedShootingCycles)) {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nShooting Cycles"
  }

  if (Number.isNaN(parsedMatchNumber)) {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nMatch Number"
  }

  const normalizedTeamImpact = normalizeTeamImpactValue(teamImpact)
  if (teamImpact === '' || normalizedTeamImpact === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nTeam Impact"
  }

  const normalizedRobotSpeed = normalizeSpeedValue(robotSpeed)
  const normalizedShootingSpeed = normalizeSpeedValue(shootingSpeed)
  const normalizedDriverSkill = normalizeDriverSkillValue(driverSkill)
  const normalizedDefenseEffectiveness = normalizeDefenseEffectivenessValue(defenseEffectiveness)
  const normalizedAutoImpact = normalizeTeamImpactValue(autoImpact)
  const normalizedAutoWin = normalizeAutoWinValue(autoWin)
  /* AutoHang */
  if (autoHang === "None" && (dq || noShow || disable || botBroke) === false) {
    autoPoints += 0;
  }
  else if (autoHang === 'Level1' && (dq || noShow || disable || botBroke) === false) {
    autoPoints += 15;
  }

  /* EndGame Select */
  switch(hangType){
    case 'None':
      endGamePoints += 0
      break;
    case 'Level3':
      endGamePoints += 30
      break;
    case 'Level2':
      endGamePoints += 20
      break;
    case 'Level1':
      endGamePoints += 10
      break;
    default: 
      incompleteForm = true;
      windowAlertMsg = windowAlertMsg + "\nWhat the endgame hang result was"
      break;
  }

  /* Robot Info Select */
  if (!normalizedRobotSpeed) {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nRobot Speed"
  }

  /* Shooting Speed Select */
  if (!normalizedShootingSpeed) {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nShooting Speed"
  }
  
  /* Driver Skill Select */
  if (!normalizedDriverSkill) {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nDriver Skill"
  }

  /* Defense Effectiveness Select */
  if (!normalizedDefenseEffectiveness) {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nDefense Effectiveness"
  }

  /* Point Calc */

  // Calculate fuel points based on autoActions
  let autoFuelPoints = autoActions.includes("Scored") ? 8 : 0; // Assume scored fuel = 8 points because of 8 preload max
  autoPoints = autoFuelPoints;

  // Teleop travel count - assume some points per travel
  let teleTravelPoints = (timesTravelledMidActive + timesTravelledMidInactive) > 0 ? (timesTravelledMidActive + timesTravelledMidInactive) * 2 : 0; // Example: 2 points per travel
  telePoints = teleTravelPoints;

  /* Window Msg Check */
  if (incompleteForm) {
    window.alert(windowAlertMsg);
    return true;
  }

  else if (!incompleteForm) { //if form is complete
    const matchEntry = buildMatchEntry(normalizedTeamNumber, matchKey)

    //matchEntry.Team = teamNumber
    matchEntry.MatchId = matchKey

    // At this point the object still contains the builder defaults; we'll log
    // the final version after we massage the strategy fields below.

    // previously we joined these arrays into strings because the GraphQL type
    // was a scalar enum. after updating the schema to accept `[StratOpts]`, we
    // can just hand the arrays straight through.
    matchEntry.ActiveStrat = Array.isArray(activeStrategy) ? activeStrategy : []
    matchEntry.InactiveStrat = Array.isArray(inactiveStrategy) ? inactiveStrategy : []

    // log final object so that callers can inspect what is about to be sent
    console.log("final matchentry", matchEntry)

    matchEntry.TravelMidActive = timesTravelledMidActive
    matchEntry.TravelMidInactive = timesTravelledMidInactive

    /*  AUTONOMOUS SPECIFIC */

    matchEntry.Autonomous.AutoStrat = normalizeAutoStratFromActions(autoActions)
    matchEntry.Autonomous.AutoHang = autoHang

    /* TELEOP SPECIFIC*/
    const totalTravelMid = timesTravelledMidActive + timesTravelledMidInactive
    matchEntry.Teleop.TravelMid = totalTravelMid

    matchEntry.Teleop.Endgame = hangType

    /* Robot Info */
    matchEntry.RobotInfo.RobotSpeed = normalizedRobotSpeed
    matchEntry.RobotInfo.ShooterSpeed = normalizedShootingSpeed
    matchEntry.RobotInfo.DriverSkill = normalizedDriverSkill
    matchEntry.RobotInfo.DefenseEffectiveness = normalizedDefenseEffectiveness
    matchEntry.RobotInfo.FuelCapacity = Number.isNaN(parsedFuelCapacity) ? 0 : parsedFuelCapacity
    matchEntry.RobotInfo.BallsShot = Number.isNaN(parsedBallsShot) ? 0 : parsedBallsShot
    matchEntry.RobotInfo.ShootingCycles = Number.isNaN(parsedShootingCycles) ? 0 : parsedShootingCycles
    matchEntry.RobotInfo.WhatBrokeDesc = robotBrokenComments
    matchEntry.RobotInfo.Comments = robotInsight

    // PENALTIES //
    matchEntry.Penalties.PenaltiesCommitted.Disabled = disable
    matchEntry.Penalties.PenaltiesCommitted.DQ = dq
    matchEntry.Penalties.PenaltiesCommitted.Broken = botBroke
    matchEntry.Penalties.PenaltiesCommitted.NoShow = noShow
    matchEntry.Penalties.PenaltiesCommitted.StuckOnBump = stuckOnBump
    matchEntry.Penalties.PenaltiesCommitted.StuckOnBalls = stuckOnBalls
    matchEntry.TeamImpact = normalizedTeamImpact

    //console.log("check")

    //check if team entry is already made then checks if match is already made
    data = await apiGetTeam(normalizedTeamNumber)

    if (!data) { //team record doesn't exist yet
      await apiCreateTeamEntry(normalizedTeamNumber, regional)
      data = await apiGetTeam(normalizedTeamNumber)
    }
    if (data) {
      const updatedTeamEntry = { ...data }

      const normalizeRegionalMatches = (regionals) => {
        return regionals
          .filter(regionalEntry => regionalEntry && typeof regionalEntry === "object" && !Array.isArray(regionalEntry))
          .map(regionalEntry => {
          const normalizedMatches = (Array.isArray(regionalEntry?.TeamMatches) ? regionalEntry.TeamMatches : (regionalEntry?.TeamMatches ? [regionalEntry.TeamMatches] : []))
            .filter(match => match && typeof match === "object" && !Array.isArray(match))
            .map(match => ({
              ...match,
              Autonomous: {
                ...match?.Autonomous,
                AutoStrat: Array.isArray(match?.Autonomous?.AutoStrat) 
                  ? match.Autonomous.AutoStrat
                  : []
              },
              ActiveStrat: normalizeStratList(match?.ActiveStrat),
              InactiveStrat: normalizeStratList(match?.InactiveStrat)
            }))

          return {
            ...regionalEntry,
            TeamMatches: normalizedMatches
          }
        })
      }

      const currentRegionalsBase = Array.isArray(updatedTeamEntry.Regionals)
        ? updatedTeamEntry.Regionals
        : (updatedTeamEntry.Regionals ? [updatedTeamEntry.Regionals] : [])

      const currentRegionals = normalizeRegionalMatches(currentRegionalsBase)

      let currentRegional = currentRegionals.find(x => x.RegionalId === regional)
      if (!currentRegional) {
        currentRegional = { RegionalId: regional, TeamMatches: [] }
        currentRegionals.push(currentRegional)
      }

      const currentTeamMatches = Array.isArray(currentRegional.TeamMatches)
        ? currentRegional.TeamMatches
        : (currentRegional.TeamMatches ? [currentRegional.TeamMatches] : [])

      const submittedAt = new Date().toISOString()

      let submittedBy = ''
      try {
        const user = await Auth.getCurrentUser()
        submittedBy = user?.signInDetails?.loginId || user?.username || ''
      } catch (e) {
        console.warn('Could not resolve current user for submission attribution', e)
      }

      const teamMatch = {
        name: submittedAt,
        SubmittedBy: submittedBy,
        Team: String(normalizedTeamNumber),
        MatchId: matchEntry.MatchId,
        MatchType: matchType,
        AutoWin: normalizedAutoWin,
        TeamImpact: normalizedTeamImpact,
        AutoImpact: normalizedAutoImpact === '' ? null : normalizedAutoImpact,
        Autonomous: {
          AutoStrat: Array.isArray(matchEntry.Autonomous.AutoStrat)
            ? matchEntry.Autonomous.AutoStrat
            : [],
          AutoHang: matchEntry.Autonomous.AutoHang,
        },
        Teleop: {
          TravelMid: matchEntry.Teleop.TravelMid,
          Endgame: matchEntry.Teleop.Endgame,
        },
        ActiveStrat: normalizeStratList(matchEntry.ActiveStrat),
        InactiveStrat: normalizeStratList(matchEntry.InactiveStrat),
        RobotInfo: matchEntry.RobotInfo,
        Penalties: matchEntry.Penalties,
      }

      const sanitizedTeamMatches = currentTeamMatches

      const matchIndex = sanitizedTeamMatches.findIndex(x => x.MatchId === matchKey)
      if (matchIndex >= 0) {
        sanitizedTeamMatches[matchIndex] = teamMatch
      } else {
        sanitizedTeamMatches.push(teamMatch)
      }

      currentRegional.TeamMatches = sanitizedTeamMatches
      updatedTeamEntry.Regionals = currentRegionals

      const currentMatchid = matchIndex >= 0 ? matchKey : null

      console.log(currentMatchid, "current match id 1")

      console.log("team exists", matchKey)
      // currentMatchid may still be null if regional or match is absent
      if (currentMatchid === matchKey) {  //checks if match is already in array of matches in our database
        console.log("match already exists, updating match entry with new data")
        console.log("updated team entry: ", updatedTeamEntry)
        await apiUpdateTeamEntry(normalizedTeamNumber, updatedTeamEntry)
      }
      else { //creates new match to add to array of matches
        console.log("team entry exists but match does not, creating new match entry and adding to team entry")
        console.log("updated team entry: ", updatedTeamEntry)
        await apiUpdateTeamEntry(normalizedTeamNumber, updatedTeamEntry)
      }
    }
  }

  // refresh team data after any create/update. `data` was already declared
  data = await apiGetTeam(normalizedTeamNumber)
  console.log("data from get team: (past apicreate)", data)


  window.alert("Form Submitted");
  return false; //return to help track whether or not to call reset form
}


/* function for form to change image based on toggle */
export function toggleIncremental(state, type) {
  /* When True */
  if (state) {
    if (type === "autoLeave") {
      return (<img src="./images/autoLeaveTrue.png" style={{ width: "110px" }} />)
    }
    else if (type === "disable") {
      return (<img src="./images/disableTrue.png" style={{ width: "100px" }} />)
    }
    else if (type === "dq") {
      return (<img src="./images/dqTrue.png" style={{ width: "100px" }} />)
    }
    else if (type === "broke") {
      return (<img src="./images/brokeTrue.png" style={{ width: "100px" }} />)
    }
    else if (type === "noShow") {
      return (<img src="./images/noShowTrue.png" style={{ width: "100px" }} />)
    }

  }
  /* When False */
  else {
    if (type === "autoLeave") {
      return (<img src="./images/autoLeaveFalse.png" style={{ width: "110px" }} />)
    }
    else if (type === "disable") {
      return (<img src="./images/disableDefault.png" style={{ width: "100px" }} />)
    }
    else if (type === "dq") {
      return (<img src="./images/dqDefault.png" style={{ width: "100px" }} />)
    }
    else if (type === "broke") {
      return (<img src="./images/brokeDefault.png" style={{ width: "100px" }} />)
    }
    else if (type === "noShow") {
      return (<img src="./images/noShowDefault.png" style={{ width: "100px" }} />)
    }

  }
}

/* incremetnal function to change images based on increments */
export function buttonIncremental(num, type, element) {
  if (element === "fuel") {
    /* Check for default */
    if (num === 0) {
      return (<img src="./images/Fuel.png" style={{ width: "110px" }} />)
    }

    /* Check for increments */

    if (num === 1) {
      return (<img src="./images/Fuel.png" style={{ width: "110px" }} />)
    }
    if (num === 2) {
      return (<img src="./images/Fuel.png" style={{ width: "110px" }} />)
    }
    if (num === 3) {
      return (<img src="./images/Fuel.png" style={{ width: "110px" }} />)
    }
    if (num === 4) {
      return (<img src="./images/Fuel.png" style={{ width: "110px" }} />)
    }
    if (num === 5) {
      return (<img src="./images/Fuel.png" style={{ width: "110px" }} />)
    }
    if (num === 6) {
      return (<img src="./images/Fuel.png" style={{ width: "110px" }} />)
    }
    if (num === 7) {
      return (<img src="./images/Fuel.png" style={{ width: "110px" }} />)
    }
    if (num === 8) {
      return (<img src="./images/Fuel.png" style={{ width: "110px" }} />)
    }
    if (num === 9) {
      return (<img src="./images/Fuel.png" style={{ width: "110px" }} />)
    }
    if (num === 10) {
      return (<img src="./images/Fuel.png" style={{ width: "110px" }} />)
    }
    if (num > 10) {
      return (<img src="./images/Fuel.png" style={{ width: "110px" }} />)
    }
  }
}