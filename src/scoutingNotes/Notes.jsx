import React, { useEffect, useState } from "react"


import {
  apiGetRegional,
  apigetMatchesForRegional,
  apiListTeams,
  apiGetTeam,
  apiUpdateTeamEntry,
  apiCreateTeamEntry
} from '../api/index';
import { buttonIncremental } from "../form/FormUtils";
import { toggleIncremental } from "../form/FormUtils"

// styling
import CollapseTButton from "../components/Table/TableUtils/CollapseTButton";
import tableStyling from "../components/Table/Table.module.css";

import { uploadData, getUrl } from 'aws-amplify/storage';


function Notes(props) {
  /* Regional Key */
  const regional = apiGetRegional()

  const [teams, setTeams] = useState([])
  const [findTeam, setFindTeam] = useState("")
  const [teamNumberInput, setTeamNumberInput] = useState("")
  const [nickname, setNickname] = useState(false)

  /* Team Info */
  const [teamName, setTeamName] = useState("")
  const [fuelCapacity, setFuelCapacity] = useState("")
  const [notes, setNotes] = useState("")
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState(null)
  
  /* New Fields */
  const [hangTime, setHangTime] = useState("")
  const [cyclesPerMatch, setCyclesPerMatch] = useState("")
  const [fuelPerCycle, setFuelPerCycle] = useState("")
  const [bump, setBump] = useState(false)
  const [trench, setTrench] = useState(false)
  const [numAutos, setNumAutos] = useState("")
  const [maxHangHeight, setMaxHangHeight] = useState("None")
  const [canDoubleHang, setCanDoubleHang] = useState(false)
  const [canTripleHang, setCanTripleHang] = useState(false)

  /* Submit */
  const [confirm, setConfirm] = useState(false);

  const gridRowStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "15px",
    alignItems: "center"
  };

  useEffect(() => {
    apiListTeams()
      .then((data) => {
       console.log("Teams data: ", data  )
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    if (stream && showCamera) {
      const video = document.querySelector('#camera-video')
      if (video) {
        video.srcObject = stream
      }
    }
  }, [stream, showCamera])

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (photoUrl && !photoUrl.startsWith('http')) {
        try {
          const url = await getUrl({ key: photoUrl })
          setImageUrl(url.url.href)
        } catch (err) {
          console.log("Failed to get image URL", err)
        }
      } else {
        setImageUrl(photoUrl)
      }
    }
    fetchImageUrl()
  }, [photoUrl])

  const resetStates = () => {
    setConfirm(false)
    setFindTeam("")
    setTeamNumberInput("")
    setTeamName("")
    setFuelCapacity("")
    setNotes("")
    setPhoto(null)
    setPhotoUrl("")
    setPhotoPreview("")
    setImageUrl("")
    setShowCamera(false)
    setHangTime("")
    setCyclesPerMatch("")
    setFuelPerCycle("")
    setBump(false)
    setTrench(false)
    setNumAutos("")
    setMaxHangHeight("None")
    setCanDoubleHang(false)
    setCanTripleHang(false)
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const nicknameBool = () => {
    teams.find(x => x.key.substring(3) === findTeam) !== undefined ? setNickname(true) : setNickname(false)
  }

  const loadTeamData = async () => {
    const teamNum = teamNumberInput
    setFindTeam(teamNum)

    if (!teamNum) {
      resetStates()
      return
    }

    try {
      let teamData = await apiGetTeam(teamNum)
      if (!teamData) {
        const reg = regional || apiGetRegional()
        if (!reg) {
          alert('Regional key not loaded yet. Please wait a moment and try again.')
          return
        }
        await apiCreateTeamEntry(teamNum, reg)
        teamData = await apiGetTeam(teamNum)
      }

      if (teamData) {
        const attrs = teamData.TeamAttributes || {}
        setTeamName(attrs.name || "")
        setFuelCapacity(attrs.DeclaredFuelCap ?? "")
        setNotes(attrs.Notes || "")
        setPhotoUrl(attrs.Photo || "")
        setHangTime(attrs.HangTime ?? "")
        setCyclesPerMatch(attrs.CyclesPerMatch ?? "")
        // fields that don't exist in schema
        setFuelPerCycle("")
        setNumAutos("")
        setBump(attrs.Capabilities === "Bump")
        setTrench(attrs.Capabilities === "Trench")
        setMaxHangHeight(attrs.MaxHang || "None")
        setCanDoubleHang(attrs.HangTeamwork === "DoubleHang")
        setCanTripleHang(attrs.HangTeamwork === "TripleHang")
      } else {
        alert('Unable to load or create team data. Please try again.')
      }
    } catch (err) {
      console.log("Team load error", err)
      alert('Failed to load team data.')
    }
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)
      setShowCamera(true)
    } catch (err) {
      alert('Camera access denied or not available')
    }
  }

  const takePhoto = () => {
    if (stream) {
      const canvas = document.createElement('canvas')
      const video = document.querySelector('#camera-video')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d').drawImage(video, 0, 0)
      const dataUrl = canvas.toDataURL('image/jpeg')
      setPhotoPreview(dataUrl)
      // Convert dataUrl to blob
      fetch(dataUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `team-${findTeam}-photo.jpg`, { type: 'image/jpeg' })
          setPhoto(file)
        })
      stopCamera()
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setShowCamera(false)
    }
  }

  const submitTeamInfo = async () => {
    if (!findTeam) {
      alert('Team number is required')
      return
    }

    // upload photo if a new file was selected
    let photoKey = photoUrl
    if (photo) {
      const fileName = `team-${findTeam}-${Date.now()}.${photo.name.split('.').pop()}`
      try {
        const result = await uploadData({
          key: fileName,
          data: photo,
          options: {
            contentType: photo.type
          }
        })
        photoKey = result.key
      } catch (err) {
        console.log("Photo upload failed", err)
        alert('Photo upload failed')
        return
      }
    }

    // map UI state into the shape defined by TeamAttributesType in the
    // GraphQL schema.  note that the old `teamInput` payload used exotic
    // field names that caused the CreateTeamInput error; the API helpers
    // below will sanitize the object and only include valid fields.
    const normalizeMaxHang = (value) => {
      const normalized = String(value || '').replace(/\s+/g, '')
      const allowed = new Set(['None', 'Level1', 'Level2', 'Level3'])
      return allowed.has(normalized) ? normalized : 'None'
    }

    const teamAttrs = {
      name: teamName,
      DeclaredFuelCap: fuelCapacity ? parseInt(fuelCapacity) : null,
      Notes: notes,
      Photo: photoKey,
      HangTime: hangTime ? parseFloat(hangTime) : null,
      CyclesPerMatch: cyclesPerMatch ? parseInt(cyclesPerMatch) : null,
      Capabilities: bump ? "Bump" : trench ? "Trench" : "None",
      MaxHang: normalizeMaxHang(maxHangHeight),
      HangTeamwork: canDoubleHang ? "DoubleHang" : canTripleHang ? "TripleHang" : "None"
    }

    try {
      const existing = await apiGetTeam(findTeam)
      if (existing) {
        // merge new attributes into whatever is already stored so we don't
        // accidentally null‑out other fields (description, Regionals, etc.)
        const merged = {
          ...existing,
          TeamAttributes: {
            ...((existing.TeamAttributes) || {}),
            ...teamAttrs,
          },
        }
        await apiUpdateTeamEntry(findTeam, merged)
      } else {
        // team doesn't exist yet; create it first so the required
        // non-null `Regional` field is initialized. then fetch the new
        // entry and merge our attribute updates so nothing important gets
        // dropped.
        const reg = apiGetRegional()
        await apiCreateTeamEntry(findTeam, reg)
        const created = await apiGetTeam(findTeam)
        if (created) {
          const merged = {
            ...created,
            TeamAttributes: {
              ...created.TeamAttributes,
              ...teamAttrs,
            },
          }
          await apiUpdateTeamEntry(findTeam, merged)
        }
      }
      alert('Team info saved successfully')
      resetStates()
    } catch (err) {
      console.error('notes submission error', err)
      alert(`Failed to save team info: ${JSON.stringify(err)}`)
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
        <h1 style={{ margin: "0", color: "#333", fontSize: "1.8em" }}>UPLOAD TEAM INFO</h1>
      </div>

      {/* Team Info */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginTop: "20px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "20px" }}>Team Info</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={gridRowStyle}>
            <div style={{ flex: "1", minWidth: "150px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Team Number</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input 
                  style={{
                    height: "50px",
                    flex: "1",
                    padding: "8px",
                    fontSize: "16px",
                    border: "2px solid #ddd",
                    borderRadius: "8px",
                    boxSizing: "border-box"
                  }}
                  placeholder="Enter team #" 
                  type="number" 
                  value={teamNumberInput} 
                  onChange={(e) => setTeamNumberInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') loadTeamData() }}
                />
                <button
                  onClick={loadTeamData}
                  style={{
                    height: "50px",
                    padding: "0 20px",
                    backgroundColor: "#77B6E2",
                    color: "white",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "500",
                    border: "none"
                  }}
                >
                  Load
                </button>
              </div>
            </div>
          </div>

          {findTeam && (
            <>
              <div style={gridRowStyle}>
                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Team Name</label>
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
                    placeholder="Enter team name" 
                    type="text" 
                    value={teamName} 
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
              </div>

              <div style={gridRowStyle}>
                <div style={{ flex: "1", minWidth: "120px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Declared Fuel Capacity</label>
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
                    placeholder="Fuel capacity" 
                    type="number" 
                    value={fuelCapacity} 
                    onChange={(e) => setFuelCapacity(e.target.value)}
                  />
                </div>
                <div style={{ flex: "1", minWidth: "120px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Cycles Per Match</label>
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
                    placeholder="Cycles per match" 
                    type="number" 
                    value={cyclesPerMatch} 
                    onChange={(e) => setCyclesPerMatch(e.target.value)}
                  />
                </div>
              </div>

              <div style={gridRowStyle}>
                <div style={{ flex: "1", minWidth: "120px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Fuel Per Cycle</label>
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
                    placeholder="Fuel per cycle" 
                    type="number" 
                    value={fuelPerCycle} 
                    onChange={(e) => setFuelPerCycle(e.target.value)}
                  />
                </div>
                <div style={{ flex: "1", minWidth: "120px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Number of Autos</label>
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
                    placeholder="Number of autos" 
                    type="number" 
                    value={numAutos} 
                    onChange={(e) => setNumAutos(e.target.value)}
                  />
                </div>
              </div>

              <div style={gridRowStyle}>
                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Capabilities</label>
                  <div style={{display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center", flexWrap: "wrap"}}>
                    <button
                      onClick={() => setBump(!bump)}
                      className={`${tableStyling.ToggleButton} ${bump ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
                    >
                      Bump
                    </button>
                    <button
                      onClick={() => setTrench(!trench)}
                      className={`${tableStyling.ToggleButton} ${trench ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
                    >
                      Trench
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "10px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "1.3em"  }}>Hang Capabilities</label>
                
                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Hang Time (seconds)</label>
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
                    placeholder="Enter hang time" 
                    type="number"
                    step="0.1"
                    value={hangTime} 
                    onChange={(e) => setHangTime(e.target.value)}
                  />
                </div>

                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Max Hang Height</label>
                  <select
                    value={maxHangHeight}
                    onChange={(e) => setMaxHangHeight(e.target.value)}
                    style={{
                      height: "50px",
                      width: "100%",
                      padding: "8px",
                      fontSize: "16px",
                      border: "2px solid #ddd",
                      borderRadius: "8px",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    <option value="None">None</option>
                    <option value="Level1">Level 1</option>
                    <option value="Level2">Level 2</option>
                    <option value="Level3">Level 3</option>
                  </select>
                </div>

                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Hang Teamwork</label>
                  <div style={{display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center", flexWrap: "wrap"}}>
                    <button
                      onClick={() => setCanDoubleHang(!canDoubleHang)}
                      className={`${tableStyling.ToggleButton} ${canDoubleHang ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
                    >
                      Can Double Hang
                    </button>
                    <button
                      onClick={() => setCanTripleHang(!canTripleHang)}
                      className={`${tableStyling.ToggleButton} ${canTripleHang ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
                    >
                      Can Triple Hang
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "row", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
              </div>

              <div style={gridRowStyle}>
                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Notes</label>
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
                    placeholder="Enter notes" 
                    type="text" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div style={gridRowStyle}>
                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Photo</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <input 
                      id="file-upload"
                      style={{ display: "none" }}
                      type="file" 
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                    <label 
                      htmlFor="file-upload"
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#77B6E2",
                        color: "white",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        border: "none",
                        display: "inline-block"
                      }}
                    >
                      Upload Robot Photo
                    </label>
                    <button
                      onClick={startCamera}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#77B6E2",
                        color: "white",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        border: "none"
                      }}
                    >
                      Take Robot Photo
                    </button>
                  </div>
                </div>
              </div>

              {showCamera && (
                <div style={{ textAlign: "center" }}>
                  <video id="camera-video" autoPlay style={{ width: "100%", maxWidth: "400px", borderRadius: "8px" }}></video>
                  <br />
                  <button
                    onClick={takePhoto}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      border: "none",
                      marginRight: "10px"
                    }}
                  >
                    Capture
                  </button>
                  <button
                    onClick={stopCamera}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#e0e0e0",
                      color: "black",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      border: "none"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {(photoPreview || imageUrl) && (
                <div style={{ textAlign: "center" }}>
                  <img src={photoPreview || imageUrl} alt="Team Photo" style={{ maxWidth: "300px", height: "auto", borderRadius: "8px" }} />
                </div>
              )}
            </>
          )}
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
        }} onClick={submitTeamInfo}>
          <div><img src="./images/BLUETHUNDERLOGO_BLUE.png" style={{width:"60px", height: "auto"}}></img><div style={{fontSize: "16px"}}>Confirm</div></div>
        </button> : null}
      </div>

    </div>
  )
}

export default Notes;