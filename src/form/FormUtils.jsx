import React from "react"
import {buildMatchEntry, buildTeamEntry} from '../api/builder';
import { apiCreateTeamEntry, apiUpdateTeamEntry, apiGetTeam } from '../api';
import { getMatchesForRegional } from '../api/bluealliance';
//import { getTeamMatch } from "../graphql/queries";
//import { generateRandomEntry } from "../api/builder";
import { normalizeTeamId } from "../utils/teamId";

/* GET MATCH TEAMS */

//CHANGE THE REGIONAL KEY VIA 'main.jsx'
/* gets given teams of a match */
export async function getMatchTeams(props) {
  let matchKey =  /*put this years event*/ props.regional + "_" + props.matchType + props.elmNum + "m" + props.matchNumber;

  const data = await getMatchesForRegional(props.regional)
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
  {
  const robotWasBroken = redCard || dq || noShow || disable || botBroke;

  let windowAlertMsg = 'Form is incomplete, you still need to fill out: ';
  let incompleteForm = false;


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
  if(autoHang === "None" && (redCard || dq || noShow || disable || botBroke) === false){
    autoPoints += 0;
  }
  else if (autoHang === 'Level1' && (redCard || dq || noShow || disable || botBroke) === false) {
    autoPoints += 15;
  }

  /* EndGame Select */
  if((robotWasBroken) !== false){
  
  }
  else{
  switch (hangType) {
    case "None":
      endGamePoints += 0;
      break
    case "Level3":
      endGamePoints += 10;
      break
    case "Level2":
      endGamePoints += 20;
      break
    case "Level1":
      endGamePoints += 30;
      break
    default:
      incompleteForm = true;
      windowAlertMsg = windowAlertMsg + "\nWhat the endgame hang result was"
  }
}
  }
  /* Robot Info Select */
  if ((robotWasBroken) !== false){

  }
  else{
    switch (robotSpeed){
      case "Slow": {
        robotSpeed = "Slow"
        break;
      }
      case "Average": {
        robotSpeed = "Average"
        break;
      }
      case "Fast": {
        robotSpeed = "Fast"
        break;
      }
      default: {
        incompleteForm = true;
        windowAlertMsg = windowAlertMsg + "\nRobot Speed"
      }
    }
  }
  /* Shooting Speed Select */
  if((robotWasBroken) !== false){

  }
  else {
    switch (shootingSpeed){
      case "Slow":
        shootingSpeed = "Slow"
        break;
      case "Average":
        shootingSpeed = "Average"
        break
      case "Fast":
        shootingSpeed = "Fast"
        break
      default:
        incompleteForm = true;
        windowAlertMsg = windowAlertMsg + "\nShooting Speed"
    }
  }
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
    const matchEntry = buildMatchEntry(teamNumber, matchKey)

    console.log("matchentry", matchEntry)

    //matchEntry.id = teamNumber
    matchEntry.MatchId = matchKey
    matchEntry.ActiveStrat = activeStrategy
    matchEntry.InactiveStrat = inactiveStrategy
    matchEntry.TravelMidActive = timesTravelledMidActive
    matchEntry.TravelMidInactive = timesTravelledMidInactive

    /*  AUTONOMOUS SPECIFIC */ 

    matchEntry.Autonomous.AutoStrat = autoActions.join(", ") //join array of auto actions into a string for storage
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
    
    //check if team entry is already made then checks if match is already made
      await apiGetTeam(teamNumber).then(async data => {
        const currentMatchid = data.data.getTeam.TeamMatches.MatchId
        if(data.data.getTeam === null){
          console.log(apiListTeamData, "api list team data")
          await apiCreateTeamEntry(teamNumber, matchEntry, "match")
        }
        else {
          console.log("team exists", matchKey)
          console.log("current match id", currentMatchid)
          if (currentMatchid === matchKey) {  //checks if match is already in array of matches in our database
            console.log("match already exists, updating match entry with new data")
            const updatedTeamEntry = buildTeamEntry(teamNumber, matchEntry, "match")
            apiUpdateTeamEntry(teamNumber, updatedTeamEntry)
          }
          else { //creates new match to add to array of matches
            
          }
        }
      })

      await apiGetTeam(teamNumber).then(data => 
        console.log("data from get team: (past apicreate)", data)
      )
  }
  window.alert("Form Submitted");
  return false; //return to help track whether or not to call reset form
}


