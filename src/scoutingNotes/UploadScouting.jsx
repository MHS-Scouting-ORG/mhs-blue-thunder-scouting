import React, { useEffect, useState } from "react"
import { getMatchesForRegional, getSimpleTeamsForRegional } from '../api/bluealliance';

import { apiGetRegional, apigetMatchesForRegional } from '../api/index';
import { buttonIncremental } from "../form/FormUtils";
import { toggleIncremental } from "../form/FormUtils"

// styling
import { submitState } from '../form/FormUtils'
import CollapseTButton from "../components/Table/TableUtils/CollapseTButton";

// Amplify imports
import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { createTeam, updateTeam } from '../graphql/mutations';
import { getTeam } from '../graphql/queries';

const client = generateClient();

function UploadScouting(props) {
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
    if (teamNum) {
      try {
        const teamData = await client.graphql({
          query: getTeam,
          variables: { id: teamNum }
        })
        if (teamData.data.getTeam) {
          setTeamName(teamData.data.getTeam.name || "")
          setFuelCapacity(teamData.data.getTeam.fuelCapacity || "")
          setNotes(teamData.data.getTeam.Comment || "")
          setPhotoUrl(teamData.data.getTeam.photo || "")
          setHangTime(teamData.data.getTeam.hangTime || "")
          setCyclesPerMatch(teamData.data.getTeam.cyclesPerMatch || "")
          setFuelPerCycle(teamData.data.getTeam.fuelPerCycle || "")
          setBump(teamData.data.getTeam.bump || false)
          setTrench(teamData.data.getTeam.trench || false)
          setNumAutos(teamData.data.getTeam.numAutos || "")
          setMaxHangHeight(teamData.data.getTeam.maxHangHeight || "None")
          setCanDoubleHang(teamData.data.getTeam.canDoubleHang || false)
          setCanTripleHang(teamData.data.getTeam.canTripleHang || false)
        } else {
          setTeamName("")
          setFuelCapacity("")
          setNotes("")
          setPhotoUrl("")
          setHangTime("")
          setCyclesPerMatch("")
          setFuelPerCycle("")
          setBump(false)
          setTrench(false)
          setNumAutos("")
          setMaxHangHeight("None")
          setCanDoubleHang(false)
          setCanTripleHang(false)
        }
      } catch (err) {
        console.log("Team not found", err)
        setTeamName("")
        setFuelCapacity("")
        setNotes("")
        setPhotoUrl("")
        setHangTime("")
        setCyclesPerMatch("")
        setFuelPerCycle("")
        setBump(false)
        setTrench(false)
        setNumAutos("")
        setMaxHangHeight("None")
        setCanDoubleHang(false)
        setCanTripleHang(false)
      }
    } else {
      setTeamName("")
      setFuelCapacity("")
      setNotes("")
      setPhotoUrl("")
      setHangTime("")
      setCyclesPerMatch("")
      setFuelPerCycle("")
      setBump(false)
      setTrench(false)
      setNumAutos("")
      setMaxHangHeight("None")
      setCanDoubleHang(false)
      setCanTripleHang(false)
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

    let photoKey = photoUrl
    if (photo) {
      // Upload photo to S3
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

    const teamInput = {
      id: findTeam,
      name: teamName,
      Comment: notes,
      fuelCapacity: fuelCapacity ? parseInt(fuelCapacity) : null,
      photo: photoKey,
      hangTime: hangTime ? parseFloat(hangTime) : null,
      cyclesPerMatch: cyclesPerMatch ? parseInt(cyclesPerMatch) : null,
      fuelPerCycle: fuelPerCycle ? parseInt(fuelPerCycle) : null,
      bump: bump,
      trench: trench,
      numAutos: numAutos ? parseInt(numAutos) : null,
      maxHangHeight: maxHangHeight,
      canDoubleHang: canDoubleHang,
      canTripleHang: canTripleHang
    }

    try {
      await client.graphql({
        query: updateTeam,
        variables: {
          input: teamInput
        }
      })
      alert('Team info updated successfully')
      resetStates()
    } catch (updateErr) {
      try {
        await client.graphql({
          query: createTeam,
          variables: {
            input: teamInput
          }
        })
        alert('Team info created successfully')
        resetStates()
      } catch (createErr) {
        alert(`Failed to save team info: ${JSON.stringify(createErr)}`)
      }
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
          <div style={{ display: "flex", flexDirection: "row", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
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
                    backgroundColor: "#4CAF50",
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
              <div style={{ display: "flex", flexDirection: "row", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
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

              <div style={{ display: "flex", flexDirection: "row", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
                <div style={{ flex: "1", minWidth: "120px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Declared Fuel Capacity</label>
                  <input 
                    style={{
                      height: "40px",
                      width: "100%",
                      padding: "6px",
                      fontSize: "14px",
                      border: "2px solid #ddd",
                      borderRadius: "6px",
                      boxSizing: "border-box"
                    }}
                    placeholder="Fuel capacity" 
                    type="number" 
                    value={fuelCapacity} 
                    onChange={(e) => setFuelCapacity(e.target.value)}
                  />
                </div>
                <div style={{ flex: "1", minWidth: "120px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Cycles Per Match</label>
                  <input 
                    style={{
                      height: "40px",
                      width: "100%",
                      padding: "6px",
                      fontSize: "14px",
                      border: "2px solid #ddd",
                      borderRadius: "6px",
                      boxSizing: "border-box"
                    }}
                    placeholder="Cycles per match" 
                    type="number" 
                    value={cyclesPerMatch} 
                    onChange={(e) => setCyclesPerMatch(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "row", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
                <div style={{ flex: "1", minWidth: "120px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Fuel Per Cycle</label>
                  <input 
                    style={{
                      height: "40px",
                      width: "100%",
                      padding: "6px",
                      fontSize: "14px",
                      border: "2px solid #ddd",
                      borderRadius: "6px",
                      boxSizing: "border-box"
                    }}
                    placeholder="Fuel per cycle" 
                    type="number" 
                    value={fuelPerCycle} 
                    onChange={(e) => setFuelPerCycle(e.target.value)}
                  />
                </div>
                <div style={{ flex: "1", minWidth: "120px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Number of Autos</label>
                  <input 
                    style={{
                      height: "40px",
                      width: "100%",
                      padding: "6px",
                      fontSize: "14px",
                      border: "2px solid #ddd",
                      borderRadius: "6px",
                      boxSizing: "border-box"
                    }}
                    placeholder="Number of autos" 
                    type="number" 
                    value={numAutos} 
                    onChange={(e) => setNumAutos(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "row", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Capabilities</label>
                  <div style={{display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center", flexWrap: "wrap"}}>
                    <button
                      onClick={() => setBump(!bump)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: bump ? "#4CAF50" : "#e0e0e0",
                        color: bump ? "white" : "black",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "500",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {bump ? "✓ " : ""}Bump
                    </button>
                    <button
                      onClick={() => setTrench(!trench)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: trench ? "#4CAF50" : "#e0e0e0",
                        color: trench ? "white" : "black",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "500",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {trench ? "✓ " : ""}Trench
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "10px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Hang Capabilities</label>
                
                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Hang Time (seconds)</label>
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
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Max Hang Height</label>
                  <select
                    value={maxHangHeight}
                    onChange={(e) => setMaxHangHeight(e.target.value)}
                    style={{
                      height: "40px",
                      width: "100%",
                      padding: "6px",
                      fontSize: "14px",
                      border: "2px solid #ddd",
                      borderRadius: "6px",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    <option value="None">None</option>
                    <option value="Level 1">Level 1</option>
                    <option value="Level 2">Level 2</option>
                    <option value="Level 3">Level 3</option>
                  </select>
                </div>

                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Hang Teamwork</label>
                  <div style={{display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center", flexWrap: "wrap"}}>
                    <button
                      onClick={() => setCanDoubleHang(!canDoubleHang)}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: canDoubleHang ? "#4CAF50" : "#e0e0e0",
                        color: canDoubleHang ? "white" : "black",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {canDoubleHang ? "✓ " : ""}Can Double Hang
                    </button>
                    <button
                      onClick={() => setCanTripleHang(!canTripleHang)}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: canTripleHang ? "#4CAF50" : "#e0e0e0",
                        color: canTripleHang ? "white" : "black",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {canTripleHang ? "✓ " : ""}Can Triple Hang
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "row", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
              </div>

              <div style={{ display: "flex", flexDirection: "row", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
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

              <div style={{ display: "flex", flexDirection: "row", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Photo</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
                        backgroundColor: "#4CAF50",
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
                        backgroundColor: "#2196F3",
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
                      backgroundColor: "#FF5722",
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
                      backgroundColor: "#9E9E9E",
                      color: "white",
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
      <div style={{ textAlign: "center", marginTop: "30px" }}>
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
          <div><img src="./images/BLUETHUNDERLOGO_WHITE.png" style={{width:"50px", height: "45px"}}></img><div style={{fontSize: "14px"}}>Not yet</div></div> 
          /* Submit */
          : <div><img src="./images/BLUETHUNDERLOGO_BLUE.png" style={{width:"50px", height: "45px"}}></img><div style={{fontSize: "14px"}}>Submit</div></div>
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
          fontWeight: "600",
          marginLeft: "20px"
        }} onClick={submitTeamInfo}>
          {<img src="./images/BLUETHUNDERLOGO_BLUE.png" style={{width:"50px", height: "45px"}}></img>}<div style={{fontSize: "14px"}}>Confirm</div>
        </button> : null}
      </div>

    </div>
  )
}

export default UploadScouting;