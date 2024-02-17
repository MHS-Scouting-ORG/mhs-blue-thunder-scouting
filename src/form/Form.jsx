import React from 'react';
// checkbox utility function imports //
import { makeBooleanCheckBox, makePenaltyBox, makeBonusBox, makeOverrideBox } from './components/checkBox/CheckBoxUtils';

// dropdown utility function imports //
import { makeAutoPlacementDropDownBox, makeMatchDropDown, makeTeamDropDown } from './components/dropDownBox/DropDownUtils';

// endgame utility function imports //
import { makeEndGameMisc, makeEndGameDropDown } from './components/endGameBox/EndGameUtils';

// counterbox utility function imports //
import { makeCounterBox } from './components/counterBox/CounterBoxUtils';

// rating slider utility function imports //
import { makeRatingSlider } from './components/ratingSlider/RatingSliderUtils';

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
      // MATCH INFO //
      matchType: '', //match type
      elmNum: '', //elimination
      matchNumber: '', //match number
      matchData: 'not found', //data for a given match
      teamNumber: ' ', //team num
      teams: ['team1', 'team2', 'team3', 'team4', 'team5', 'team6'], //teams for a given match

      // AUTO SPECIFIC //
      autoPlacement: '', //1,2,3,4
      mobility: false,

      // SCORING //
      counterBoxVals: [0, 0, 0, 0, 0, 0, 0, 0, 0], //[autoAmp, autoSpeaker , teleAmp, teleSpeaker, teleAmplifiedSpeaker, highNotesMade, highNotesMissed, fouls, techFouls]
      autoAmpScored: 0,
      autoSpeakerScored: 0,
      teleAmpScored: 0,
      teleSpeakerScored: 0,
      teleAmplifiedSpeakerScored: 0,
      highNotesMade: 0,
      highNotesMissed: 0,

      endGameVal: '', //onstage, attempted, parked, none
      noteInTrap: false,

      totalPts: 0,
      endgamePts: 0,
      ampPts: 0,
      speakerPts: 0,

      // RANKING PTS //
      rankingState: ["", "", ""], // [ (win, tie, loss), activation, sustainability]
      rankingPts: 0,
      matchResult: '', //win, tie, loss
      activation: false,
      sustainability: false,

      // PENALTIES //
      penaltyVal: [' ', ' ', ' ', ' ', ' ', ' '], // yellow card, red card, dq, botbroke, no show
      yellowCard: false,
      redCard: false,
      disqualified: false,
      botBroke: false,
      noShow: false,
      fouls: 0,
      techFouls: 0,
      foulComments: "",
      robotBrokenComments: "",

      // ROBOT INFO //
      booleans: [false, false, false, false, false, false], //mobility, hangsFaster, noteInTrap, isFaster, clearsStage, countersDefense
      hangsFaster: false,
      isFaster: false,
      clearsStage: false,
      countersDefense: false,
      ratingSliderVals: ["", ""], //lineup speed, intake rating
      lineUpSpeed: "",
      intakeRating: "",

      // OVERRIDE //
      override: false, //override bool
    }

    // FUNCTION BINDING //
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
    this.updateRatingSlider = this.updateRatingSlider.bind(this);
    this.updateFoulComments = this.updateFoulComments.bind(this);
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

  // MATCH INFO //
  updateMatchType(value, prop) {
    this.setState({ [prop]: value })
  }

  updateMatchData (match) {
    this.setState({ matchData: match })
    this.setState({ teams: match.alliances.blue.team_keys.concat(match.alliances.red.team_keys) });
  }

  updateTeam(team) {
    this.setState({ teamNumber: team })
  }

  // AUTO SPECIFIC //
  updateAutonomousPlacement(value) {
    this.setState({ autoPlacement: value })
  }

  // SCORING //
  updateCounterBox(i, newState) {
    let counterBoxVals = [...this.state.counterBoxVals];
    counterBoxVals[i] = newState;
    this.setState({ counterBoxVals });
  }

  updateEndGameVal(value) {
    this.setState({ endGameVal: value })
  }

  // RANKING PTS //
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

  // PENALTIES //
  updatePenalty([_, i], val) {
    let penaltyVal = [...this.state.penaltyVal]
    penaltyVal[i] = val
    this.setState({ penaltyVal })
  }

  updateFoulComments(comment) {
    this.setState({ foulComments: comment })
  }

  updateRobotBrokenComments(comment) {
    this.setState({ robotBrokenComments: comment})
  }

  // ROBOT INFO //
  updateBoolean(i, value) {
    let booleans = [...this.state.booleans]
    booleans[i] = value
    this.setState({ booleans })
  }

  updateRatingSlider(i, value) {
    let ratingSliderVals = [...this.state.ratingSliderVals]
    ratingSliderVals[i] = value
    this.setState({ ratingSliderVals })
  }

  // OVERRIDE //
  updateOverride (val) {
    this.setState({ override: val })
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
        <h2> CRESCENDO FORM <img alt="" src={'./images/BLUETHUNDERLOGO_WHITE.png'} style={{ width: "50px", height: "50px" }}></img> </h2>

        {/* CHECK STATE BUTTON */}
        <div className="match-contain">
          <button onClick={() => console.log(this.state)}> Check State </button>

          {/* MATCH INITIATION */}
          {makeMatchDropDown({ ...this.state, changeState: this.updateMatchType })}
          <button onClick={() => { getMatchTeams({ ...this.state, changeState: this.updateMatchData, regional: this.regional }) }}>GET MATCH TEAMS</button>
          <br></br>
          {makeTeamDropDown({ ...this.state, changeState: this.updateTeam, rankingStates: this.state.rankingState })}
        </div>

        <br></br>

        {/* AUTONOMOUS */}
        <div className="auto-contain">
          <h3>AUTONOMOUS:</h3>
          <img alt="" src={'./images/auto placement.png'}></img>
          {makeAutoPlacementDropDownBox({ changeState: this.updateAutonomousPlacement, dropDownVal: this.state.autoPlacement }, "Auto Placement: ", [1, 2, 3, 4], 0)}
          <br></br>
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Amp Scored: ", 0)}
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Speaker Scored: ", 1)}
          <br></br>
          {makeBooleanCheckBox({ changeState: this.updateBoolean, booleans: [...this.state.booleans] }, "Leave ", 0)}
        </div>

        <br></br>

        {/* TELEOP */}
        <div className='tele-contain'>
          <h3>TELE-OP:</h3>
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Amp Scored: ", 2)}
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Speaker Scored: ", 3)}
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Amplified Speaker Scored: ", 4)}
          <br></br>
          {makeEndGameDropDown({ changeState: this.updateEndGameVal, endGameVal: this.state.endGameVal })}
          {makeEndGameMisc({changeState: this.updateBoolean, endGameVal: this.state.endGameVal, booleans: [...this.state.booleans]}, "Hangs Faster Than Us", 1)}
          {makeBooleanCheckBox({ changeState: this.updateBoolean, booleans: [...this.state.booleans] }, "Trap Scored ", 2)}
          <br></br>
          <p>USE ONLY IF HUMAN PLAYER IS ON AMP</p>
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "High Notes Made: ", 5)}
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "High Notes Missed: ", 6)}
          <br></br>
        </div>

        {/* ROBOT/TEAM INFO */}
        <div className="robot-info-contain">
          <h3>ROBOT INFO</h3>
          {makeBooleanCheckBox({ changeState: this.updateBoolean, booleans: [...this.state.booleans] }, "Faster Than Us ", 3)}
          {makeBooleanCheckBox({ changeState: this.updateBoolean, booleans: [...this.state.booleans] }, "Passes Under Stage ", 4)}
          {makeBooleanCheckBox({ changeState: this.updateBoolean, booleans: [...this.state.booleans] }, "Counters Defense ", 5)}
          {makeRatingSlider({changeState: this.updateRatingSlider, ratingSliderVals: [...this.state.ratingSliderVals]}, "Lineup Speed: ", ["None", "Slow", "Average", "Fast"], 0)}
          {makeRatingSlider({changeState: this.updateRatingSlider, ratingSliderVals: [...this.state.ratingSliderVals]}, "Intake Rating: ", ["None", "Bad", "Average", "Good"], 1)}
        </div>

        <br></br>

        {/* PENALTIES */}
        <div className="penalty-contain">
          <h3>PENALTIES:</h3>
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Fouls: ", 7)}
          {makeCounterBox({ changeState: this.updateCounterBox, counterBoxVals: this.state.counterBoxVals }, "Tech Fouls: ", 8)}
          <TextBox changeState={this.updateFoulComments} title="Foul Descriptions:" description="Provide specifics on fouls commited (be brief)." value={this.state.foulComments}/>
          {(_ => ["Yellow Card", "Red Card", "Disable", "Disqualified", "Bot Broke", "No Show"].
            map((label, i) => makePenaltyBox({ changeState: this.updatePenalty, penaltyVal: this.state.penaltyVal }, `${label} `, i))
          )()}
          <TextBox changeState={this.updateRobotBrokenComments} title="Robot Broken Description:" description="IF the robot broke, describe what exactly broke (you can go down to the pit and ask the team what broke)" value={this.state.robotBrokenComments}/>
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
          {makeOverrideBox({ changeState: this.setOverride, override: this.state.override })}
        </div>
        <br></br>
      </div>
    )
  }
}

export default Form;