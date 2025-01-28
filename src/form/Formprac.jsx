import React, { useEffect, useState } from "react"
import { getMatchesForRegional } from '../api/bluealliance';

// styling
import classes from './Form.module.css';

import { apiGetRegional } from '../api/index';
import DropDown from "./components/dropDownBox/DropDown";

function Formprac (props) {
/* Regional Key */
  const regional = apiGetRegional()

  const [matchData, setMatchData] = useState([])

  const [matchType, setMatchType] = useState([]); //match type
  const [elmNum, setElmNum] = useState([]); //elimination
  const [matchNumber, setMatchNumber] = useState([]); //match number
  const [teamNumber, setTeamNumber] = useState([]); //team num
  const [color, setColor] = useState(false); // alliance color
  const [red, setRed] = useState([]); //red teams for a given match
  const [blue, setBlue] = useState([]); //blue teams for a given match

  /* AUTO SPECIFIC */
  const [autoPlacement, setAuoPlacement] = useState([]); //1,2,3,4
  const [left, setLeft] = useState(false);
  
  /* SCORING */
  const [autoCoralL1, setAutoCoralL1] = useState([]);
  const [autoCoralL2, setAutoCoralL2] = useState([]);
  const [autoCoralL3, setAutoCoralL3] = useState([]);
  const [autoCoralL4, setAutoCoralL4] = useState([]);

  const [teleCoralL1, setTeleCoralL1] = useState([]);
  const [teleCoralL2, setTeleCoralL2] = useState([]);
  const [teleCoralL3, setTeleCoralL3] = useState([]);
  const [teleCoralL4, setTeleCoralL4] = useState([]);
  const [processorScored, setProcessorScored] = useState([]);
  const [netScored, setNetScored] = useState([]);
  const [hangType, setHangType] = useState([]);

  /* ACCURACY */
  const [MissedCoralL1, setMissedCoralL1] = useState([]);
  const [MissedCoralL2, setMissedCoralL2] = useState([]);
  const [MissedCoralL3, setMissedCoralL3] = useState([]);
  const [MissedCoralL4, setMissedCoralL4] = useState([]);
  const [MissedProcessor, setMissedProcessor] = useState([]);
  const [MissedNet, setMissedNet] = useState([])

  /* PENALTIES */
  const [yellowCard, setYellowCard] = useState(false);
  const [redCard, setRedCard] = useState(false);
  const [disable, setDisable] = useState(false);
  const [dq, setDQ] = useState(false);
  const [botBroke, setBotBroke] = useState(false);
  const [minFouls, setMinFouls] = useState([]);
  const [majFouls, setMajFouls] = useState([]);
  const [robotBrokenComments, setRobotBrokenComments] = useState("");

  /* ROBOT INFO */
  const [robotSpeed, setRobotSpeed] = useState([]);


  console.log(`functional component form`)

  useEffect(() => {
    /* Get Matches for Regional from bluealliance */
    getMatchesForRegional(regional) 
    .then(data => {
      console.log(data)
      const matchKey = regional + "_" + matchType + elmNum + "m" + matchNumber

      /* Finds match data from bluealliance based on user input */
      data.map((match) => {
        if(match.key === matchKey) {
          setMatchData(match)
          console.log(match)
          console.log(match.alliances.red.team_keys)
          setRed(match.alliances.red.team_keys)
          setBlue(match.alliances.blue.team_keys)
          console.log(red)
          console.log(blue)
        }
      })

    })
  },[matchType, elmNum, matchNumber])
  
  return (
    <div>
      <h1>FORM</h1>

      <div>
      {/* Match Init */}
        <h2>MATCH & ROBOT</h2>

        <select value= {matchType} onChange={(e) => {setMatchType(e.target.value); setElmNum("")}}>
          <option value = ""></option>
          <option value = 'q'>Qualification</option>
          <option value = 'qf'>Quarterfinal</option>
          <option value = 'sf'>Semifinal</option>
          <option value = 'f'>Final</option>
        </select>
        {
        matchType === 'qf' || matchType === 'sf' || matchType === 'f' ? 
        <input placeholder = "elim#" type = "number" value= {elmNum} onChange={(e) => setElmNum(e.target.value)}></input> 
        : null
        }
        <input placeholder = "match#" type = "number" value= {matchNumber} onChange={(e) => setMatchNumber(e.target.value)}></input>
        <br></br>

        <button onClick={() => setColor(!color)}>{color === false ? 'RED' : 'BLUE'}</button>

        <select value = {teamNumber} onChange={(e) => setTeamNumber(e.target.value)}>
          <option>robot #</option>
          {color === false ?

            matchData != [] ? 
              red.map((team) => {
                return <option value = {team} key = {team}>{team}</option>
              }) : null
            
            : matchData != [] ?
              blue.map((team) => {
                return <option value = {team} key = {team}>{team}</option>
              }) : null
            
          }
        </select>
        <br></br>
        
        {/* AUTONOMOUS */}
        <h2>AUTONOMOUS</h2>

      </div>

      <button>test</button>
    </div>
  )
} 

export default Formprac;