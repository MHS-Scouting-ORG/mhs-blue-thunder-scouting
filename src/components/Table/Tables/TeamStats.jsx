import React, {useEffect, useState} from 'react'
import { getUrl } from 'aws-amplify/storage';
import { apiGetTeam, apigetMatchesForRegional } from '../../../api/index';

function TeamStats(props) {
  const information = []
  //const information = props.information
  const selectedTeam = props.selectedTeam;
  const regional = props.regionalEvent;

  const [teamData, setTeamData] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [stats, setStats] = useState(null);
  const [matches, setMatches] = useState([]);

  const mode = (arr) => {
    const cleaned = arr.filter(v => v !== null && v !== undefined && String(v).trim() !== '');
    if (cleaned.length === 0) return 'N/A';
    const counts = new Map();
    cleaned.forEach(v => {
      const key = String(v);
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    let best = 'N/A';
    let bestCount = 0;
    counts.forEach((count, key) => {
      if (count > bestCount) {
        best = key;
        bestCount = count;
      }
    });
    return best;
  };

  const topFromListFields = (arr, field) => {
    const flattened = arr
      .flatMap(m => (Array.isArray(m?.[field]) ? m[field] : []))
      .filter(Boolean)
      .map(v => String(v));
    return mode(flattened);
  };

  const fmt = (value, digits = 2) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A';
    return value.toFixed(digits);
  };

  useEffect(() => {
    if (!selectedTeam) return;

    apiGetTeam(selectedTeam)
      .then(team => {
        setTeamData(team);
      })
      .catch(err => {
        console.log('Error fetching team data:', err);
        setTeamData(null);
      });

    if (regional) {
      apigetMatchesForRegional(regional, selectedTeam)
        .then(res => {
          const items = res?.data?.teamMatchesByRegional?.items || [];
          setMatches(items);
        })
        .catch(err => {
          console.log('Error fetching team matches:', err);
          setMatches([]);
        });
    }

    const teamStats = information && Array.isArray(information)
      ? information.find(t => String(t.TeamNumber) === String(selectedTeam))
      : null;
    setStats(teamStats);
  }, [selectedTeam, information, regional]);

  //console.log("teamStats", stats)

  useEffect(() => {
    // photo is now nested under TeamAttributes
    const key = teamData?.TeamAttributes?.Photo || teamData?.photo
    if (key) {
      const loadPhoto = async () => {
        if (key.startsWith('http')) {
          setPhotoUrl(key);
        } else {
          try {
            const url = await getUrl({ key });
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

  const attrs = teamData?.TeamAttributes || {};
  const autoMode = mode(matches.map(m => m?.Autonomous?.AutoStrat || 'None'));
  const autoHangMode = mode(matches.map(m => m?.Autonomous?.AutoHang || 'None'));
  const endgameMode = mode(matches.map(m => m?.Teleop?.Endgame || 'None'));
  const activeMode = topFromListFields(matches, 'ActiveStrat');
  const inactiveMode = topFromListFields(matches, 'InactiveStrat');

  const totalFouls = matches.reduce((sum, m) => sum + Number(m?.Penalties?.Fouls || 0), 0);
  const totalTechs = matches.reduce((sum, m) => sum + Number(m?.Penalties?.Tech || 0), 0);
  const yellowCards = matches.reduce((sum, m) => sum + (m?.Penalties?.PenaltiesCommitted?.YellowCard ? 1 : 0), 0);
  const redCards = matches.reduce((sum, m) => sum + (m?.Penalties?.PenaltiesCommitted?.RedCard ? 1 : 0), 0);

  const brokenCount = matches.reduce((sum, m) => sum + (m?.Penalties?.PenaltiesCommitted?.Broken ? 1 : 0), 0);
  const disabledCount = matches.reduce((sum, m) => sum + (m?.Penalties?.PenaltiesCommitted?.Disabled ? 1 : 0), 0);
  const dqCount = matches.reduce((sum, m) => sum + (m?.Penalties?.PenaltiesCommitted?.DQ ? 1 : 0), 0);
  const noShowCount = matches.reduce((sum, m) => sum + (m?.Penalties?.PenaltiesCommitted?.NoShow ? 1 : 0), 0);

  const cardsInfo = `${yellowCards} yellow / ${redCards} red`;
  const penaltiesInfo = `${totalFouls} fouls / ${totalTechs} tech`;
  const riskInfo = `${brokenCount} broken • ${disabledCount} disabled • ${dqCount} DQ • ${noShowCount} no-show`;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>Team {selectedTeam} Statistics</h2>

      {/* Team Info */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "20px" }}>Team Information</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div>
            <p style={{ margin: "5px 0", fontWeight: "600" }}>Team Number: {selectedTeam}</p>
            <p style={{ margin: "5px 0", fontWeight: "600" }}>
            Team Name: {teamData?.TeamAttributes?.name || teamData?.nickname || 'Unknown'}
          </p>
            <p style={{ margin: "5px 0", fontWeight: "600" }}>Matches Scouted: {stats?.Matches ?? matches.length ?? 0}</p>
            <p style={{ margin: "5px 0", fontWeight: "600" }}>Capabilities: {attrs?.Capabilities || 'None'}</p>
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
      {(attrs?.Notes || teamData?.notes) && (
        <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
          <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Notes Form</h3>
          <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
            {attrs?.Notes || teamData?.notes}
          </p>
        </div>
      )}

      {/* Statistics */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "20px" }}>Form + Notes Summary</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            {/* change stats.avg to correct schema call & do the same for all cards below*/}
            <strong>Max Level Hang</strong> {stats.AvgPoints?.toFixed(2) || 'N/A'}  
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Multi Hang</strong> {stats.AvgAutoPts?.toFixed(2) || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Fuel Capacity:</strong> {stats.AvgEndgamePts?.toFixed(2) || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>AutoStrat:</strong> {stats.AvgEndgamePts?.toFixed(2) || 'N/A'}
          </div>
           <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Auto Hang:</strong> {stats.AvgEndgamePts?.toFixed(2) || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Most Likely Active Strat:</strong> {stats.AvgCoralPts?.toFixed(2) || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Most Likely Inactive Strat:</strong> {stats.AvgAlgaePts?.toFixed(2) || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Avg Hang Time:</strong> {stats.AvgCycles?.toFixed(2) || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Cards</strong>: {cardsInfo}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Shooter Speed:</strong> {stats.RobotHang || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Declared Fuel Cap</strong>: {attrs?.DeclaredFuelCap ?? 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Cycles Per Match (Notes)</strong>: {attrs?.CyclesPerMatch ?? 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Fuel Per Cycle (Notes)</strong>: {attrs?.FuelPerCycle ?? 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Number of Autos (Notes)</strong>: {attrs?.NumAutos ?? 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Max Hang Capability</strong>: {attrs?.MaxHang || 'None'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Hang Teamwork</strong>: {attrs?.HangTeamwork || 'None'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Broken:</strong> {stats.AvgEndgamePts?.toFixed(2) || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamStats
