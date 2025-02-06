import React from "react";
import buildMatchEntry, { MatchResultOpts, EndgameOpts, StagePositionOpts, PenaltyOpts, SpeedOpts, RatingOpts} from '../api/builder';
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
  matchData,
  matchType,
  elmNum,
  matchNumber,
  autoPlacement,
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
  missedCoralL1,
  missedCoralL2,
  missedCoralL3,
  missedCoralL4,
  missedProcessor,
  missedNet,
  humanNetMade,
  humanNetMissed,
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

  /* Auto Placement Select */
  // if (autoPlacement === '') {
  //   incompleteForm = true;
  //   windowAlertMsg = windowAlertMsg + "\nRobot AutoStarting Placement"
  // }

  // if(left){
  //   autoPoints += 3;
  // }

  /* EndGame Select */
  // if(hangType === 'Deep'){
  //   endGamePoints += 12;
  // }
  // else if(hangType === 'Shallow'){
  //   endGamePoints += 6;
  // }
  // else if(hangType === 'Parked'){
  //   endGamePoints += 2;
  // }
  // else {
  //   incompleteForm = true;
  //   windowAlertMsg = windowAlertMsg + "\nWhat the endgame result was"
  // }

  /* Robot Info Select */
  // if(robotSpeed === 'Slow'){

  // }

  /* Point Calc */

  autoCoralPoints = (autoCoralL1 * 3) + (autoCoralL2 * 4) + (autoCoralL3 * 6) + (autoCoralL4 * 7);
  teleCoralPoints = (teleCoralL1 * 2) + (teleCoralL2 * 3) + (teleCoralL3 * 4) + (teleCoralL4 * 5);

  teleAlgaePoints = (processorScored * 6) + (netScored * 4);
  autoAlgaePoints = (autoProcessorScored * 6) + (autoNetScored * 4);

  autoPoints += (autoCoralPoints + autoAlgaePoints);
  telePoints += (teleCoralPoints + teleAlgaePoints);

  let cycles = processorScored + netScored + teleCoralL1 + teleCoralL2 + teleCoralL3 + teleCoralL4;
  let totalPoints = autoPoints + telePoints + endGamePoints;

  console.log("test", regional, matchKey, autoPoints, telePoints, totalPoints, hangType)


  /* Window Msg Check */
  if (incompleteForm) {
    window.alert(windowAlertMsg);
  }
  else if (!incompleteForm) {
    const matchEntry = buildMatchEntry(regional, teamNumber, matchKey) 
    
    console.log("init", matchEntry)

     // AUTO SPECIFIC //
    matchEntry.Autonomous.StartingPosition = autoPlacement
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
     
    matchEntry.Teleop.HumPlrScoring.Made = humanNetMade
    matchEntry.Teleop.HumPlrScoring.Missed = humanNetMissed

    /* Robot Info */
    matchEntry.RobotInfo.SpeedOpts = robotSpeed

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


    console.log("matchEntry", matchEntry)

    if (matchData === undefined) {
      await apiCreateTeamMatchEntry(regional, teamNumber, matchKey);
    }
    await apiUpdateTeamMatch(regional, teamNumber, matchKey, matchEntry);

    //generateRandomEntry(regional, teamNumber, matchKey)

    //for testing
   apiGetTeamMatch(matchKey, regional, teamNumber)
   .then((teamMatch) => console.log(teamMatch))
  }

  console.log("test2", regional, matchKey, autoPoints, telePoints, totalPoints, hangType)
}