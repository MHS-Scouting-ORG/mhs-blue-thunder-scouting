import React from 'react';
// checkbox utility function imports //
import { makeWhoWonBox, makeStrategyBox, makeBooleanCheckBox, makePenaltyBox, makeBonusBox, makeOverrideBox } from './components/checkBox/CheckBoxUtils';

// dropdown utility function imports //
import { makeDropDownBox, makeMatchDropDown, makeTeamDropDown } from './components/dropDownBox/DropDownUtils';

// endgame utility function imports //
import { makeEndGameStartEndBox, makeEndGameDropDown } from './components/endGameBox/EndGameUtils';

// chargestation utility function imports //
import { makeChargeStationAuto } from './components/chargeStation/ChargeStationUtils';

// counterbox utility function imports //
import { makeCounterBox } from './components/counterBox/CounterBoxUtils';

import TextBox from './components/TextBox';
import Headers from './components/Header';

// general utility function imports //
import { getMatchTeams, submitState, copyArray} from './FormUtils';


class Form extends React.Component {
  constructor(props) {
    super(props);

    this.matchData = props.matchData; // OVERALL MATCH DATA

    this.regional = props.regional; // REGIONAL KEY

    // STATE SETTING FUNCTIONS //
    // this.setCommentState = this.setCommentState.bind(this); done
    // this.setMatchTypeState = this.setMatchTypeState.bind(this); done
    // this.setElmNumState = this.setElmNumState.bind(this); done
    // this.setMatchNumberState = this.setMatchNumberState.bind(this); done
    // this.setMatchDataState = this.setMatchDataState.bind(this);
    // this.setTeamNumberState = this.setTeamNumberState.bind(this); done
    // this.setTeamsState = this.setTeamsState.bind(this); done
    // this.setOverrideState = this.setOverrideState.bind(this); done
    // this.setEndGameValState = this.setEndGameValState.bind(this);
    // this.setChargeStationValAutoState = this.setChargeStationValAutoState.bind(this);
    // this.setWhoWonState = this.setWhoWonState.bind(this); done

    this.setGivenState = this.setGivenState.bind(this);

    // initializing form by making array of data
    console.log(`initializing form`)
    this.state = {
      comments: '', //comments 0
      matchType: '', //match type 1
      elmNum: '', //elimination 2
      matchNumber: '', //match number 3
      matchData: 'not found', //data for a given match 4
      teamNumber: ' ', //team num 5
      teams: ['team1', 'team2', 'team3', 'team4', 'team5', 'team6'], //teams for a given match 6
      override: false, //override bool 7
      endGameVal: ['', '', ''], // 8
      chargeStationValAuto: '', //charge station status during auto 9
      whoWon: '', //whichever team won 10
      //checkedWhoWon: [' ', ' '], /* UNUSED */
      rankingPts: 0, //teams ranking points 11
      rankingState: ["", "", ""], // [ (win, tie, loss), activation, sustainability] 12
      penaltyVal: [' ', ' ', ' ', ' ', ' ', ' '], // yellow card, red card, dq, botbroke, no show 13
      dropDownVal: ['', '', ''], //dropdown vals??? 14
      counterBoxVals: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //game objects scored/attempted 15
      strategyVal: [null, null, null, null, null, null, null, null, null], // strategies/priorities (lownode, midnode, highnode, cubes, cones, chargestation, singlesubstation, doublesubstation, defense) 16
      booleans: [false, false], //mobility, smartplacement 17
      totalPoints: 0, //total points 18
      totalGrid: 0, //total grid points 19
      cubesAccuracy: 0, //cube accuracy 20
      conesAccuracy: 0, //cone accuracy 21
      cubesPts: 0, //cube pts 22
      conesPts: 0, //cone pts 23
    }
  }

