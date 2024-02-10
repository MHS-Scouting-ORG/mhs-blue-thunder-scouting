import React from 'react';
// checkbox utility function imports //
import { makeStrategyBox, makeBooleanCheckBox, makePenaltyBox, makeBonusBox, makeOverrideBox } from './components/checkBox/CheckBoxUtils';

// dropdown utility function imports //
import { makeAutoPlacementDropDownBox, makeMatchDropDown, makeTeamDropDown } from './components/dropDownBox/DropDownUtils';

// endgame utility function imports //
import { makeEndGameStartEndBox, makeEndGameDropDown } from './components/endGameBox/EndGameUtils';

// counterbox utility function imports //
import { makeCounterBox } from './components/counterBox/CounterBoxUtils';

import TextBox from './components/TextBox';
import Headers from './components/Header';

// general utility function imports //
import { getMatchTeams, submitState } from './FormUtils';


class Form extends React.Component {
  constructor(props) {
    super(props);

    this.matchData = props.matchData; // OVERALL MATCH DATA

    this.regional = props.regional; // REGIONAL KEY

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


      endGameVal: ['', '', ''], // endgame val [endgameStatus, timeStart, timeEnd]
      whoWon: '', //whichever team won
      rankingPts: 0, //teams ranking points
      rankingState: ["", "", ""], // [ (win, tie, loss), activation, sustainability]
      penaltyVal: [' ', ' ', ' ', ' ', ' ', ' '], // yellow card, red card, dq, botbroke, no show
      autoPlacement: '', //robots starting position (1,2,3,4)
      counterBoxVals: [0, 0, 0, 0, 0, 0, 0], //[autoAmp, autoSpeaker , teleAmp, teleSpeaker, teleAmplifiedSpeaker, fouls, techFouls]
      // strategyVal: [null, null, null, null, null, null, null, null, null], // strategies/priorities (lownode, midnode, highnode, cubes, cones, chargestation, singlesubstation, doublesubstation, defense)
      booleans: [false, false, false], //booleans (mobility, isFaster, clearsStage)
      totalPts: 0, //total points
      ampPts: 0, //total amp pts
      speakerPts: 0 //total speaker pts
    }

    //FUNCTION BINDING
    this.updateCounterBox = this.updateCounterBox.bind(this);
    this.updateMatchData = this.updateMatchData.bind(this);
    this.updateMatchType = this.updateMatchType.bind(this);
    this.updateTeam = this.updateTeam.bind(this);
    this.updateAutonomousPlacement = this.updateAutonomousPlacement.bind(this);
    this.updateBoolean = this.updateBoolean.bind(this);
    this.updateEndGameVal = this.updateEndGameVal.bind(this);
    this.updatePenalty = this.updatePenalty.bind(this);
    this.updateRankingPoints = this.updateRankingPoints.bind(this);
    this.updateWhoWon = this.updateWhoWon.bind(this);
    this.updateBonus = this.updateBonus.bind(this);
    // this.updateStrategy = this.updateStrategy.bind(this);
    // this.makeBoxCounters = this.makeBoxCounters.bind(this);
    this.updateComments = this.updateComments.bind(this);
    this.updateOverride = this.updateOverride.bind(this);
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

    if (rankingStates[1] === "MelodyBonus") {
      rankingStates[1] = "Melody ";
      rankingPoints++;
    }
    if (rankingStates[2] === "EnsembleBonus") {
      rankingStates[2] = "Ensemble ";
      rankingPoints++;
    }

    // let priorityStates = [...m.Priorities];
    // for (let i = 0; i < priorityStates.length; i++) {
    //   if (priorityStates[i] === "Low") {
    //     priorityStates[0] = "Low Node ";
    //   }
    //   if (priorityStates[i] === "Mid") {
    //     priorityStates[1] = "Mid Node ";
    //   }
    //   if (priorityStates[i] === "Upper") {
    //     priorityStates[2] = "High Node ";
    //   }
    //   if (priorityStates[i] === "Cubes") {
    //     priorityStates[3] = "Cubes ";
    //   }
    //   if (priorityStates[i] === "Cones") {
    //     priorityStates[4] = "Cones ";
    //   }
    //   if (priorityStates[i] === "ChargeStation") {
    //     priorityStates[5] = "Charge Station ";
    //   }
    //   if (priorityStates[i] === "SingleSubstation") {
    //     priorityStates[6] = "Single Substation ";
    //   }
    //   if (priorityStates[i] === "DoubleStation") {
    //     priorityStates[7] = "Double Substation ";
    //   }
    //   if (priorityStates[i] === "Defense") {
    //     priorityStates[8] = "Defense ";
    //   }
    // }

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

