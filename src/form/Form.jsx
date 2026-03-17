import React, { useEffect, useState } from "react"
import { apiGetMatchesForRegional, apiGetRegional, apiGetTeam, apiListTeams, apiCreateTeamEntry } from '../api/index';
import { normalizeTeamId, isSameTeam } from '../utils/teamId';

import tableStyling from "../components/Table/Table.module.css";

// styling

import { submitState } from './FormUtils' //from formUtils submits to builder

const sectionHelp = {
  matchInfo: "Match Info sets the identity of the team you are scouting for this specific match. Select Qualification, Semifinal, or Final based on the official schedule, enter the match number exactly as listed, then choose the alliance color that team is actually playing on in that match. Finally, pick the robot number for the single team you are scouting. Use this section first, because every note below should describe only that one team in that one match.",
  autonomous: "Autonomous records what the robot completed before driver control started. Select Moved if the robot clearly left its starting area or completed the required autonomous mobility action. Select Scored if it successfully scored Fuel into its alliance hub while that hub was active during auto. Select Crossed Bump/Trench if it intentionally used that route during autonomous. For Auto Hang, choose None if it did not complete an autonomous hang, or choose the level it reached if the robot finished the hang in auto. Only mark actions that fully happened, not attempts that failed halfway.",
  activeStrategy: "Active Strategy should describe the robot's main job during teleop in Rebuilt. Select Scoring if the team spent most of the match gathering Fuel and putting it into the active alliance hub. Select Hoarding if it mainly controlled large amounts of Fuel, stockpiled game pieces, or managed possession to influence scoring opportunities. Select Defending if its main impact came from slowing cycles, blocking shooting lanes, pressuring intakes, or disrupting the other alliance. Use Times Travelled to Mid to count how often it crossed into the middle of the field or central traffic area, and use Shooting Cycles to count distinct scoring trips or shooting possessions, not individual balls.",
  inactiveStrategy: "Inactive Strategy tracks tactics this robot used during the inactive period. Select Hoarding if the robot was significantly hoaring balls in their baskets or bringing them to their alliance zones. Select Defending Mid if the robot protected or contested the middle. Select Blocking if it was trying to blocking the opponents. This section is only for what the robot did when their hub was inactive.",
  results: "Results records how the match ended for the scouted team. Endgame Hang should be None if the robot stayed on the floor, or the highest level fully secured if it completed a hang. Match Result is the official result for that team's alliance: Win, Tie, or Lose. Team Impact should be High if this robot strongly changed the outcome through scoring, defense, control of Fuel, or endgame; Medium if it contributed clearly but was not the main driver; and Low if its effect on the outcome was limited. Select Disable if the drivers lost control for the remaineder of the match, DQ if the team was disqualified, Broke if it suffered a mechanical or electrical failure, No Show if it didnt entered play, Stuck on Bump if it was stuck on one of the Bumps, and Stuck on Balls if Fuel on the carpet prevented movement. Add broken comments if Broke is selected and include the failure you observed.",
  robotInfo: "Robot Info is where you rate the machine itself compared to the AVERAGE ROBOT at the EVENT. Robot Speed should be Slow, Average, or Fast based on how quickly it drove. Driver Skill should be Poor, Average, Good, or Excellent based on pathing, awareness, recovery under pressure, and whether the team made smart decisions. Shooter Speed should reflect how quickly it could score. Fuel Capacity is your estimate of how much Fuel it can hold at once. Balls Shot is your estimate of how many total Fuel pieces it successfully scored in this match, remembering that Rebuilt has roughly 400 Fuel on the field and pieces can be cycled and scored multiple times. Use Comments for anything weird that happened during the match to the robot such as penalties, or information that you fell is important to share about the robot/match."
  matchInfo: "Match Info sets the identity of the team you are scouting for this specific match. Select Qualification, Semifinal, or Final based on the official schedule, enter the match number exactly as listed, then choose the alliance color that team is actually playing on in that match. Finally, pick the robot number for the single team you are scouting. Use this section first, because every note below should describe only that one team in that specific match.",
  autonomous: "Autonomous records what the robot completed before driver control started. Select Moved if the robot clearly left its starting area or completed the required autonomous mobility action. Select Scored if it successfully scored Fuel into its alliance hub while that hub was active during auto. Select Crossed Bump/Trench if it intentionally used that route during autonomous. For Auto Hang, choose None if it did not complete an autonomous hang, or level1 if the robot finished the hang in auto. Only mark actions that fully happened, not attempts that failed halfway.",
  activeStrategy: "Active Strategy should describe the robot's main job during teleop. Select Scoring if the team spent most of the match gathering Fuel and shooting it into the active alliance hub. Select Hoarding if it mainly controlled large amounts of Fuel, stockpiled game pieces, or managed fuel to influence scoring opportunities. Select Defending if its main impact came from stopping/slowing cycles, blocking shooting spots, pressuring intakes, or disrupting the other alliance in other ways. Use Times Travelled to Mid to count how often it crossed into the middle of the field or central traffic area, and use Shooting Cycles to count distinct scoring trips or shooting fuel, not individual balls shot.",
  inactiveStrategy: "Inactive Strategy tracks tactics this robot could have used but did not meaningfully show in this match. Select Hoarding if the robot was capable of controlling Fuel volume but mostly did not do it here. Select Defending Mid if it had opportunities to protect or contest the middle area but rarely committed to that role. Select Blocking if it could have obstructed lanes, sightlines, or scoring paths but did not spend enough time doing so to count as a main job. This section is useful for alliance selection because it separates a robot's unused tools from what it actually chose to do in the match you watched.",
  results: "Results records how the match ended for the scouted team. Endgame Hang should be None if the robot stayed on the floor, or the highest level fully secured if it completed a hang. Match Result is the official result for that team's alliance: Win, Tie, or Lose. Team Impact should be High if this robot strongly changed the outcome through scoring, defense, control of Fuel, or endgame; Medium if it contributed clearly but was not the main driver; and Low if its effect on the outcome was limited. Select Disable if the robot lost normal function for part of the match, DQ if the team was disqualified, Broke if it suffered a mechanical or electrical failure, No Show if it never meaningfully entered play, Stuck on Bump if terrain or an obstacle trapped it, and Stuck on Balls if Fuel on the carpet prevented movement. Add broken comments only when Broke is selected and include the failure you observed.",
  robotInfo: "Robot Info is where you rate the machine itself compared with the field you have watched at this event. Robot Speed should be Slow, Average, or Fast based on how quickly it drove between intake, shooting, and defensive positions. Driver Skill should be Poor, Average, Good, or Excellent based on pathing, awareness, recovery under pressure, and whether the team made smart decisions about when the alliance hub was active. Shooter Speed should reflect how quickly it could convert a shooting opportunity once set. Fuel Capacity is your estimate of how much Fuel it can hold at once. Balls Shot is your estimate of how many total Fuel pieces it successfully scored in this match, remembering that Rebuilt has roughly 400 Fuel on the field and pieces can be cycled and scored multiple times. Use Comments for anything that matters in alliance selection, such as intake reliability, activation awareness, preferred shooting spots, or whether the robot improved as the match went on."
};

