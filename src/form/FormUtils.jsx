import React from "react";
import buildMatchEntry, { StageOpts, PenaltyOpts, RankingPtsOpts, LineupSpeedOpts, IntakeRatingOpts } from '../api/builder';
import { apiCreateTeamMatchEntry, apiUpdateTeamMatch } from '../api';
import { getMatchesForRegional } from '../api/bluealliance';

/* GET MATCH TEAMS */

//CHANGE THE REGIONAL KEY VIA 'main.jsx'
/* gets given teams of a match */
export async function getMatchTeams(props) {
  let matchKey =  /*put this years event*/ props.regional + "_" + props.matchType + props.elmNum + "m" + props.matchNumber;

  const data = await getMatchesForRegional(props.regional)
  data.map((match) => {
    if (match.key === matchKey) {
      console.log("match: ", match)
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
export async function submitState(props) {
  let windowAlertMsg = 'Form is incomplete, you still need to fill out: ';
  let matchKey = /*put year event*/ props.regional + "_" + props.state.matchType + props.state.elmNum + "m" + props.state.matchNumber;

  let counterBoxVals = props.state.counterBoxVals
  let booleans = props.state.booleans

  // TEAM INFO //
  let teamNum = props.state.teamNumber;

  // AUTO SPECIFIC //
  let autoPlacement = props.state.autoPlacement;
  let left = props.state.left //booleans[0]

  // SCORING //
  let autoAmpScored = props.state.autoAmpScored; //counterBoxVals[0]
  let autoSpeakerScored = props.state.autoSpeakerScored; //counterBoxVals[1]
  let teleAmpScored = props.state.teleAmpScored //counterBoxVals[2]
  let teleSpeakerScored = props.state.teleSpeakerScored //counterBoxVals[3]
  let teleAmplifiedSpeakerScored = props.state.teleAmplifiedSpeakerScored //counterBoxVals[4]
  let highNotesMade = props.state.highNotesMade //counterBoxVals[5]
  let highNotesMissed = props.state.highNotesMissed //counterBoxVals[6]

  let endGameVal = props.state.endGameVal
  let noteInTrap = props.state.noteInTrap //booleans[3]

  // RANKING PTS //
  //let rankingState = props.state.rankingState
  let rankingPts = props.state.rankingPts
  let matchResult = props.state.matchResult //rankingState[0]
  let melody = props.state.melody //rankingState[1]
  let ensemble = props.state.ensemble //rankingState[2]


  // PENALTIES //
  // let penalties = props.state.penaltyVal;
  let yellowCard = props.state.yellowCard; //penalties[0]
  let redCard = props.state.redCard; //penalties[1]
  let dq = props.state.dq; //penalties[2]
  let botBroke = props.state.botBroke; //penalties[3]
  let noShow = props.state.noShow; //penalties[4]
  let fouls = props.state.fouls; //counterBoxVals[7]
  let techFouls = props.state.techFouls; //counterBoxVals[8]
  let foulComments = props.state.foulComments;
  let robotBrokenComments = props.state.robotBrokenComments


  // ROBOT INFO //
  let hangsFaster = props.state.hangsFaster
  let isFaster = props.state.isFaster
  let clearsStage = props.state.clearsStage
  let countersDefense = props.state.countersDefense
  let lineUpSpeed = props.state.lineUpSpeed
  let intakeRating = props.state.intakeRating

  // INITIALIZE SCORE--------------------------------------------------------------------------------------------
  let autoPts = 0;
  let telePts = 0;
  let endGamePts = 0;
  let ampPts = 0;
  let speakerPts = 0;

  /*----------------------------------------------------POINT CALCULATIONS----------------------------------------------------------*/
  let incompleteForm = false;

  let override = props.state.override;

  if (endGameVal === 'Onstage') {
    endGamePts = 3;
  } else if (endGameVal === "Parked") {
    endGamePts = 1;
  } else if (endGameVal === 'Attempted' || endGameVal === 'None') {
    endGamePts = 0;
  } else {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nWhat the endgame result was"
  }

  if (left) {
    autoPts += 3;
  }

  let rankFinal = [];
  for (let i = 0; i < rankingState.length; i++) {
    let rankOp = rankingState[i];
    if (rankOp === "Team Won ") {
      rankFinal.push(RankingPtsOpts.WIN);
    }
    else if (rankOp === "Team Tied ") {
      rankFinal.push(RankingPtsOpts.TIE);
    }
    else if (rankOp === "Team Lost ") {
      rankFinal.push(RankingPtsOpts.LOSS);
    }
    else if (rankOp === "Sustainability ") {
      rankFinal.push(RankingPtsOpts.SUSTAINABILITY_BONUS);
    }
    else if (rankOp === "Activation ") {
      rankFinal.push(RankingPtsOpts.ACTIVATION_BONUS);
    }
  }

  function findChargeStationType(chargeStation) {
    if (chargeStation === 'None') {
      return ChargeStationType.NONE;
    } else if (chargeStation === 'DockedEngaged') {
      return ChargeStationType.DOCKED_ENGAGED;
    } else if (chargeStation === 'Docked') {
      return ChargeStationType.DOCKED;
    } else if (chargeStation === 'Parked') {
      return ChargeStationType.Parked;
    } else if (chargeStation === 'Attempted') {
      return ChargeStationType.ATTEMPTED;
    }
  }

  let chargeTeleFinal = findChargeStationType(endGameVal);
  let chargeAutoFinal = findChargeStationType(chargeStationAuto);


  //POINT CALCULATIONS

  autoPts =  5 * autoSpeakerScored + 2 * autoAmpScored
  telePts = 2 * teleSpeakerScored + 5 * teleAmplifiedSpeakerScored + teleAmpScored
  speakerPts = 5 * (autoSpeakerScored + teleAmplifiedSpeakerScored) + 2 * teleSpeakerScored
  ampPts = 2 * autoAmpScored + teleAmpScored

  let totalPts = autoPts + telePts + endGamePts

  props.setState(totalPts, ampPts, speakerPts)
  // setPoints(points, totalGridPts, cubesTeleAutoAccuracy, conesTeleAutoAccuracy, cubePts, conePts);

  if (autoPlacement === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nPosition of robot during Auto"
  }

  if (props.state.matchType === 'qf' || props.state.matchType === 'sf' || props.state.matchType === 'f') {
    if (props.state.elmNum === '') {
      incompleteForm = true;
      windowAlertMsg = windowAlertMsg + "\nFinals Number";
    }
  } else if (props.state.matchType === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nMatch Type (Qualifications, Quarterfinals, Semifinals, Finals)"
  }

  if (props.state.matchNumber === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nMatch Number";
  }

  if (props.state.teamNumber === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nTeam Number"
  }

  if (incompleteForm && !override) {
    window.alert(windowAlertMsg);
  } else if (!incompleteForm || override) {
    const matchEntry = buildMatchEntry(props.regional, teamNum, matchKey)

    // AUTO SPECIFIC //
    matchEntry.Autonomous.StartingPosition = autoPlacement

    matchEntry.Autonomous.AmountScored.Amp = autoAmpScored
    matchEntry.Autonomous.AmountScored.Speaker = autoSpeakerScored

    matchEntry.Autonomous.PointsScored.Points = undefined
    matchEntry.Autonomous.PointsScored.SpeakerPoints = undefined
    matchEntry.Autonomous.PointsScored.AmpPoints = undefined

    matchEntry.Autonomous.Left = left

    //TELEOP MATCH ENTREES
    matchEntry.Teleop.AmountScored.Amp = teleAmpScored
    matchEntry.Teleop.AmountScored.Speaker = teleSpeakerScored
    matchEntry.Teleop.AmountScored.AmplifiedSpeaker = teleAmplifiedSpeakerScored
    matchEntry.Teleop.AmountScored.Cycles = undefined

    matchEntry.Teleop.PointsScored.Points = undefined
    matchEntry.Teleop.PointsScored.EndgamePoints = undefined
    matchEntry.Teleop.PointsScored.SpeakerPoints = undefined
    matchEntry.Teleop.PointsScored.AmpPoints = undefined

    matchEntry.Teleop.EndGame.MatchResult = matchResult
    matchEntry.Teleop.EndGame.StageResult = endGameVal
    matchEntry.Teleop.EndGame.Melody = melody
    matchEntry.Teleop.EndGame.Ensemble = ensemble

    //SCORING TOTAL
    matchEntry.Teleop.ScoringTotal.Total = points
    matchEntry.Teleop.ScoringTotal.GridPoints = totalGridPts

    matchEntry.Teleop.ScoringTotal.GridScoringByPlacement.High = highGridPoints
    matchEntry.Teleop.ScoringTotal.GridScoringByPlacement.Mid = midGridPoints
    matchEntry.Teleop.ScoringTotal.GridScoringByPlacement.Low = lowGridPoints

    matchEntry.Teleop.ScoringTotal.Cones = conePts
    matchEntry.Teleop.ScoringTotal.Cubes = cubePts

    //DRIVE
    matchEntry.Teleop.DriveStrength = driveStrength
    matchEntry.Teleop.DriveSpeed = driveSpeed

    matchEntry.Teleop.SmartPlacement = smartPlacement

    //CONE ACCURACIES
    matchEntry.Teleop.ConesAccuracy.High = conesHighTeleAutoAccuracy
    matchEntry.Teleop.ConesAccuracy.Mid = conesMidTeleAutoAccuracy
    matchEntry.Teleop.ConesAccuracy.Low = conesLowTeleAutoAccuracy
    matchEntry.Teleop.ConesAccuracy.Overall = conesTeleAutoAccuracy

    //CUBE ACCURACIES
    matchEntry.Teleop.CubesAccuracy.High = cubesHighTeleAutoAccuracy
    matchEntry.Teleop.CubesAccuracy.Mid = cubesMidTeleAutoAccuracy
    matchEntry.Teleop.CubesAccuracy.Low = cubesLowTeleAutoAccuracy
    matchEntry.Teleop.CubesAccuracy.Overall = cubesTeleAutoAccuracy

    //MATCH DETAILS
    matchEntry.RankingPts = rankFinal;

    matchEntry.Comments = comments

    matchEntry.Penalties.Fouls = fouls
    matchEntry.Penalties.Tech = techFouls
    matchEntry.Penalties.Penalties = penFinal;

    matchEntry.Priorities = stratFinal;

    if (props.matchData === undefined) {

      await apiCreateTeamMatchEntry(props.regional, teamNum, matchKey);
    }

    await apiUpdateTeamMatch(props.regional, teamNum, matchKey, matchEntry);
  }
}