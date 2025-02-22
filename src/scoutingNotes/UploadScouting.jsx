import React, { useEffect, useState } from "react"
import { getMatchesForRegional, getSimpleTeamsForRegional } from '../api/bluealliance';

import { apiGetRegional, apigetMatchesForRegional } from '../api/index';
import { buttonIncremental } from "../form/FormUtils";
import { toggleIncremental } from "../form/FormUtils"

// styling
import { submitState } from '../form/FormUtils'
import CollapseTButton from "../components/Table/TableUtils/CollapseTButton";

function UploadScouting(props) {
  /* Regional Key */
  const regional = apiGetRegional()

  const [teams, setTeams] = useState([])
  const [findTeam, setFindTeam] = useState("")
  const [nickname, setNickname] = useState(false)

  /* Submit */
  const [confirm, setConfirm] = useState(false);



  useEffect(() => {
    /* Get Matches for Regional from bluealliance */
    getSimpleTeamsForRegional(regional)
      .then(data => {
        setTeams(data)
        nicknameBool()

      })
      .catch(err => console.log(err))
  })
  

  const resetStates = () => {
    setConfirm(false)

  }

  const nicknameBool = () => {
    teams.find(x => x.key.substring(3) === findTeam) !== undefined ? setNickname(true) : setNickname(false)
  }
  

  return (
    <div align="center" style={{padding: "20px"}}>

      <img src="./images/NOTESHEADER.png" style={{maxWidth: "100%"}}/>

      {/* Match Init */}

      <input type="number" placeholder="ROBOT #" style={{width: "300px", fontSize: "50px"}} onChange={(e) => setFindTeam(e.target.value) }></input>

      <br></br>

      <div>
        {teams.find(x => x.key.substring(3) === findTeam) !== undefined ? teams.find(x => x.key.substring(3) === findTeam).nickname : "no team found"}
      </div>

      <br></br>
      <br></br>

      <input type="string" placeholder="NOTES" style={{width: "300px", fontSize: "50px"}} ></input>

      <button 
      style={{
        border: "none",
        fontSize: "50px",
        padding: "30px",
        borderRadius: "6px",
        margin: "7px",
        background:" #77B6E2",
        fontWeight: "bold",
    }} 
      
      >UPLOAD PHOTO</button>

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
        nickname ? console.log("submit func here") : alert('Form Incomplete, wrong/no robot team number')
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

export default UploadScouting;