import React from "react";
import buildMatchEntry, { EndgameOpts, PenaltyOpts, SpeedOpts } from '../api/builder';
import { apiCreateTeamMatchEntry, apiUpdateTeamMatch, apiGetTeamMatch, } from '../api';
import { getMatchesForRegional } from '../api/bluealliance';
import { getTeamMatch } from "../graphql/queries";
import { generateRandomEntry } from "../api/builder";

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
  apiMatchData,
  matchType,
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
  minFouls,
  majFouls,
  robotSpeed,
  fuelCapacity,
  shootingSpeed,
  estimatedBallsShot,
  shootingCycles,
  robotInsight,
  robotBrokenComments

) {

  let windowAlertMsg = 'Form is incomplete, you still need to fill out: ';
  let incompleteForm = false;

  /* Points Init */
  let autoPoints = 0;
  let endGamePoints = 0;
  let telePoints = 0;


  /* Checks Match Selects */
  if (matchType === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nMatch Type (Qualifications, Semifinals or Finals)"
  }

  if (teamNumber === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nTeam Number"
  }


  /* EndGame Select */
  if((redCard || dq || noShow || disable || botBroke) !== false){

  }
  else if(hangType === "None" && (redCard || dq || noShow || disable || botBroke) === false){
    endGamePoints += 0;
  }
  else if (hangType === 'Level3' && (redCard || dq || noShow || disable || botBroke) === false) {
    endGamePoints += 12;
  }
  else if (hangType === 'Level2' && (redCard || dq || noShow || disable || botBroke) === false) {
    endGamePoints += 6;
  }
  else if (hangType === 'Level1' && (redCard || dq || noShow || disable || botBroke) === false) {
    endGamePoints += 2;
  }
  else {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nWhat the endgame hang result was"
  }

  /* Robot Info Select */
  if((redCard || dq || noShow || disable || botBroke) !== false){

  }
  else if (robotSpeed === 'Slow' && (redCard || dq || noShow || disable || botBroke) === false) {
    robotSpeed = "Slow";
  }
  else if (robotSpeed === "Average" && (redCard || dq || noShow || disable || botBroke) === false) {
    robotSpeed = "Average";
  }
  else if (robotSpeed == "Fast" && (redCard || dq || noShow || disable || botBroke) === false) {
    robotSpeed = "Fast"; 
  }
  else {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nRobot Speed"
  }

  /* Shooting Speed Select */
  if((redCard || dq || noShow || disable || botBroke) !== false){

  }
  else if (shootingSpeed === 'Slow' && (redCard || dq || noShow || disable || botBroke) === false) {
    shootingSpeed = "Slow";
  }
  else if (shootingSpeed === "Average" && (redCard || dq || noShow || disable || botBroke) === false) {
    shootingSpeed = "Average";
  }
  else if (shootingSpeed == "Fast" && (redCard || dq || noShow || disable || botBroke) === false) {
    shootingSpeed = "Fast"; 
  }
  else {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nShooting Speed"
  }

  /* Point Calc */

  // Calculate fuel points based on autoActions
  let autoFuelPoints = autoActions.includes("Scored") ? 3 : 0; // Assume scored fuel = 3 points
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
  else if (!incompleteForm) {
    const matchEntry = buildMatchEntry(regional, teamNumber, matchKey)

    console.log("init", matchEntry)

    matchEntry.TotalPoints = totalPoints

    // Set Autonomous fields - only fields that exist in schema
    
    // Set coral scoring based on autoActions
    if (autoActions.includes("Scored")) {
      matchEntry.Autonomous.AmountScored.Net = 1  // Record coral scored
    }

    matchEntry.Autonomous.PointsScored.Points = autoPoints

    /* TELEOP SPECIFIC*/
    // Set teleop coral scoring
    matchEntry.Teleop.AmountScored.Net = timesTravelledMidActive + timesTravelledMidInactive

    matchEntry.Teleop.PointsScored.Points = telePoints
    matchEntry.Teleop.PointsScored.AlgaePoints = endGamePoints
    matchEntry.Teleop.Endgame.EndGameResult = hangType

    /* Robot Info */
    matchEntry.RobotInfo.RobotSpeed = robotSpeed
    matchEntry.RobotInfo.WhatBrokeDesc = robotBrokenComments
    matchEntry.RobotInfo.Comments = `Shooter Speed: ${shootingSpeed}, Fuel Capacity: ${fuelCapacity}, Balls Shot: ${estimatedBallsShot}, Shooting Cycles: ${shootingCycles}, ${robotInsight}`

    // PENALTIES //
    matchEntry.Penalties.Fouls = minFouls
    matchEntry.Penalties.Tech = majFouls
    matchEntry.Penalties.PenaltiesCommitted.YellowCard = yellowCard
    matchEntry.Penalties.PenaltiesCommitted.RedCard = redCard
    matchEntry.Penalties.PenaltiesCommitted.Disabled = disable
    matchEntry.Penalties.PenaltiesCommitted.DQ = dq
    matchEntry.Penalties.PenaltiesCommitted.Broken = botBroke
    matchEntry.Penalties.PenaltiesCommitted.NoShow = noShow


    // console.log("matchEntry", matchEntry.Team)
    // console.log("apiMatchData", apiMatchData)
    // console.log(apiMatchData.find(x => x.Team === matchEntry.Team))


    /* currently submits and updates the new form completely */

    if (apiMatchData.find(x => x.id === matchKey) === undefined) { //checks if match is already in array of matches in our database
      await apiCreateTeamMatchEntry(regional, teamNumber, matchKey);
    }
    await apiUpdateTeamMatch(regional, teamNumber, matchKey, matchEntry); //updates data if there already is

    //for testing
    await apiGetTeamMatch(matchKey, regional, teamNumber)

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

/* incremetnal function to change images based on increments */
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