const InfoIcon = ({ text, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      backgroundColor: "#e0e0e0",
      color: "#333",
      fontWeight: 700,
      cursor: "pointer",
      marginLeft: "8px",
      fontSize: "14px",
      userSelect: "none",
      border: "none",
      padding: 0
    }}
    aria-label={text}
  >
    ?
  </button>
);

 function Form() {
  /* Regional Key */
  // regional key is populated asynchronously by apiUpdateRegional in App.jsx.
  // maintain it in state so that when it becomes defined the component rerenders.
  const [regional, setRegional] = useState(apiGetRegional());

  // log for debug
  console.log(regional, 'regional check')

  // keep polling until the regional key arrives; stops once set
  useEffect(() => {
    if (regional) return;
    const id = setInterval(() => {
      const reg = apiGetRegional();
      if (reg) {
        setRegional(reg);
        clearInterval(id);
      }
    }, 500);
    return () => clearInterval(id);
  }, [regional]);

  /* MATCH STATES*/
  const [matchData, setMatchData] = useState([]) //used to pick blue alliance info
  const [apiTeamListData, setApiTeamListData] = useState([]) //team list data in our database
  const [matchType, setMatchType] = useState(''); //match type
  // const [elmNum, setElmNum] = useState(''); //elimination
  const [matchNumber, setMatchNumber] = useState(''); //match number
  const [teamNumber, setTeamNumber] = useState(''); //team num
  const [color, setColor] = useState(undefined); // alliance color
  const [red, setRed] = useState([]); //red teams for a given match
  const [blue, setBlue] = useState([]); //blue teams for a given match
  const [matchKey, setMatchKey] = useState(''); //match key

  /* AUTO SPECIFIC */
  const [autoActions, setAutoActions] = useState([]);
  const [autoHang, setAutoHang] = useState('');

  /* ENDGAME */
  const [hangType, setHangType] = useState('');

  /* RESULTS FLAGS */
  const [disable, setDisable] = useState(false);
  const [dq, setDQ] = useState(false);
  const [botBroke, setBotBroke] = useState(false);
  const [noShow, setNoShow] = useState(false);
  const [stuckOnBump, setStuckOnBump] = useState(false);
  const [stuckOnBalls, setStuckOnBalls] = useState(false);
  const [robotBrokenComments, setRobotBrokenComments] = useState("");

  /* ROBOT INFO */
  const [robotSpeed, setRobotSpeed] = useState('');
  const [driverSkill, setDriverSkill] = useState('');
  const [fuelCapacity, setFuelCapacity] = useState('');
  const [shootingSpeed, setShootingSpeed] = useState('');
  const [robotInsight, setRobotInsight] = useState("");
  const [estimatedBallsShot, setEstimatedBallsShot] = useState('');

  /* ACTIVE/INACTIVE STRATEGIES */
  const [activeStrategy, setActiveStrategy] = useState([]);
  const [inactiveStrategy, setInactiveStrategy] = useState([]);
  const [timesTravelledMid, setTimesTravelledMid] = useState(0);
  const [shootingCycles, setShootingCycles] = useState(0);

  /* RESULTS */
  const [matchResult, setMatchResult] = useState('');
  const [teamImpact, setTeamImpact] = useState('');

  /* Submit */
  const [confirm, setConfirm] = useState(false);

  /* Info popup */
  const [infoModal, setInfoModal] = useState("");

 /* Blue Alliance API List Teams */
  useEffect(() => {
    /* Get latest regional key each time in case it was undefined earlier */
    const reg = regional || apiGetRegional();
    if (!reg) {
      console.warn('regional not provided, skipping blue alliance fetch');
      return;
    }

    /* Get Matches for Regional from bluealliance via our API wrapper */
    apiGetMatchesForRegional(reg)
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
  }, [matchType, matchNumber, regional])

  useEffect(() => {
    /* Check for pre-existing team entry data in our api */
    apiListTeams()
      .then((data) => {
        const teamList = data?.data?.listTeams?.items || []
        console.log("Existing teams in our data : ", data?.data)
        setApiTeamListData(teamList)
      })
      .catch(err => {
        console.log(err)
        setApiTeamListData([])
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

  /* Stop Non Numbers From Going Into Number States */
  const stopNonNum = (e) => {
    const banned = ['e', 'E', '-', '+']
    if (banned.includes(e.key)) {
      e.preventDefault();
    }
  }

  /* resets form based on successful submission */
  const resetStates = () => {
    setMatchData([])
    setApiTeamListData([])
    setMatchNumber('')
    setTeamNumber('')
    setColor(undefined)
    setRed([])
    setBlue([])
    setMatchKey('')
    setAutoActions([])
    setAutoHang('')
    setHangType('')
    setActiveStrategy([])
    setInactiveStrategy([])
    setTimesTravelledMid(0)
    setShootingCycles(0)
    setMatchResult('')
    setTeamImpact('')
    setDisable(false)
    setDQ(false)
    setBotBroke(false)
    setNoShow(false)
    setStuckOnBump(false)
    setStuckOnBalls(false)
    setRobotBrokenComments('')
    setRobotSpeed('')
    setDriverSkill('')
    setFuelCapacity('')
    setShootingSpeed('')
    setRobotInsight('')
    setEstimatedBallsShot('')
    setConfirm(false)

  }

  /* toggle functions for display of form sections */

  const toggleActiveStrategy = (strategy) => {
    // allow multiple active strategies; FormUtils.join will convert to string
    if (activeStrategy.includes(strategy)) {
      setActiveStrategy(activeStrategy.filter(s => s !== strategy))
    } else {
      setActiveStrategy([...activeStrategy, strategy])
    }
  }

  const toggleInactiveStrategy = (strategy) => {
    // multiple inactive strategies allowed as well
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

      {infoModal ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setInfoModal("")}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              maxWidth: "420px",
              width: "calc(100% - 40px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ fontWeight: 700 }}>Info</div>
              <button
                type="button"
                onClick={() => setInfoModal("")}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "18px",
                  lineHeight: 1
                }}
                aria-label="Close info"
              >
                ×
              </button>
            </div>
            <p style={{ margin: 0, lineHeight: "1.5" }}>{infoModal}</p>
          </div>
        </div>
      ) : null}

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
        <h2 style={{ marginTop: 0, marginBottom: "20px" }}>
          Match Info
          <InfoIcon
            text={sectionHelp.matchInfo}
            onClick={() => setInfoModal(sectionHelp.matchInfo)}
          />
        </h2>
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
                  boxSizing: "border-box",
                  opacity: !matchType ? 0.5 : 1,
                  cursor: !matchType ? "not-allowed" : "text",
                }}
                placeholder="Enter match #" 
                type="number" 
                min="1"
                disabled={!matchType}
                value={matchNumber} 
                onKeyDown={stopNonNum}
                onChange={(e) => {
                  setMatchNumber(e.target.value)}
                }
                onWheel={(e) => e.target.blur()} 
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "15px", backgroundColor: "white", borderRadius: "8px", border: "2px solid #ddd", opacity: !matchNumber ? 0.5 : 1 }}>
            <label style={{ fontWeight: "600", marginBottom: "5px" }}>Alliance Color</label>
            <div style={{ display: "flex", flexDirection: "row", gap: "20px", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input 
                  style={{ cursor: !matchNumber ? "not-allowed" : "pointer", width: "20px", height: "20px" }}
                  disabled={!matchNumber}
                  onChange={() => setColor(false)} 
                  type="radio" 
                  id="redAllianceChosen" 
                  name="alliance"
                  checked={color === false}
                />
                <label htmlFor="redAllianceChosen" style={{ cursor: !matchNumber ? "not-allowed" : "pointer", margin: "0" }}>Red</label>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input 
                  style={{ cursor: !matchNumber ? "not-allowed" : "pointer", width: "20px", height: "20px" }}
                  disabled={!matchNumber}
                  onChange={() => setColor(true)} 
                  type="radio" 
                  id="blueAllianceChosen" 
                  name="alliance"
                  checked={color === true}
                />
                <label htmlFor="blueAllianceChosen" style={{ cursor: !matchNumber ? "not-allowed" : "pointer", margin: "0" }}>Blue</label>
              </div>

              {color ? (
                <img src="./images/white-blueGrad.png" style={{ width: "50px", height: "auto" }} />
              ) : (
                <img src="./images/white-redGrad.png" style={{ width: "50px", height: "auto" }} />
              )}
            </div>
          </div>

          <div style={{ opacity: matchNumber && color !== undefined ? 1 : !matchNumber || color === undefined ? 0.5 : 0.5, cursor: !matchNumber || color === undefined ? "not-allowed" : "pointer" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Robot Number</label>
            <select 
              style={{
                height: "50px",
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                cursor: !matchNumber || color === undefined ? "not-allowed" : "pointer"
              }} 
              disabled={!matchNumber || color === undefined}
              value={teamNumber}
              onChange={async (e) => {
                // capture the new team number immediately, avoid relying on state update
                const normalized = normalizeTeamId(e.target.value);
                setTeamNumber(normalized);

                try {
                  const checkData = await apiGetTeam(normalized);
                  console.log("data in our thing ", checkData);

                  if (checkData === null) {
                    console.log("api get team returned null");
                    console.log(apiTeamListData, "api list team data");
                    await apiCreateTeamEntry(normalized, regional);
                    console.log("created team entry for team/regional", { team: normalized, regional });
                  }
                } catch (err) {
                  // GraphQL returns object with data/errors; log details
                  console.error("error fetching/creating team", err);
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
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>
          Autonomous
          <InfoIcon
            text={sectionHelp.autonomous}
            onClick={() => setInfoModal(sectionHelp.autonomous)}
          />
        </h2>

        <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
          <div style={{display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center", flexWrap: "wrap"}}>
            {["Moved", "Scored", "Crossed Bump/Trench"].map((action) => (
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
              onWheel={(e) => e.target.blur()} 
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
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>
          Active Strategy
          <InfoIcon
            text={sectionHelp.activeStrategy}
            onClick={() => setInfoModal(sectionHelp.activeStrategy)}
          />
        </h2>
        
        <div style={{display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center", flexWrap: "wrap"}}>
          {["Hoarding", "Defending", "Scoring"].map((strategy) => (
            <button
              key={strategy}
              onClick={() => toggleActiveStrategy(strategy)}
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
              onClick={() => setTimesTravelledMid(Math.max(0, timesTravelledMid - 1))}
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
              value={timesTravelledMid} 
              onChange={(e) => setTimesTravelledMid(Math.max(0, parseInt(e.target.value) || 0))}
              onWheel={(e) => e.target.blur()} 
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
              onClick={() => setTimesTravelledMid(timesTravelledMid + 1)}
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

        <div style={{ marginTop: "15px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Shooting Cycles</label>
          <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", justifyContent: "center"}}>
            <button 
              onClick={() => setShootingCycles(Math.max(0, shootingCycles - 1))}
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
              value={shootingCycles} 
              onChange={(e) => setShootingCycles(Math.max(0, parseInt(e.target.value) || 0))}
              onWheel={(e) => e.target.blur()} 
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
              onClick={() => setShootingCycles(shootingCycles + 1)}
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
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>
          Inactive Strategy
          <InfoIcon
            text={sectionHelp.inactiveStrategy}
            onClick={() => setInfoModal(sectionHelp.inactiveStrategy)}
          />
        </h2>
        
        <div style={{display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center", flexWrap: "wrap"}}>
          {["Hoarding", "Defending Mid", "Blocking"].map((strategy) => (
            <button
              key={strategy}
              onClick={() => toggleInactiveStrategy(strategy)}
              className={`${tableStyling.ToggleButton} ${inactiveStrategy.includes(strategy) ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
            >
              {strategy}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>
          Results
          <InfoIcon
            text={sectionHelp.results}
            onClick={() => setInfoModal(sectionHelp.results)}
          />
        </h2>
        
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
              onWheel={(e) => e.target.blur()} 
            >
              <option value=''>Select Level</option>
              <option value="None">None</option>
              <option value='Level1'>Level 1</option>
              <option value='Level2'>Level 2</option>
              <option value='Level3'>Level 3</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Match Result</label>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => setMatchResult("Win")}
                className={`${tableStyling.ToggleButton} ${matchResult === "Win" ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
                style={{ flex: 1, maxWidth: "180px" }}
              >
                Win
              </button>
              <button
                type="button"
                onClick={() => setMatchResult("Tie")}
                className={`${tableStyling.ToggleButton} ${matchResult === "Tie" ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
                style={{ flex: 1, maxWidth: "180px" }}
              >
                Tie
              </button>
              <button
                type="button"
                onClick={() => setMatchResult("Lose")}
                className={`${tableStyling.ToggleButton} ${matchResult === "Lose" ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
                style={{ flex: 1, maxWidth: "180px" }}
              >
                Lose
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Team Impact</label>
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
              value={teamImpact}
              onChange={(e) => setTeamImpact(e.target.value)}
              onWheel={(e) => e.target.blur()}
            >
              <option value="">Select Team Impact</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "row", gap: "6px", justifyContent: "center", flexWrap: "wrap", paddingTop: "6px" }}>
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
              onClick={() => setStuckOnBump(!stuckOnBump)} 
              className={`${tableStyling.ToggleButton} ${stuckOnBump ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
            >
              Stuck on Bump
            </button>
            <button 
              onClick={() => setStuckOnBalls(!stuckOnBalls)} 
              className={`${tableStyling.ToggleButton} ${stuckOnBalls ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
            >
              Stuck on Balls
            </button>
          </div>

          {botBroke && (
            <input 
              placeholder="broken comments" 
              type="text" 
              value={robotBrokenComments} 
              onChange={(e) => setRobotBrokenComments(e.target.value)}
              onWheel={(e) => e.target.blur()} 
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
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>
          Robot Info
          <InfoIcon
            text={sectionHelp.robotInfo}
            onClick={() => setInfoModal(sectionHelp.robotInfo)}
          />
        </h2>
        
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
              onWheel={(e) => e.target.blur()} 
            >
              <option value="">Select Robot Speed</option>
              <option value="Slow">Slow</option>
              <option value="Average">Average</option>
              <option value="Fast">Fast</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Driver Skill</label>
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
              value={driverSkill} 
              onChange={(e) => setDriverSkill(e.target.value)}
              onWheel={(e) => e.target.blur()} 
            >
              <option value="">Select Driver Skill</option>
              <option value="Poor">Poor</option>
              <option value="Average">Average</option>
              <option value="Good">Good</option>
              <option value="Excellent">Excellent</option>
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
              onWheel={(e) => e.target.blur()} 
            >
              <option value="">Select Shooting Speed</option>
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
              min="0"
              placeholder="Enter Estimated Fuel Capacity (e.g., 100)"
              value={fuelCapacity} 
              onKeyDown={stopNonNum}
              onChange={(e) => setFuelCapacity(parseInt(e.target.value) || '')}
              onWheel={(e) => e.target.blur()} 
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
              min="0"
              placeholder="Enter estimated balls shot"
              value={estimatedBallsShot} 
              onKeyDown={stopNonNum}
              onChange={(e) => setEstimatedBallsShot(parseInt(e.target.value) || '')}

              onWheel={(e) => e.target.blur()} 
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Comments</label>
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
              onWheel={(e) => e.target.blur()} 
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
            timesTravelledMid,
            0,
            shootingCycles,
            matchResult,
            teamImpact,
            disable,
            dq,
            botBroke,
            noShow,
            stuckOnBump,
            stuckOnBalls,
            robotSpeed,
            driverSkill,
            fuelCapacity,
            shootingSpeed,
            estimatedBallsShot,
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