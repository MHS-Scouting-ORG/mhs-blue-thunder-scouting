import React from 'react';
// checkbox utility function imports //
import { makeStrategyBox, makeBooleanCheckBox, makePenaltyBox, makeBonusBox, makeOverrideBox } from './components/checkBox/CheckBoxUtils';

// dropdown utility function imports //
import { makeDropDownBox, makeMatchDropDown, makeTeamDropDown } from './components/dropDownBox/DropDownUtils';

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
      comments: '', //comments 0
      matchType: '', //match type 1
      elmNum: '', //elimination 2
      matchNumber: '', //match number 3
      matchData: 'not found', //data for a given match 4
      teamNumber: ' ', //team num 5
      teams: ['team1', 'team2', 'team3', 'team4', 'team5', 'team6'], //teams for a given match 6
      override: false, //override bool 7


      endGameVal: ['', '', ''], // 8
      whoWon: '', //whichever team won 10
      rankingPts: 0, //teams ranking points 11
      rankingState: ["", "", ""], // [ (win, tie, loss), activation, sustainability] 12
      penaltyVal: [' ', ' ', ' ', ' ', ' ', ' '], // yellow card, red card, dq, botbroke, no show 13
      dropDownVal: ['1', '', ''], //dropdown vals 14
      counterBoxVals: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //game objects scored/attempted 15
      strategyVal: [null, null, null, null, null, null, null, null, null], // strategies/priorities (lownode, midnode, highnode, cubes, cones, chargestation, singlesubstation, doublesubstation, defense) 16
      booleans: [false, false], //mobility, smartplacement 17
      totalPts: 0, //total points 18
      ampPts: 0, //total amp pts 19
      speakerPts: 0 //total speaker pts 20
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

    if (rankingStates[1] === "MelodyBonus") {
      rankingStates[1] = "Melody ";
      rankingPoints++;
    }
    if (rankingStates[2] === "EnsembleBonus") {
      rankingStates[2] = "Ensemble ";
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
      // chargeStationValAuto: m.Autonomous.ChargeStation,
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

  //-------------------------------------------------------------------------------------------------------------//

  updateCounterBox = (i, newState) => {
    let counterBoxVals = [...this.state.counterBoxVals];
    counterBoxVals[i] = newState;
    this.setState({ counterBoxVals });
  }

  updateMatchData = (match) => {
    this.setState({ matchData: match })
    this.setState({ teams: match.alliances.blue.team_keys.concat(match.alliances.red.team_keys) });
  }

  updateMatchType = (value, prop) => {
    console.log(value, " ", prop)
    this.setState({ [prop]: value })
  }

  updateTeam = (team) => {
    this.setState({ teamNumber: team })
  } //

  updateDropDown = ({ target: { value } }, i) => {
    let dropDownVal = [...this.state.dropDownVal];
    dropDownVal[i] = value;
    this.setState({ dropDownVal });
  }

  updateBoolean = (i, value) => {
    let booleans = [...this.state.booleans]
    booleans[i] = value
    this.setState({ booleans })
  }

  updateEndGameVal = (i, value) => {
    let endGameVal = [...this.state.endGameVal]
    endGameVal[i] = value
    this.setState({ endGameVal })
  }

  updatePenalty = ([_, i], val) => {
    let penaltyVal = [...this.state.penaltyVal]
    penaltyVal[i] = val
    this.setState({ penaltyVal })
  }

  updateRankingPoints = (rankingState) => {
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

  updateWhoWon = ({ target: { value } }) => {
    let rankingState = [...this.state.rankingState]
    rankingState[0] = value
    this.setState({ rankingState })
    this.updateRankingPoints(rankingState)
  }

  updateBonus = (i, name, checked) => {
    let rankingState = [...this.state.rankingState]
    rankingState[i] = checked ? name : ''
    this.setState({ rankingState })
    this.updateRankingPoints(rankingState)
  }

  updateStrategy = ([_, i], val) => {
    let strategyVal = [...this.state.strategyVal]
    strategyVal[i] = val
    this.setState({ strategyVal })
  }

  updateComments = (comment) => {
    this.setState({ comments: comment })
  }

  updateOverride = (overrideStatus) => {
    this.setState( {override: overrideStatus} )
  }

  // updatePoints = (totalPts, ampPts, speakerPts) => {
  //   this.setState( {totalPts} )
  //   this.setState( {ampPts} )
  //   this.setState( {speakerPts} )
  // }

  // rendering physical and visible website components
  render() {
    return (
      <div className="form-contain">
        {/* TITLE */}
        <h2> CRESCENDO FORM  <img alt="" src={'./images/BLUETHUNDERLOGO_WHITE.png'} style={{width: "50px", height: "50px"}}></img> </h2>

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
        <div className="auto-contain">

          <h3>AUTONOMOUS:</h3>
          <img alt="" src={'./images/auto placement.png'}></img>
          {makeDropDownBox({ changeState: this.updateDropDown, dropDownVal: this.state.dropDownVal }, "Auto Placement: ", [1, 2, 3, 4], 0)}
          <br></br>
          <p></p>
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "⚡ Amp Scored: ", 0)}
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "🔊 Speaker Scored: ", 1)}
          <br></br>
          {makeBooleanCheckBox({ changeState: this.updateBoolean, booleans: this.state.booleans }, "Mobility ", 0)}
        </div>

        <br></br>

        {/* TELEOP */}
        <div className="teleop-contain">

          <h3>TELE-OP:</h3>
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "⚡ Amp Scored: ", 2)}
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "🔊 Speaker Scored: ", 3)}
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "⚡🔊 Amplified Speaker Scored: ", 4)}
          <br></br>
          {makeEndGameDropDown({ changeState: this.updateEndGameVal, endGameVal: this.state.endGameVal })}
          {makeEndGameStartEndBox({ changeState: this.updateEndGameVal, endGameVal: this.state.endGameVal })}

        </div>

        <br></br>

        {/* ROBOT/TEAM INFO */}
        <div className="robot-info-contain">

          {makeBooleanCheckBox({ changeState: this.updateBoolean, booleans: this.state.booleans }, "Smart Placement (creates links) ", 1)}
          <br></br>
          {makeDropDownBox({ changeState: this.updateDropDown, dropDownVal: this.state.dropDownVal }, "Drive Strength: ", ["Weak", "Normal", "Strong"], 1)}
          {makeDropDownBox({ changeState: this.updateDropDown, dropDownVal: this.state.dropDownVal }, "Drive Speed: ", ["Slow", "Normal", "Fast"], 2)}
        </div>

        <br></br>

        {/* PENALTIES */}
        <div className="penalty-contain">

          <h3>PENALTIES:</h3>
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Fouls: ", 24)}
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Tech Fouls: ", 25)}
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

        {/* STRATEGY & PRIORITIES */}
        <div className="strat-contain">

          <h3>📝STRATEGY & PRIORITIES:</h3>
          {(_ => [
            "Low Node", "Mid Node", "High Node", "Cubes", "Cones", "Charge Station", "Single Substation", "Double Substation", "Defense"].
            map((label, i) => makeStrategyBox({ changeState: this.updateStrategy, strategyVal: this.state.strategyVal }, `${label} `, i)))()}
        </div>

        <br></br>

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