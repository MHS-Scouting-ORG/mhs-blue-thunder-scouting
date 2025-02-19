import React, { useEffect, useState } from "react"
import { getMatchesForRegional } from '../api/bluealliance';

import { apiGetRegional, apigetMatchesForRegional } from '../api/index';
import { buttonIncremental } from "./FormUtils";
// styling
import classes from './Form.module.css';
import { submitState } from './FormUtils'
import CollapseTButton from "../components/Table/TableUtils/CollapseTButton";

function Form(props) {
  /* Regional Key */
  const regional = apiGetRegional()
  const type = "form"

  /* MATCH */
  const [matchData, setMatchData] = useState([]) //used to pick blue alliance info
  const [apiMatchData, setApiMatchData] = useState([]) //match data in our database
  const [matchType, setMatchType] = useState(''); //match type
  const [elmNum, setElmNum] = useState(''); //elimination
  const [matchNumber, setMatchNumber] = useState(''); //match number
  const [teamNumber, setTeamNumber] = useState(''); //team num
  const [color, setColor] = useState(false); // alliance color
  const [red, setRed] = useState([]); //red teams for a given match
  const [blue, setBlue] = useState([]); //blue teams for a given match
  const [matchKey, setMatchKey] = useState(''); //match key

  /* AUTO SPECIFIC */
  const [autoPlacement, setAutoPlacement] = useState(''); //1,2,3,4
  const [left, setLeft] = useState(false);
  const [autoCoralL1, setAutoCoralL1] = useState(0);
  const [autoCoralL2, setAutoCoralL2] = useState(0);
  const [autoCoralL3, setAutoCoralL3] = useState(0);
  const [autoCoralL4, setAutoCoralL4] = useState(0);
  const [autoProcessorScored, setAutoProcessorScored] = useState(0);
  const [autoNetScored, setAutoNetScored] = useState(0);

  /* TElEOP */
  const [teleCoralL1, setTeleCoralL1] = useState(0);
  const [teleCoralL2, setTeleCoralL2] = useState(0);
  const [teleCoralL3, setTeleCoralL3] = useState(0);
  const [teleCoralL4, setTeleCoralL4] = useState(0);
  const [processorScored, setProcessorScored] = useState(0);
  const [netScored, setNetScored] = useState(0);
  const [hangType, setHangType] = useState('');

  /* PENALTIES */
  const [yellowCard, setYellowCard] = useState(false);
  const [redCard, setRedCard] = useState(false);
  const [disable, setDisable] = useState(false);
  const [dq, setDQ] = useState(false);
  const [botBroke, setBotBroke] = useState(false);
  const [noShow, setNoShow] = useState(false);
  const [minFouls, setMinFouls] = useState(0);
  const [majFouls, setMajFouls] = useState(0);
  const [robotBrokenComments, setRobotBrokenComments] = useState("");

  /* ROBOT INFO */
  const [robotSpeed, setRobotSpeed] = useState([]);
  const [robotInsight, setRobotInsight] = useState("");

  /* Toggle States */
  const [infoState, setInfoState] = useState('none');
  const [autoState, setAutoState] = useState('none');
  const [teleState, setTeleState] = useState('none');
  const [penaltyState, setPenaltyState] = useState('none');
  const [robotState, setRobotState] = useState('none');

  /* Submit */
  const [confirm, setConfirm] = useState(false);



  useEffect(() => {
    /* Get Matches for Regional from bluealliance */
    getMatchesForRegional(regional)
      .then(data => {
        const match_key = regional + "_" + matchType + elmNum + "m" + matchNumber
        setMatchKey(match_key)

        /* Finds match data from bluealliance based on user input */
        const match = data.find((x) => x.key === match_key)
        if (match) {
          setMatchData(match)
          setRed(match.alliances.red.team_keys)
          setBlue(match.alliances.blue.team_keys)
        }
      })
      .catch(err => console.log(err))
  }, [matchType, elmNum, matchNumber])
  useEffect(() => {
    /* Check for pre-existing match data in our api */
    apigetMatchesForRegional(regional)
      .then((data) => {
        let matches = data.data.teamMatchesByRegional.items
        let team = matches.find((x) => x.Team === teamNumber)
        if (team !== undefined && apiMatchData.find((x) => x.Team === teamNumber) === undefined)
          setApiMatchData(apiMatchData.concat(team))
      })
      .catch(err => console.log(err))
  }, [teamNumber]
  )

  const resetStates = () => {
    setMatchData([])
    setApiMatchData([])
    setMatchType('')
    setElmNum('')
    setMatchNumber('')
    setTeamNumber('')
    setColor(false)
    setRed([])
    setBlue([])
    setMatchKey('')
    setAutoPlacement('')
    setLeft('')
    setAutoCoralL1(0)
    setAutoCoralL2(0)
    setAutoCoralL3(0)
    setAutoCoralL4(0)
    setAutoProcessorScored(0)
    setAutoNetScored(0)
    setTeleCoralL1(0)
    setTeleCoralL2(0)
    setTeleCoralL3(0)
    setTeleCoralL4(0)
    setProcessorScored(0)
    setNetScored(0)
    setHangType([])
    setYellowCard(false)
    setRedCard(false)
    setDisable(false)
    setDQ(false)
    setBotBroke(false)
    setNoShow(false)
    setMinFouls(0)
    setMajFouls(0)
    setRobotBrokenComments('')
    setRobotSpeed([])
    setRobotInsight('')
    setConfirm(false)

  }

  const toggleInfo = () => {
    if (infoState === 'none') {
      setInfoState('')
    }
    else {
      setInfoState('none')
    }
  }

  const toggleAuto = () => {
    if (autoState === 'none') {
      setAutoState('')
    }
    else {
      setAutoState('none')
    }
  }

  const toggleTele = () => {
    if (teleState === 'none') {
      setTeleState('')
    }
    else {
      setTeleState('none')
    }
  }

  const togglePenalty = () => {
    if (penaltyState === 'none') {
      setPenaltyState('')
    }
    else {
      setPenaltyState('none')
    }
  }

    const toggleRobot = () => {
      if (robotState === 'none') {
        setRobotState('')
      }
      else {
        setRobotState('none')
      }
  }

  return (
    <div>
      <h1>FORM</h1>

      {/* Match Init */}
      <CollapseTButton label="Match Info" toggleFunction={toggleInfo} type={type}/>
        <div style={{ display: infoState}}> 
        
          <select value={matchType} onInput={(e) => { setMatchType(e.target.value); setElmNum("") }}>
            <option value=""></option>
            <option value='q'>Qualification</option>
            <option value='qf'>Quarterfinal</option>
            <option value='sf'>Semifinal</option>
            <option value='f'>Final</option>
          </select>
          {
            matchType === 'qf' || matchType === 'sf' || matchType === 'f' ?
              <input placeholder="elim#" type="number" value={elmNum} onChange={(e) => setElmNum(e.target.value)}></input>
              : null
          }
          <input placeholder="match#" type="number" value={matchNumber} onChange={(e) => setMatchNumber(e.target.value)}></input>
        

        <br></br>

        <button onClick={() => setColor(!color)}>{color === false ? 'RED' : 'BLUE'}</button>

        <select onChange={(e) => setTeamNumber(e.target.value)}>
          <option>robot #</option>
          {color === false ?

            matchData != [] ?
              red.map((team) => {
                return <option value={team} key={team}>{team}</option>
              }) : null

            : matchData != [] ?
              blue.map((team) => {
                return <option value={team} key={team}>{team}</option>
              }) : null

          }
        </select>
        </div>

        <br></br>

        {/* AUTONOMOUS */}
        <CollapseTButton label="Autonomous" toggleFunction={toggleAuto} type={type}/>
        <div style={{ display: autoState}}> 

          {/* Placement */}
          <div>
        <select value={autoPlacement} onChange={(e) => setAutoPlacement(e.target.value)}>
          <option value=""> Start</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
          </div>

          {/* Left */}
        <button onClick={() => setLeft(!left)} style={{ backgroundColor: left === true ? "#77B6E2" : "" }}> 
          {
            left === false ? <img src={"./images/autoLeaveFalse.png"} style={{width: "50px"}}/>
            : <img src={"./images/autoLeaveTrue.png"} style={{width: "50px"}}/>
          }
        </button>

        <button onClick={() => setAutoCoralL1(autoCoralL1 + 1)}>{buttonIncremental(autoCoralL1, "coral1", "coral")}</button>
        <button onClick={() => setAutoCoralL2(autoCoralL2 + 1)}>{buttonIncremental(autoCoralL2, "coral2", "coral")}</button>
        <button onClick={() => setAutoCoralL3(autoCoralL3 + 1)}>{buttonIncremental(autoCoralL3, "coral3", "coral")}</button>
        <button onClick={() => setAutoCoralL4(autoCoralL4 + 1)}>{buttonIncremental(autoCoralL4, "coral4", "coral")}</button>
        <button onClick={() => setAutoProcessorScored(autoProcessorScored + 1)}>{buttonIncremental(autoProcessorScored, "processor", "algae")}</button>
        <button onClick={() => setAutoNetScored(autoNetScored + 1)}>{buttonIncremental(autoNetScored, "net", "algae")}</button>
        </div>

        <br></br>

        {/* TELEOP */}
        <CollapseTButton label="Teleop" toggleFunction={toggleTele} type={type}/>
        <div style={{ display: teleState}}> 
        
        <button onClick={() => setTeleCoralL1(teleCoralL1 + 1)}>{buttonIncremental(teleCoralL1, "coral1", "coral")}</button>
        <button onClick={() => setTeleCoralL2(teleCoralL2 + 1)}>{buttonIncremental(teleCoralL2, "coral2", "coral")}</button>
        <button onClick={() => setTeleCoralL3(teleCoralL3 + 1)}>{buttonIncremental(teleCoralL3, "coral3", "coral")}</button>
        <button onClick={() => setTeleCoralL4(teleCoralL4 + 1)}>{buttonIncremental(teleCoralL4, "coral4", "coral")}</button>
        <button onClick={() => setProcessorScored(processorScored + 1)}>{buttonIncremental(processorScored, "processor", "algae")}</button>
        <button onClick={() => setNetScored(netScored + 1)}>{buttonIncremental(netScored, "net", "algae")}</button>
        <button onClick={() => setMinFouls(minFouls + 1)}>Min Foul</button>
        <button onClick={() => setMajFouls(majFouls + 1)}>Maj Foul</button>

        <div>
          <select value={hangType} onChange={(e) => setHangType(e.target.value)}>
            <option value=''>Endgame Type</option>
            <option value='Shallow'>Shallow</option>
            <option value='Deep'>Deep</option>
            <option value='Parked'>Park</option>
          </select>
        </div>

        </div>

        <br></br>

        {/* PENALTIES */}
        <CollapseTButton label="Penalties" toggleFunction={togglePenalty} type={type}/>
        <div style={{ display: penaltyState}}> 
        
        <button onClick={() => setYellowCard(!yellowCard)}>YellowCard</button>
        <button onClick={() => setRedCard(!redCard)}>RedCard</button>
        <button onClick={() => setDisable(!disable)}>Disable</button>
        <button onClick={() => setDQ(!dq)}>DQ</button>
        <button onClick={() => setBotBroke(!botBroke)}>Bot Broke</button>
        <button onClick={() => setNoShow(!noShow)}>No Show</button>
        {botBroke ? <input placeholder="comments" type="text" value={robotBrokenComments} onChange={(e) => setRobotBrokenComments(e.target.value)}></input> : null}
        </div>

        <br></br>


        {/* ROBOT INFO */}
        <CollapseTButton label="Robot Info" toggleFunction={toggleRobot} type={type}/>
        <div style={{ display: robotState}}> 
        <div>
          <select value={robotSpeed} onChange={(e) => setRobotSpeed(e.target.value)}>
            <option value="">Robot Speed</option>
            <option value="Slow">Slow</option>
            <option value="Average">Average</option>
            <option value="Fast">Fast</option>
          </select>
        </div>
        
        <input type="text" placeholder="Optional Insight" value={robotInsight} onChange={(e) => setRobotInsight(e.target.value)}></input>
        </div>

        <br></br>
      {/* Submit */}
      <button onClick={() => { setConfirm(!confirm) }}>{confirm ? "Not Yet" : "Submit"}</button>
      {confirm ? <button onClick={() => {
        submitState(
          regional,
          teamNumber,
          matchKey,
          apiMatchData,
          matchType,
          elmNum,
          matchNumber,
          autoPlacement,
          left,
          autoCoralL1,
          autoCoralL2,
          autoCoralL3,
          autoCoralL4,
          autoProcessorScored,
          autoNetScored,
          teleCoralL1,
          teleCoralL2,
          teleCoralL3,
          teleCoralL4,
          processorScored,
          netScored,
          hangType,
          yellowCard,
          redCard,
          disable,
          dq,
          botBroke,
          noShow,
          minFouls,
          majFouls,
          robotSpeed,
          robotInsight,
          robotBrokenComments
      )
      .then(_ => {
        alert('Form Submitted')
        resetStates()
      })
        .catch(err => alert(`Form Incomplete, ${JSON.stringify(err)}`))


        }
      }
      >Confirm</button> : null}

    </div>
  )
}

export default Form;