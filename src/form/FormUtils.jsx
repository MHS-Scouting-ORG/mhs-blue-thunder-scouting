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

export async function submitState(
  regional,
  teamNumber,
  matchKey,
  apiMatchData,
  matchType,
  elmNum,
  matchNumber,
  left,
  autoCoralL1,
  autoCoralL2,
  autoCoralL3,
  autoCoralL4,
  autoProcessorScored,
  autoNetScored,
  teleCoralL1,
  teleCoralL2,
  teleCoralL3,
  teleCoralL4,
  processorScored,
  netScored,
  hangType,
  yellowCard,
  redCard,
  disable,
  dq,
  botBroke,
  noShow,
  minFouls,
  majFouls,
  robotSpeed,
  robotInsight,
  robotBrokenComments

) {

  let windowAlertMsg = 'Form is incomplete, you still need to fill out: ';
  let incompleteForm = false;

  /* Points Init */
  let autoPoints = 0;
  let endGamePoints = 0;
  let telePoints = 0;

  let autoCoralPoints = 0;
  let teleCoralPoints = 0;

  let teleAlgaePoints = 0;
  let autoAlgaePoints = 0;


  /* Checks Match Selects */
  if (matchType === 'qf' || matchType === 'sf' || matchType === 'f') {
    if (elmNum === '') {
      incompleteForm = true;
      windowAlertMsg = windowAlertMsg + "\nFinals Number";
    }
  } else if (matchType === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nMatch Type (Qualifications, Quarterfinals, Semifinals or Finals)"
  }

  if (matchNumber === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nMatch Number";
  }

  if (teamNumber === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nTeam Number"
  }


  if (left) {
    autoPoints += 3;
  }

  /* EndGame Select */
  if((redCard || dq || noShow || disable || botBroke) !== false){

  }
  else if (hangType === 'Deep' && (redCard || dq || noShow || disable || botBroke) === false) {
    endGamePoints += 12;
  }
  else if (hangType === 'Shallow' && (redCard || dq || noShow || disable || botBroke) === false) {
    endGamePoints += 6;
  }
  else if (hangType === 'Parked' && (redCard || dq || noShow || disable || botBroke) === false) {
    endGamePoints += 2;
  }
  else {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nWhat the endgame result was"
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

  /* Point Calc */

  autoCoralPoints = (autoCoralL1 * 3) + (autoCoralL2 * 4) + (autoCoralL3 * 6) + (autoCoralL4 * 7);
  teleCoralPoints = (teleCoralL1 * 2) + (teleCoralL2 * 3) + (teleCoralL3 * 4) + (teleCoralL4 * 5);

  teleAlgaePoints = (processorScored * 6) + (netScored * 4);
  autoAlgaePoints = (autoProcessorScored * 6) + (autoNetScored * 4);

  autoPoints += (autoCoralPoints + autoAlgaePoints);
  telePoints += (teleCoralPoints + teleAlgaePoints);

  let cycles = processorScored + netScored + teleCoralL1 + teleCoralL2 + teleCoralL3 + teleCoralL4;
  let totalPoints = autoPoints + telePoints + endGamePoints;

  /* Window Msg Check */
  if (incompleteForm) {
    window.alert(windowAlertMsg);
  }
  else if (!incompleteForm) {
    const matchEntry = buildMatchEntry(regional, teamNumber, matchKey)

    console.log("init", matchEntry)

    matchEntry.TotalPoints = totalPoints

    // AUTO SPECIFIC //
    matchEntry.Autonomous.Left = left

    matchEntry.Autonomous.AmountScored.CoralL1 = autoCoralL1
    matchEntry.Autonomous.AmountScored.CoralL2 = autoCoralL2
    matchEntry.Autonomous.AmountScored.CoralL3 = autoCoralL3
    matchEntry.Autonomous.AmountScored.CoralL4 = autoCoralL4

    matchEntry.Autonomous.AmountScored.Processor = autoProcessorScored
    matchEntry.Autonomous.AmountScored.Net = autoNetScored

    matchEntry.Autonomous.PointsScored.Points = autoPoints
    matchEntry.Autonomous.PointsScored.CoralPoints = autoCoralPoints
    matchEntry.Autonomous.PointsScored.AlgaePoints = autoAlgaePoints

    /* TELEOP SPECIFIC*/
    matchEntry.Teleop.AmountScored.CoralL1 = teleCoralL1
    matchEntry.Teleop.AmountScored.CoralL2 = teleCoralL2
    matchEntry.Teleop.AmountScored.CoralL3 = teleCoralL3
    matchEntry.Teleop.AmountScored.CoralL4 = teleCoralL4

    matchEntry.Teleop.AmountScored.Processor = processorScored
    matchEntry.Teleop.AmountScored.Net = netScored

    matchEntry.Teleop.AmountScored.Cycles = cycles

    matchEntry.Teleop.PointsScored.Points = telePoints
    matchEntry.Teleop.PointsScored.EndgamePoints = endGamePoints
    matchEntry.Teleop.PointsScored.CoralPoints = teleCoralPoints
    matchEntry.Teleop.PointsScored.AlgaePoints = teleAlgaePoints

    matchEntry.Teleop.Endgame.EndGameResult = hangType

    /* Robot Info */
    matchEntry.RobotInfo.RobotSpeed = robotSpeed

    // PENALTIES //
    matchEntry.Penalties.Fouls = minFouls
    matchEntry.Penalties.Tech = majFouls
    matchEntry.Penalties.PenaltiesCommitted.YellowCard = yellowCard
    matchEntry.Penalties.PenaltiesCommitted.RedCard = redCard
    matchEntry.Penalties.PenaltiesCommitted.Disabled = disable
    matchEntry.Penalties.PenaltiesCommitted.DQ = dq
    matchEntry.Penalties.PenaltiesCommitted.Broken = botBroke
    matchEntry.Penalties.PenaltiesCommitted.NoShow = noShow

    matchEntry.RobotInfo.WhatBrokeDesc = robotBrokenComments
    matchEntry.RobotInfo.Comments = robotInsight


    console.log("matchEntry", matchEntry.Team)
    console.log("apiMatchData", apiMatchData)
    console.log(apiMatchData.find(x => x.Team === matchEntry.Team))


    /* currently submits and updates the new form completely */

    if (apiMatchData.find(x => x.id === matchKey) === undefined) {
      await apiCreateTeamMatchEntry(regional, teamNumber, matchKey);
    }
    await apiUpdateTeamMatch(regional, teamNumber, matchKey, matchEntry);

    //for testing
    await apiGetTeamMatch(matchKey, regional, teamNumber)

  }
}

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

export function buttonIncremental(num, type, element) {
  if (element === "coral") {
    /* Check for default and level */
    if (num === 0 && type === "coral1") {
      return (<img src="./images/level1.png" style={{width: "110px"}}/>)
    }
    else if(num <= 0 && type === "coral2") {
      return (<img src="./images/level2.png" style={{width: "110px"}}/>)
    }
    else if(num === 0 && type === "coral3") {
      return (<img src="./images/level3.png" style={{width: "110px"}}/>)
    }
    else if(num === 0 && type === "coral4") {
      return (<img src="./images/level4.png" style={{width: "110px"}}/>)
    }

    /* Check for increment */

    if( num === 1){
      return (<img src="./images/incremental/coralOne.png" style={{width: "110px"}}/>)
    }
    if( num === 2){
      return (<img src="./images/incremental/coralTwo.png" style={{width: "110px"}}/>)
    }
    if( num === 3){
      return (<img src="./images/incremental/coralThree.png" style={{width: "110px"}}/>)
    }
    if( num === 4){
      return (<img src="./images/incremental/coralFour.png" style={{width: "110px"}}/>)
    }
    if( num === 5){
      return (<img src="./images/incremental/coral5.png" style={{width: "110px"}}/>)
    }
    if( num === 6){
      return (<img src="./images/incremental/coral6.png" style={{width: "110px"}}/>)
    }
    if( num === 7){
      return (<img src="./images/incremental/coral7.png" style={{width: "110px"}}/>)
    }
    if( num === 8){
      return (<img src="./images/incremental/coral8.png" style={{width: "110px"}}/>)
    }
    if( num === 9){
      return (<img src="./images/incremental/coral9.png" style={{width: "110px"}}/>)
    }
    if( num === 10){
      return (<img src="./images/incremental/coral10.png" style={{width: "110px"}}/>)
    }
    if(num > 10){
      return (<img src="./images/incremental/coralOver10.png" style={{width: "110px"}}/>)
    }
  }
  else if (element === "algae"){
    /* Check type */
    if (num === 0 && type === "processor") {
      return (<img src="./images/processorDefault.png" style={{width: "110px"}}/>)
    }
    else if(num === 0 && type === "net") {
      return (<img src="./images/netDefault.png" style={{width: "110px"}}/>)
    }

    /* Check for increment */

    if( num === 1){
      return (<img src="./images/incremental/algae1.png" style={{width: "110px"}}/>)
    }
    if( num === 2){
      return (<img src="./images/incremental/algae2.png" style={{width: "110px"}}/>)
    }
    if( num === 3){
      return (<img src="./images/incremental/algae3.png" style={{width: "110px"}}/>)
    }
    if( num === 4){
      return (<img src="./images/incremental/algae4.png" style={{width: "110px"}}/>)
    }
    if( num === 5){
      return (<img src="./images/incremental/algae5.png" style={{width: "110px"}}/>)
    }
    if( num === 6){
      return (<img src="./images/incremental/algae6.png" style={{width: "110px"}}/>)
    }
    if( num === 7){
      return (<img src="./images/incremental/algae7.png" style={{width: "110px"}}/>)
    }
    if( num === 8){
      return (<img src="./images/incremental/algae8.png" style={{width: "110px"}}/>)
    }
    if( num === 9){
      return (<img src="./images/incremental/algae9.png" style={{width: "110px"}}/>)
    }
    if( num === 10){
      return (<img src="./images/incremental/algae10.png" style={{width: "110px"}}/>)
    }
    if(num > 10){
      return (<img src="./images/incremental/algaeOver10.png" style={{width: "110px"}}/>)
    }
  }
}