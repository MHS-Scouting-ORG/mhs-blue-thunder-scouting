import React, {useEffect, useState} from 'react'
import { getUrl } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import { getTeam } from '../../../graphql/queries';

let client
const getClient = () => {
  if (!client) client = generateClient()
  return client
}

function TeamStats(props) {
  const information = []
  //const information = props.information
  const selectedTeam = props.selectedTeam;

  const [teamData, setTeamData] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (selectedTeam) {
      // Fetch team data from database
      getClient().graphql({
        query: getTeam,
        variables: { id: selectedTeam }
      }).then(result => {
        setTeamData(result.data.getTeam);
      }).catch(err => console.log('Error fetching team data:', err));

      // Get stats from information
      const teamStats = information.find(t => t.TeamNumber === parseInt(selectedTeam));
      setStats(teamStats);
    }
  }, [selectedTeam, information]);

  useEffect(() => {
    if (teamData && teamData.photo) {
      const loadPhoto = async () => {
        if (teamData.photo.startsWith('http')) {
          setPhotoUrl(teamData.photo);
        } else {
          try {
            const url = await getUrl({ key: teamData.photo });
            setPhotoUrl(url.url.href);
          } catch (err) {
            console.log('Failed to load photo for team', selectedTeam);
          }
        }
      };
      loadPhoto();
    }
  }, [teamData, selectedTeam]);

  if (!selectedTeam || !stats) {
    return null;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>Team {selectedTeam} Statistics</h2>

      {/* Team Info */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "20px" }}>Team Information</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div>
            <p style={{ margin: "5px 0", fontWeight: "600" }}>Team Number: {selectedTeam}</p>
            <p style={{ margin: "5px 0", fontWeight: "600" }}>Team Name: {teamData?.nickname || 'Unknown'}</p>
          </div>
          {photoUrl && (
            <img 
              src={photoUrl}
              alt={`Team ${selectedTeam}`} 
              style={{ width: '150px', height: '112px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #ddd' }}
            />
          )}
        </div>
      </div>

      {/* Notes */}
      {teamData?.notes && (
        <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
          <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Scouting Notes</h3>
          <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}>{teamData.notes}</p>
        </div>
      )}

      {/* Statistics */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "20px" }}>Performance Statistics</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            {/* change stats.avg to correct schema call & do the same for all cards below*/}
            <strong>Max Level Hang</strong> {stats.MaxLevelHang?.toFixed(2) || 'N/A'}  
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Multi Hang</strong> {stats.MultiHang?.toFixed(2) || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Fuel Capacity:</strong> {stats.FuelCap?.toFixed(2) || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Auto Strat:</strong> {stats.AutoStrat?.toFixed(2) || 'N/A'}
          </div>
           <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Auto Hang:</strong> {stats.AutoHang?.toFixed(2) || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Most Likely Active Strat:</strong> {stats.LikelyActiveStrat?.toFixed(2) || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Most Likely Inactive Strat:</strong> {stats.LikelyInactiveStrat?.toFixed(2) || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Avg Hang Time:</strong> {stats.AvgHangTime?.toFixed(2) || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Robot Speed:</strong> {stats.RobotSpeed || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Shooter Speed:</strong> {stats.ShooterSpeed || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Total Fouls:</strong> {stats.Fouls || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Total Major Fouls:</strong> {stats.Tech || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Yellow Cards:</strong> {stats.YellowCard || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Red Cards:</strong> {stats.RedCard || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Broken:</strong> {stats.Broken || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamStats
