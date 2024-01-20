import React from 'react';
// checkbox utility function imports //
import { makeWhoWonBox, makeStrategyBox, makeBooleanCheckBox, makePenaltyBox, makeBonusBox, makeOverrideBox } from './components/checkBox/CheckBoxUtils';

// dropdown utility function imports //
import { makeDropDownBox, makeMatchDropDown } from './components/dropDownBox/DropDownUtils';

// endgame utility function imports //
import { makeEndGameStartEndBox, makeEndGameDropDown } from './components/endGameBox/EndGameUtils';

// chargestation utility function imports //
import { makeChargeStationAuto } from './components/chargeStation/ChargeStationUtils';

// counterbox utility function imports //
import { makeCounterBox } from './components/counterBox/CounterBoxUtils';

import TextBox from './components/TextBox';
import Headers from './components/Header';

// general utility function imports //
import { submitState, copyArray } from './FormUtils';

// api imports //
import { apiCreateTeamMatchEntry, apiUpdateTeamMatch } from '../api';
import buildMatchEntry, { ChargeStationType, PenaltyKinds, RankingPtsOpts, PriorityOpts } from '../api/builder'
import { getMatchesForRegional } from '../api/bluealliance';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.matchData = props.matchData; // OVERALL MATCH DATA

    this.regional = props.regional; // REGIONAL KEY

    this.changeMatchType = this.changeMatchType.bind(this);
    this.changeElmNum = this.changeElmNum.bind(this);
    this.changeMatchNumber = this.changeMatchNumber.bind(this);
    this.makeMatchTypeDropDown = this.makeMatchTypeDropDown.bind(this);

    this.getMatchTeams = this.getMatchTeams.bind(this);
    this.changeTeam = this.changeTeam.bind(this);
    this.makeTeamDropdown = this.makeTeamDropdown.bind(this);

    this.whoWonClicked = this.whoWonClicked.bind(this);

    this.strategyBoxChanged = this.strategyBoxChanged.bind(this);

    this.changeBooleanCheckBox = this.changeBooleanCheckBox.bind(this);

    this.dropDownChanged = this.dropDownChanged.bind(this);

    this.changeEndGame = this.changeEndGame.bind(this);
    this.changeEndGameStartBox = this.changeEndGameStartBox.bind(this);
    this.changeEndGameEndBox = this.changeEndGameEndBox.bind(this);

    this.changeChargeStation = this.changeChargeStation.bind(this);

    this.setComment = this.setComment.bind(this);

    this.penaltyBoxChecked = this.penaltyBoxChecked.bind(this);

    this.bonusBoxChecked = this.bonusBoxChecked.bind(this);

    this.overrideChange = this.overrideChange.bind(this);

    this.counterBoxChanged = this.counterBoxChanged.bind(this);
    this.buttonMinus = this.buttonMinus.bind(this);
    this.buttonPlus = this.buttonPlus.bind(this);

    // this.submitState = this.submitState.bind(this);
    this.setPoints = this.setPoints.bind(this);

      // initializing form by making array of data
      console.log(`initializing form`)
      this.state = {
        comments: '', //comments
        matchType: '', //match type
        elmNum: '', //elimination
        matchNumber: '', //match number
        matchData: 'not found', //data for a given match
        teamNumber: ' ', //team num
        teams: ['team1', 'team2', 'team3', 'team4', 'team5', 'team6'], //teams for a given match
        override: false, //override bool
        endGameVal: ['', '', ''], //
        chargeStationValAuto: '', //charge station status during auto
        whoWon: '', //whichever team won
        checkedWhoWon: [' ', ' '], /* UNUSED */
        rankingPts: 0, //teams ranking points
        rankingState: ["", "", ""], // [ (win, tie, loss), activation, sustainability]
        penaltyVal: [' ', ' ', ' ', ' ', ' ', ' '], // yellow card, red card, dq, botbroke, no show
        dropDownVal: ['', '', ''], //dropdown vals???
        counterBoxVals: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //game objects scored/attempted
        strategyVal: [null, null, null, null, null, null, null, null, null], // strategies/priorities (lownode, midnode, highnode, cubes, cones, chargestation, singlesubstation, doublesubstation, defense)
        booleans: [false, false], //mobility, smartplacement
        totalPoints: 0, //total points
        totalGrid: 0, //total grid points
        cubesAccuracy: 0, //cube accuracy
        conesAccuracy: 0, //cone accuracy
        cubesPts: 0, //cube pts
        conesPts: 0, //cone pts
      }

  }

  componentDidMount() {
    console.log(`fill form`)
    if (!this.props.matchData)
      return
    let m = this.props.matchData;

    let rankingStates = [...m.RankingPts];
    let rankingPoints = 0;
    if (rankingStates[0] === "Win") {
      rankingStates[0] = "Team Won ";
      rankingPoints = 2;
    }
    else if (rankingStates[0] === "Tie") {
      rankingStates[0] = "Team Tied ";
      rankingPoints = 1;
    }
    else if (rankingStates[0] === "Loss") {
      rankingStates[0] = "Team Lost ";
      rankingPoints = 0;
    }

    if (rankingStates[1] === "ActivationBonus") {
      rankingStates[1] = "Activation ";
      rankingPoints++;
    }
    if (rankingStates[2] === "SustainabilityBonus") {
      rankingStates[2] = "Sustainability ";
      rankingPoints++;
    }

    let priorityStates = [...m.Priorities];
    for (let i = 0; i < priorityStates.length; i++) {
      if (priorityStates[i] === "Low") {
        priorityStates[0] = "Low Node ";
      }
      if (priorityStates[i] === "Mid") {
        priorityStates[1] = "Mid Node ";
      }
      if (priorityStates[i] === "Upper") {
        priorityStates[2] = "High Node ";
      }
      if (priorityStates[i] === "Cubes") {
        priorityStates[3] = "Cubes ";
      }
      if (priorityStates[i] === "Cones") {
        priorityStates[4] = "Cones ";
      }
      if (priorityStates[i] === "ChargeStation") {
        priorityStates[5] = "Charge Station ";
      }
      if (priorityStates[i] === "SingleSubstation") {
        priorityStates[6] = "Single Substation ";
      }
      if (priorityStates[i] === "DoubleStation") {
        priorityStates[7] = "Double Substation ";
      }
      if (priorityStates[i] === "Defense") {
        priorityStates[8] = "Defense ";
      }
    }

    let penaltyStates = [...m.Penalties.Penalties];
    for (let i = 0; i < penaltyStates.length; i++) {
      if (penaltyStates[i] === "YellowCard") {
        penaltyStates[0] = "Yellow Card ";
      }
      if (penaltyStates[i] === "RedCard") {
        penaltyStates[1] = "Red Card ";
      }
      if (penaltyStates[i] === "Disabled") {
        penaltyStates[2] = "Disable ";
      }
      if (penaltyStates[i] === "DQ") {
        penaltyStates[3] = "Disqualified ";
      }
      if (penaltyStates[i] === "BrokenBot") {
        penaltyStates[4] = "Bot Broke ";
      }
      if (penaltyStates[i] === "NoShow") {
        penaltyStates[5] = "No Show ";
      }
    }

    this.setState({
      comments: m.Comments,
      matchType: matchType,
      elmNum: (((m.id.substring(8)).indexOf("f") >= 0) ? (m.id.substring(m.id.length())) : ''), //MATCH ELM NUMBER
      matchNumber: matchNumber,
      matchData: [],
      teamNumber: m.Team,
      teams: [],
      override: true, //OVERRIDE
      endGameVal: [
          /*0 - Tele Charge Station*/m.Teleop.EndGame,
          /*1 - Endgame Start Time*/m.Teleop.EndGameTally.Start,
          /*2 - Engame End Time*/m.Teleop.EndGameTally.End
      ],
      chargeStationValAuto: m.Autonomous.ChargeStation,
      whoWon: '',
      checkedWhoWon: ['', ''],
      rankingPts: rankingPoints,
      rankingState: rankingStates, //RANKING PTS STATES
      penaltyVal: penaltyStates,
      dropDownVal: [
          /*0 - AutoPlacement*/m.Autonomous.AutonomousPlacement,
          /*1 - driveStrength*/m.Teleop.DriveStrength,
          /*2 - driveSpeed*/m.Teleop.DriveSpeed
      ],
      counterBoxVals: [
          //AUTONOMOUS SCORING
          /*0*/m.Autonomous.Scored.Cubes.Upper,
          /*1*/m.Autonomous.Scored.Cubes.Mid,
          /*2*/m.Autonomous.Scored.Cubes.Lower,
          /*3*/m.Autonomous.Attempted.Cubes.Upper,
          /*4*/m.Autonomous.Attempted.Cubes.Mid,
          /*5*/m.Autonomous.Attempted.Cubes.Lower,
          /*6*/m.Autonomous.Scored.Cones.Upper,
          /*7*/m.Autonomous.Scored.Cones.Mid,
          /*8*/m.Autonomous.Scored.Cones.Lower,
          /*9*/m.Autonomous.Attempted.Cones.Upper,
          /*10*/m.Autonomous.Attempted.Cones.Mid,
          /*11*/m.Autonomous.Attempted.Cones.Lower,
          //TELEOP SCORING
          /*12*/m.Teleop.Scored.Cubes.Upper,
          /*13*/m.Teleop.Scored.Cubes.Mid,
          /*14*/m.Teleop.Scored.Cubes.Lower,
          /*15*/m.Teleop.Attempted.Cubes.Upper,
          /*16*/m.Teleop.Attempted.Cubes.Mid,
          /*17*/m.Teleop.Attempted.Cubes.Lower,
          /*18*/m.Teleop.Scored.Cones.Upper,
          /*19*/m.Teleop.Scored.Cones.Mid,
          /*20*/m.Teleop.Scored.Cones.Lower,
          /*21*/m.Teleop.Attempted.Cones.Upper,
          /*22*/m.Teleop.Attempted.Cones.Mid,
          /*23*/m.Teleop.Attempted.Cones.Lower,
          /*24*/m.Penalties.Fouls,
          /*25*/m.Penalties.Tech
      ],
      strategyVal: priorityStates,//[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      booleans: [
          /*0 - MobilityVal*/m.Autonomous.LeftCommunity,
          /*1 - SmartPlacement*/m.Teleop.SmartPlacement
      ],
      totalPoints: m.Teleop.ScoringTotal.Total,
      totalGrid: m.Teleop.ScoringTotal.GridPoints,
      cubesAccuracy: m.Teleop.CubesAccuracy.Overall,
      conesAccuracy: m.Teleop.ConesAccuracy.Overall,
      cubesPts: m.Teleop.ScoringTotal.Cubes,
      conesPts: m.Teleop.ScoringTotal.Cones,
    })
  }

  //------------------------------------------------------------------------------------------------------------------------//

  changeMatchType(event) {
    let matchType = event;
    if (matchType === 'q') {
      this.setState({ elmNum: '' });
    }
    this.setState({ matchType: event });
    this.setState({ teams: ['team1', 'team2', 'team3', 'team4', 'team5', 'team6'] });
    this.setState({ teamNumber: ' ' });
  }

  changeElmNum(event) {
    this.setState({ elmNum: (event.target.value) });
    this.setState({ teams: ['team1', 'team2', 'team3', 'team4', 'team5', 'team6'] });
    this.setState({ teamNumber: ' ' });
  }

  changeMatchNumber(event) {
    if (event.target.value !== 0) {
      this.setState({ override: false })
    }
    this.setState({ matchNumber: event.target.value });
    this.setState({ teams: ['team1', 'team2', 'team3', 'team4', 'team5', 'team6'] });
    this.setState({ teamNumber: ' ' });
  }

  makeMatchTypeDropDown(matchType) {
    if (matchType === 'qf' || matchType === 'sf' || matchType === 'f') {
      return (
        <input value={this.state.elmNum} onChange={this.changeElmNum} />
      )
    }
  }

  //CHANGE THE REGIONAL KEY VIA 'main.jsx'

  /* gets given teams of a match */
  async getMatchTeams() {
    let matchKey =  /*put this years event*/ this.regional + "_" + this.state.matchType + this.state.elmNum + "m" + this.state.matchNumber;
    const teams = async () => {
      getMatchesForRegional(this.regional)
        .then(data => {
          data.map((match) => {
            // console.log(match.key)
            if (match.key === matchKey) {
              this.setState({ matchData: match })
              this.setState({ teams: match.alliances.blue.team_keys.concat(match.alliances.red.team_keys) });
              console.log({ teams: match.alliances.blue.team_keys.concat(match.alliances.red.team_keys) });

            }
          })
        })
        .catch(err => console.log(err))
    }
    console.log(this.matchKey);
    console.log(this.matchData)
    teams();
  }

  changeTeam(event) {
    this.setState({ teamNumber: event.target.value });
    let data = this.state.matchData;
    let teamColor = 'red';
    let selectedTeam = event.target.value;
    data.alliances.blue.team_keys.map((team) => {
      if (team === selectedTeam) {
        teamColor = 'blue';
      }
    })

    let whoWon = '';

    if (data.alliances.blue.score > data.alliances.red.score) {
      whoWon = 'blue';
    } else if (data.alliances.blue.score < data.alliances.red.score) {
      whoWon = 'red';
    } else {
      whoWon = 'Tie';
    }

    let rankingStates = this.state.rankingState;

    if (teamColor === whoWon) {
      this.setState({ rankingPts: 2 });
      rankingStates[0] = "Team Won ";
    } else if (whoWon === 'Tie') {
      this.setState({ rankingPts: 1 });
      rankingStates[0] = "Team Tied ";
    } else if ((whoWon === 'blue' || whoWon === 'red') && teamColor !== whoWon) {
      this.setState({ rankingPts: 0 });
      rankingStates[0] = "Team Lost ";
    }

    rankingStates[1] = '';
    rankingStates[2] = '';
    this.setState({ whoWon: whoWon });
  }

  makeTeamDropdown() {
    let alliances = this.state.teams;
    return parseInt(this.state.matchNumber) !== 0 ? (
      <div>
        <select onChange={this.changeTeam}>
          <option value={this.state.teamNumber}> {this.state.teamNumber} </option>
          {alliances.map((alliances) => <option key={alliances}> {alliances} </option>)}
        </select>
      </div>
    ) : (
      <div>
        <lable> Team Number
          <input type='number' onChange={e => { this.setState({ teamNumber: 'frc' + e.target.value }) }}></input>
        </lable>
      </div>
    )
  }

  whoWonClicked(i, label) {
    let data = this.state.matchData;
    let rankingStates = (this.state.rankingState);
    if (data === "not found") {
      window.alert("PICK A TEAM FIRST");
    }
    else {
      if (rankingStates[0] === label) {
        rankingStates[0] = '';
        this.setState({ rankingPts: 0 })
      }
      else if (rankingStates[0] === '') {
        rankingStates[0] = label;

        if (label === "Team Won ") {
          this.setState({ rankingPts: 2 })
        }
        else if (label === "Team Tied ") {
          this.setState({ rankingPts: 1 })
        }
        else if (label === "Team Lost ") {
          this.setState({ rankingPts: 0 })
        }
      }

      rankingStates[1] = '';
      rankingStates[2] = '';

      this.setState({ rankingState: rankingStates })
    }
  }

  strategyBoxChanged(i, label) {
    let strategyStates = copyArray(this.state.strategyVal);
    if (strategyStates[i] === label) {
      strategyStates[i] = ' ';
    } else {
      strategyStates[i] = label;
    }

    this.setState({ strategyVal: strategyStates })
  }

  changeBooleanCheckBox(i) {
    let booleanStates = copyArray(this.state.booleans)
    booleanStates[i] = !booleanStates[i]
    this.setState({ booleans: booleanStates })
  }

  //---------------------------------------------------------------------------------------------------------------//

  dropDownChanged(event, i) {
    let dropDownStates = this.state.dropDownVal;
    dropDownStates[i] = event.target.value;
  }

  //--------------------------------------------------------------------------------------------------------------//

  changeEndGame(event) {
    let endGame = Array(this.state.endGameVal);
    endGame[0] = event.target.value;
    this.setState({ endGameVal: endGame });
  }

  changeEndGameStartBox(event) {
    let endGame = this.state.endGameVal;
    endGame[1] = event.target.value;
  }

  changeEndGameEndBox(event) {
    let endGame = this.state.endGameVal;
    endGame[2] = event.target.value;
  }

  changeChargeStation(event) {
    let chargeStation = this.state.chargeStationValAuto;
    chargeStation = event.target.value;
    this.setState({ chargeStationValAuto: chargeStation });
  }

  //-------------------------------------------------------------------------------------------------------------//

  setComment(event) {
    this.setState({ comments: event.target.value });
  }

  //-------------------------------------------------------------------------------------------------------------//

  penaltyBoxChecked(i, label) {
    let penaltyStates = copyArray(this.state.penaltyVal);
    if (penaltyStates[i] === label) {
      penaltyStates[i] = ' ';
    } else {
      penaltyStates[i] = label;
    }
    this.setState({ penaltyVal: penaltyStates })
  }

  bonusBoxChecked(i, label) {
    let ranking = copyArray(this.state.rankingState);
    if (ranking[i] === label) {
      this.setState({ rankingPts: this.state.rankingPts - 1 });
    } else {
      this.setState({ rankingPts: this.state.rankingPts + 1 });
    }


    if (ranking[i] === label) {
      ranking[i] = ' ';
    } else {
      ranking[i] = label;
    }

    this.setState({ rankingState: ranking })
  }

  overrideChange() {
    this.setState({ override: !this.state.override });
  }

  //-------------------------------------------------------------------------------------------------------------//

  counterBoxChanged(event, i) {
    let counterStates = this.state.counterBoxVals;
    if (event.target.value === '' || event.target.value == null) {
      counterStates[i] = 0
    }
    else {
      counterStates[i] = event.target.value;
    }
  }

  buttonMinus(event, i) {
    let counterStates = this.state.counterBoxVals;
    if (counterStates[i] > 0) {
      counterStates[i] = parseInt(counterStates[i] - 1)
    }
    else if (counterStates[i] <= 0) {
      counterStates[i] = 0
    }
  }

  buttonPlus(event, i) {
    let counterStates = this.state.counterBoxVals;
    if (counterStates[i] >= 0) {
      counterStates[i] = parseInt(counterStates[i] + 1)
    }
    else if (counterStates[i] < 0) {
      counterStates[i] = 0
    }
  }

  //-------------------------------------------------------------------------------------------------------------//

  setPoints(points, totalGridPts, cubesTeleAutoAccuracy, conesTeleAutoAccuracy, cubePts, conePts) {
    this.setState({
      totalPoints: points,
      totalGrid: totalGridPts,
      cubesAccuracy: cubesTeleAutoAccuracy,
      conesAccuracy: conesTeleAutoAccuracy,
      cubesPts: cubePts,
      conesPts: conePts
    })
  }

  //-------------------------------------------------------------------------------------------------------------//

  // rendering physical and visible website components
  render() {
    return (
      <div>
        {/* TITLE */}
        <h2> CHARGED UP FORM  <img alt="" src={'./images/BLUETHUNDERLOGO_WHITE.png'} width="50px" height="50px"></img> </h2>

        {/* CHECK STATE BUTTON */}
        <button onClick={ () => console.log(this.state) }> Check State </button>

        {/* MATCH INITIATION */}
        {makeMatchDropDown({ matchType: this.state.matchType, matchNumber: this.state.matchNumber, changeMatchType: this.changeMatchType, changeElmNum: this.changeElmNum, makeMatchTypeDropDown: this.makeMatchTypeDropDown, changeMatchNumber: this.changeMatchNumber })}
        <button onClick={this.getMatchTeams}>GET MATCH TEAM</button>
        <br></br>
        {this.makeTeamDropdown()}
        <br></br>

        {/* AUTONOMOUS */}
        <h3>AUTONOMOUS:</h3>
        <img alt="" src={'./images/auto placement.jpg'} width="250px" height="260px"></img>
        {makeDropDownBox({ dropDownVal: this.state.dropDownVal, dropDownChanged: this.dropDownChanged }, "Auto Placement: ", [1, 2, 3, 4, 5, 6], 0)}
        <br></br>
        <p>🟪Cubes Scored</p>
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "High Cubes Made: ", 0)}
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Mid Cubes Made:  ", 1)}
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Low Cubes Made:  ", 2)}
        <p>🟪Cubes Attempted</p>
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "High Cubes Attempted: ", 3)}
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Mid Cubes Attempted: ", 4)}
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Low Cubes Attempted: ", 5)}
        <p>🔺Cones Scored</p>
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "High Cones Made: ", 6)}
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Mid Cones Made: ", 7)}
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Low Cones Made: ", 8)}
        <p>🔺Cones Attempted</p>
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "High Cones Attempted: ", 9)}
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Mid Cones Attempted: ", 10)}
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Low Cones Attempted: ", 11)}
        <br></br>
        {makeBooleanCheckBox({ booleans: this.state.booleans, changeBooleanCheckBox: this.changeBooleanCheckBox }, "Mobility ", 0)}
        <br></br>
        {makeChargeStationAuto({ chargeStationValAuto: this.state.chargeStationValAuto, changeChargeStation: this.changeChargeStation })}
        <br></br>

        {/* TELEOP */}
        <h3>TELE-OP:</h3>
        <p>🟪Cubes Scored</p>
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "High Cubes Made: ", 12)}
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Mid Cubes Made: ", 13)}
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Low Cubes Made: ", 14)}
        <p>🟪Cubes Attempted</p>
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "High Cubes Attempted: ", 15)}
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Mid Cubes Attempted: ", 16)}
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Low Cubes Attempted: ", 17)}
        <p>🔺Cones Scored</p>
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "High Cones Made: ", 18)}
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Mid Cones Made: ", 19)}
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Low Cones Made: ", 20)}
        <p>🔺Cones Attempted</p>
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "High Cones Attempted: ", 21)}
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Mid Cones Attempted: ", 22)}
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Low Cones Attempted: ", 23)}
        <br></br>
        {makeEndGameDropDown({ endGameVal: this.state.endGameVal, changeEndGame: this.changeEndGame })}
        {makeEndGameStartEndBox({ endGameVal: this.state.endGameVal, changeEndGameStartBox: this.changeEndGameStartBox, changeEndGameEndBox: this.changeEndGameEndBox })}
        <br></br>

        {/* ROBOT/TEAM INFO */}
        {makeBooleanCheckBox({ booleans: this.state.booleans, changeBooleanCheckBox: this.changeBooleanCheckBox }, "Smart Placement (creates links) ", 1)}
        <br></br>
        {makeDropDownBox({ dropDownVal: this.state.dropDownVal, dropDownChanged: this.dropDownChanged }, "Drive Strength: ", ["Weak", "Normal", "Strong"], 1)}
        {makeDropDownBox({ dropDownVal: this.state.dropDownVal, dropDownChanged: this.dropDownChanged }, "Drive Speed: ", ["Slow", "Normal", "Fast"], 2)}
        <br></br>

        {/* PENALTIES */}
        <h3>PENALTIES:</h3>
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Fouls: ", 24)}
        {makeCounterBox({ counterBoxVals: this.state.counterBoxVals, counterboxChanged: this.counterBoxChanged, buttonMinus: this.buttonMinus, buttonPlus: this.buttonPlus }, "Tech Fouls: ", 25)}
        {makePenaltyBox({ penaltyVal: this.state.penaltyVal,penaltyBoxChecked: this.penaltyBoxChecked }, "Yellow Card ", 0)}
        {makePenaltyBox({ penaltyVal: this.state.penaltyVal,penaltyBoxChecked: this.penaltyBoxChecked }, "Red Card ", 1)}
        {makePenaltyBox({ penaltyVal: this.state.penaltyVal,penaltyBoxChecked: this.penaltyBoxChecked }, "Disable ", 2)}
        {makePenaltyBox({ penaltyVal: this.state.penaltyVal,penaltyBoxChecked: this.penaltyBoxChecked }, "Disqualifed ", 3)}
        {makePenaltyBox({ penaltyVal: this.state.penaltyVal,penaltyBoxChecked: this.penaltyBoxChecked }, "Bot Broke ", 4)}
        {makePenaltyBox({ penaltyVal: this.state.penaltyVal,penaltyBoxChecked: this.penaltyBoxChecked }, "No Show ", 5)}
        <br></br>

        {/* RANKING POINTS */}
        <h3>RANKING POINTS:</h3>
        {makeWhoWonBox({ rankingState: this.state.rankingState, whoWonClicked: this.whoWonClicked }, "Team Won ", 0)}
        {makeWhoWonBox({ rankingState: this.state.rankingState, whoWonClicked: this.whoWonClicked }, "Team Tied ", 1)}
        {makeWhoWonBox({ rankingState: this.state.rankingState, whoWonClicked: this.whoWonClicked }, "Team Lost ", 2)}
        {makeBonusBox({ rankingState: this.state.rankingState, bonusBoxChecked: this.bonusBoxChecked }, "Activation ", 1)}
        {makeBonusBox({ rankingState: this.state.rankingState, bonusBoxChecked: this.bonusBoxChecked }, "Sustainability ", 2)}
        <Headers display={this.state.rankingPts} />
        <br></br>

        {/* STRATEGY & PRIORITIES */}
        <h3>📝STRATEGY & PRIORITIES:</h3>
        {makeStrategyBox({ strategyVal: this.state.strategyVal, strategyBox: this.strategyBoxChanged }, "Low Node ", 0)}
        {makeStrategyBox({ strategyVal: this.state.strategyVal, strategyBox: this.strategyBoxChanged }, "Mid Node ", 1)}
        {makeStrategyBox({ strategyVal: this.state.strategyVal, strategyBox: this.strategyBoxChanged }, "High Node ", 2)}
        {makeStrategyBox({ strategyVal: this.state.strategyVal, strategyBox: this.strategyBoxChanged }, "Cubes ", 3)}
        {makeStrategyBox({ strategyVal: this.state.strategyVal, strategyBox: this.strategyBoxChanged }, "Cones ", 4)}
        {makeStrategyBox({ strategyVal: this.state.strategyVal, strategyBox: this.strategyBoxChanged }, "Charge Station ", 5)}
        {makeStrategyBox({ strategyVal: this.state.strategyVal, strategyBox: this.strategyBoxChanged }, "Single Substation ", 6)}
        {makeStrategyBox({ strategyVal: this.state.strategyVal, strategyBox: this.strategyBoxChanged }, "Double Substation ", 7)}
        {makeStrategyBox({ strategyVal: this.state.strategyVal, strategyBox: this.strategyBoxChanged }, "Defense ", 8)}
        <br></br>

        {/* COMMENTS */}
        <TextBox title={"💬Comments: "} commentState={this.setComment} value={this.state.comments}></TextBox>

        {/* SUBMISSION */}
        <div>
          <br></br>
          <button onClick={(evt) => {
            evt.preventDefault()
            submitState(this)
              .then(() => {
                alert("Data successfully submitted")
              })
              .catch(err => {
                console.log(err)
                try {
                  alert(`Error occurred when submitting data ${err?.message}`)
                }
                catch(e) {

                }
              })
          }
          }>SUBMIT</button>
        </div>
        <p> ONLY CLICK IF NOTHING ELSE CAN BE FILLED! </p>
        {makeOverrideBox({ override: this.state.override, overrideChange: this.overrideChange })}
        <br></br>
      </div>
    )
  }
}

export default Form;