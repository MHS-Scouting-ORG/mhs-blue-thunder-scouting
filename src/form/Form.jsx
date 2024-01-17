import React from 'react';
// checkbox imports //
import CheckBox from './components/checkBox/CheckBox';

// dropdown imports //
import DropDown from './components/dropDownBox/DropDown';
import MatchDropDown from './components/dropDownBox/MatchDropDown';
import { makeDropDownBox, makeMatchDropDown } from './components/dropDownBox/DropDownUtils';

// endgame imports //
import EndGame from './components/endGameBox/EndGame';
// import { makeEndGameStartEndBox, } from './components/endGameBox/EndGameUtils';

// chargestation imports //
import ChargeStation from './components/chargeStation/ChargeStation';


// counterbox imports //
import CounterBox from './components/counterBox/CounterBox';
import { makeWhoWonBox, makeStrategyBox, makeBooleanCheckBox, makePenaltyBox, makeBonusBox, makeOverrideBox } from './components/checkBox/CheckBoxUtils';

import TextBox from './components/TextBox';
import Headers from './components/Header';

import { apiCreateTeamMatchEntry, apiUpdateTeamMatch } from '../api';
import buildMatchEntry, { ChargeStationType, PenaltyKinds, RankingPtsOpts, PriorityOpts } from '../api/builder'
import { getMatchesForRegional } from '../api/bluealliance';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.matchData = props.matchData; // OVERALL MATCH DATA

    this.regional = props.regional;
    
    this.changeMatchType = this.changeMatchType.bind(this);
    this.changeElmNum = this.changeElmNum.bind(this);
    this.changeMatchNumber = this.changeMatchNumber.bind(this);
    this.makeMatchTypeDropDown = this.makeMatchTypeDropDown.bind(this);
    // this.makeMatchDropDown = this.makeMatchDropDown.bind(this);

    this.getMatchTeams = this.getMatchTeams.bind(this);
    this.changeTeam = this.changeTeam.bind(this);
    this.makeTeamDropdown = this.makeTeamDropdown.bind(this);

    this.whoWonClicked = this.whoWonClicked.bind(this);
    // this.makeWhoWonBox = this.makeWhoWonBox.bind(this);

    this.copyArray = this.copyArray.bind(this);

    this.strategyBoxChanged = this.strategyBoxChanged.bind(this);
    // this.makeStrategyBox = this.makeStrategyBox.bind(this);

    this.changeBooleanCheckBox = this.changeBooleanCheckBox.bind(this);
    // this.makeBooleanCheckBox = this.makeBooleanCheckBox.bind(this);

    // this.makeMatchDropDown = this.makeMatchDropDown.bind(this)
    this.dropDownChanged = this.dropDownChanged.bind(this);
    // this.makeDropDownBox = this.makeDropDownBox.bind(this);

    this.changeEndGame = this.changeEndGame.bind(this);
    this.changeEndGameStartBox = this.changeEndGameStartBox.bind(this);
    this.changeEndGameEndBox = this.changeEndGameEndBox.bind(this);
    this.makeEndGameStartEndBox = this.makeEndGameStartEndBox.bind(this);
    this.makeEndGameDropDown = this.makeEndGameDropDown.bind(this);
    this.changeChargeStation = this.changeChargeStation.bind(this);
    this.makeChargeStationAuto = this.makeChargeStationAuto.bind(this);

    this.setComment = this.setComment.bind(this);

    this.penaltyBoxChecked = this.penaltyBoxChecked.bind(this);
    // this.makePenaltyBox = this.makePenaltyBox.bind(this);
    this.bonusBoxChecked = this.bonusBoxChecked.bind(this);
    // this.makeBonusBox = this.makeBonusBox.bind(this);
    this.overrideChange = this.overrideChange.bind(this);
    // this.makeOverrideBox = this.makeOverrideBox.bind(this);

    this.counterBoxChanged = this.counterBoxChanged.bind(this);
    this.buttonMinus = this.buttonMinus.bind(this);
    this.buttonPlus = this.buttonPlus.bind(this);
    this.makeCounterBox = this.makeCounterBox.bind(this);

    this.submitState = this.submitState.bind(this);

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

    // creating variable to get match type (quals, elims), and match number
    const [a, r, matchType, matchNumber] = m.id.match(/(.+)_([a-z]{1,2}[0-9]?)m([0-9+]{1,2})/)

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

  // makeMatchDropDown() {
  //   let matchTypeState = this.state.matchType;
  //   let matchState = '';
  //   if (matchTypeState === 'q') {
  //     matchState = "Qualification";
  //   } else if (matchTypeState === 'qf') {
  //     matchState = "QuarterFinal";
  //   } else if (matchTypeState === 'sf') {
  //     matchState = "SemiFinal";
  //   } else if (matchTypeState === 'f') {
  //     matchState = "Final";
  //   }
  //   return (
  //     <div>
  //       <MatchDropDown
  //         setMatchType={this.changeMatchType}
  //         setElmNum={this.changeElmNum}
  //         generateMatchTypeNum={this.makeMatchTypeDropDown}
  //         setMatchNumber={this.changeMatchNumber}
  //         matchTypeValue={matchState}
  //         matchNumber={this.state.matchNumber}
  //       />
  //     </div>
  //   )
  // }

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
            console.log(match.key)
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

  // makeWhoWonBox(name, i) {
  //   let rankingStates = this.state.rankingState;
  //   let checkVal;
  //   if (rankingStates[0] === name) {
  //     checkVal = true;
  //   } else {
  //     checkVal = false;
  //   }
  //   return (
  //     <div>
  //       <CheckBox
  //         label={name}
  //         changeCheckBoxState={this.whoWonClicked}
  //         place={i}
  //         checked={checkVal}
  //       />
  //     </div>
  //   )
  // }

  copyArray(Array) {
    let arrayCopy = [];
    for (let i = 0; i < Array.length; i++) {
      arrayCopy.push(Array[i]);
    }

    return arrayCopy

  }

  strategyBoxChanged(i, label) {
    let strategyStates = this.copyArray(this.state.strategyVal);
    if (strategyStates[i] === label) {
      strategyStates[i] = ' ';
    } else {
      strategyStates[i] = label;
    }

    this.setState({ strategyVal: strategyStates })
  }

  // makeStrategyBox(name, i) {
  //   let strategyState = this.state.strategyVal;
  //   let checkedVal;
  //   if (strategyState[i] === name) {
  //     checkedVal = true;
  //   } else {
  //     checkedVal = false;
  //   }
  //   return (
  //     <div>
  //       <CheckBox
  //         label={name}
  //         changeCheckBoxState={this.strategyBox}
  //         place={i}
  //         checked={checkedVal}
  //       />
  //     </div>
  //   )
  // }

  changeBooleanCheckBox(i) {
    let booleanStates = this.copyArray(this.state.booleans)
    booleanStates[i] = !booleanStates[i]
    this.setState({ booleans: booleanStates })
  }

  // makeBooleanCheckBox(name, i) {
  //   let booleanStates = this.state.booleans;
  //   return (
  //     <div>
  //       <CheckBox
  //         label={name}
  //         changeCheckBoxState={this.changeBooleanCheckBox}
  //         place={i}
  //         checked={booleanStates[i]}
  //       />
  //     </div>
  //   )
  // }

  //---------------------------------------------------------------------------------------------------------------//

  dropDownChanged(event, i) {
    let dropDownStates = this.state.dropDownVal;
    dropDownStates[i] = event.target.value;
  }

  // makeDropDownBox(title, option, i) {
  //   let dropDownStates = this.state.dropDownVal;
  //   return (
  //     <div>
  //       <DropDown
  //         title={title}
  //         choices={option}
  //         place={i}
  //         value={dropDownStates[i]}
  //         setState={this.dropDownChanged}
  //       />
  //     </div>
  //   )
  // }

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

  makeEndGameStartEndBox() {
    let endGameValues = this.state.endGameVal;
    let endGame = endGameValues[0];
    if (endGame !== "None" && endGame !== '') {
      if (endGame === "Attempted") {
        return (
          <div>
            <p>Match Timer EX:125 (1:25)</p>
            <label> {"End Game Start: "}
              <input value={this.state.endGameVal[1]} style={{ width: '10%' }} type="number" onChange={this.changeEndGameStartBox}></input>
            </label>
          </div>
        )
      } else if (endGame === 'Parked') {
        return <div></div>
      } else {
        return (
          <div>
            <div>
              <p style={{ fontSize: '14px' }}>Match Timer | EX Start: 25 (0:25), EX End: 3 (0:03)</p>
              <label> {"End Game Start: "}
                <input value={this.state.endGameVal[1]} style={{ width: '10%' }} type="number" onChange={this.changeEndGameStartBox}></input>
              </label>
            </div>
            <div>
              <label> {"End Game End: "}
                <input value={this.state.endGameVal[2]} style={{ width: '10%' }} type="number" onChange={this.changeEndGameEndBox}></input>
              </label>
            </div>
          </div>
        )
      }
    } else {
      return <div></div>;
    }
  }

  makeEndGameDropDown() {
    let endGameState = this.state.endGameVal
    return (
      <div>
        <EndGame
          changeEndGameUsed={this.changeEndGame}
          makeEndGameStartEndBox={this.makeEndGameStartEndBox}
          value={endGameState[0]}
        />
      </div>
    )
  }

  changeChargeStation(event) {
    let chargeStation = this.state.chargeStationValAuto;
    chargeStation = event.target.value;
    this.setState({ chargeStationValAuto: chargeStation });
  }

  makeChargeStationAuto() {
    let chargeStationState = this.state.chargeStationValAuto;
    return (
      <div>
        <ChargeStation
          changeChargeStationUsed={this.changeChargeStation}
          value={chargeStationState}
        />
      </div>
    )
  }

  //-------------------------------------------------------------------------------------------------------------//

  setComment(event) {
    this.setState({ comments: event.target.value });
  }

  //-------------------------------------------------------------------------------------------------------------//

  penaltyBoxChecked(i, label) {
    let penaltyStates = this.copyArray(this.state.penaltyVal);
    if (penaltyStates[i] === label) {
      penaltyStates[i] = ' ';
    } else {
      penaltyStates[i] = label;
    }
    this.setState({ penaltyVal: penaltyStates })
  }

  makePenaltyBox(name, i) {
    let penaltyStates = this.state.penaltyVal;
    let checkedVal;
    if (penaltyStates[i] === name) {
      checkedVal = true;
    } else {
      checkedVal = false
    }
    return (
      <div>
        <CheckBox
          label={name}
          changeCheckBoxState={this.penaltyBoxChecked}
          place={i}
          checked={checkedVal}
        />
      </div>
    )
  }

  bonusBoxChecked(i, label) {
    let ranking = this.copyArray(this.state.rankingState);
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

  // makeBonusBox(name, i) {
  //   let rankingState = this.state.rankingState;
  //   let checkedVal;
  //   if (rankingState[i] === name) {
  //     checkedVal = true;
  //   }
  //   else {
  //     checkedVal = false;
  //   }
  //   return (
  //     <div>
  //       <CheckBox
  //         label={name}
  //         changeCheckBoxState={this.bonusBoxChecked}
  //         place={i}
  //         checked={checkedVal}
  //       />
  //     </div>
  //   )
  // }

  overrideChange() {
    this.setState({ override: !this.state.override });
  }

  // makeOverrideBox() {
  //   let overrideState = this.state.override;
  //   return (
  //     <div>
  //       <CheckBox
  //         label={"Overide "}
  //         changeCheckBoxState={this.overrideChange}
  //         checked={overrideState}
  //       />
  //     </div>
  //   )
  // }

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

  makeCounterBox(title, i) {
    let counterStates = this.state.counterBoxVals;
    return (
      <div>
        <CounterBox
          label={title}
          setState={this.counterBoxChanged}
          place={i}
          state={counterStates[i]}
          minusButton={this.buttonMinus}
          plusButton={this.buttonPlus}
        />
      </div>
    )
  }

  //-------------------------------------------------------------------------------------------------------------//

  async submitState() {
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

    function setChargeStationType(chargeStation) {
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

    let chargeTeleFinal = setChargeStationType(endGameUsed);
    let chargeAutoFinal = setChargeStationType(chargeStationAuto);


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
        {this.makeCounterBox("High Cubes Made: ", 0)}
        {this.makeCounterBox("Mid Cubes Made:  ", 1)}
        {this.makeCounterBox("Low Cubes Made:  ", 2)}
        <p>🟪Cubes Attempted</p>
        {this.makeCounterBox("High Cubes Attempted: ", 3)}
        {this.makeCounterBox("Mid Cubes Attempted: ", 4)}
        {this.makeCounterBox("Low Cubes Attempted: ", 5)}
        <p>🔺Cones Scored</p>
        {this.makeCounterBox("High Cones Made: ", 6)}
        {this.makeCounterBox("Mid Cones Made: ", 7)}
        {this.makeCounterBox("Low Cones Made: ", 8)}
        <p>🔺Cones Attempted</p>
        {this.makeCounterBox("High Cones Attempted: ", 9)}
        {this.makeCounterBox("Mid Cones Attempted: ", 10)}
        {this.makeCounterBox("Low Cones Attempted: ", 11)}
        <br></br>
        {makeBooleanCheckBox({ booleans: this.state.booleans, changeBooleanCheckBox: this.changeBooleanCheckBox }, "Mobility ", 0)}
        <br></br>
        {this.makeChargeStationAuto()}
        <br></br>

        {/* TELEOP */}
        <h3>TELE-OP:</h3>
        <p>🟪Cubes Scored</p>
        {this.makeCounterBox("High Cubes Made: ", 12)}
        {this.makeCounterBox("Mid Cubes Made: ", 13)}
        {this.makeCounterBox("Low Cubes Made: ", 14)}
        <p>🟪Cubes Attempted</p>
        {this.makeCounterBox("High Cubes Attempted: ", 15)}
        {this.makeCounterBox("Mid Cubes Attempted: ", 16)}
        {this.makeCounterBox("Low Cubes Attempted: ", 17)}
        <p>🔺Cones Scored</p>
        {this.makeCounterBox("High Cones Made: ", 18)}
        {this.makeCounterBox("Mid Cones Made: ", 19)}
        {this.makeCounterBox("Low Cones Made: ", 20)}
        <p>🔺Cones Attempted</p>
        {this.makeCounterBox("High Cones Attempted: ", 21)}
        {this.makeCounterBox("Mid Cones Attempted: ", 22)}
        {this.makeCounterBox("Low Cones Attempted: ", 23)}
        <br></br>
        {this.makeEndGameDropDown()}
        {this.makeEndGameStartEndBox()}
        <br></br>

        {/* ROBOT/TEAM INFO */}
        {makeBooleanCheckBox({ booleans: this.state.booleans, changeBooleanCheckBox: this.changeBooleanCheckBox }, "Smart Placement (creates links) ", 1)}
        <br></br>
        {makeDropDownBox({ dropDownVal: this.state.dropDownVal, dropDownChanged: this.dropDownChanged }, "Drive Strength: ", ["Weak", "Normal", "Strong"], 1)}
        {makeDropDownBox({ dropDownVal: this.state.dropDownVal, dropDownChanged: this.dropDownChanged }, "Drive Speed: ", ["Slow", "Normal", "Fast"], 2)}
        <br></br>

        {/* PENALTIES */}
        <h3>PENALTIES:</h3>
        {this.makeCounterBox("Fouls: ", 24)}
        {this.makeCounterBox("Tech Fouls: ", 25)}
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
            this.submitState()
              .then(() => {
                alert("Data succesfully submitted")
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