    //INIT
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
      whoWon: '',
      checkedWhoWon: ['', ''],
      rankingPts: rankingPoints,
      rankingState: rankingStates, //RANKING PTS STATES
      penaltyVal: penaltyStates,
      autoPlacement: m.Autonomous.AutonomousPlacement,
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
      // strategyVal: priorityStates,//[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
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

  updateCounterBox(i, newState) {
    let counterBoxVals = [...this.state.counterBoxVals];
    counterBoxVals[i] = newState;
    this.setState({ counterBoxVals });
  }

  updateMatchData(match) {
    this.setState({ matchData: match })
    this.setState({ teams: match.alliances.blue.team_keys.concat(match.alliances.red.team_keys) });
  }

  updateMatchType(value, prop) {
    console.log(value, " ", prop)
    this.setState({ [prop]: value })
  }

  updateTeam(team) {
    this.setState({ teamNumber: team })
  }

  updateAutonomousPlacement(value) {
    this.setState({ autoPlacement: value})
  }

  updateBoolean(i, value) {
    let booleans = [...this.state.booleans]
    booleans[i] = value
    this.setState({ booleans })
  }

  updateEndGameVal(i, value) {
    let endGameVal = [...this.state.endGameVal]
    endGameVal[i] = value
    this.setState({ endGameVal })
  }

  updatePenalty([_, i], val) {
    let penaltyVal = [...this.state.penaltyVal]
    penaltyVal[i] = val
    this.setState({ penaltyVal })
  }

  updateRankingPoints(rankingState) {
    let rankingPts = 0
    if (rankingState[0] === "win") {
      rankingPts = 2
    }
    else if (rankingState[0] === "tie") {
      rankingPts = 1
    }
    else if (rankingState[0] === "loss") {
      rankingPts = 0
    }

    if (rankingState[1].trim() === "Melody") {
      rankingPts++
    }
    if (rankingState[2].trim() === "Ensemble") {
      rankingPts++
    }
    this.setState({ rankingPts })
  }

  updateWhoWon({ target: { value } }) {
    let rankingState = [...this.state.rankingState]
    rankingState[0] = value
    this.setState({ rankingState })
    this.updateRankingPoints(rankingState)
  }

  updateBonus(i, name, checked) {
    let rankingState = [...this.state.rankingState]
    rankingState[i] = checked ? name : ''
    this.setState({ rankingState })
    this.updateRankingPoints(rankingState)
  }

  // updateStrategy([_, i], val) {
  //   let strategyVal = [...this.state.strategyVal]
  //   strategyVal[i] = val
  //   this.setState({ strategyVal })

  // }

  // makeBoxCounters(startIndex) {
  //   return (
  //     <>
  //       <p>🟪Cubes Scored</p>
  //       {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "High Cubes Made: ", startIndex)}
  //       {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Mid Cubes Made: ", startIndex + 1)}
  //       {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Low Cubes Made: ", startIndex + 2)}
  //       <p>🟪Cubes Attempted</p>
  //       {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "High Cubes Attempted: ", startIndex + 3)}
  //       {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Mid Cubes Attempted: ", startIndex + 4)}
  //       {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Low Cubes Attempted: ", startIndex + 5)}
  //       <p>🔺Cones Scored</p>
  //       {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "High Cones Made: ", startIndex + 6)}
  //       {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Mid Cones Made: ", startIndex + 7)}
  //       {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Low Cones Made: ", startIndex + 8)}
  //       <p>🔺Cones Attempted</p>
  //       {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "High Cones Attempted: ", startIndex + 9)}
  //       {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Mid Cones Attempted: ", startIndex + 10)}
  //       {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Low Cones Attempted: ", startIndex + 11)}
  //     </>
  //   )
  // }

  updateComments(comment) {
    this.setState({ comments: comment })
  }

  updateOverride(overrideStatus) {
    this.setState({ override: overrideStatus })
  }

  // updatePoints(totalPts, ampPts, speakerPts) {
  //   this.setState( {totalPts} )
  //   this.setState( {ampPts} )
  //   this.setState( {speakerPts} )
  // }

