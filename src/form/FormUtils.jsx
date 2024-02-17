import React from "react";
import buildMatchEntry, { ChargeStationType, PenaltyKinds, RankingPtsOpts, PriorityOpts } from '../api/builder';
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

  let fouls = parseInt(counterVal[24]);
  let techFouls = parseInt(counterVal[25]);

  /*-------------------------------------------------------------SETTING SCORING VARIABLES--------------------------------------------------------------*/


  //AUTONOMOUS-----------------------------------------

  //Auto Cubes & Cones Scoring
  let highAutoCubes = parseInt(counterVal[0]);
  let midAutoCubes = parseInt(counterVal[1]);
  let lowAutoCubes = parseInt(counterVal[2]);
  let highAutoCones = parseInt(counterVal[6]);
  let midAutoCones = parseInt(counterVal[7]);
  let lowAutoCones = parseInt(counterVal[8]);
  //Auto Cubes & Cones Attempted
  let highCubesAutoAttempted = parseInt(counterVal[3]);
  let midCubesAutoAttempted = parseInt(counterVal[4]);
  let lowCubesAutoAttempted = parseInt(counterVal[5]);
  let highConesAutoAttempted = parseInt(counterVal[9]);
  let midConesAutoAttempted = parseInt(counterVal[10]);
  let lowConesAutoAttempted = parseInt(counterVal[11]);


  //TELEOP-----------------------------------------------

  //Tele Cubes & Cones Scoring
  let highTeleCubes = parseInt(counterVal[12]);
  let midTeleCubes = parseInt(counterVal[13]);
  let lowTeleCubes = parseInt(counterVal[14]);
  let highTeleCones = parseInt(counterVal[18]);
  let midTeleCones = parseInt(counterVal[19]);
  let lowTeleCones = parseInt(counterVal[20]);
  //Tele Cubes & Cones Attempted
  let highCubesTeleAttempted = parseInt(counterVal[15]);
  let midCubesTeleAttempted = parseInt(counterVal[16]);
  let lowCubesTeleAttempted = parseInt(counterVal[17]);
  let highConesTeleAttempted = parseInt(counterVal[21]);
  let midConesTeleAttempted = parseInt(counterVal[22]);
  let lowConesTeleAttempted = parseInt(counterVal[23]);


  //OVERALL ATTEMPTED----------------------------------------------------------------------------------
  let highCubesAttempted = highCubesAutoAttempted + highCubesTeleAttempted + highTeleCubes + highAutoCubes;
  let highConesAttempted = highConesAutoAttempted + highConesTeleAttempted + highTeleCones + highAutoCones;
  let midCubesAttempted = midCubesAutoAttempted + midCubesTeleAttempted + midTeleCubes + midAutoCubes;
  let midConesAttempted = midConesAutoAttempted + midConesTeleAttempted + midTeleCones + midAutoCones;
  let lowCubesAttempted = lowCubesAutoAttempted + lowCubesTeleAttempted + lowTeleCubes + lowAutoCubes;
  let lowConesAttempted = lowConesAutoAttempted + lowConesTeleAttempted + lowTeleCones + lowTeleCones;

  let cubesAttempted = parseInt(counterVal[3]) + parseInt(counterVal[4]) + parseInt(counterVal[5]) + parseInt(counterVal[15]) + parseInt(counterVal[16]) + parseInt(counterVal[17]);
  let conesAttempted = parseInt(counterVal[9]) + parseInt(counterVal[10]) + parseInt(counterVal[11]) + parseInt(counterVal[21]) + parseInt(counterVal[22]) + parseInt(counterVal[23]);

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

  // function setPoints(points, totalGridPts, cubesTeleAutoAccuracy, conesTeleAutoAccuracy, cubePts, conePts){
  //   const savedPoints = props.setGivenState([18,0],points);
  //   const savedGridPoints = props.setGivenState([19,0],totalGridPts,savedPoints);
  //   const savedCubeAccuracy = props.setGivenState([20,0],cubesTeleAutoAccuracy,savedGridPoints);
  //   const savedConesAccuracy = props.setGivenState([21,0],conesTeleAutoAccuracy,savedCubeAccuracy);
  //   const savedCubePoints = props.setGivenState([22,0],cubePts,savedConesAccuracy);
  //   props.setGivenState([23,0],conePts,savedCubePoints);
  // }


  let highGridPoints = 6 * (highAutoCones + highAutoCubes) + 5 * (highTeleCones + highTeleCubes);
  let midGridPoints = 4 * (midAutoCones + midAutoCubes) + 3 * (midTeleCones + midTeleCubes);
  let lowGridPoints = 3 * (lowAutoCones + lowAutoCubes) + 2 * (lowTeleCones + lowTeleCubes);
  let autoPoints = 6 * (highAutoCones + highAutoCubes) + 4 * (midAutoCones + midAutoCubes) + 3 * (lowAutoCones + lowAutoCubes);
  let telePoints = 5 * (highTeleCones + highTeleCubes) + 3 * (midTeleCones + midTeleCubes) + 2 * (lowTeleCones + lowTeleCubes);
  let points = chargeStationPts + endGamePts + mobilityPts + autoPoints + telePoints;
  let cubePts = (highAutoCubes * 6) + (highTeleCubes * 5) + (midAutoCubes * 4) + (midTeleCubes * 3) + (lowAutoCubes * 3) + (lowTeleCubes * 2);
  let conePts = (highAutoCones * 6) + (highTeleCones * 5) + (midAutoCones * 4) + (midTeleCones * 3) + (lowAutoCones * 3) + (lowTeleCones * 2);

  let cubesHighTeleAutoAccuracy = 100 * ((highAutoCubes + highTeleCubes) / (highCubesAttempted + highAutoCubes + highTeleCubes));
  let conesHighTeleAutoAccuracy = 100 * ((highAutoCones + highTeleCones) / (highConesAttempted + highAutoCones + highTeleCones));

  let cubesMidTeleAutoAccuracy = 100 * ((midAutoCubes + midTeleCubes) / (midCubesAttempted + midAutoCubes + midTeleCubes));
  let conesMidTeleAutoAccuracy = 100 * ((midAutoCones + midTeleCones) / (midConesAttempted + midAutoCones + midTeleCones));

  let cubesLowTeleAutoAccuracy = 100 * ((lowAutoCubes + lowTeleCubes) / (lowCubesAttempted + lowAutoCubes + lowTeleCubes));
  let conesLowTeleAutoAccuracy = 100 * ((lowAutoCones + lowTeleCones) / (lowConesAttempted + lowAutoCones + lowTeleCones));

  let totalGridPts = highGridPoints + midGridPoints + lowGridPoints;

  let cubesTeleAutoAccuracy = 100 * ((lowAutoCubes + lowTeleCubes + midAutoCubes + midTeleCubes + highAutoCubes + highTeleCubes) / (cubesAttempted + lowAutoCubes + lowTeleCubes + midAutoCubes + midTeleCubes + highAutoCubes + highTeleCubes));
  let conesTeleAutoAccuracy = 100 * ((lowAutoCones + lowTeleCones + midAutoCones + midTeleCones + highAutoCones + highTeleCones) / (conesAttempted + lowAutoCones + lowTeleCones + midAutoCones + midTeleCones + highAutoCones + highTeleCones));

  props.updatePoints(points, totalGridPts, cubesTeleAutoAccuracy, conesTeleAutoAccuracy, cubePts, conePts)
  // setPoints(points, totalGridPts, cubesTeleAutoAccuracy, conesTeleAutoAccuracy, cubePts, conePts);

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

    matchEntry.Autonomous.Attempted.Cones.Upper = highConesAutoAttempted
    matchEntry.Autonomous.Attempted.Cones.Mid = midConesAutoAttempted
    matchEntry.Autonomous.Attempted.Cones.Lower = lowConesAutoAttempted
    matchEntry.Autonomous.Attempted.Cubes.Upper = highCubesAutoAttempted
    matchEntry.Autonomous.Attempted.Cubes.Mid = midCubesAutoAttempted
    matchEntry.Autonomous.Attempted.Cubes.Lower = lowCubesAutoAttempted

    matchEntry.Autonomous.Scored.Cones.Upper = highAutoCones
    matchEntry.Autonomous.Scored.Cones.Mid = midAutoCones
    matchEntry.Autonomous.Scored.Cones.Lower = lowAutoCones
    matchEntry.Autonomous.Scored.Cubes.Upper = highAutoCubes
    matchEntry.Autonomous.Scored.Cubes.Mid = midAutoCubes
    matchEntry.Autonomous.Scored.Cubes.Lower = lowAutoCubes

    matchEntry.Autonomous.LeftCommunity = mobility
    matchEntry.Autonomous.ChargeStation = chargeAutoFinal

    //TELEOP MATCH ENTREES
    matchEntry.Teleop.Scored.Cones.Upper = highTeleCones
    matchEntry.Teleop.Scored.Cones.Mid = midTeleCones
    matchEntry.Teleop.Scored.Cones.Lower = lowTeleCones
    matchEntry.Teleop.Scored.Cubes.Upper = highTeleCubes
    matchEntry.Teleop.Scored.Cubes.Mid = midTeleCubes
    matchEntry.Teleop.Scored.Cubes.Lower = lowTeleCubes

    matchEntry.Teleop.Attempted.Cones.Upper = highConesTeleAttempted
    matchEntry.Teleop.Attempted.Cones.Mid = midConesTeleAttempted
    matchEntry.Teleop.Attempted.Cones.Lower = lowConesTeleAttempted
    matchEntry.Teleop.Attempted.Cubes.Upper = highCubesTeleAttempted
    matchEntry.Teleop.Attempted.Cubes.Mid = midCubesTeleAttempted
    matchEntry.Teleop.Attempted.Cubes.Lower = lowCubesTeleAttempted

    matchEntry.Teleop.EndGame = chargeTeleFinal
    matchEntry.Teleop.EndGameTally.Start = endGameStart
    matchEntry.Teleop.EndGameTally.End = endGameEnd

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