import React from "react";
import buildMatchEntry, { ChargeStationType, PenaltyKinds, RankingPtsOpts, PriorityOpts } from '../api/builder';
import { apiCreateTeamMatchEntry, apiUpdateTeamMatch } from '../api';
import { getMatchesForRegional } from '../api/bluealliance';

/* GET MATCH TEAMS */

//CHANGE THE REGIONAL KEY VIA 'main.jsx'
/* gets given teams of a match */
export async function getMatchTeams(props) {
  console.log(props)
  let matchKey =  /*put this years event*/ props.regional + "_" + props.matchType + props.elmNum + "m" + props.matchNumber;

  const teams = async () => {
    getMatchesForRegional(props.regional)
      .then(data => {
        data.map((match) => {
          if (match.key === matchKey) {
            console.log("runs")
            props.changeState(match)
          }
        })
      })
      .catch(err => console.log(err))
  }
  // console.log(matchKey);
  // console.log(props.matchData)
  teams()
}


/* COPY ARRAY */

export function copyArray(Array) {
  let arrayCopy = [];
  for (let i = 0; i < Array.length; i++) {
    arrayCopy.push(Array[i]);
  }
  return arrayCopy
}

/* SUBMISSION */

/**
 * creates a match entry which is passed to the table
 * @param {*} props the entire form component (i was too lazy to send through each and individual state through a newly created instance of an object)
 */