  //upon component init
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
      counterBoxVals: [ // number corresponds to their spot within the counterbox array
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

  // SET STATE FUNCTION //
  setGivenState = (i,newState,savedEntries) => {
    let stateEntries;
    if(savedEntries){
      stateEntries = Object.entries(savedEntries).slice();
    }
    else{
      stateEntries = Object.entries(this.state).slice();
    }

    let stateName = stateEntries[i[0]][0];
    let stateValue = stateEntries[i[0]][1];

    if(Array.isArray(stateValue) && i[1] !== -1){
       stateValue[i[1]] = newState;
       console.log("hey: " + newState)
    }
    else{
      const newEntry = [stateName,newState]
      stateEntries[i[0]] = newEntry;
      console.log("runs: " + stateName + " - " + newState)
    }

    this.setState(Object.fromEntries(stateEntries));
    return Object.fromEntries(stateEntries);
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
        {makeMatchDropDown({ changeState: this.setGivenState, matchType: this.state.matchType, matchNumber: this.state.matchNumber })}
        <button onClick={() => {getMatchTeams(this)} }>GET MATCH TEAMS</button>
        <br></br>
        {makeTeamDropDown({ changeState: this.setGivenState, matchData: this.state.matchData, rankingStates: this.state.rankingState, matchNumber: this.state.matchNumber, teamNumber: this.state.teamNumber, teams: this.state.teams })}

        <br></br>

        {/* AUTONOMOUS */}
        <h3>AUTONOMOUS:</h3>
        <img alt="" src={'./images/auto placement.jpg'} width="250px" height="260px"></img>
        {makeDropDownBox({ changeState: this.setGivenState, dropDownVal: this.state.dropDownVal }, "Auto Placement: ", [1, 2, 3, 4, 5, 6], 0)}
        <br></br>
        <p>🟪Cubes Scored</p>
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "High Cubes Made: ", 0)}
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Mid Cubes Made:  ", 1)}
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Low Cubes Made:  ", 2)}
        <p>🟪Cubes Attempted</p>
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "High Cubes Attempted: ", 3)}
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Mid Cubes Attempted: ", 4)}
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Low Cubes Attempted: ", 5)}
        <p>🔺Cones Scored</p>
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "High Cones Made: ", 6)}
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Mid Cones Made: ", 7)}
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Low Cones Made: ", 8)}
        <p>🔺Cones Attempted</p>
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "High Cones Attempted: ", 9)}
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Mid Cones Attempted: ", 10)}
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Low Cones Attempted: ", 11)}
        <br></br>
        {makeBooleanCheckBox({ changeState: this.setGivenState, booleans: this.state.booleans }, "Mobility ", 0)}
        <br></br>
        {makeChargeStationAuto({ changeState: this.setGivenState, chargeStationValAuto: this.state.chargeStationValAuto, changeChargeStation: this.changeChargeStation })}
        <br></br>

        {/* TELEOP */}
        <h3>TELE-OP:</h3>
        <p>🟪Cubes Scored</p>
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "High Cubes Made: ", 12)}
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Mid Cubes Made: ", 13)}
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Low Cubes Made: ", 14)}
        <p>🟪Cubes Attempted</p>
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "High Cubes Attempted: ", 15)}
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Mid Cubes Attempted: ", 16)}
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Low Cubes Attempted: ", 17)}
        <p>🔺Cones Scored</p>
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "High Cones Made: ", 18)}
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Mid Cones Made: ", 19)}
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Low Cones Made: ", 20)}
        <p>🔺Cones Attempted</p>
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "High Cones Attempted: ", 21)}
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Mid Cones Attempted: ", 22)}
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Low Cones Attempted: ", 23)}
        <br></br>
        {makeEndGameDropDown({ changeState: this.setGivenState, endGameVal: this.state.endGameVal })}
        {makeEndGameStartEndBox({ changeState: this.setGivenState, endGameVal: this.state.endGameVal })}
        <br></br>

        {/* ROBOT/TEAM INFO */}
        {makeBooleanCheckBox({ changeState: this.setGivenState, booleans: this.state.booleans }, "Smart Placement (creates links) ", 1)}
        <br></br>
        {makeDropDownBox({ changeState: this.setGivenState, dropDownVal: this.state.dropDownVal }, "Drive Strength: ", ["Weak", "Normal", "Strong"], 1)}
        {makeDropDownBox({ changeState: this.setGivenState, dropDownVal: this.state.dropDownVal }, "Drive Speed: ", ["Slow", "Normal", "Fast"], 2)}
        <br></br>

        {/* PENALTIES */}
        <h3>PENALTIES:</h3>
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Fouls: ", 24)}
        {makeCounterBox({ changeState: this.setGivenState, counterBoxVals: this.state.counterBoxVals }, "Tech Fouls: ", 25)}
        {makePenaltyBox({ changeState: this.setGivenState, penaltyVal: this.state.penaltyVal}, "Yellow Card ", 0)}
        {makePenaltyBox({ changeState: this.setGivenState, penaltyVal: this.state.penaltyVal}, "Red Card ", 1)}
        {makePenaltyBox({ changeState: this.setGivenState, penaltyVal: this.state.penaltyVal}, "Disable ", 2)}
        {makePenaltyBox({ changeState: this.setGivenState, penaltyVal: this.state.penaltyVal}, "Disqualifed ", 3)}
        {makePenaltyBox({ changeState: this.setGivenState, penaltyVal: this.state.penaltyVal}, "Bot Broke ", 4)}
        {makePenaltyBox({ changeState: this.setGivenState, penaltyVal: this.state.penaltyVal}, "No Show ", 5)}
        <br></br>

        {/* RANKING POINTS */}
        <h3>RANKING POINTS:</h3>
        {makeWhoWonBox({ changeState: this.setGivenState, rankingState: this.state.rankingState, matchData: this.state.matchData }, "Team Won ", 0)}
        {makeWhoWonBox({ changeState: this.setGivenState, rankingState: this.state.rankingState, matchData: this.state.matchData }, "Team Tied ", 1)}
        {makeWhoWonBox({ changeState: this.setGivenState, rankingState: this.state.rankingState, matchData: this.state.matchData }, "Team Lost ", 2)}
        {makeBonusBox({ changeState: this.setGivenState, rankingState: this.state.rankingState, rankingPoints: this.state.rankingPts }, "Activation ", 1)}
        {makeBonusBox({ changeState: this.setGivenState, rankingState: this.state.rankingState, rankingPoints: this.state.rankingPts }, "Sustainability ", 2)}
        <Headers display={this.state.rankingPts}/>
        <br></br>

        {/* STRATEGY & PRIORITIES */}
        <h3>📝STRATEGY & PRIORITIES:</h3>
        {makeStrategyBox({ changeState: this.setGivenState, strategyVal: this.state.strategyVal }, "Low Node ", 0)}
        {makeStrategyBox({ changeState: this.setGivenState, strategyVal: this.state.strategyVal }, "Mid Node ", 1)}
        {makeStrategyBox({ changeState: this.setGivenState, strategyVal: this.state.strategyVal }, "High Node ", 2)}
        {makeStrategyBox({ changeState: this.setGivenState, strategyVal: this.state.strategyVal }, "Cubes ", 3)}
        {makeStrategyBox({ changeState: this.setGivenState, strategyVal: this.state.strategyVal }, "Cones ", 4)}
        {makeStrategyBox({ changeState: this.setGivenState, strategyVal: this.state.strategyVal }, "Charge Station ", 5)}
        {makeStrategyBox({ changeState: this.setGivenState, strategyVal: this.state.strategyVal }, "Single Substation ", 6)}
        {makeStrategyBox({ changeState: this.setGivenState, strategyVal: this.state.strategyVal }, "Double Substation ", 7)}
        {makeStrategyBox({ changeState: this.setGivenState, strategyVal: this.state.strategyVal }, "Defense ", 8)}
        <br></br>

        {/* COMMENTS */}
        <TextBox title={"💬Comments: "} changeState={this.setGivenState} value={this.state.comments}></TextBox>

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
          }}>SUBMIT</button>
        </div>
        <p> ONLY CLICK IF NOTHING ELSE CAN BE FILLED! </p>
        {makeOverrideBox({ changeState: this.setGivenState, override: this.state.override })}
        <br></br>
      </div>
    )
  }
}

export default Form;