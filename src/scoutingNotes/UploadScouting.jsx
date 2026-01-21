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
    setTeamName("")
    setFuelCapacity("")
    setNotes("")
    setPhoto(null)
    setPhotoUrl("")
    setPhotoPreview("")
    setImageUrl("")
    setShowCamera(false)
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const nicknameBool = () => {
    teams.find(x => x.key.substring(3) === findTeam) !== undefined ? setNickname(true) : setNickname(false)
  }

  const handleTeamChange = async (teamNum) => {
    setFindTeam(teamNum)
    nicknameBool()
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
        } else {
          setTeamName("")
          setFuelCapacity("")
          setNotes("")
          setPhotoUrl("")
        }
      } catch (err) {
        console.log("Team not found", err)
        setTeamName("")
        setFuelCapacity("")
        setNotes("")
        setPhotoUrl("")
      }
    } else {
      setTeamName("")
      setFuelCapacity("")
      setNotes("")
      setPhotoUrl("")
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
      photo: photoKey
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
                placeholder="Enter team #" 
                type="number" 
                value={findTeam} 
                onChange={(e) => handleTeamChange(e.target.value)}
              />
            </div>

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

          {findTeam && (
            <>
              <div style={{ display: "flex", flexDirection: "row", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
                <div style={{ flex: "1", minWidth: "150px" }}>
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
                    placeholder="Enter fuel capacity" 
                    type="number" 
                    value={fuelCapacity} 
                    onChange={(e) => setFuelCapacity(e.target.value)}
                  />
                </div>
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