  // rendering physical and visible website components
  render() {
    return (
      <div className="form-contain">
        {/* TITLE */}
        <h2> CRESCENDO FORM  <img alt="" src={'./images/BLUETHUNDERLOGO_WHITE.png'} style={{ width: "50px", height: "50px" }}></img> </h2>

        {/* CHECK STATE BUTTON */}
        <div className="match-contain">
          <button onClick={() => console.log(this.state)}> Check State </button>

          {/* MATCH INITIATION */}
          {makeMatchDropDown({ changeState: this.updateMatchType, matchType: this.state.matchType, matchNumber: this.state.matchNumber })}
          <button onClick={() => { getMatchTeams({ changeState: this.updateMatchData, regional: this.regional, matchType: this.state.matchType, elmNum: this.state.elmNum, matchNumber: this.state.matchNumber, matchData: this.state.matchData }) }}>GET MATCH TEAMS</button>
          <br></br>
          {makeTeamDropDown({ changeState: this.updateTeam, matchData: this.state.matchData, rankingStates: this.state.rankingState, matchNumber: this.state.matchNumber, teamNumber: this.state.teamNumber, teams: this.state.teams })}
        </div>

        <br></br>

        {/* AUTONOMOUS */}
        <h3>AUTONOMOUS:</h3>
        <img alt="" src={'./images/auto placement.png'}></img>
        {makeAutoPlacementDropDownBox({ changeState: this.updateAutonomousPlacement, dropDownVal: this.state.autoPlacement }, "Auto Placement: ", [1, 2, 3, 4], 0)}
        <br></br>
        {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Amp Scored: ", 0)}
        {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Speaker Scored: ", 1)}
        <br></br>
        {makeBooleanCheckBox({ changeState: this.updateBoolean, booleans: this.state.booleans }, "Mobility ", 0)}
        <br></br>

        {/* TELEOP */}
        <h3>TELE-OP:</h3>
        {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Amp Scored: ", 2)}
        {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Speaker Scored: ", 3)}
        {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Amplified Speaker Scored: ", 4)}

        <br></br>
        {makeEndGameDropDown({ changeState: this.updateEndGameVal, endGameVal: this.state.endGameVal })}
        {makeEndGameStartEndBox({ changeState: this.updateEndGameVal, endGameVal: this.state.endGameVal })}
        <br></br>

        {/* ROBOT/TEAM INFO */}
        <div className="robot-info-contain">

          {makeBooleanCheckBox({ changeState: this.updateBoolean, booleans: this.state.booleans }, "Is this robot faster than ours? ", 1)}
          {makeBooleanCheckBox({ changeState: this.updateBoolean, booleans: this.state.booleans }, "Can this robot go under the stage? ", 2)}

          {/* <br></br>
          {makeDropDownBox({ changeState: this.updateDropDown, dropDownVal: this.state.dropDownVal }, "Drive Strength: ", ["Weak", "Normal", "Strong"], 1)}
          {makeDropDownBox({ changeState: this.updateDropDown, dropDownVal: this.state.dropDownVal }, "Drive Speed: ", ["Slow", "Normal", "Fast"], 2)} */}
        </div>

        <br></br>

        {/* PENALTIES */}
        <div className="penalty-contain">

          <h3>PENALTIES:</h3>
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Fouls: ", 5)}
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Tech Fouls: ", 6)}
          {(_ => ["Yellow Card", "Red Card", "Disable", "Disqualified", "Bot Broke", "No Show"].
            map((label, i) => makePenaltyBox({ changeState: this.updatePenalty, penaltyVal: this.state.penaltyVal }, `${label} `, i))
          )()}
        </div>

        <br></br>

        {/* RANKING POINTS */}
        <div className="ranking-contain">

          <h3>RANKING POINTS:</h3>
          <div>
            <label>
              <input type="radio" name="whoWon" value="win" onChange={this.updateWhoWon} />
              Team Won
            </label>
            <label>
              <input type="radio" name="whoWon" value="tie" onChange={this.updateWhoWon} />
              Team Tied
            </label>
            <label>
              <input type="radio" name="whoWon" value="loss" onChange={this.updateWhoWon} />
              Team Lost
            </label>
          </div>
          {makeBonusBox({ changeState: this.updateBonus, rankingState: this.state.rankingState, rankingPoints: this.state.rankingPts }, "Melody ", 1)}
          {makeBonusBox({ changeState: this.updateBonus, rankingState: this.state.rankingState, rankingPoints: this.state.rankingPts }, "Ensemble ", 2)}
          <Headers display={this.state.rankingPts} />

        </div>

        <br></br>

        {/* STRATEGY & PRIORITIES
        <div className="strat-contain">

          <h3>📝STRATEGY & PRIORITIES:</h3>
          {(_ => [
            "Low Node", "Mid Node", "High Node", "Cubes", "Cones", "Charge Station", "Single Substation", "Double Substation", "Defense"].
            map((label, i) => makeStrategyBox({ changeState: this.updateStrategy, strategyVal: this.state.strategyVal }, `${label} `, i)))()}
        </div>

        <br></br> */}

        {/* COMMENTS */}
        <div className="comment-contain">

          <TextBox title={"💬Comments: "} changeState={this.updateComments} value={this.state.comments}></TextBox>

        </div>

        <br></br>

        {/* SUBMISSION */}
        <div className="submit-contain">
          <div>
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
                  catch (e) {

                  }
                })
            }}>SUBMIT</button>
          </div>
          <p> ONLY CLICK IF NOTHING ELSE CAN BE FILLED! </p>
          {makeOverrideBox({ changeState: this.updateOverride, override: this.state.override })}
        </div>

        <br></br>

      </div>
    )
  }
}

export default Form;