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

import RadioButton from './components/radiobuttons/RadioButton';


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
      left: false,

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
      ampPts: 0,
      speakerPts: 0,

      // RANKING PTS //
      rankingState: ["", "", ""], // [ (win, tie, loss), activation, sustainability]
      rankingPts: 0,
      matchResult: '', //win, tie, loss
      bonusStatus: ['', ''],

      // PENALTIES //
      penaltyVal: [' ', ' ', ' ', ' ', ' ', ' '], // yellow card, red card, dq, botbroke, no show
      yellowCard: false,
      redCard: false,
      dq: false,
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

    //match info
    this.updateMatchType = this.updateMatchType.bind(this)
    this.updateMatchData = this.updateMatchData.bind(this)
    this.updateTeam = this.updateTeam.bind(this)

    //auto specific
    this.updateAutonomousPlacement = this.updateAutonomousPlacement.bind(this)
    this.updateLeftStatus = this.updateLeftStatus.bind(this)

    //scoring
    this.updateAutoAmpScored = this.updateAutoAmpScored.bind(this)
    this.updateAutoSpeakerScored = this.updateAutoSpeakerScored.bind(this)
    this.updateTeleAmpScored = this.updateTeleAmpScored.bind(this)
    this.updateTeleSpeakerScored = this.updateTeleSpeakerScored.bind(this)
    this.updateTeleAmplifiedSpeakerScored = this.updateTeleAmplifiedSpeakerScored.bind(this)
    this.updateEndGameVal = this.updateEndGameVal.bind(this)
    this.updateNoteInTrap = this.updateNoteInTrap.bind(this)
    this.updateHighNotesMade = this.updateHighNotesMade.bind(this)
    this.updateHighNotesMissed = this.updateHighNotesMissed.bind(this)

    //ranking pts
    this.updateRankingPoints = this.updateRankingPoints.bind(this)
    this.updateMatchResult = this.updateMatchResult.bind(this)
    this.updateBonus = this.updateBonus.bind(this)

    //penalties
    this.updateYellowCard = this.updateYellowCard.bind(this)
    this.updateRedCard = this.updateRedCard.bind(this)
    this.updateDQ = this.updateDQ.bind(this)
    this.updateBotBroke = this.updateBotBroke.bind(this)
    this.updateNoShow = this.updateNoShow.bind(this)
    this.updateFoulCount = this.updateFoulCount.bind(this)
    this.updateTechFoulCount = this.updateTechFoulCount.bind(this)
    this.updateFoulComments = this.updateFoulComments.bind(this)
    this.updateRobotBrokenComments = this.updateRobotBrokenComments.bind(this)

    //robot info
    this.updateHangsFaster = this.updateHangsFaster.bind(this)
    this.updateIsFaster = this.updateIsFaster.bind(this)
    this.updateClearsStage = this.updateClearsStage.bind(this)
    this.updateCountersDefense = this.updateCountersDefense.bind(this)
    this.updateLineUpSpeed = this.updateLineUpSpeed.bind(this)
    this.updateIntakeRating = this.updateIntakeRating.bind(this)

    //override
    this.updateOverride = this.updateOverride.bind(this)

    //form component display on/off
    this.updateAutoDisplay = this.updateAutoDisplay.bind(this)
    this.updateTeleDisplay = this.updateTeleDisplay.bind(this)
    this.updateRobotDisplay = this.updateRobotDisplay.bind(this)
    this.updatePenaltyDisplay = this.updatePenaltyDisplay.bind(this)
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
  updateMatchType(val, prop) {
    this.setState({ [prop]: val })
  }

  updateMatchData (match) {
    this.setState({ matchData: match })
    this.setState({ teams: match.alliances.blue.team_keys.concat(match.alliances.red.team_keys) });
  }

  updateTeam(team) {
    this.setState({ teamNumber: team })
  }

  // AUTO SPECIFIC //
  updateAutonomousPlacement(val) {
    this.setState({ autoPlacement: val })
  }

  updateLeftStatus(value) {
    this.setState( {left: value} )
  }

  // SCORING //
  updateCounterBox(i, newState) {
    let counterBoxVals = [...this.state.counterBoxVals];
    counterBoxVals[i] = newState;
    this.setState({ counterBoxVals });
  }

  updateAutoAmpScored(val) {
    this.setState({ autoAmpScored: val })
  }

  updateAutoSpeakerScored(val) {
    this.setState({ autoSpeakerScored: val })
  }

  updateTeleAmpScored(val) {
    this.setState({ teleAmpScored: val })
  }

  updateTeleSpeakerScored(val) {
    this.setState({ teleSpeakerScored: val })
  }

  updateTeleAmplifiedSpeakerScored(val) {
    this.setState({ teleAmplifiedSpeakerScored: val })
  }

  updateHighNotesMade(val) {
    this.setState({highNotesMade: val})
  }

  updateHighNotesMissed(val) {
    this.setState({highNotesMissed: val})
  }

  updateEndGameVal(val) {
    this.setState({ endGameVal: val })
  }

  updateNoteInTrap(val) {
    this.setState({noteInTrap: val})
  }

  // RANKING PTS //
  updateRankingPoints(rankingState) {
    console.log(rankingState)
    let rankingPts = this.state.rankingPts
    if (rankingState === "win") {
      rankingPts = 2
    }
    else if (rankingState === "tie") {
      rankingPts = 1
    }
    else if (rankingState === "loss") {
      rankingPts = 0
    }

    if (rankingState.trim() === "Melody") { //check if they have bonus (melody, ensemble)
      rankingPts++
    }
    else if (rankingState.trim() === "Ensemble") {
      rankingPts++
    }
    this.setState({ rankingPts })
  }

  updateMatchResult(val) {
    this.setState({matchResult: val})
    this.updateRankingPoints(val)
  }

  updateBonus(i, val, name) {
    let bonusStatus = [...this.state.bonusStatus]
    bonusStatus[i] = val ? name : ''
    this.setState({ bonusStatus })
    this.updateRankingPoints(bonusStatus[i])
  }

  // PENALTIES //
  updatePenalty([_, i], val) {
    let penaltyVal = [...this.state.penaltyVal]
    penaltyVal[i] = val
    this.setState({ penaltyVal })
  }

  updateYellowCard(val) {
    this.setState({yellowCard: val})
  }

  updateRedCard(val) {
    this.setState({redCard: val})
  }

  updateDQ(val) {
    this.setState({dq: val})
  }

  updateBotBroke(val) {
    this.setState({botBroke: val})
  }

  updateNoShow(val) {
    this.setState({noShow: val})
  }

  updateFoulCount(val) {
    this.setState({fouls: val})
  }

  updateTechFoulCount(val) {
    this.setState({techFouls: val})
  }

  updateFoulComments(comment) {
    this.setState({ foulComments: comment })
  }

  updateRobotBrokenComments(comment) {
    this.setState({ robotBrokenComments: comment})
  }

  // ROBOT INFO //
  updateBoolean(i, val) {
    let booleans = [...this.state.booleans]
    booleans[i] = val
    this.setState({ booleans })
  }

  updateHangsFaster(val) {
    this.setState({hangsFaster: val})
  }

  updateIsFaster(val) {
    this.setState({isFaster: val})
  }

  updateClearsStage(val) {
    this.setState({clearsStage: val})
  }

  updateCountersDefense(val) {
    this.setState({countersDefense: val})
  }

  updateRatingSlider(i, value) {
    let ratingSliderVals = [...this.state.ratingSliderVals]
    ratingSliderVals[i] = value
    this.setState({ ratingSliderVals })
  }

  updateLineUpSpeed(val) {
    this.setState({lineUpSpeed: val})
  }

  updateIntakeRating(val) {
    this.setState({intakeRating: val})
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

  // FORM COMPONENT DISPLAY ON/OFF //
  updateAutoDisplay () {
    this.setState({ autoOn: !this.state.autoOn})
  }

  updateTeleDisplay () {
    this.setState({ teleOn: !this.state.teleOn})
  }

  updateRobotDisplay () {
    this.setState({ robotOn: !this.state.robotOn})
  }

  updatePenaltyDisplay () {
    this.setState({ penaltiesOn: !this.state.penaltiesOn})
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
          <button onClick={() => this.updateAutoDisplay()} style={{fontSize: "18", width: "30%"}}>AUTONOMOUS:</button>
          {(() => {
            return (this.state.autoOn ?
              (
                <div>
                  <img alt="" src={'./images/auto placement.png'}></img>
                  {makeAutoPlacementDropDownBox({ changeState: this.updateAutonomousPlacement, dropDownVal: this.state.autoPlacement }, "Auto Placement: ", [1, 2, 3, 4])}
                  <br></br>
                  {makeCounterBox({ changeState: this.updateAutoAmpScored, counterBoxVals: this.state.autoAmpScored }, "Amp Scored: ")}
                  {makeCounterBox({ changeState: this.updateAutoSpeakerScored, counterBoxVals: this.state.autoSpeakerScored }, "Speaker Scored: ")}
                  <br></br>
                  {makeBooleanCheckBox({ changeState: this.updateLeftStatus, booleans: [...this.state.booleans] }, "Leave ", 0)}
                  <br></br>
                </div>
              ) : (
                <div></div>
              ))
          })()}
        </div>


        {/* TELEOP */}
        <div className='tele-contain'>
          <button onClick={() => this.updateTeleDisplay()} style={{fontSize: "18", width: "30%"}}>TELEOP:</button>
          {(() => {
            return (this.state.teleOn ?
              (
                <div>
                  {makeCounterBox({ changeState: this.updateTeleAmpScored, counterBoxVals: this.state.teleAmpScored }, "Amp Scored: ")}
                  {makeCounterBox({ changeState: this.updateTeleSpeakerScored, counterBoxVals: this.state.teleSpeakerScored }, "Speaker Scored: ")}
                  {makeCounterBox({ changeState: this.updateTeleAmplifiedSpeakerScored, counterBoxVals: this.state.teleAmplifiedSpeakerScored }, "Amplified Speaker Scored: ")}
                  <br></br>
                  {makeEndGameDropDown({ changeState: this.updateEndGameVal, endGameVal: this.state.endGameVal })}
                  {makeEndGameMisc({changeState: this.updateHangsFaster, endGameVal: this.state.endGameVal, booleans: [...this.state.booleans]}, "Hangs Faster Than Us", 1)}
                  {makeBooleanCheckBox({ changeState: this.updateNoteInTrap, booleans: [...this.state.booleans] }, "Trap Scored ", 2)}
                  <br></br>
                  <p>USE ONLY IF HUMAN PLAYER IS ON AMP</p>
                  {makeCounterBox({ changeState: this.updateHighNotesMade, counterBoxVals: this.state.highNotesMade }, "High Notes Made: ", 5)}
                  {makeCounterBox({ changeState: this.updateHighNotesMissed, counterBoxVals: this.state.highNotesMissed }, "High Notes Missed: ", 6)}
                  <br></br>
                </div>
              ) : (
                <div></div>
              ))
          })()}
        </div>

        {/* ROBOT/TEAM INFO */}
        <div className="robot-info-contain">
          <button onClick={() => this.updateRobotDisplay()} style={{fontSize: "18", width: "30%"}}>ROBOT INFO:</button>
          {(() => {
            return (this.state.robotOn ?
              (
                <div>
                  {makeBooleanCheckBox({ changeState: this.updateIsFaster, booleans: [...this.state.booleans] }, "Faster Than Us ", 3)}
                  {makeBooleanCheckBox({ changeState: this.updateClearsStage, booleans: [...this.state.booleans] }, "Passes Under Stage ", 4)}
                  {makeBooleanCheckBox({ changeState: this.updateCountersDefense, booleans: [...this.state.booleans] }, "Counters Defense ", 5)}
                  {makeRatingSlider({changeState: this.updateLineUpSpeed, ratingSliderVals: this.state.lineUpSpeed}, "Lineup Speed: ", ["None", "Slow", "Average", "Fast"], 0)}
                  {makeRatingSlider({changeState: this.updateIntakeRating, ratingSliderVals: this.state.intakeRating}, "Intake Rating: ", ["None", "Bad", "Average", "Good"], 1)}
                  <br></br>
                </div>
              ) : (
                <div></div>
              ))
          })()}
        </div>

        {/* PENALTIES */}
        <div className="penalty-contain">
          <button onClick={() => this.updatePenaltyDisplay()} style={{fontSize: "18", width: "30%"}}>PENALTIES:</button>
          {(() => {
            return (this.state.penaltiesOn ?
              (
                <div>
                  {makeCounterBox({ changeState: this.updateFoulCount, counterBoxVals: this.state.fouls }, "Fouls: ", 7)}
                  {makeCounterBox({ changeState: this.updateTechFoulCount, counterBoxVals: this.state.techFouls }, "Tech Fouls: ", 8)}
                  <TextBox changeState={this.updateFoulComments} title="Foul Descriptions:" description="Provide specifics on fouls commited (be brief)." value={this.state.foulComments} displayOn={this.state.counterBoxVals[7] || this.state.counterBoxVals[8]}/>
                  {(_ => ["Yellow Card", "Red Card", "Disable", "Disqualified", "Bot Broke", "No Show"].
                    map((label, i) => makePenaltyBox({ changeState: this.updatePenalty, penaltyVal: this.state.penaltyVal }, `${label} `, i))
                  )()}
                  <TextBox changeState={this.updateRobotBrokenComments} title="Robot Broken Description:" description="IF the robot broke, describe what exactly broke (you can go down to the pit and ask the team what broke)" value={this.state.robotBrokenComments} displayOn={this.state.penaltyVal[4] === "Bot Broke "}/>
                </div>
              ) : (
                <div></div>
              ))
          })()}
        </div>

        <br></br>

        {/* RANKING POINTS */}
        <div className="ranking-contain">
          <h3>RANKING POINTS:</h3>
          <RadioButton
            label="whoWon"
            options={[
              { value: "win", label: "Team Won" },
              { value: "tie", label: "Team Tied" },
              { value: "loss", label: "Team Lost" }
            ]}
            changeState={this.updateMatchResult}
            selected={this.state.matchResult}

          />
          {makeBonusBox({ changeState: this.updateBonus, bonusStatus: this.state.bonusStatus, rankingPoints: this.state.rankingPts }, "Melody ", 0)}
          {makeBonusBox({ changeState: this.updateBonus, bonusStatus: this.state.bonusStatus, rankingPoints: this.state.rankingPts }, "Ensemble ", 1)}
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
          {makeOverrideBox({ changeState: this.updateOverride, override: this.state.override })}
        </div>
        <br></br>
      </div>
    )
  }
}

export default Form;