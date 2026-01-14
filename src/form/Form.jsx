import React, { useEffect, useState } from "react"
import { getMatchesForRegional } from '../api/bluealliance';

import { apiGetRegional, apigetMatchesForRegional } from '../api/index';
import { buttonIncremental } from "./FormUtils";
import { toggleIncremental } from "./FormUtils"

// styling
import { submitState } from './FormUtils'
import CollapseTButton from "../components/Table/TableUtils/CollapseTButton";

function Form() {
  /* Regional Key */
  const regional = apiGetRegional() // updated in aws
  const type = "form" //used for styling

  console.log(regional) //regional check

  /* MATCH */
  const [matchData, setMatchData] = useState([]) //used to pick blue alliance info
  const [apiMatchData, setApiMatchData] = useState([]) //match data in our database
  const [matchType, setMatchType] = useState(''); //match type
  // const [elmNum, setElmNum] = useState(''); //elimination
  const [matchNumber, setMatchNumber] = useState(''); //match number
  const [teamNumber, setTeamNumber] = useState(''); //team num
  const [color, setColor] = useState(false); // alliance color
  const [red, setRed] = useState([]); //red teams for a given match
  const [blue, setBlue] = useState([]); //blue teams for a given match
  const [matchKey, setMatchKey] = useState(''); //match key

  /* AUTO SPECIFIC */
  const [left, setLeft] = useState(false);
  const [autoFuel, setAutoFuel] = useState(0);
  const [autoHang, setAutoHang] = useState('');

  /* TElEOP */
  const [teleFuel, setTeleFuel] = useState(0);
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
  const [shootingSpeed, setShootingSpeed] = useState([]);
  const [robotInsight, setRobotInsight] = useState("");

  /* Toggle States */
  const [infoState, setInfoState] = useState('none');
  const [autoState, setAutoState] = useState('none');
  const [activeState, setActiveState] = useState('none');
  const [inactiveState, setInactiveState] = useState('none');
  const [teleState, setTeleState] = useState('none');
  const [penaltyState, setPenaltyState] = useState('none');
  const [robotState, setRobotState] = useState('none');

  /* ACTIVE/INACTIVE STRATEGIES */
  const [activeStrategy, setActiveStrategy] = useState('');
  const [inactiveStrategy, setInactiveStrategy] = useState('');

  /* Submit */
  const [confirm, setConfirm] = useState(false);



  useEffect(() => {
    /* Get Matches for Regional from bluealliance */
    getMatchesForRegional(regional)
    /* creates unique matchkey based on the type of match being record(usually quals tho) */
      .then(data => {
        let match_key = regional + "_" + matchType + "m" + matchNumber

        if(matchType === "sf") {
          match_key = regional + "_" + matchType + matchNumber + "m1" 
        }
        if(matchType === "f"){
          match_key = regional + "_" + matchType + "1" + "m" + matchNumber
        }

        setMatchKey(match_key)

        /* Finds match data from bluealliance based on user input */
        const match = data.find((x) => x.key === match_key)
        /* sets the team keys for each allaince color */
        if (match) {
          setMatchData(match)
          setRed(match.alliances.red.team_keys)
          setBlue(match.alliances.blue.team_keys)
        }
        else {
          setRed([])
          setBlue([])
          setMatchData([])
        }
      })
      .catch(err => console.log(err))
  }, [matchType, matchNumber])

  useEffect(() => {
    /* Check for pre-existing match data in our api */
    apigetMatchesForRegional(regional)
      .then((data) => {
        let matches = data.data.teamMatchesByRegional.items
        let team = matches.find((x) => x.Team === teamNumber) // finds matches for the team in our database
        if (team !== undefined && apiMatchData.find((x) => x.Team === teamNumber) === undefined)//checks if the team is found in our database
          setApiMatchData(apiMatchData.concat(team))
      })
      .catch(err => console.log(err))
  }, [teamNumber]
  )

  /* resets form based on successful submission */
  const resetStates = () => {
    setMatchData([])
    setApiMatchData([])
    setMatchNumber('')
    setTeamNumber('')
    setColor(false)
    setRed([])
    setBlue([])
    setMatchKey('')
    setLeft('')
    setAutoFuel(0)
    setAutoHang('')
    setTeleFuel(0)
    setHangType([])
    setActiveStrategy('')
    setInactiveStrategy('')
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
    setShootingSpeed([])
    setRobotInsight('')
    setConfirm(false)

  }

  /* toggle functions for display of form sections */

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

  const toggleActive = () => {
    if (activeState === 'none') {
      setActiveState('')
    }
    else {
      setActiveState('none')
    }
  }

  const toggleInactive = () => {
    if (inactiveState === 'none') {
      setInactiveState('')
    }
    else {
      setInactiveState('none')
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
      setColor(false)
    }
    else if (val === 'blueAllianceChosen') {
      setColor(true)
    }
  }
  

  return (
    <div>

      <img src="./images/FORMHEADER.png" style={{maxWidth: "100%"}}/>

      {/* Match Init */}
      <CollapseTButton label="Match Info" toggleFunction={toggleInfo} type={type}/>
        <div style={{ display: infoState}}> 

          <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <select style={{height: "50px"}} value={matchType} onInput={(e) => {setMatchType(e.target.value); resetStates() }}>
              <option value="">Select Match Type</option>
              <option value='q'>Qualification</option>
              <option value='sf'>Semifinal</option>
              <option value='f'>Final</option>
            </select>
            <input placeholder="match#" type="number" value={matchNumber} onChange={(e) => setMatchNumber(e.target.value)}></input>
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

        {color ?  <img src="./images/white-blueGrad.png" style={{width: "50px"}}/>  : <img src="./images/white-redGrad.png" style={{width: "50px"}}/>}
        
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

        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "10px"}}>
          <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center"}}>
            <button onClick={() => setAutoFuel(Math.max(0, autoFuel - 1))} style={{backgroundColor:"#77B6E2", padding: "10px"}}>
              <img src="./images/Fuel.png" style={{width: "80px"}}/>
              <div>-</div>
            </button>
            <button onClick={() => setAutoFuel(autoFuel + 1)} style={{backgroundColor:"#77B6E2", padding: "10px"}}>
              <img src="./images/Fuel.png" style={{width: "80px"}}/>
              <div>+</div>
            </button>
          </div>
          <input 
            type="number" 
            value={autoFuel} 
            onChange={(e) => setAutoFuel(Math.max(0, parseInt(e.target.value) || 0))}
            style={{height: "40px", fontSize: "18px", textAlign: "center", width: "100px"}}
            placeholder="Fuel"
          />
        </div>
        
        <div>
          <select style={{height: "50px"}} value={autoHang} onChange={(e) => setAutoHang(e.target.value)}>
            <option value=''>Auto Hang</option>
            <option value="None">None</option>
            <option value='Level1'>Level 1</option>
            <option value='Level2'>Level 2</option>
            <option value='Level3'>Level 3</option>
          </select>
        </div>
        </div>

        <br></br>

        {/* ACTIVE */}
        <CollapseTButton label="Active" toggleFunction={toggleActive} type={type}/>
        <div style={{ display: activeState}}> 
        
        <div>
          <select style={{height: "50px"}} value={activeStrategy} onChange={(e) => setActiveStrategy(e.target.value)}>
            <option value=''>Select Strategy</option>
            <option value="Hoarding">Hoarding</option>
            <option value='Defense'>Defense</option>
            <option value='Offensive'>Offensive</option>
            <option value='Support'>Support</option>
          </select>
        </div>
        </div>

        <br></br>

        {/* INACTIVE */}
        <CollapseTButton label="Inactive" toggleFunction={toggleInactive} type={type}/>
        <div style={{ display: inactiveState}}> 
        
        <div>
          <select style={{height: "50px"}} value={inactiveStrategy} onChange={(e) => setInactiveStrategy(e.target.value)}>
            <option value=''>Select Strategy</option>
            <option value="Hoarding">Hoarding</option>
            <option value='Defense'>Defense</option>
            <option value='Offensive'>Offensive</option>
            <option value='Support'>Support</option>
          </select>
        </div>
        </div>

        <br></br>
        <CollapseTButton label="Teleop" toggleFunction={toggleTele} type={type}/>
        <div style={{ display: teleState}}> 
        
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "10px"}}>
          <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center"}}>
            <button onClick={() => setTeleFuel(Math.max(0, teleFuel - 1))} style={{backgroundColor:"#77B6E2", padding: "10px"}}>
              <img src="./images/Fuel.png" style={{width: "80px"}}/>
              <div>-</div>
            </button>
            <button onClick={() => setTeleFuel(teleFuel + 1)} style={{backgroundColor:"#77B6E2", padding: "10px"}}>
              <img src="./images/Fuel.png" style={{width: "80px"}}/>
              <div>+</div>
            </button>
          </div>
          <input 
            type="number" 
            value={teleFuel} 
            onChange={(e) => setTeleFuel(Math.max(0, parseInt(e.target.value) || 0))}
            style={{height: "40px", fontSize: "18px", textAlign: "center", width: "100px"}}
            placeholder="Fuel"
          />
        </div>
        
        <div>
          <select style={{height: "50px"}} value={hangType} onChange={(e) => setHangType(e.target.value)}>
            <option value=''>Endgame Hang</option>
            <option value="None">None</option>
            <option value='Level1'>Level 1</option>
            <option value='Level2'>Level 2</option>
            <option value='Level3'>Level 3</option>
          </select>
        </div>
        </div>

        <br></br>

        {/* PENALTIES */}
        <CollapseTButton label="Penalties" toggleFunction={togglePenalty} type={type}/>
        <div style={{ display: penaltyState}}> 
        
        <div>
          <button onClick={() => setMinFouls(minFouls + 1)} style={{backgroundColor:" #ffbd59"}}><img src="./images/minorFoul.png" style={{width: "110px"}}/><div>Minor Foul +:{minFouls}</div></button>
          <button onClick={() => setMinFouls(Math.max(0, minFouls - 1))} style={{backgroundColor:" #ffbd59"}}><img src="./images/minorFoul.png" style={{width: "110px"}}/><div>Minor Foul -</div></button>
          <button onClick={() => setMajFouls(majFouls + 1)} style={{backgroundColor:" #ff3131"}}><img src="./images/majorFoul.png" style={{width: "110px"}}/><div>Major Foul +:{majFouls}</div></button>
          <button onClick={() => setMajFouls(Math.max(0, majFouls - 1))} style={{backgroundColor:" #ff3131"}}><img src="./images/majorFoul.png" style={{width: "110px"}}/><div>Major Foul -</div></button>
        </div>

        <button onClick={() => setYellowCard(!yellowCard)} style={{ backgroundColor: yellowCard === true ? "#ffbd59" : "" }}>{toggleIncremental(yellowCard, "yellowCard")} <div>Yellow Card</div> </button>
        <button onClick={() => setRedCard(!redCard)} style={{ backgroundColor: redCard === true ? "#ff3131" : "" }}>{toggleIncremental(redCard, "redCard")} <div>Red Card</div> </button>
        <button onClick={() => setDisable(!disable)} style={{ backgroundColor: disable === true ? "#ff914d" : "" }}>{toggleIncremental(disable, "disable")} <div>Disable</div> </button>
        <button onClick={() => setDQ(!dq)} style={{ backgroundColor: dq === true ? "black" : "" }}>{toggleIncremental(dq, "dq")} <div>DQ</div> </button>
        <button onClick={() => setBotBroke(!botBroke)} style={{ backgroundColor: botBroke === true ? "#77B6E2" : "" }}>{toggleIncremental(botBroke, "broke")} <div>Broke</div> </button>
        <button onClick={() => setNoShow(!noShow)} style={{ backgroundColor: noShow === true ? "#77B6E2" : "" }}>{toggleIncremental(noShow, "noShow")} <div>No Show</div> </button>

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

        <div>
          <select style={{height: "50px"}} value={shootingSpeed} onChange={(e) => setShootingSpeed(e.target.value)}>
            <option value="">Shooting Speed</option>
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
        submitState( //passes all data (states) of the form into the build in formutils
          regional,
          teamNumber,
          matchKey,
          apiMatchData,
          matchType,
          left,
          autoFuel,
          autoHang,
          teleFuel,
          hangType,
          activeStrategy,
          inactiveStrategy,
          yellowCard,
          redCard,
          disable,
          dq,
          botBroke,
          noShow,
          minFouls,
          majFouls,
          robotSpeed,
          shootingSpeed,
          robotInsight,
          robotBrokenComments
      )
      .then(_ => {
        if(_ === false){ //checks if the form utils return true or false which based on if the user filled all required
          resetStates()
        }
      })
        .catch(err => alert(`Form Incomplete: ignore submission alert and fix, ${JSON.stringify(err)}`))
        }
      }/* Double checks and confirms for submission, in case of accidental press */
      >{<img src="./images/BLUETHUNDERLOGO_BLUE.png" style={{width:"100px", height: "90px"}}></img>}<div style={{fontSize: "20px"}}>Confirm</div></button> : null}
  
    </div>
  )
}

export default Form;