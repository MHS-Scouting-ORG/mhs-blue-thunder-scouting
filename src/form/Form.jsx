import React from 'react';
// checkbox utility function imports //
import { makeBooleanCheckBox, makePenaltyBox, makeBonusBox } from './components/checkBox/CheckBoxUtils';

// dropdown utility function imports //
import { makeAutoPlacementDropDownBox, makeMatchDropDown, makeTeamDropDown } from './components/dropDownBox/DropDownUtils';

// endgame utility function imports //
import { makeEndGameMiscCheckbox, makeEndGameMiscRadio, makeEndGameDropDown } from './components/endGameBox/EndGameUtils';

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
      autoAmpScored: 0,
      autoSpeakerScored: 0,
      teleAmpScored: 0,
      teleSpeakerScored: 0,
      teleAmplifiedSpeakerScored: 0,
      highNotesMade: 0,
      highNotesMissed: 0,

      endGameVal: '', //onstage, attempted, parked, none
      stagePosition: '',
      noteInTrap: false,

      totalPts: 0,
      autoPts: 0,
      telePts: 0,
      ampPts: 0,
      speakerPts: 0,

      // RANKING PTS //
      rankingPts: 0,
      matchResult: '', //win, tie, loss
      bonusStatus: [false, false],

      // PENALTIES //
      yellowCard: false,
      redCard: false,
      disable: false,
      dq: false,
      botBroke: false,
      noShow: false,
      fouls: 0,
      techFouls: 0,
      foulComments: "",
      robotBrokenComments: "",

      // ROBOT INFO //
      betterAmp: false,
      betterSpeaker: false,
      betterTrap: false,
      hangsFaster: false,
      isFaster: false,
      clearsStage: false,
      countersDefense: false,
      canDefend: false,
      lineUpSpeed: "",
      intakeRating: "",
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
    this.updateStagePosition = this.updateStagePosition.bind(this)
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
    this.updateDisable = this.updateDisable.bind(this)
    this.updateDQ = this.updateDQ.bind(this)
    this.updateBotBroke = this.updateBotBroke.bind(this)
    this.updateNoShow = this.updateNoShow.bind(this)
    this.updateFoulCount = this.updateFoulCount.bind(this)
    this.updateTechFoulCount = this.updateTechFoulCount.bind(this)
    this.updateFoulComments = this.updateFoulComments.bind(this)
    this.updateRobotBrokenComments = this.updateRobotBrokenComments.bind(this)

    //robot info
    this.updateBetterAmp = this.updateBetterAmp.bind(this)
    this.updateBetterSpeaker = this.updateBetterSpeaker.bind(this)
    this.updateBetterTrap = this.updateBetterTrap.bind(this)
    this.updateHangsFaster = this.updateHangsFaster.bind(this)
    this.updateIsFaster = this.updateIsFaster.bind(this)
    this.updateClearsStage = this.updateClearsStage.bind(this)
    this.updateCountersDefense = this.updateCountersDefense.bind(this)
    this.updateLineUpSpeed = this.updateLineUpSpeed.bind(this)
    this.updateIntakeRating = this.updateIntakeRating.bind(this)
    this.updateCanDefend = this.updateCanDefend.bind(this)
    this.renderBooleanCheckboxes = this.renderBooleanCheckboxes.bind(this)

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

    //INIT
    this.setState({
      matchType: matchType,
      elmNum: (((m.id.substring(8)).indexOf("f") >= 0) ? (m.id.substring(m.id.length())) : ''), //MATCH ELM NUMBER
      matchNumber: matchNumber,
      matchData: [],
      teamNumber: m.Team,
      teams: [],

      // AUTO SPECIFIC //
      autoPlacement: m.Autonomous.StartingPosition,
      left: m.Autonomous.Left,

      // SCORING //
      autoAmpScored: m.Autonomous.AmountScored.Amp,
      autoSpeakerScored: m.Autonomous.AmountScored.Speaker,
      teleAmpScored: m.Teleop.AmountScored.Amp,
      teleSpeakerScored: m.Teleop.AmountScored.Speaker,
      teleAmplifiedSpeakerScored: m.Teleop.AmountScored.AmplifiedSpeaker,
      highNotesMade: m.Teleop.HumPlrScoring.Made,
      highNotesMissed: m.Teleop.HumPlrScoring.Missed,

      endGameVal: m.Teleop.EndGame.StageResult, //onstage, attempted, parked, none
      noteInTrap: m.Teleop.EndGame.TrapScored,

      totalPts: m.TotalPoints,
      autoPts: m.Autonomous.PointsScored.Points,
      telePts: m.Teleop.PointsScored.Points,

      // RANKING PTS //
      // rankingState: ["", "", ""], // [ (win, tie, loss), activation, sustainability]
      rankingPts: 0,
      matchResult: m.Teleop.Endgame.MatchResult, //win, tie, loss
      bonusStatus: [
        m.Teleop.EndGame.Melody,
        m.Teleop.EndGame.Ensemble
      ],

      // PENALTIES //
      // penaltyVal: [' ', ' ', ' ', ' ', ' ', ' '], // yellow card, red card, dq, botbroke, no show
      yellowCard: m.Penalties.PenaltiesCommited.YellowCard,
      redCard: m.Penalties.PenaltiesCommited.RedCard,
      disable: m.Penalties.PenaltiesCommited.Disabled,
      dq: m.Penalties.PenaltiesCommited.DQ,
      botBroke: m.Penalties.PenaltiesCommited.Broken,
      noShow: m.Penalties.PenaltiesCommited.NoShow,
      fouls: m.Penalties.Fouls,
      techFouls: m.Penalties.Tech,
      foulComments: m.Penalties.FoulDesc,
      robotBrokenComments: m.RobotInfo.WhatBrokeDesc,

      // ROBOT INFO //
      // booleans: [false, false, false, false, false, false], //mobility, hangsFaster, noteInTrap, isFaster, clearsStage, countersDefense
      betterAmp: m.RobotInfo.BetterAmp,
      betterSpeaker: m.RobotInfo.BetterSpeaker,
      betterTrap: m.RobotInfo.BetterTrap,
      hangsFaster: m.RobotInfo.HangsFaster,
      isFaster: m.RobotInfo.FasterThanUs,
      clearsStage: m.RobotInfo.PassesUnderStage,
      countersDefense: m.RobotInfo.CountersDefense,
      lineUpSpeed: m.RobotInfo.LineupSpeed,
      intakeRating: m.RobotInfo.IntakeRating,
      canDefend: m.RobotInfo.CanDefend,
    })
  }

  // MATCH INFO //
  updateMatchType(val, prop) {
    this.setState({ [prop]: val })
  }

  updateMatchData (match) {
    this.setState({ matchData: match, teams: match.alliances.blue.team_keys.concat(match.alliances.red.team_keys) });
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

  updateStagePosition(val) {
    this.setState({ stagePosition: val})
  }

  updateNoteInTrap(val) {
    this.setState({noteInTrap: val})
  }

  // RANKING PTS //
  updateRankingPoints(rankingState) {
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

    this.setState({ rankingPts })
    this.setState({ bonusStatus: [false,false]})
  }

  updateMatchResult(val) {
    this.setState({matchResult: val})
    this.updateRankingPoints(val)
  }

  updateBonus(i, val, name) {
    let bonusStatus = [...this.state.bonusStatus]
    // bonusStatus[i] = val ? name : ''
    bonusStatus[i] = !bonusStatus[i]
    this.setState({ bonusStatus })

    let rankingPts = this.state.rankingPts
    if(!bonusStatus[i]){
      rankingPts--;
    }
    else{
      rankingPts++;
    }
    this.setState({ rankingPts })
    // this.updateRankingPoints(bonusStatus[i])
  }

  // PENALTIES //
  updatePenalty([_, i], val) {
    let penaltyVal = [...this.state.penaltyVal]
    penaltyVal[i] = val
    this.setState({ penaltyVal })
  }

  updateYellowCard(event) {
    let checked = event.target.checked
    this.setState({yellowCard: checked})
  }

  updateRedCard(event) {
    let checked = event.target.checked
    this.setState({redCard: checked})
  }

  updateDisable(event) {
    let checked = event.target.checked
    this.setState({disable: checked})
  }

  updateDQ(event) {
    let checked = event.target.checked
    this.setState({dq: checked})
  }

  updateBotBroke(event) {
    let checked = event.target.checked
    this.setState({botBroke: checked})
  }

  updateNoShow(event) {
    let checked = event.target.checked
    this.setState({noShow: checked})
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
    let booleans = this.state.isFaster
    booleans[i] = val
    this.setState({ booleans })
  }

  updateBetterAmp(val) {
    this.setState({betterAmp: val})
  }

  updateBetterSpeaker(val) {
    this.setState({betterSpeaker: val})
  }

  updateBetterTrap(val) {
    this.setState({betterTrap: val})
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

  updateCanDefend(val) {
    this.setState({canDefend: val})
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

  renderBooleanCheckboxes() {
    return(
      <>
      {makeBooleanCheckBox({ changeState: this.updateBetterAmp, booleans: this.state.betterAmp }, "Scores Amp Better ")}
      {makeBooleanCheckBox({ changeState: this.updateBetterSpeaker, booleans: this.state.betterSpeaker }, "Scores Speaker Better ")}
      {makeBooleanCheckBox({ changeState: this.updateBetterTrap, booleans: this.state.betterTrap }, "Scores Trap Better ")}
      {makeBooleanCheckBox({ changeState: this.updateIsFaster, booleans: this.state.isFaster }, "Faster Than Us ")}
      {makeBooleanCheckBox({ changeState: this.updateClearsStage, booleans: this.state.clearsStage }, "Goes Under Stage ")}
      {makeBooleanCheckBox({ changeState: this.updateCountersDefense, booleans: this.state.countersDefense }, "Counters/Gets Around Defense ")}
      {makeBooleanCheckBox({ changeState: this.updateCanDefend, booleans: this.state.canDefend }, "Can Defend ")}
      </>
    )

  }

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

  updatePoints(totalPts, autoPts, telePts) {
    this.setState({ totalPts, autoPts, telePts })
  }

  // rendering physical and visible website components
  render() {
    return (
      <div className="form-contain">
        {/* TITLE */}
        <h2> CRESCENDO FORM <img alt="" src={'./images/BLUETHUNDERLOGO_WHITE.png'}></img> </h2>

        {/* CHECK STATE BUTTON */}
        <div className="match-contain">
          <button onClick={() => console.log(this.state)}> Check State </button>

          {/* MATCH INITIATION */}
          {makeMatchDropDown({ ...this.state, changeState: this.updateMatchType })}
          <button onClick={() => { getMatchTeams({ ...this.state, changeState: this.updateMatchData, regional: this.regional }) }}>GET MATCH TEAMS</button>
          <br></br>
          {makeTeamDropDown({ ...this.state, changeState: this.updateTeam, teams: this.state.teams })}
        </div>

        <br></br>

        {/* AUTONOMOUS */}
        <div className="auto-contain">
          <button onClick={() => this.updateAutoDisplay()}>AUTONOMOUS:</button>
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
                  {makeBooleanCheckBox({ changeState: this.updateLeftStatus, booleans: this.state.left }, "Leave ")}
                  <br></br>
                </div>
              ) : (
                <div></div>
              ))
          })()}
        </div>


        {/* TELEOP */}
        <div className='tele-contain'>
          <button onClick={() => this.updateTeleDisplay()} >TELEOP:</button>
          {(() => {
            return (this.state.teleOn ?
              (
                <div>
                  {makeCounterBox({ changeState: this.updateTeleAmpScored, counterBoxVals: this.state.teleAmpScored }, "Amp Scored: ")}
                  {makeCounterBox({ changeState: this.updateTeleSpeakerScored, counterBoxVals: this.state.teleSpeakerScored }, "Speaker Scored: ")}
                  {makeCounterBox({ changeState: this.updateTeleAmplifiedSpeakerScored, counterBoxVals: this.state.teleAmplifiedSpeakerScored }, "Amplified Speaker Scored: ")}
                  <br></br>
                  {makeEndGameDropDown({ changeState: this.updateEndGameVal, changeHangsFaster: this.updateHangsFaster, endGameVal: this.state.endGameVal })}
                  {makeEndGameMiscCheckbox({changeState: this.updateHangsFaster, endGameVal: this.state.endGameVal, booleans: this.state.hangsFaster }, "Hangs Faster Than Us")}
                  {makeEndGameMiscRadio({changeState: this.updateStagePosition, endGameVal: this.state.endGameVal, stagePosition: this.state.stagePosition }, "Stage Position: ")}
                  {makeBooleanCheckBox({ changeState: this.updateNoteInTrap, booleans: this.state.noteInTrap }, "Trap Scored ")}
                  <br></br>
                  <p>USE ONLY IF HUMAN PLAYER IS ON AMP</p>
                  {makeCounterBox({ changeState: this.updateHighNotesMade, counterBoxVals: this.state.highNotesMade }, "High Notes Made: ")}
                  {makeCounterBox({ changeState: this.updateHighNotesMissed, counterBoxVals: this.state.highNotesMissed }, "High Notes Missed: ")}
                  <br></br>
                </div>
              ) : (
                <div></div>
              ))
          })()}
        </div>

        {/* ROBOT/TEAM INFO */}
        <div className="robot-info-contain">
          <button onClick={() => this.updateRobotDisplay()}>ROBOT INFO:</button>
          {(() => {
            return (this.state.robotOn ?
              (
                <div>
                  {this.renderBooleanCheckboxes()}
                  {makeRatingSlider({changeState: this.updateLineUpSpeed, ratingSliderVals: this.state.lineUpSpeed}, "Alignment Speed: ", ["None", "Slow", "Average", "Fast"])}
                  {makeRatingSlider({changeState: this.updateIntakeRating, ratingSliderVals: this.state.intakeRating}, "Intake Rating: ", ["None", "Bad", "Average", "Good"])}
                  <br></br>
                </div>
              ) : (
                <div></div>
              ))
          })()}
        </div>

        {/* PENALTIES */}
        <div className="penalty-contain">
          <button onClick={() => this.updatePenaltyDisplay()}>PENALTIES:</button>
          {(() => {
            return (this.state.penaltiesOn ?
              (
                <div>
                  {makeCounterBox({ changeState: this.updateFoulCount, counterBoxVals: this.state.fouls }, "Fouls: ")}
                  {makeCounterBox({ changeState: this.updateTechFoulCount, counterBoxVals: this.state.techFouls }, "Tech Fouls: ")}
                  <TextBox changeState={this.updateFoulComments} title="Foul Descriptions:" description="Provide specifics on fouls commited (be brief)." value={this.state.foulComments} displayOn={this.state.fouls || this.state.techFouls}/>
                  {(_ => [{label: "Yellow Card", updatePenalty: this.updateYellowCard, penaltyVal: this.state.yellowCard}, {label: "Red Card", updatePenalty: this.updateRedCard, penaltyVal: this.state.redCard}, {label: "Disable", updatePenalty: this.updateDisable, penaltyVal: this.state.disable}, {label: "Disqualified", updatePenalty: this.updateDQ, penaltyVal: this.state.dq}, {label: "Bot Broke", updatePenalty: this.updateBotBroke, penaltyVal: this.state.botBroke}, {label: "No Show", updatePenalty: this.updateNoShow, penaltyVal: this.state.noShow},].
                    map((obj, i) =>
                      makePenaltyBox({ changeState: obj.updatePenalty, penaltyVal: obj.penaltyVal }, `${obj.label} `))
                  )()}
                  <TextBox changeState={this.updateRobotBrokenComments} title="Robot Broken Description:" description="IF the robot broke, describe what exactly broke (you can go down to the pit and ask the team what broke)" value={this.state.robotBrokenComments} displayOn={this.state.botBroke}/>
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
        </div>
        <br></br>
      </div>
    )
  }
}

export default Form;