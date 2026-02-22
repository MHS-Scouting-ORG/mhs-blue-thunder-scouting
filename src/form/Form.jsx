import React, { useEffect, useState } from "react"
import { apiGetMatchesForRegional, apiGetRegional, apiGetTeam, apiListTeams, apiCreateTeamEntry } from '../api/index';
import { buildTeamEntry } from '../api/builder';
import { normalizeTeamId, isSameTeam } from '../utils/teamId';
import { buttonIncremental } from "./FormUtils";
import { toggleIncremental } from "./FormUtils"

import tableStyling from "../components/Table/Table.module.css";

// styling

import { submitState } from './FormUtils' //from formUtils submits to builder

 function Form() {
  /* Regional Key */
  const regional = apiGetRegional() // updated in aws
  //console.log(regional)

  console.log(regional, ' regional check') //regional check

  /* MATCH STATES*/
  const [matchData, setMatchData] = useState([]) //used to pick blue alliance info
  const [apiTeamListData, setApiTeamListData] = useState([]) //team list data in our database
  const [matchType, setMatchType] = useState(''); //match type
  // const [elmNum, setElmNum] = useState(''); //elimination
  const [matchNumber, setMatchNumber] = useState(''); //match number
  const [teamNumber, setTeamNumber] = useState(''); //team num
  const [color, setColor] = useState(false); // alliance color
  const [red, setRed] = useState([]); //red teams for a given match
  const [blue, setBlue] = useState([]); //blue teams for a given match
  const [matchKey, setMatchKey] = useState(''); //match key

  /* AUTO SPECIFIC */
  const [autoActions, setAutoActions] = useState([]);
  const [autoHang, setAutoHang] = useState('');

  /* TElEOP */
  const [hangType, setHangType] = useState('');

  /* PENALTIES */
  const [yellowCard, setYellowCard] = useState(false);
  const [redCard, setRedCard] = useState(false);
  const [disable, setDisable] = useState(false);
  const [dq, setDQ] = useState(false);
  const [botBroke, setBotBroke] = useState(false);
  const [noShow, setNoShow] = useState(false);
  const [tipped, setTipped] = useState(false);
  const [minFouls, setMinFouls] = useState(0);
  const [majFouls, setMajFouls] = useState(0);
  const [robotBrokenComments, setRobotBrokenComments] = useState("");

  /* ROBOT INFO */
  const [robotSpeed, setRobotSpeed] = useState([]);
  const [fuelCapacity, setFuelCapacity] = useState('');
  const [shootingSpeed, setShootingSpeed] = useState([]);
  const [robotInsight, setRobotInsight] = useState("");
  const [estimatedBallsShot, setEstimatedBallsShot] = useState('');
  const [shootingCycles, setShootingCycles] = useState('');

  /* ACTIVE/INACTIVE STRATEGIES */
  const [activeStrategy, setActiveStrategy] = useState([]);
  const [inactiveStrategy, setInactiveStrategy] = useState([]);
  const [timesTravelledMidActive, setTimesTravelledMidActive] = useState(0);
  const [timesTravelledMidInactive, setTimesTravelledMidInactive] = useState(0);

  /* Submit */
  const [confirm, setConfirm] = useState(false);


 /* Blue Alliance API List Teams */
  useEffect(() => {
    if (!regional) return
    /* Get Matches for Regional from bluealliance */
    apiGetMatchesForRegional(regional)
    /* creates unique matchkey based on the type of match being record(usually quals tho) */
      .then(data => {
        console.log(data, ' blue alliance api check') //blue alliance api check

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
  }, [regional, matchType, matchNumber])

  useEffect(() => {
    /* Check for pre-existing team entry data in our api */
    apiListTeams()
      .then((data) => {
        const teamList = data.data.listTeams.items
        console.log("Existing teams in our data : ", data.data)
        setApiTeamListData(teamList)
      })
      .catch(err => {
        console.log(err) //temp fix there is current err in data 02/11/26
        console.log("Existing teams in our data : ", err.data.listTeams.items) //temp fix there is current err in data 02/11/26
        setApiTeamListData(err.data.listTeams.items)
      })
  }, [])

  //for testing
  useEffect(() => {
    /* Check for pre-existing team entry data in our api */
    apiGetTeam(teamNumber)
      .then((data) => {
        console.log(teamNumber, "for test api get team data : ", data)
      })
      .catch(err => console.log(err))
  }, [teamNumber]
  )

  /* resets form based on successful submission */
  const resetStates = () => {
    setMatchData([])
    setApiTeamListData([])
    setMatchNumber('')
    setTeamNumber('')
    setColor(false)
    setRed([])
    setBlue([])
    setMatchKey('')
    setAutoActions([])
    setAutoHang('')
    setHangType([])
    setActiveStrategy([])
    setInactiveStrategy([])
    setTimesTravelledMidActive(0)
    setTimesTravelledMidInactive(0)
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
    setFuelCapacity('')
    setShootingSpeed([])
    setRobotInsight('')
    setEstimatedBallsShot('')
    setShootingCycles('')
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

  const toggleAutoAction = (action) => {
    if (autoActions.includes(action)) {
      setAutoActions(autoActions.filter(a => a !== action))
    } else {
      setAutoActions([...autoActions, action])
    }
  }
  

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <img 
          src="./images/BLUETHUNDERLOGO_BLUE.png" 
          alt="2443 Blue Thunder Logo"
          style={{ maxWidth: "100px", height: "auto", marginBottom: "10px" }}
        />
        <h1 style={{ margin: "0", color: "#333", fontSize: "1.8em" }}>FORM</h1>
      </div>

      {/* Match Info */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginTop: "20px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "20px" }}>Match Info</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", flexDirection: "row", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
            <div style={{ flex: "1", minWidth: "150px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Match Type</label>
              <select 
                style={{
                  height: "50px",
                  width: "100%",
                  padding: "8px",
                  fontSize: "16px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  cursor: "pointer"
                }} 
                value={matchType} 
                onInput={(e) => {setMatchType(e.target.value); resetStates() }}
              >
                <option value="">Select Type</option>
                <option value='q'>Qualification</option>
                <option value='sf'>Semifinal</option>
                <option value='f'>Final</option>
              </select>
            </div>

            <div style={{ flex: "1", minWidth: "150px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Match Number</label>
              <input 
                style={{
                  height: "50px",
                  width: "100%",
                  padding: "8px",
                  fontSize: "16px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  boxSizing: "border-box"
                }}
                placeholder="Enter match #" 
                type="number" 
                value={matchNumber} 
                onChange={(e) => setMatchNumber(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "15px", backgroundColor: "white", borderRadius: "8px", border: "2px solid #ddd" }}>
            <label style={{ fontWeight: "600", marginBottom: "5px" }}>Alliance Color</label>
            <div style={{ display: "flex", flexDirection: "row", gap: "20px", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input 
                  style={{ cursor: "pointer", width: "20px", height: "20px" }}
                  onInput={(e) => setColor(false)} 
                  type="radio" 
                  id="redAllianceChosen" 
                  name="alliance"
                />
                <label htmlFor="redAllianceChosen" style={{ cursor: "pointer", margin: "0" }}>Red</label>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input 
                  style={{ cursor: "pointer", width: "20px", height: "20px" }}
                  onInput={(e) => setColor(true)} 
                  type="radio" 
                  id="blueAllianceChosen" 
                  name="alliance"
                />
                <label htmlFor="blueAllianceChosen" style={{ cursor: "pointer", margin: "0" }}>Blue</label>
              </div>

              {color ? (
                <img src="./images/white-blueGrad.png" style={{ width: "50px", height: "auto" }} />
              ) : (
                <img src="./images/white-redGrad.png" style={{ width: "50px", height: "auto" }} />
              )}
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Robot Number</label>
            <select 
              style={{
                height: "50px",
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer"
              }} 
              onChange={(e) => {

                setTeamNumber(normalizeTeamId(e.target.value))

                const checkData = apiGetTeam(teamNumber) 

                console.log("data in our thing ", checkData)
                //currentMatchId = checkData.Regionals.find(x => x.RegionalId === regional).TeamMatches.find(x => x.MatchId === matchKey).MatchId

                //createsd empty shell and pushes up to data when selected team if there is existing team object yet
                const teamShell = buildTeamEntry(teamNumber, regional)

                teamShell.MatchId = matchKey

                if (checkData === null) {
                  console.log("api get team returned null")
                  console.log(apiTeamListData, "api list team data")
                  apiCreateTeamEntry(teamNumber, regional)
                  console.log("created team entry with shell data: ", teamShell)
                  console.log(apiTeamListData)
                }
                
              }}
            >
              <option value="">Select robot number</option>
              {color === false ?
                matchData != [] ?
                  red.map((team) => {
                    return <option value={normalizeTeamId(team)} key={team}>{normalizeTeamId(team)}</option>
                  }) : null
                : matchData != [] ?
                  blue.map((team) => {
                    return <option value={normalizeTeamId(team)} key={team}>{normalizeTeamId(team)}</option>
                  }) : null
              }
            </select>
          </div>
        </div>
      </div>

      {/* AUTONOMOUS */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>Autonomous</h2>

        <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
          <div style={{display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center", flexWrap: "wrap"}}>
            {["Went Mid", "Scored", "Crossed Mid"].map((action) => (
              <button
                key={action}
                onClick={() => toggleAutoAction(action)}
                className={`${tableStyling.ToggleButton} ${autoActions.includes(action) ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
              >
                {action}
              </button>
            ))}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Auto Hang</label>
            <select 
              style={{
                height: "50px", 
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer"
              }} 
              value={autoHang} 
              onChange={(e) => setAutoHang(e.target.value)}
            >
              <option value=''>Select Level</option>
              <option value="None">None</option>
              <option value='Level1'>Level 1</option>
            </select>
          </div>
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
              title={
                strategy === "Hoarding" ? "Collecting and holding game pieces" :
                strategy === "Defense" ? "Playing defensively to block opponents" :
                strategy === "Offensive" ? "Aggressive play to score points" :
                "Assisting teammates"
              }
              className={`${tableStyling.ToggleButton} ${activeStrategy.includes(strategy) ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
            >
              {strategy}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "15px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Times Travelled to Mid</label>
          <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", justifyContent: "center"}}>
            <button 
              onClick={() => setTimesTravelledMidActive(Math.max(0, timesTravelledMidActive - 1))}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ff6b6b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "600",
                minWidth: "50px"
              }}
            >
              −
            </button>
            <input 
              type="number" 
              value={timesTravelledMidActive} 
              onChange={(e) => setTimesTravelledMidActive(Math.max(0, parseInt(e.target.value) || 0))}
              style={{
                fontSize: "24px",
                fontWeight: "600",
                minWidth: "70px",
                textAlign: "center",
                height: "50px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                padding: "0 10px"
              }}
            />
            <button 
              onClick={() => setTimesTravelledMidActive(timesTravelledMidActive + 1)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "600",
                minWidth: "50px"
              }}
            >
              +
            </button>
          </div>
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
              title={
                strategy === "Hoarding" ? "Collecting and holding game pieces" :
                strategy === "Defense" ? "Playing defensively to block opponents" :
                strategy === "Offensive" ? "Aggressive play to score points" :
                "Assisting teammates"
              }
              className={`${tableStyling.ToggleButton} ${inactiveStrategy.includes(strategy) ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
            >
              {strategy}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "15px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Times Travelled to Mid</label>
          <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", justifyContent: "center"}}>
            <button 
              onClick={() => setTimesTravelledMidInactive(Math.max(0, timesTravelledMidInactive - 1))}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ff6b6b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "600",
                minWidth: "50px"
              }}
            >
              −
            </button>
            <input 
              type="number" 
              value={timesTravelledMidInactive} 
              onChange={(e) => setTimesTravelledMidInactive(Math.max(0, parseInt(e.target.value) || 0))}
              style={{
                fontSize: "24px",
                fontWeight: "600",
                minWidth: "70px",
                textAlign: "center",
                height: "50px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                padding: "0 10px"
              }}
            />
            <button 
              onClick={() => setTimesTravelledMidInactive(timesTravelledMidInactive + 1)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "600",
                minWidth: "50px"
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* TELEOP */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>Teleop</h2>
        
        <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Endgame Hang</label>
            <select 
              style={{
                height: "50px", 
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer"
              }} 
              value={hangType} 
              onChange={(e) => setHangType(e.target.value)}
            >
              <option value=''>Select Level</option>
              <option value="None">None</option>
              <option value='Level1'>Level 1</option>
              <option value='Level2'>Level 2</option>
              <option value='Level3'>Level 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* PENALTIES */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>Penalties</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Minor Fouls</label>
            <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", justifyContent: "center"}}>
              <button 
                onClick={() => setMinFouls(Math.max(0, minFouls - 1))}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#ff6b6b",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "600",
                  minWidth: "50px"
                }}
              >
                −
              </button>
              <input 
                type="number" 
                value={minFouls} 
                onChange={(e) => setMinFouls(Math.max(0, parseInt(e.target.value) || 0))}
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  minWidth: "70px",
                  textAlign: "center",
                  height: "50px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  padding: "0 10px"
                }}
              />
              <button 
                onClick={() => setMinFouls(minFouls + 1)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#ffbd59",
                  color: "black",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "600",
                  minWidth: "50px"
                }}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Major Fouls</label>
            <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", justifyContent: "center"}}>
              <button 
                onClick={() => setMajFouls(Math.max(0, majFouls - 1))}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#ff6b6b",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "600",
                  minWidth: "50px"
                }}
              >
                −
              </button>
              <input 
                type="number" 
                value={majFouls} 
                onChange={(e) => setMajFouls(Math.max(0, parseInt(e.target.value) || 0))}
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  minWidth: "70px",
                  textAlign: "center",
                  height: "50px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  padding: "0 10px"
                }}
              />
              <button 
                onClick={() => setMajFouls(majFouls + 1)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#ff3131",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "600",
                  minWidth: "50px"
                }}
              >
                +
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "row", gap: "6px", justifyContent: "center", flexWrap: "wrap", paddingTop: "6px" }}>
            <button 
              onClick={() => setYellowCard(!yellowCard)} 
              className={`${tableStyling.ToggleButton} ${yellowCard ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
              style={{ '--toggle-on-bg': '#ffbd59', '--toggle-on-fg': 'black' }}
            >
              Yellow Card
            </button>
            <button 
              onClick={() => setRedCard(!redCard)} 
              className={`${tableStyling.ToggleButton} ${redCard ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
              style={{ '--toggle-on-bg': '#ff3131', '--toggle-on-fg': 'white' }}
            >
              Red Card
            </button>
            <button 
              onClick={() => setDisable(!disable)} 
              className={`${tableStyling.ToggleButton} ${disable ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
              style={{ '--toggle-on-bg': '#ff914d', '--toggle-on-fg': 'black' }}
            >
              Disable
            </button>
            <button 
              onClick={() => setDQ(!dq)} 
              className={`${tableStyling.ToggleButton} ${dq ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
              style={{ '--toggle-on-bg': 'black', '--toggle-on-fg': 'white' }}
            >
              DQ
            </button>
            <button 
              onClick={() => setBotBroke(!botBroke)} 
              className={`${tableStyling.ToggleButton} ${botBroke ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
            >
              Broke
            </button>
            <button 
              onClick={() => setNoShow(!noShow)} 
              className={`${tableStyling.ToggleButton} ${noShow ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
            >
              No Show
            </button>
            <button 
              onClick={() => setTipped(!tipped)} 
              className={`${tableStyling.ToggleButton} ${tipped ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
            >
              Tipped
            </button>
          </div>

          {botBroke && (
            <input 
              placeholder="broken comments" 
              type="text" 
              value={robotBrokenComments} 
              onChange={(e) => setRobotBrokenComments(e.target.value)}
              style={{
                padding: "10px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px"
              }}
            />
          )}
        </div>
      </div>

      {/* ROBOT INFO */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>Robot Info</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Robot Speed</label>
            <select 
              style={{
                height: "50px",
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer"
              }} 
              value={robotSpeed} 
              onChange={(e) => setRobotSpeed(e.target.value)}
            >
              <option value="">Select Speed</option>
              <option value="Slow">Slow</option>
              <option value="Average">Average</option>
              <option value="Fast">Fast</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Shooter Speed</label>
            <select 
              style={{
                height: "50px",
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer"
              }} 
              value={shootingSpeed} 
              onChange={(e) => setShootingSpeed(e.target.value)}
            >
              <option value="">Select Speed</option>
              <option value="Slow">Slow</option>
              <option value="Average">Average</option>
              <option value="Fast">Fast</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Fuel Capacity</label>
            <input 
              style={{
                height: "50px",
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px"
              }} 
              type="number" 
              placeholder="Enter fuel capacity (e.g., 100)"
              value={fuelCapacity} 
              onChange={(e) => setFuelCapacity(parseInt(e.target.value) || '')}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Balls Shot</label>
            <input 
              style={{
                height: "50px",
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px"
              }} 
              type="number" 
              placeholder="Enter estimated balls shot"
              value={estimatedBallsShot} 
              onChange={(e) => setEstimatedBallsShot(parseInt(e.target.value) || '')}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Shooting Cycles</label>
            <input 
              style={{
                height: "50px",
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px"
              }} 
              type="number" 
              placeholder="Enter shooting cycles"
              value={shootingCycles} 
              onChange={(e) => setShootingCycles(parseInt(e.target.value) || '')}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Additional Insights</label>
            <input 
              style={{
                padding: "12px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                width: "100%",
                boxSizing: "border-box"
              }} 
              type="text" 
              placeholder="Add any observations..." 
              value={robotInsight} 
              onChange={(e) => setRobotInsight(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Submit Check */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "30px" }}>
        <button onClick={() => {setConfirm(!confirm)}} style={{
          padding: "15px 30px",
          backgroundColor: confirm ? "red" : "white",
          color: confirm ? "white" : "black",
          border: "2px solid #ddd",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "600"
        }}>
          {
          confirm ? 
          /* Not Yet */
          <div><img src="./images/BLUETHUNDERLOGO_WHITE.png" style={{width:"60px", height: "auto"}}></img><div style={{fontSize: "16px"}}>Not yet</div></div> 
          /* Submit */
          : <div><img src="./images/BLUETHUNDERLOGO_BLUE.png" style={{width:"60px", height: "auto"}}></img><div style={{fontSize: "16px"}}>Submit</div></div>
          }
        </button>

        {/* Submit & Send */}
        {confirm ? <button style={{
          padding: "15px 30px",
          backgroundColor: "white",
          border: "2px solid #ddd",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "600"
        }} onClick={() => {
          submitState( //passes all data (states) of the form into the build in formutils
            regional,
            teamNumber,
            matchKey,
            apiTeamListData,
            matchType,
            matchNumber,
            color,
            autoActions,
            autoHang,
            hangType,
            activeStrategy,
            inactiveStrategy,
            timesTravelledMidActive,
            timesTravelledMidInactive,
            yellowCard,
            redCard,
            disable,
            dq,
            botBroke,
            noShow,
            tipped,
            minFouls,
            majFouls,
            robotSpeed,
            fuelCapacity,
            shootingSpeed,
            estimatedBallsShot,
            shootingCycles,
            robotInsight,
            robotBrokenComments
        )
        .then(_ => {
          if(_ === false){ //checks if the form utils return true or false which based on if the user filled all required
            resetStates()
          }
        })
          .catch(err => {
            let details = ''
            if (err instanceof Error) {
              details = `${err.message}${err.stack ? `\n${err.stack}` : ''}`
            } else if (err?.errors?.length) {
              const messages = err.errors.map(e => e?.message || JSON.stringify(e))
              details = `${messages.join('\n')}\n\nRaw errors:\n${JSON.stringify(err.errors, null, 2)}`
            } else {
              details = JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
            }
            console.error('Form submit failed', err)
            alert(`Form submit failed:\n${details}`)
          })
          }
        }/* Double checks and confirms for submission, in case of accidental press */
        ><div><img src="./images/BLUETHUNDERLOGO_BLUE.png" style={{width:"60px", height: "auto"}}></img><div style={{fontSize: "16px"}}>Confirm</div></div></button> : null}
      </div>
      <div>
        {/* <button onClick={async () => {await apiCreateTeamEntry(teamNumber); await apiListTeams()}}>test and bypass</button> */}
      </div>
    </div>
  )
}

export default Form;