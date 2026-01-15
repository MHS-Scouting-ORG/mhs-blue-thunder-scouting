import React, { useEffect, useState } from "react"
import { getMatchesForRegional } from '../api/bluealliance';

import { apiGetRegional, apigetMatchesForRegional } from '../api/index';
import { buttonIncremental } from "./FormUtils";
import { toggleIncremental } from "./FormUtils"

// styling
import { submitState } from './FormUtils'

function Form() {
  /* Regional Key */
  const regional = apiGetRegional() // updated in aws

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

  /* ACTIVE/INACTIVE STRATEGIES */
  const [activeStrategy, setActiveStrategy] = useState([]);
  const [inactiveStrategy, setInactiveStrategy] = useState([]);

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
        if(matchType === "f"){x
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
    setAutoFuel(0)
    setAutoHang('')
    setTeleFuel(0)
    setHangType([])
    setActiveStrategy([])
    setInactiveStrategy([])
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

  const toggleActiveStrategy = (strategy) => {
    if (activeStrategy.includes(strategy)) {
      setActiveStrategy(activeStrategy.filter(s => s !== strategy))
    } else {
      setActiveStrategy([...activeStrategy, strategy])
    }
  }

  const toggleInactiveStrategy = (strategy) => {
    if (inactiveStrategy.includes(strategy)) {
      setInactiveStrategy(inactiveStrategy.filter(s => s !== strategy))
    } else {
      setInactiveStrategy([...inactiveStrategy, strategy])
    }
  }
  

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>

      <img src="./images/FORMHEADER.png" style={{maxWidth: "100%"}}/>

      {/* Match Info */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginTop: "20px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>Match Info</h2>

          <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "15px"}}>
            <select style={{height: "50px"}} value={matchType} onInput={(e) => {setMatchType(e.target.value); resetStates() }}>
              <option value="">Select Match Type</option>
              <option value='q'>Qualification</option>
              <option value='sf'>Semifinal</option>
              <option value='f'>Final</option>
            </select>
            <input placeholder="match#" type="number" value={matchNumber} onChange={(e) => setMatchNumber(e.target.value)}></input>
        </div>

        <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "20px", flexWrap: "wrap"}}>
        <div>
        <div style={{marginBottom: "8px"}}>Alliance Color</div>
          <input onInput={(e) => radioAlliance(e.target.id)} type="radio" id="redAllianceChosen" name="alliance"></input>
          <label for="red" style={{marginRight: "15px"}}>Red</label>
          <input onInput={(e) => radioAlliance(e.target.id)} type="radio" id="blueAllianceChosen" name="alliance"></input>
          <label for="blue">Blue</label>
        </div>

        {color ?  <img src="./images/white-blueGrad.png" style={{width: "50px"}}/>  : <img src="./images/white-redGrad.png" style={{width: "50px"}}/>}
        
        <select style={{height: "50px", minWidth: "200px"}} onChange={(e) => setTeamNumber(e.target.value)}>
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

      {/* AUTONOMOUS */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>Autonomous</h2>

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

      {/* ACTIVE */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>Active Strategy</h2>
        
        <div style={{display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center", flexWrap: "wrap"}}>
          {["Hoarding", "Defense", "Offensive", "Support"].map((strategy) => (
            <button
              key={strategy}
              onClick={() => toggleActiveStrategy(strategy)}
              style={{
                padding: "10px 20px",
                backgroundColor: activeStrategy.includes(strategy) ? "#77B6E2" : "#e0e0e0",
                color: activeStrategy.includes(strategy) ? "white" : "black",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
                transition: "all 0.3s ease"
              }}
            >
              {strategy}
            </button>
          ))}
        </div>
      </div>

      {/* INACTIVE */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>Inactive Strategy</h2>
        
        <div style={{display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center", flexWrap: "wrap"}}>
          {["Hoarding", "Defense", "Offensive", "Support"].map((strategy) => (
            <button
              key={strategy}
              onClick={() => toggleInactiveStrategy(strategy)}
              style={{
                padding: "10px 20px",
                backgroundColor: inactiveStrategy.includes(strategy) ? "#77B6E2" : "#e0e0e0",
                color: inactiveStrategy.includes(strategy) ? "white" : "black",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
                transition: "all 0.3s ease"
              }}
            >
              {strategy}
            </button>
          ))}
        </div>
      </div>

      {/* TELEOP */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>Teleop</h2>
        
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

      {/* PENALTIES */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>Penalties</h2>
        
        <div style={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginBottom: "15px" }}>
          <button onClick={() => setMinFouls(minFouls + 1)} style={{backgroundColor:" #ffbd59"}}><img src="./images/minorFoul.png" style={{width: "110px"}}/><div>Minor Foul +:{minFouls}</div></button>
          <button onClick={() => setMinFouls(Math.max(0, minFouls - 1))} style={{backgroundColor:" #ffbd59"}}><img src="./images/minorFoul.png" style={{width: "110px"}}/><div>Minor Foul -</div></button>
          <button onClick={() => setMajFouls(majFouls + 1)} style={{backgroundColor:" #ff3131"}}><img src="./images/majorFoul.png" style={{width: "110px"}}/><div>Major Foul +:{majFouls}</div></button>
          <button onClick={() => setMajFouls(Math.max(0, majFouls - 1))} style={{backgroundColor:" #ff3131"}}><img src="./images/majorFoul.png" style={{width: "110px"}}/><div>Major Foul -</div></button>
        </div>

        <div style={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginBottom: "15px" }}>
          <button onClick={() => setYellowCard(!yellowCard)} style={{ backgroundColor: yellowCard === true ? "#ffbd59" : "" }}>{toggleIncremental(yellowCard, "yellowCard")} <div>Yellow Card</div> </button>
          <button onClick={() => setRedCard(!redCard)} style={{ backgroundColor: redCard === true ? "#ff3131" : "" }}>{toggleIncremental(redCard, "redCard")} <div>Red Card</div> </button>
          <button onClick={() => setDisable(!disable)} style={{ backgroundColor: disable === true ? "#ff914d" : "" }}>{toggleIncremental(disable, "disable")} <div>Disable</div> </button>
          <button onClick={() => setDQ(!dq)} style={{ backgroundColor: dq === true ? "black" : "" }}>{toggleIncremental(dq, "dq")} <div>DQ</div> </button>
          <button onClick={() => setBotBroke(!botBroke)} style={{ backgroundColor: botBroke === true ? "#77B6E2" : "" }}>{toggleIncremental(botBroke, "broke")} <div>Broke</div> </button>
          <button onClick={() => setNoShow(!noShow)} style={{ backgroundColor: noShow === true ? "#77B6E2" : "" }}>{toggleIncremental(noShow, "noShow")} <div>No Show</div> </button>
        </div>

        {botBroke ? <input placeholder="broken comments" type="text" value={robotBrokenComments} onChange={(e) => setRobotBrokenComments(e.target.value)}></input> : null}
      </div>

      {/* ROBOT INFO */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>Robot Info</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <select style={{height: "50px"}} value={robotSpeed} onChange={(e) => setRobotSpeed(e.target.value)}>
            <option value="">Robot Speed</option>
            <option value="Slow">Slow</option>
            <option value="Average">Average</option>
            <option value="Fast">Fast</option>
          </select>

          <select style={{height: "50px"}} value={shootingSpeed} onChange={(e) => setShootingSpeed(e.target.value)}>
            <option value="">Shooting Speed</option>
            <option value="Slow">Slow</option>
            <option value="Average">Average</option>
            <option value="Fast">Fast</option>
          </select>

          <input style={{height: "50px"}} type="text" placeholder="Optional Insight" value={robotInsight} onChange={(e) => setRobotInsight(e.target.value)}></input>
        </div>
      </div>

      {/* Submit Check */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "30px" }}>
        <button onClick={() => {setConfirm(!confirm)}} style={{backgroundColor: confirm ? "red" : "white", padding: "15px", borderRadius: "8px", cursor: "pointer"}}>
          {
          confirm ? 
          /* Not Yet */
          <div><img src="./images/BLUETHUNDERLOGO_WHITE.png" style={{width:"100px", height: "90px"}}></img><div style={{fontSize: "20px"}}>Not yet</div></div> 
          /* Submit */
          : <div><img src="./images/BLUETHUNDERLOGO_BLUE.png" style={{width:"100px", height: "90px"}}></img><div style={{fontSize: "20px"}}>Submit</div></div>
          }
        </button>

        {/* Submit & Send */}
        {confirm ? <button style={{backgroundColor:"White", padding: "15px", borderRadius: "8px", cursor: "pointer"}} onClick={() => {
          submitState( //passes all data (states) of the form into the build in formutils
            regional,
            teamNumber,
            matchKey,
            apiMatchData,
            matchType,
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
    </div>
  )
}

export default Form;