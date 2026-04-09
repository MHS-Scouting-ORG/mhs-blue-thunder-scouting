import React, {useEffect, useState} from 'react'
import { getUrl } from 'aws-amplify/storage';
import { apiGetTeam, apiGetSimpleTeamsForRegional, apigetMatchesForRegional, toNotesTeamId } from '../../../api/index';

function TeamStats(props) {
  const information = props.information
  const selectedTeam = props.selectedTeam;
  const regional = props.regionalEvent;

  const [teamData, setTeamData] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [stats, setStats] = useState(null);
  const [matches, setMatches] = useState([]);
  const [simpleTeamName, setSimpleTeamName] = useState('');

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
      .flatMap(m => {
        const raw = m?.[field];
        if (Array.isArray(raw)) return raw;
        if (typeof raw === 'string') return raw.split(',').map(v => v.trim());
        return [];
      })
      .map(v => String(v || '').trim())
      .filter(v => v && v !== 'None');
    return mode(flattened);
  };

  const formatDefenseEffectiveness = (value) => {
    const normalized = String(value || '').trim();
    if (!normalized || normalized === 'N/A') return normalized || 'N/A';
    return normalized === 'VeryPoor' ? 'Very Poor' : normalized;
  };

  useEffect(() => {
    if (!selectedTeam) return;

    Promise.all([
      apiGetTeam(selectedTeam),
      apiGetTeam(toNotesTeamId(selectedTeam)),
    ])
      .then(([baseTeam, notesTeam]) => {
        const baseAttrs = baseTeam?.TeamAttributes || {}
        const notesAttrs = notesTeam?.TeamAttributes || {}

        setTeamData({
          ...(baseTeam || {}),
          TeamAttributes: {
            ...baseAttrs,
            ...notesAttrs,
          },
        });
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

  useEffect(() => {
    if (!selectedTeam || !regional) {
      setSimpleTeamName('');
      return;
    }

    apiGetSimpleTeamsForRegional(regional)
      .then((teams) => {
        const list = Array.isArray(teams) ? teams : [];
        const found = list.find((t) => String(t?.team_number || t?.TeamNumber || '') === String(selectedTeam));
        setSimpleTeamName(found?.nickname || '');
      })
      .catch(() => setSimpleTeamName(''));
  }, [selectedTeam, regional]);

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

  if (!selectedTeam) {
    return null;
  }

  const safeStats = stats || {};

  const attrs = teamData?.TeamAttributes || {};
  
  // Handle AutoStrat as an array
  const flattenedAutoStrats = matches
    .flatMap(m => {
      const auto = m?.Autonomous?.AutoStrat;
      return Array.isArray(auto) ? auto : (auto ? [auto] : []);
    });
  const autoMode = flattenedAutoStrats.length > 0 
    ? flattenedAutoStrats.reduce((acc, val, _, arr) => 
        acc === val || acc.split(',').includes(val) ? acc : acc + ',' + val, '')
    : 'None';
  
  const autoHangMode = mode(matches.map(m => m?.Autonomous?.AutoHang || 'None'));
  const autoWinMode = mode(matches.map(m => m?.AutoWin || 'N/A'));
  const autoImpactMode = mode(matches.map(m => m?.AutoImpact || 'N/A'));
  const endgameMode = mode(matches.map(m => m?.Teleop?.Endgame || 'None'));
  const matchResultMode = mode(matches.map(m => m?.MatchResult || 'N/A'));
  const teamImpactMode = mode(matches.map(m => m?.TeamImpact || 'N/A'));
  const activeMode = topFromListFields(matches, 'ActiveStrat');
  const inactiveMode = topFromListFields(matches, 'InactiveStrat');
  const shooterMode = mode(matches.map(m => m?.RobotInfo?.ShooterSpeed || 'None'));
  const driverSkillMode = mode(matches.map(m => m?.RobotInfo?.DriverSkill || 'None'));
  const defenseEffectivenessMode = formatDefenseEffectiveness(mode(matches.map(m => m?.RobotInfo?.DefenseEffectiveness || 'N/A')));
  
  const ballsShot = mode(matches.map(m => m?.RobotInfo?.BallsShot || 'None'))

  const scoutedFuelCap = mode(matches.map(m => m?.RobotInfo?.FuelCapacity || 'None'));
  const avgAllianceScore = matches.length > 0
    ? (matches.reduce((sum, m) => sum + (Number.isFinite(Number(m?.AllianceScore)) ? Number(m.AllianceScore) : 0), 0) / matches.length).toFixed(1)
    : 'N/A'
  const avgOpponentScore = matches.length > 0
    ? (matches.reduce((sum, m) => sum + (Number.isFinite(Number(m?.OpponentScore)) ? Number(m.OpponentScore) : 0), 0) / matches.length).toFixed(1)
    : 'N/A'
  
  /* I made this ~ Jmoney */
  const brokenText =  mode(matches.map(m => m?.RobotInfo?.WhatBrokeDesc  ?? 'None'));
  
  const insightText = mode(matches.map(m => m?.RobotInfo?.Comments ?? 'None'));

  const dqCount = matches.reduce((sum, m) => sum + (m?.Penalties?.PenaltiesCommitted?.DQ ? 1 : 0), 0);

  const brokenCount = matches.reduce((sum, m) => sum + (m?.Penalties?.PenaltiesCommitted?.Broken ? 1 : 0), 0);

  const brokenRate = matches.length > 0 ? ((brokenCount / matches.length) * 100).toFixed(2) : '0.00';
  const capabilitiesText = Array.isArray(attrs?.Capabilities)
    ? (attrs.Capabilities.filter(v => v && v !== 'None').join(', ') || 'None')
    : (attrs?.Capabilities || 'None');
  const canAutoHangText = typeof attrs?.CanAutoHang === 'boolean' ? (attrs.CanAutoHang ? 'Yes' : 'No') : 'N/A';
  const turretText = typeof attrs?.Turret === 'boolean' ? (attrs.Turret ? 'Yes' : 'No') : 'N/A';
  const formattedEndgameMode = String(endgameMode || 'N/A').replace(/Level(\d+)/g, 'Level $1');
  const hangTimeText = typeof attrs?.HangTime === 'number' ? `${attrs.HangTime.toFixed(2)} s` : 'N/A';
  const brokenRateText = `${brokenRate}%`;

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
            Team Name: {simpleTeamName || teamData?.nickname || 'Unknown'}
          </p>
            <p style={{ margin: "5px 0", fontWeight: "600" }}>Matches Scouted: {safeStats?.Matches ?? matches.length ?? 0}</p>
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
            <strong>Max Level Hang</strong> {formattedEndgameMode}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>AutoStrat:</strong> {autoMode || 'N/A'}
          </div>
           <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Auto Hang:</strong> {autoHangMode || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Auto Win:</strong> {autoWinMode || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Auto Impact:</strong> {autoImpactMode || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Most Likely Active Strat:</strong> {activeMode || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Most Likely Inactive Strat:</strong> {inactiveMode || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Driver Skill:</strong> {driverSkillMode || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Defense Effectiveness:</strong> {defenseEffectivenessMode || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Shooter Speed:</strong> {shooterMode || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Balls Shot</strong>: {ballsShot ?? 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Scouted Fuel Cap</strong>: {scoutedFuelCap ?? 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Match Result:</strong> {matchResultMode || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Team Impact:</strong> {teamImpactMode || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Avg Alliance/Opp Score:</strong> {avgAllianceScore} / {avgOpponentScore}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Hang Time:</strong> {hangTimeText}
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
            <strong>Can Auto Hang (Notes)</strong>: {canAutoHangText}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Turret (Notes)</strong>: {turretText}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Capabilities:</strong> {capabilitiesText}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Broken:</strong> {brokenRateText}
          </div>
          {/* Is displayed in all matches */}
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>What Broke: </strong> {brokenText}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Insight: </strong> {insightText}
          </div>
        </div>
      </div>

    </div>
  );
}

export default TeamStats
