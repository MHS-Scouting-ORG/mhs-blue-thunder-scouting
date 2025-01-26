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
  const [teams, setTeams] = useState([]); //teams for a given match

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
  console.log(matchType)

  useEffect(() => {
    /* Get Matches for Regional from bluealliance */
    getMatchesForRegional(regional) 
    .then(data => {
      const holdMatchesData = data.data

      setMatchData(holdMatchesData)
    })
  })

  return (
    <div>
      <h1>FORM</h1>

      <div>

        <h2>MATCH & ROBOT</h2>
        <select value= {matchType} onChange={(e) => setMatchType(e.target.value)}>
          <option value = 'qm'>Qualification</option>
          <option value = 'qf'>Quarterfinal</option>
          <option value = 'sf'>Semifinal</option>
          <option value = 'f'>Final</option>
        </select>

        <br></br>

        {/* <input type="text" value={matchType} onChange={(e) => setMatchType(e.target.value)} /> */}

      </div>

      <button>test</button>
    </div>
  )
} 

export default Formprac;