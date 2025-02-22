import React, { useEffect, useState } from "react"
import { getMatchesForRegional } from '../api/bluealliance';

import { apiGetRegional, apigetMatchesForRegional } from '../api/index';
import { buttonIncremental } from "./FormUtils";
import { toggleIncremental } from "./FormUtils"

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

  /* Decremental */
  const [decremental, setDecremental] = useState(false);

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

  const radioAlliance = (val) =>{
    if (val === 'redAllianceChosen') {
      setColor(true)
    }
    else if (val === 'blueAllianceChosen') {
      setColor(false)
    }
  }
  

  return (
    <div>

      <img src="./images/FORMHEADER.png" style={{maxWidth: "100%"}}/>

      {/* Match Init */}
      <CollapseTButton label="Match Info" toggleFunction={toggleInfo} type={type}/>
        <div style={{ display: infoState}}> 

          <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <select style={{height: "50px"}} value={matchType} onInput={(e) => { setMatchType(e.target.value); setElmNum("") }}>
              <option value="">Select Match Type</option>
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
            <input style={{height: "50px"}} placeholder="match#" type="number" value={matchNumber} onChange={(e) => setMatchNumber(e.target.value)}></input>
        </div>

        <br></br>
        <br></br>

        <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        <div>
        <div>Alliance Color</div>
          <input onInput={(e) => radioAlliance(e.target.id)} type="radio" id="redAllianceChosen" name="alliance"></input>
          <label for="red">Red</label>
          <input onInput={(e) => radioAlliance(e.target.id)} type="radio" id="blueAllianceChosen" name="alliance"></input>
          <label for="blue">Blue</label>
        </div>

        {color ? <img src="./images/white-redGrad.png" style={{width: "50px"}}/> : <img src="./images/white-blueGrad.png" style={{width: "50px"}}/>}
        
        <select style={{height: "50px", flex: 1}} onChange={(e) => setTeamNumber(e.target.value)}>
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

        </div>

        <br></br>

        {/* AUTONOMOUS */}
        <CollapseTButton label="Autonomous" toggleFunction={toggleAuto} type={type}/>
        <div style={{ display: autoState}}> 

        {/* Left */}
        <button onClick={() => setLeft(!left)} style={{ backgroundColor: left === true ? "#77B6E2" : "" }}>{toggleIncremental(left, "autoLeave")}<div>Auto Leave</div></button>

        <button onClick={() => {decremental ? setAutoCoralL1(autoCoralL1 - 1) :setAutoCoralL1(autoCoralL1 + 1)}} style={{backgroundColor:"#77B6E2"}}>{buttonIncremental(autoCoralL1, "coral1", "coral")}<div>Level 1</div></button>
        <button onClick={() => {decremental ? setAutoCoralL2(autoCoralL2 - 1) :setAutoCoralL2(autoCoralL2 + 1)}} style={{backgroundColor:"#77B6E2"}}>{buttonIncremental(autoCoralL2, "coral2", "coral")}<div>Level 2</div></button>
        <button onClick={() => {decremental ? setAutoCoralL3(autoCoralL3 - 1) :setAutoCoralL3(autoCoralL3 + 1)}} style={{backgroundColor:"#77B6E2"}}>{buttonIncremental(autoCoralL3, "coral3", "coral")}<div>Level 3</div></button>
        <button onClick={() => {decremental ? setAutoCoralL4(autoCoralL4 - 1) :setAutoCoralL4(autoCoralL4 + 1)}} style={{backgroundColor:"#77B6E2"}}>{buttonIncremental(autoCoralL4, "coral4", "coral")}<div>Level 4</div></button>
        <button onClick={() => {decremental ? setAutoProcessorScored(autoProcessorScored - 1) :setAutoProcessorScored(autoProcessorScored + 1)}} style={{backgroundColor:"#77B6E2"}}>{buttonIncremental(autoProcessorScored, "processor", "algae")}<div>Processor</div></button>
        <button onClick={() => {decremental ? setAutoNetScored(autoNetScored - 1) :setAutoNetScored(autoNetScored + 1)}} style={{backgroundColor:"#77B6E2"}}>{buttonIncremental(autoNetScored, "net", "algae")}<div>Net</div></button>
        <div>
          <button onClick={() => setDecremental(!decremental)} style={{backgroundColor: decremental ? "#ff3131" : "white"}}>{decremental ? <img src="./images/decrementalTrue.png" style={{width: "50px"}}/> : <img src="./images/decrementDefault.png" style={{width: "50px"}}/>}<div>{decremental ? "Decrement" : "Increment"}</div> </button>
        </div>
        </div>

        <br></br>

        {/* TELEOP */}
        <CollapseTButton label="Teleop" toggleFunction={toggleTele} type={type}/>
        <div style={{ display: teleState}}> 
        
        <button onClick={() => {decremental ? setTeleCoralL1(teleCoralL1 - 1) :setTeleCoralL1(teleCoralL1 + 1)}} style={{backgroundColor:"#77B6E2"}}>{buttonIncremental(teleCoralL1, "coral1", "coral")}<div>Level 1</div></button>
        <button onClick={() => {decremental ? setTeleCoralL2(teleCoralL2 - 1) :setTeleCoralL2(teleCoralL2 + 1)}} style={{backgroundColor:"#77B6E2"}}>{buttonIncremental(teleCoralL2, "coral2", "coral")}<div>Level 2</div></button>
        <button onClick={() => {decremental ? setTeleCoralL3(teleCoralL3 - 1) :setTeleCoralL3(teleCoralL3 + 1)}} style={{backgroundColor:"#77B6E2"}}>{buttonIncremental(teleCoralL3, "coral3", "coral")}<div>Level 3</div></button>
        <button onClick={() => {decremental ? setTeleCoralL4(teleCoralL4 - 1) :setTeleCoralL4(teleCoralL4 + 1)}} style={{backgroundColor:"#77B6E2"}}>{buttonIncremental(teleCoralL4, "coral4", "coral")}<div>Level 4</div></button>
        <div>
          <button onClick={() => {decremental ? setProcessorScored(processorScored - 1) :setProcessorScored(processorScored + 1)}} style={{backgroundColor:"#77B6E2"}}>{buttonIncremental(processorScored, "processor", "algae")}<div>Processor</div></button>
          <button onClick={() => {decremental ? setNetScored(netScored - 1) :setNetScored(netScored + 1)}} style={{backgroundColor:"#77B6E2"}}>{buttonIncremental(netScored, "net", "algae")}<div>Net</div></button>
          <div>
            <button onClick={() => setDecremental(!decremental)} style={{backgroundColor: decremental ? "#ff3131" : "white"}}>{decremental ? <img src="./images/decrementalTrue.png" style={{width: "50px"}}/> : <img src="./images/decrementDefault.png" style={{width: "50px"}}/>}<div>{decremental ? "Decrement" : "Increment"}</div> </button>
          </div>
        </div>
        

        <div>
          <select style={{height: "50px"}} value={hangType} onChange={(e) => setHangType(e.target.value)}>
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
        
        <div>
          <button onClick={() => {decremental ? setMinFouls(minFouls - 1) :setMinFouls(minFouls + 1)}} style={{backgroundColor:" #ffbd59"}}><img src="./images/minorFoul.png" style={{width: "110px"}}/><div>Minor Foul:{minFouls}</div></button>
          <button onClick={() => {decremental ? setMajFouls(majFouls - 1) :setMajFouls(majFouls + 1)}} style={{backgroundColor:" #ff3131"}}><img src="./images/majorFoul.png" style={{width: "110px"}}/><div>Major Foul:{majFouls}</div></button>
          <button onClick={() => setDecremental(!decremental)} style={{backgroundColor: decremental ? "#ff3131" : "white"}}>{decremental ? <img src="./images/decrementalTrue.png" style={{width: "50px"}}/> : <img src="./images/decrementDefault.png" style={{width: "50px"}}/>}<div>{decremental ? "Decrement" : "Increment"}</div> </button>
        </div>

        <button onClick={() => setYellowCard(!yellowCard)} style={{ backgroundColor: yellowCard === true ? "#ffbd59" : "" }}>{toggleIncremental(yellowCard, "yellowCard")}</button>
        <button onClick={() => setRedCard(!redCard)} style={{ backgroundColor: redCard === true ? "#ff3131" : "" }}>{toggleIncremental(redCard, "redCard")}</button>
        <button onClick={() => setDisable(!disable)} style={{ backgroundColor: disable === true ? "#ff914d" : "" }}>{toggleIncremental(disable, "disable")}</button>
        <button onClick={() => setDQ(!dq)} style={{ backgroundColor: dq === true ? "black" : "" }}>{toggleIncremental(dq, "dq")}</button>
        <button onClick={() => setBotBroke(!botBroke)} style={{ backgroundColor: botBroke === true ? "#77B6E2" : "" }}>{toggleIncremental(botBroke, "broke")}</button>
        <button onClick={() => setNoShow(!noShow)} style={{ backgroundColor: noShow === true ? "#77B6E2" : "" }}>{toggleIncremental(noShow, "noShow")}</button>

        <div>
          {botBroke ? <input placeholder="broken comments" type="text" value={robotBrokenComments} onChange={(e) => setRobotBrokenComments(e.target.value)}></input> : null}
        </div>
        </div>

        <br></br>


        {/* ROBOT INFO */}
        <CollapseTButton label="Robot Info" toggleFunction={toggleRobot} type={type}/>
        <div style={{ display: robotState}}> 
        <div>
          <select style={{height: "50px"}} value={robotSpeed} onChange={(e) => setRobotSpeed(e.target.value)}>
            <option value="">Robot Speed</option>
            <option value="Slow">Slow</option>
            <option value="Average">Average</option>
            <option value="Fast">Fast</option>
          </select>
        </div>

        <input style={{height: "50px"}} type="text" placeholder="Optional Insight" value={robotInsight} onChange={(e) => setRobotInsight(e.target.value)}></input>
        </div>

        <br></br>
        <br></br>
      {/* Submit Check */}
      <button onClick={() => {setConfirm(!confirm)}} style={{backgroundColor: confirm ? "red" : "white"}}>
        {
        confirm ? 
        /* Not Yet */
        <div><img src="./images/BLUETHUNDERLOGO_WHITE.png" style={{width:"100px", height: "90px"}}></img><div style={{fontSize: "20px"}}>Not yet</div></div> 
        /* Submit */
        : <div><img src="./images/BLUETHUNDERLOGO_BLUE.png" style={{width:"100px", height: "90px"}}></img><div style={{fontSize: "20px"}}>Submit</div></div>
        }
      </button>

      {/* Submit & Send */}
      {confirm ? <button style={{backgroundColor:"White"}} onClick={() => {
        submitState(
          regional,
          teamNumber,
          matchKey,
          apiMatchData,
          matchType,
          elmNum,
          matchNumber,
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
      >{<img src="./images/BLUETHUNDERLOGO_BLUE.png" style={{width:"100px", height: "90px"}}></img>}<div style={{fontSize: "20px"}}>Confirm</div></button> : null}

    </div>
  )
}

export default Form;