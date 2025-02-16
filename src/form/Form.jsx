import React, { useEffect, useState } from "react"
import { getMatchesForRegional } from '../api/bluealliance';

import { apiGetRegional, apigetMatchesForRegional } from '../api/index';
//import {  }
// styling
import classes from './Form.module.css';
import { submitState } from './FormUtils'

function Form(props) {
  /* Regional Key */
  const regional = apiGetRegional()

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
    setHangType('')
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

  return (
    <div>
      <h1>FORM</h1>

      <div>
        {/* Match Init */}
        <h2>MATCH & ROBOT</h2>

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
        <br></br>

        {/* AUTONOMOUS */}
        <h2>AUTONOMOUS</h2>
        <div>Auto Placement here maybe clickable button pos?</div>
        <select value={autoPlacement} onChange={(e) => setAutoPlacement(e.target.value)}>
          <option value=""> temp autoplacement for now</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <button onClick={() => setLeft(!left)}>Auto Leave</button>
        <button onClick={() => setAutoCoralL1(autoCoralL1 + 1)}>L1 Scored</button>
        <button onClick={() => setAutoCoralL2(autoCoralL2 + 1)}>L2 Scored</button>
        <button onClick={() => setAutoCoralL3(autoCoralL3 + 1)}>L3 Scored</button>
        <button onClick={() => setAutoCoralL4(autoCoralL4 + 1)}>L4 Scored</button>
        <button onClick={() => setAutoProcessorScored(autoProcessorScored + 1)}>Processor Scored</button>
        <button onClick={() => setAutoNetScored(autoNetScored + 1)}>Net Scored</button>
        <br></br>

        {/* TELEOP */}
        <h2>TELEOP</h2>
        <button onClick={() => setTeleCoralL1(teleCoralL1 + 1)}>L1 Scored</button>
        <button onClick={() => setTeleCoralL2(teleCoralL2 + 1)}>L2 Scored</button>
        <button onClick={() => setTeleCoralL3(teleCoralL3 + 1)}>L3 Scored</button>
        <button onClick={() => setTeleCoralL4(teleCoralL4 + 1)}>L4 Scored</button>
        <button onClick={() => setProcessorScored(processorScored + 1)}>Processor Scored</button>
        <button onClick={() => setNetScored(netScored + 1)}>Net Scored</button>
        <select onChange={(e) => setHangType(e.target.value)}>
          <option value=''>Endgame Type</option>
          <option value='Shallow'>Shallow</option>
          <option value='Deep'>Deep</option>
          <option value='Parked'>Park</option>
        </select>
        <br></br>
        <br></br>

        {/* PENALTIES */}
        <h2>PENALTIES</h2>
        <button onClick={() => setYellowCard(!yellowCard)}>YellowCard</button>
        <button onClick={() => setRedCard(!redCard)}>RedCard</button>
        <button onClick={() => setDisable(!disable)}>Disable</button>
        <button onClick={() => setDQ(!dq)}>DQ</button>
        <button onClick={() => setBotBroke(!botBroke)}>Bot Broke</button>
        <button onClick={() => setNoShow(!noShow)}>No Show</button>
        <button onClick={() => setMinFouls(minFouls + 1)}>Min Foul</button>
        <button onClick={() => setMajFouls(majFouls + 1)}>Maj Foul</button>
        {botBroke ? <input placeholder="comments" type="text" value={robotBrokenComments} onChange={(e) => setRobotBrokenComments(e.target.value)}></input> : null}
        <br></br>
        {/* ROBOT INFO */}
        <h2>ROBOT INFO</h2>
        <select value={robotSpeed} onChange={(e) => setRobotSpeed(e.target.value)}>
          <option value="">Robot Speed</option>
          <option value="Slow">Slow</option>
          <option value="Average">Average</option>
          <option value="Fast">Fast</option>
        </select>
        <input type="text" placeholder="Optional Insight" value={robotInsight} onChange={(e) => setRobotInsight(e.target.value)}></input>
        <br></br>
      </div>
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