export async function submitState(props) {
  let windowAlertMsg = 'Form is incomplete, you still need to fill out: ';
  let matchKey = /*put year event*/ props.regional + "_" + props.state.matchType + props.state.elmNum + "m" + props.state.matchNumber;
  let teamNum = props.state.teamNumber;

  let comments = props.state.comments;

  let dropVal = props.state.dropDownVal;
  let autoPlacement = dropVal[0];
  let driveStrength = dropVal[1];
  let driveSpeed = dropVal[2];

  let rankingState = props.state.rankingState;

  let endGame = props.state.endGameVal;
  let endGameUsed = endGame[0];
  let endGameStart = endGame[1];
  let endGameEnd = endGame[2];

  let chargeStationAuto = props.state.chargeStationValAuto;
  let booleans = props.state.booleans;

  let strats = props.state.strategyVal.slice();
  let strategies = props.state.strategyVal;
  let penalties = props.state.penaltyVal;
  let smartPlacement = booleans[1];

  let counterVal = props.state.counterBoxVals;

  let fouls = parseInt(counterVal[5]);
  let techFouls = parseInt(counterVal[6]);

  /*-------------------------------------------------------------SETTING SCORING VARIABLES--------------------------------------------------------------*/


  //AUTONOMOUS-----------------------------------------

  //Auto Speaker & Amp Scoring
  let autoAmpScored = parseInt(counterVal[0]);
  let autoSpeakerScored = parseInt(counterVal[1]);

  //TELEOP-----------------------------------------------

  //Tele Cubes & Cones Scoring
  let teleAmpScored = parseInt(counterVal[2]);
  let teleSpeakerScored = parseInt(counterVal[3]);
  let teleSpeakerAmplifiedScored = parseInt(counterVal[4]);

  // INITIALIZE SCORE--------------------------------------------------------------------------------------------
  let chargeStationPts = 0;
  let endGamePts = 0;
  let mobilityPts = 0;

  /*----------------------------------------------------POINT CALCULATIONS----------------------------------------------------------*/

  let mobility = booleans[0];

  let incompleteForm = false;
  let incompletePriorities = true;

  let override = props.state.override;

  if (endGameUsed === 'DockedEngaged') {
    endGamePts = 10;
  } else if (endGameUsed === "Docked") {
    endGamePts = 6;
  } else if (endGameUsed === 'Parked') {
    endGamePts = 2;
  } else {
    endGamePts = 0;
  }

  if (endGameUsed === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nWhat charge station the robot did"
  } else {
    if (endGameUsed !== 'None') {
      if (endGameUsed === 'Attemped') {
        if (endGameStart === '') {
          incompleteForm = true;
          windowAlertMsg = windowAlertMsg + "\nWhat time the robot started charge station"
        }
      } else {
        if (endGameStart === '') {
          incompleteForm = true;
          windowAlertMsg = windowAlertMsg + "\nWhat time the robot started charge station"
        } if (endGameEnd === '') {
          incompleteForm = true;
          windowAlertMsg = windowAlertMsg + "\nWhat time the robot ended charge station"
        }
      }
    }
  }

  if (chargeStationAuto === 'DockedEngaged') {
    chargeStationPts = 12;
  } else if (chargeStationAuto === "Docked") {
    chargeStationPts = 8;
  } else {
    chargeStationPts = 0;
  }

  if (chargeStationAuto === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nWhat charge station the robot did"
  }

  if (mobility === false) {
    mobilityPts = 0;
  } else {
    mobilityPts = 3;
  }

  let penFinal = [];
  for (let i = 0; i < penalties.length; i++) {
    let arr = penalties[i];
    if (arr === 'Yellow Card ') {
      penFinal[i] = PenaltyKinds.YELLOW_CARD;
    } else if (arr === 'Red Card ') {
      penFinal[i] = PenaltyKinds.RED_CARD;
    } else if (arr === 'Disable ') {
      penFinal[i] = PenaltyKinds.DISABLED
    } else if (arr === 'Disqualifed ') {
      penFinal[i] = PenaltyKinds.DQ
    } else if (arr === 'Bot Broke ') {
      penFinal[i] = PenaltyKinds.BROKEN_BOT
    } else if (arr === 'No Show ') {
      penFinal[i] = PenaltyKinds.NO_SHOW
    } else {
      penFinal[i] = PenaltyKinds.NONE;
    }
  }

  let stratFinal = [];
  for (let i = 0; i < strategies.length; i++) {
    let strategy = strategies[i];
    if (strategy === "Low Node ") {
      stratFinal.push(PriorityOpts.LOW);
    }
    else if (strategy === "Mid Node ") {
      stratFinal.push(PriorityOpts.MID);
    }
    else if (strategy === "High Node ") {
      stratFinal.push("Upper");
    }
    else if (strategy === "Cubes ") {
      stratFinal.push(PriorityOpts.CUBES);
    }
    else if (strategy === "Cones ") {
      stratFinal.push(PriorityOpts.CONES);
    }
    else if (strategy === "Charge Station ") {
      stratFinal.push(PriorityOpts.CHARGESTATION);
    }
    else if (strategy === "Single Substation ") {
      stratFinal.push(PriorityOpts.SINGLE_SUBSTATION);
    }
    else if (strategy === "Double Substation ") {
      stratFinal.push(PriorityOpts.DOUBLE_STATION);
    }
    else if (strategy === "Defense ") {
      stratFinal.push(PriorityOpts.DEFENSE);
    }
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

  let chargeTeleFinal = findChargeStationType(endGameUsed);
  let chargeAutoFinal = findChargeStationType(chargeStationAuto);


  //POINT CALCULATIONS
  let cycles = teleAmpScored + teleSpeakerScored + teleSpeakerAmplifiedScored
  let autoPoints = autoAmpScored * 2 + autoSpeakerScored * 5
  let telePoints = teleAmpScored + teleSpeakerScored * 2 + teleSpeakerAmplifiedScored * 5

  let points = chargeStationPts + endGamePts + mobilityPts + autoPoints + telePoints
  let ampPts = autoAmpScored * 2 + teleAmpScored
  let speakerPts = autoSpeakerScored * 5 + teleSpeakerScored * 2 + teleSpeakerAmplifiedScored * 5

  props.updatePoints(points, ampPts, speakerPts);

  if (autoPlacement === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nPosition of robot during Auto"
  }

  if (driveStrength === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nWhat strength is the robot drive"
  }

  if (driveSpeed === '') {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nHow fast is the robot drive"
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

  strats.filter(strat => {
    if (strat !== ' ') {
      incompletePriorities = false;
    }
  })

  if (incompletePriorities) {
    incompleteForm = true;
    windowAlertMsg = windowAlertMsg + "\nRobot priorities/strategies";
  }

  if (incompleteForm && !override) {
    window.alert(windowAlertMsg);
  } else if (!incompleteForm || override) {
    const matchEntry = buildMatchEntry(props.regional, teamNum, matchKey)

    //AUTONOMOUS MATCH ENTREES
    matchEntry.Autonomous.AutonomousPlacement = autoPlacement

    matchEntry.Autonomous.Scored.Cones.Upper = autoAmpScored //change to autoAmpScored
    matchEntry.Autonomous.Scored.Cones.Mid = autoSpeakerScored //change to autoSpeakerScored

    matchEntry.Autonomous.LeftCommunity = mobility
    matchEntry.Autonomous.ChargeStation = chargeAutoFinal

    //TELEOP MATCH ENTREES
    matchEntry.Autonomous.Scored.Cones.Lower = teleAmpScored //change to teleAmpScored
    matchEntry.Autonomous.Scored.Cones.Lower = teleSpeakerScored //change to teleSpeakerScored
    matchEntry.Autonomous.Scored.Cones.Lower = teleSpeakerAmplifiedScored //change to teleSpeakerAmplifiedScored

    matchEntry.Teleop.EndGame = chargeTeleFinal
    matchEntry.Teleop.EndGameTally.Start = endGameStart
    matchEntry.Teleop.EndGameTally.End = endGameEnd

    //SCORING TOTAL
    matchEntry.Teleop.ScoringTotal.GridPoints = cycles //change to cycles
    matchEntry.Teleop.ScoringTotal.Total = points
    matchEntry.Teleop.ScoringTotal.GridPoints = ampPts //change to ampPts
    matchEntry.Teleop.ScoringTotal.GridPoints = speakerPts //change to speakerPts



    //DRIVE
    matchEntry.Teleop.DriveStrength = driveStrength
    matchEntry.Teleop.DriveSpeed = driveSpeed

    matchEntry.Teleop.SmartPlacement = smartPlacement

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