import React from "react";

export async function submitState(props, builderModule) {
    let windowAlertMsg = 'Form is incomplete, you still need to fill out: ';
    let matchKey = /*put this years event*/ this.regional  + "_" + this.state.matchType + this.state.elmNum + "m" + this.state.matchNumber;
    let teamNum = this.state.teamNumber;

    let comments = this.state.comments;

    let dropVal = this.state.dropDownVal;
    let autoPlacement = dropVal[0];
    let driveStrength = dropVal[1];
    let driveSpeed = dropVal[2];

    let rankingState = this.state.rankingState;

    let endGame = this.state.endGameVal;
    let endGameUsed = endGame[0];
    let endGameStart = endGame[1];
    let endGameEnd = endGame[2];

    let chargeStationAuto = this.state.chargeStationValAuto;
    let booleans = this.state.booleans;

    let strats = this.state.strategyVal.slice();
    let strategies = this.state.strategyVal;
    let penalties = this.state.penaltyVal;
    let smartPlacement = booleans[1];

    let counterVal = this.state.counterBoxVals;

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

    let override = this.state.override;

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
        penFinal[i] = builderModule.PenaltyKinds.YELLOW_CARD;
      } else if (arr === 'Red Card ') {
        penFinal[i] = builderModule.PenaltyKinds.RED_CARD;
      } else if (arr === 'Disable ') {
        penFinal[i] = builderModule.PenaltyKinds.DISABLED
      } else if (arr === 'Disqualifed ') {
        penFinal[i] = builderModule.PenaltyKinds.DQ
      } else if (arr === 'Bot Broke ') {
        penFinal[i] = builderModule.PenaltyKinds.BROKEN_BOT
      } else if (arr === 'No Show ') {
        penFinal[i] = builderModule.PenaltyKinds.NO_SHOW
      } else {
        penFinal[i] = builderModule.PenaltyKinds.NONE;
      }
    }

    let stratFinal = [];
    for (let i = 0; i < strategies.length; i++) {
      let strategy = strategies[i];
      if (strategy === "Low Node ") {
        stratFinal.push(builderModule.PriorityOpts.LOW);
      }
      else if (strategy === "Mid Node ") {
        stratFinal.push(builderModule.PriorityOpts.MID);
      }
      else if (strategy === "High Node ") {
        stratFinal.push("Upper");
      }
      else if (strategy === "Cubes ") {
        stratFinal.push(builderModule.PriorityOpts.CUBES);
      }
      else if (strategy === "Cones ") {
        stratFinal.push(builderModule.PriorityOpts.CONES);
      }
      else if (strategy === "Charge Station ") {
        stratFinal.push(builderModule.PriorityOpts.CHARGESTATION);
      }
      else if (strategy === "Single Substation ") {
        stratFinal.push(builderModule.PriorityOpts.SINGLE_SUBSTATION);
      }
      else if (strategy === "Double Substation ") {
        stratFinal.push(builderModule.PriorityOpts.DOUBLE_STATION);
      }
      else if (strategy === "Defense ") {
        stratFinal.push(builderModule.PriorityOpts.DEFENSE);
      }
    }

    let rankFinal = [];
    for (let i = 0; i < rankingState.length; i++) {
      let rankOp = rankingState[i];
      if (rankOp === "Team Won ") {
        rankFinal.push(builderModule.RankingPtsOpts.WIN);
      }
      else if (rankOp === "Team Tied ") {
        rankFinal.push(builderModule.RankingPtsOpts.TIE);
      }
      else if (rankOp === "Team Lost ") {
        rankFinal.push(builderModule.RankingPtsOpts.LOSS);
      }
      else if (rankOp === "Sustainability ") {
        rankFinal.push(builderModule.RankingPtsOpts.SUSTAINABILITY_BONUS);
      }
      else if (rankOp === "Activation ") {
        rankFinal.push(builderModule.RankingPtsOpts.ACTIVATION_BONUS);
      }
    }

    function findChargeStationType(chargeStation) {
      if (chargeStation === 'None') {
        return builderModule.ChargeStationType.NONE;
      } else if (chargeStation === 'DockedEngaged') {
        return builderModule.ChargeStationType.DOCKED_ENGAGED;
      } else if (chargeStation === 'Docked') {
        return builderModule.ChargeStationType.DOCKED;
      } else if (chargeStation === 'Parked') {
        return builderModule.ChargeStationType.Parked;
      } else if (chargeStation === 'Attempted') {
        return builderModule.ChargeStationType.ATTEMPTED;
      }
    }

    let chargeTeleFinal = findChargeStationType(endGameUsed);
    let chargeAutoFinal = findChargeStationType(chargeStationAuto);


    //POINT CALCULATIONS

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

    this.setState({
      totalPoints: points,
      totalGrid: totalGridPts,
      cubesAccuracy: cubesTeleAutoAccuracy,
      conesAccuracy: conesTeleAutoAccuracy,
      cubesPts: cubePts,
      conesPts: conePts

    })

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

    if (this.state.matchType === 'qf' || this.state.matchType === 'sf' || this.state.matchType === 'f') {
      if (this.state.elmNum === '') {
        incompleteForm = true;
        windowAlertMsg = windowAlertMsg + "\nFinals Number";
      }
    } else if (this.state.matchType === '') {
      incompleteForm = true;
      windowAlertMsg = windowAlertMsg + "\nMatch Type (Qualifications, Quarterfinals, Semifinals, Finals)"
    }

    if (this.state.matchNumber === '') {
      incompleteForm = true;
      windowAlertMsg = windowAlertMsg + "\nMatch Number";
    }

    if (this.state.teamNumber === '') {
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
      const matchEntry = buildMatchEntry(this.regional, teamNum, matchKey)

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

      if (this.matchData === undefined) {

        await apiCreateTeamMatchEntry(this.regional, teamNum, matchKey);
      }

      await apiUpdateTeamMatch(this.regional, teamNum, matchKey, matchEntry);
    }
}