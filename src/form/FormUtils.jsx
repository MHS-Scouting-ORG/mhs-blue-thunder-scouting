import React from "react"
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
  hangType,
  activeStrategy,
  inactiveStrategy,
  timesTravelledMidActive,
  timesTravelledMidInactive,
  yellowCard,
  redCard,
  disable,
  dq,
  botBroke,
  noShow,
  tipped,
  minFouls,
  majFouls,
  robotSpeed,
  fuelCapacity,
  shootingSpeed,
  estimatedBallsShot,
  shootingCycles,
  robotInsight,
  robotBrokenComments

)

//actual function below
{

  const normalizeAutoStratFromActions = (actions) => {
    if (!Array.isArray(actions) || actions.length === 0) return "None"
    if (actions.includes("Scored")) return "Scored"
    if (actions.includes("Went Mid")) return "WentMid"
    if (actions.includes("Crossed Mid")) return "CrossedMid"
    return "None"
  }

  const normalizeStratList = (value) => {
    const allowed = ["Hoarding", "Defense", "Offensive", "Support", "None"]

    if (Array.isArray(value)) {
      const cleaned = value
        .map(v => (typeof v === "string" ? v.trim() : ""))
        .filter(v => allowed.includes(v) && v !== "")
      return cleaned.length > 0 ? cleaned : ["None"]
    }

    if (typeof value === "string") {
      const parts = value
        .split(",")
        .map(v => v.trim())
        .filter(v => allowed.includes(v) && v !== "")
      return parts.length > 0 ? parts : ["None"]
    }

    return ["None"]
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

  const mapMatchType = (type) => {
    if (type === 'q') return 'Qual'
    if (type === 'sf' || type === 'f') return 'Elim'
    return 'Practice'
  }

  /* Checks Match Selects */
  if (matchType === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nMatch Type (Qualifications, Semifinals or Finals)"
  }

  if (normalizedTeamNumber === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nTeam Number"
  }

  if (Number.isNaN(parsedMatchNumber)) {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nMatch Number"
  }

  /* Autonomous Hang */
  if (autoHang === "None" && (redCard || dq || noShow || disable || botBroke) === false) {
    autoPoints += 0;
  }
  else if (autoHang === 'Level1' && (redCard || dq || noShow || disable || botBroke) === false) {
    autoPoints += 15;
  }

  /* EndGame Select */
  if ((redCard || dq || noShow || disable || botBroke) !== false) {

  }
  else{
    switch(hangType){
      case 'None':
        endGamePoints += 0
        break;
      case 'Level3':
        endGamePoints += 30
        break;
      case 'Level2':
        endGamePoints += 20

      case 'Level1':
        endGamePoints += 10
        break;
      default: 
        incompleteForm = true;
        windowAlertMsg = windowAlertMsg + "\nWhat the endgame hang result was"
        break;
    }
  }
  // else if (hangType === "None" && (redCard || dq || noShow || disable || botBroke) === false) {
  //   endGamePoints += 0;
  // }
  // else if (hangType === 'Level3' && (redCard || dq || noShow || disable || botBroke) === false) {
  //   endGamePoints += 10;
  // }
  // else if (hangType === 'Level2' && (redCard || dq || noShow || disable || botBroke) === false) {
  //   endGamePoints += 20;
  // }
  // else if (hangType === 'Level1' && (redCard || dq || noShow || disable || botBroke) === false) {
  //   endGamePoints += 30;
  // }
  // else {
  //   incompleteForm = true;
  //   windowAlertMsg = windowAlertMsg + "\nWhat the endgame hang result was"
  // }

  /* Robot Info Select */
  if ((redCard || dq || noShow || disable || botBroke) !== false) {

  }
  else{
    switch(robotSpeed){
      case 'Slow':
        robotSpeed = "Slow"
        break;
      case 'Average':
        robotSpeed = "Average"
        break;
      case 'Fast':
        robotSpeed = "Fast"
        break;
      default:
        incompleteForm = true;
        windowAlertMsg = windowAlertMsg + "\nRobot Speed"
        break;
    }
  }
  // else if (robotSpeed === 'Slow' && (redCard || dq || noShow || disable || botBroke) === false) {
  //   robotSpeed = "Slow";
  // }
  // else if (robotSpeed === "Average" && (redCard || dq || noShow || disable || botBroke) === false) {
  //   robotSpeed = "Average";
  // }
  // else if (robotSpeed == "Fast" && (redCard || dq || noShow || disable || botBroke) === false) {
  //   robotSpeed = "Fast";
  // }
  // else {
  //   incompleteForm = true;
  //   windowAlertMsg = windowAlertMsg + "\nRobot Speed"
  // }

  /* Shooting Speed Select */
  if ((redCard || dq || noShow || disable || botBroke) !== false) {

  }
  else{
    switch(shootingSpeed){
      case 'Slow':
        shootingSpeed = "Slow"
        break;
      case 'Average':
        shootingSpeed = "Average"
        break;
      case 'Fast':
        shootingSpeed = "Fast"
        break;
      default:
        incompleteForm = true;
        windowAlertMsg = windowAlertMsg + "\nShooting Speed"
        break;
    }
  }
  // else if (shootingSpeed === 'Slow' && (redCard || dq || noShow || disable || botBroke) === false) {
  //   shootingSpeed = "Slow";
  // }
  // else if (shootingSpeed === "Average" && (redCard || dq || noShow || disable || botBroke) === false) {
  //   shootingSpeed = "Average";
  // }
  // else if (shootingSpeed == "Fast" && (redCard || dq || noShow || disable || botBroke) === false) {
  //   shootingSpeed = "Fast";
  // }
  // else {
  //   incompleteForm = true;
  //   windowAlertMsg = windowAlertMsg + "\nShooting Speed"
  // }

  /* Point Calc */

  // Calculate fuel points based on autoActions
  let autoFuelPoints = autoActions.includes("Scored") ? 8 : 0; // Assume scored fuel = 8 points because of 8 preload max
  autoPoints = autoFuelPoints;

  // Teleop travel count - assume some points per travel
  let teleTravelPoints = (timesTravelledMidActive + timesTravelledMidInactive) > 0 ? (timesTravelledMidActive + timesTravelledMidInactive) * 2 : 0; // Example: 2 points per travel
  telePoints = teleTravelPoints;

  let totalPoints = autoPoints + telePoints + endGamePoints;

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
    matchEntry.RobotInfo.RobotSpeed = robotSpeed
    matchEntry.RobotInfo.ShooterSpeed = shootingSpeed
    matchEntry.RobotInfo.FuelCapacity = Number.isNaN(parsedFuelCapacity) ? 0 : parsedFuelCapacity
    matchEntry.RobotInfo.BallsShot = Number.isNaN(parsedBallsShot) ? 0 : parsedBallsShot
    matchEntry.RobotInfo.ShootingCycles = Number.isNaN(parsedShootingCycles) ? 0 : parsedShootingCycles
    matchEntry.RobotInfo.WhatBrokeDesc = robotBrokenComments
    matchEntry.Comment = robotInsight

    // PENALTIES //
    matchEntry.Penalties.Fouls = minFouls
    matchEntry.Penalties.Tech = majFouls
    matchEntry.Penalties.PenaltiesCommitted.YellowCard = yellowCard
    matchEntry.Penalties.PenaltiesCommitted.RedCard = redCard
    matchEntry.Penalties.PenaltiesCommitted.Disabled = disable
    matchEntry.Penalties.PenaltiesCommitted.DQ = dq
    matchEntry.Penalties.PenaltiesCommitted.Broken = botBroke
    matchEntry.Penalties.PenaltiesCommitted.NoShow = noShow

    //console.log("check")

    //check if team entry is already made then checks if match is already made
    data = await apiGetTeam(normalizedTeamNumber)

    // protect against missing team/region structures; failing to do so would throw a
    // TypeError (which ended up in the caller as the `{}` you saw in the alert)
    let currentMatchid = null
    let regionalData = null
    if (data && Array.isArray(data.Regionals)) {
      regionalData = data.Regionals.find(x => x.RegionalId === regional)
      if (regionalData && Array.isArray(regionalData.TeamMatches)) {
        const matchObj = regionalData.TeamMatches.find(x => x.MatchId === matchKey)
        currentMatchid = matchObj ? matchObj.MatchId : null
      }
    }

    console.log("current match id", currentMatchid)

    if (!data) { //team record doesn't exist yet
      console.log(apiListTeamData, "api list team data")
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
                AutoStrat: ["WentMid", "Scored", "CrossedMid", "None"].includes(match?.Autonomous?.AutoStrat)
                  ? match.Autonomous.AutoStrat
                  : "None"
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

      const teamMatch = {
        name: "",
        description: "",
        Team: String(normalizedTeamNumber),
        MatchId: matchEntry.MatchId,
        Autonomous: {
          AutoStrat: ["WentMid", "Scored", "CrossedMid", "None"].includes(matchEntry.Autonomous.AutoStrat)
            ? matchEntry.Autonomous.AutoStrat
            : "None",
          TravelMid: matchEntry.Autonomous.TravelMid,
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
  console.log(apiListTeamData, " api list team data 345")
  return false; //return to help track whether or not to call reset form
}


/* function for form to change image based on toggle */
export function toggleIncremental(state, type) {
  /* When True */
  if (state) {
    if (type === "autoLeave") {
      return (<img src="./images/autoLeaveTrue.png" style={{ width: "110px" }} />)
    }
    else if (type === "yellowCard") {
      return (<img src="./images/yellowTrue.png" style={{ width: "100px" }} />)
    }
    else if (type === "redCard") {
      return (<img src="./images/redTrue.png" style={{ width: "100px" }} />)
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
    else if (type === "yellowCard") {
      return (<img src="./images/yellowDefault.png" style={{ width: "100px" }} />)
    }
    else if (type === "redCard") {
      return (<img src="./images/redDefault.png" style={{ width: "100px" }} />)
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