/* function for form to change image based on toggle */
export function toggleIncremental(state, type){ 
  /* When True */
  if(state) {
    if(type === "autoLeave") {
      return (<img src="./images/autoLeaveTrue.png" style={{width: "110px"}}/>)
    }
    else if(type === "yellowCard") {
      return (<img src="./images/yellowTrue.png" style={{width: "100px"}}/>)
    }
    else if(type === "redCard") {
      return (<img src="./images/redTrue.png" style={{width: "100px"}}/>)
    }
    else if(type === "disable") {
      return (<img src="./images/disableTrue.png" style={{width: "100px"}}/>)
    }
    else if(type === "dq") {
      return (<img src="./images/dqTrue.png" style={{width: "100px"}}/>)
    }
    else if(type === "broke") {
      return (<img src="./images/brokeTrue.png" style={{width: "100px"}}/>)
    }
    else if(type === "noShow") {
      return (<img src="./images/noShowTrue.png" style={{width: "100px"}}/>)
    }

  }
  /* When False */
  else {
    if(type === "autoLeave") {
      return (<img src="./images/autoLeaveFalse.png" style={{width: "110px"}}/>)
    }
    else if(type === "yellowCard") {
      return (<img src="./images/yellowDefault.png" style={{width: "100px"}}/>)
    }
    else if(type === "redCard") {
      return (<img src="./images/redDefault.png" style={{width: "100px"}}/>)
    }
    else if(type === "disable") {
      return (<img src="./images/disableDefault.png" style={{width: "100px"}}/>)
    }
    else if(type === "dq") {
      return (<img src="./images/dqDefault.png" style={{width: "100px"}}/>)
    }
    else if(type === "broke") {
      return (<img src="./images/brokeDefault.png" style={{width: "100px"}}/>)
    }
    else if(type === "noShow") {
      return (<img src="./images/noShowDefault.png" style={{width: "100px"}}/>)
    }

  }
}

/* incremental function to change images based on increments */
export function buttonIncremental(num, type, element) {
  if (element === "fuel"){
    /* Check for default */
    if (num === 0) {
      return (<img src="./images/Fuel.png" style={{width: "110px"}}/>)
    }

    /* Check for increments */ 

    if( num === 1){
      return (<img src="./images/Fuel.png" style={{width: "110px"}}/>)
    }
    if( num === 2){
      return (<img src="./images/Fuel.png" style={{width: "110px"}}/>)
    }
    if( num === 3){
      return (<img src="./images/Fuel.png" style={{width: "110px"}}/>)
    }
    if( num === 4){
      return (<img src="./images/Fuel.png" style={{width: "110px"}}/>)
    }
    if( num === 5){
      return (<img src="./images/Fuel.png" style={{width: "110px"}}/>)
    }
    if( num === 6){
      return (<img src="./images/Fuel.png" style={{width: "110px"}}/>)
    }
    if( num === 7){
      return (<img src="./images/Fuel.png" style={{width: "110px"}}/>)
    }
    if( num === 8){
      return (<img src="./images/Fuel.png" style={{width: "110px"}}/>)
    }
    if( num === 9){
      return (<img src="./images/Fuel.png" style={{width: "110px"}}/>)
    }
    if( num === 10){
      return (<img src="./images/Fuel.png" style={{width: "110px"}}/>)
    }
    if(num > 10){
      return (<img src="./images/Fuel.png" style={{width: "110px"}}/>)
    }
  }
}