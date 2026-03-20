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
  const [rankingTrend, setRankingTrend] = useState([]);
  const [rankingTrendMeta, setRankingTrendMeta] = useState({ currentMatch: 0, teamsWithData: 0, hasEnoughTeams: false });

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

  const parseMatchNumberFromId = (matchId) => {
    if (typeof matchId !== 'string') return null;
    const normalized = matchId.toLowerCase();
    const qmMatch = normalized.match(/qm(\d+)/);
    if (qmMatch?.[1]) return Number(qmMatch[1]);

    const trailing = normalized.match(/(\d+)$/);
    if (trailing?.[1]) return Number(trailing[1]);

    return null;
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
      setRankingTrend([]);
      setRankingTrendMeta({ currentMatch: 0, teamsWithData: 0, hasEnoughTeams: false });
      return;
    }

    apigetMatchesForRegional(regional)
      .then(res => {
        const items = res?.data?.teamMatchesByRegional?.items || [];
        const teamToMatches = new Map();
        let latestMatchNumber = 0;

        items.forEach(match => {
          const team = String(match?.Team || '').trim();
          const matchNumber = parseMatchNumberFromId(match?.MatchId);
          if (!team || !matchNumber || Number.isNaN(matchNumber)) return;

          latestMatchNumber = Math.max(latestMatchNumber, matchNumber);
          if (!teamToMatches.has(team)) teamToMatches.set(team, new Set());
          teamToMatches.get(team).add(matchNumber);
        });

        const teamsWithData = Array.from(teamToMatches.values()).filter(set => set.size > 0).length;
        const hasEnoughTeams = teamsWithData >= 2;
        const selectedTeamKey = String(selectedTeam);
        const selectedSet = teamToMatches.get(selectedTeamKey);

        if (!hasEnoughTeams || !selectedSet || latestMatchNumber < 1) {
          setRankingTrend([]);
          setRankingTrendMeta({ currentMatch: latestMatchNumber, teamsWithData, hasEnoughTeams });
          return;
        }

        const points = [];

        for (let currentMatch = 1; currentMatch <= latestMatchNumber; currentMatch++) {
          const ranked = Array.from(teamToMatches.entries())
            .map(([team, matchSet]) => {
              const submittedByNow = Array.from(matchSet).filter(n => n <= currentMatch).length;
              return {
                team,
                submittedByNow,
                score: submittedByNow / currentMatch,
              };
            })
            .filter(teamData => teamData.submittedByNow > 0)
            .sort((a, b) => {
              if (b.score !== a.score) return b.score - a.score;
              if (b.submittedByNow !== a.submittedByNow) return b.submittedByNow - a.submittedByNow;
              return a.team.localeCompare(b.team);
            });

          const rankIndex = ranked.findIndex(teamData => teamData.team === selectedTeamKey);
          if (rankIndex >= 0) {
            points.push({
              matchNumber: currentMatch,
              rank: rankIndex + 1,
              score: ranked[rankIndex].score,
              submittedByNow: ranked[rankIndex].submittedByNow,
              teamsRanked: ranked.length,
            });
          }
        }

        setRankingTrend(points);
        setRankingTrendMeta({ currentMatch: latestMatchNumber, teamsWithData, hasEnoughTeams });
      })
      .catch(err => {
        console.log('Error loading ranking trend:', err);
        setRankingTrend([]);
        setRankingTrendMeta({ currentMatch: 0, teamsWithData: 0, hasEnoughTeams: false });
      });
  }, [selectedTeam, regional]);

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
  const endgameMode = mode(matches.map(m => m?.Teleop?.Endgame || 'None'));
  const activeMode = topFromListFields(matches, 'ActiveStrat');
  const inactiveMode = topFromListFields(matches, 'InactiveStrat');
  const shooterMode = mode(matches.map(m => m?.RobotInfo?.ShooterSpeed || 'None'));
  const driverSkillMode = mode(matches.map(m => m?.RobotInfo?.DriverSkill || 'None'));
  
  const ballsShot = mode(matches.map(m => m?.RobotInfo.BallsShot || 'None'))

  const scoutedFuelCap = mode(matches.map(m => m?.RobotInfo?.FuelCapacity || 'None'));
  
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
  const formattedEndgameMode = String(endgameMode || 'N/A').replace(/Level(\d+)/g, 'Level $1');
  const hangTimeText = typeof attrs?.HangTime === 'number' ? `${attrs.HangTime.toFixed(2)} s` : 'N/A';
  const brokenRateText = `${brokenRate}%`;

  const chartWidth = 720;
  const chartHeight = 230;
  const chartPadding = { top: 20, right: 20, bottom: 34, left: 52 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;
  const maxRank = rankingTrend.length > 0 ? Math.max(...rankingTrend.map(point => point.rank)) : 1;
  const minMatch = rankingTrend.length > 0 ? Math.min(...rankingTrend.map(point => point.matchNumber)) : 1;
  const maxMatch = rankingTrend.length > 0 ? Math.max(...rankingTrend.map(point => point.matchNumber)) : 1;

  const getX = (matchNumber) => {
    if (maxMatch === minMatch) return chartPadding.left + (plotWidth / 2);
    return chartPadding.left + ((matchNumber - minMatch) / (maxMatch - minMatch)) * plotWidth;
  };

  const getY = (rank) => {
    if (maxRank <= 1) return chartPadding.top + (plotHeight / 2);
    return chartPadding.top + ((rank - 1) / (maxRank - 1)) * plotHeight;
  };

  const trendPolylinePoints = rankingTrend.map(point => `${getX(point.matchNumber)},${getY(point.rank)}`).join(' ');
  const latestTrendPoint = rankingTrend.length > 0 ? rankingTrend[rankingTrend.length - 1] : null;

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
            <strong>Most Likely Active Strat:</strong> {activeMode || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Most Likely Inactive Strat:</strong> {inactiveMode || 'N/A'}
          </div>
          <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ddd" }}>
            <strong>Driver Skill:</strong> {driverSkillMode || 'N/A'}
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

      {/* Ranking Evolution */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "10px" }}>Ranking Evolution by Match</h3>

        {!rankingTrendMeta.hasEnoughTeams ? (
          <p style={{ margin: 0 }}>Need scouting submissions from at least 2 teams to build this graph.</p>
        ) : rankingTrend.length < 2 ? (
          <p style={{ margin: 0 }}>Not enough points yet to chart Team {selectedTeam}. Add more submitted matches.</p>
        ) : (
          <>
            <div style={{ backgroundColor: 'white', borderRadius: '6px', border: '1px solid #ddd', padding: '10px', overflowX: 'auto' }}>
              <svg width={chartWidth} height={chartHeight} role="img" aria-label={`Ranking evolution for team ${selectedTeam}`}>
                <line
                  x1={chartPadding.left}
                  y1={chartPadding.top + plotHeight}
                  x2={chartPadding.left + plotWidth}
                  y2={chartPadding.top + plotHeight}
                  stroke="#777"
                  strokeWidth="1"
                />
                <line
                  x1={chartPadding.left}
                  y1={chartPadding.top}
                  x2={chartPadding.left}
                  y2={chartPadding.top + plotHeight}
                  stroke="#777"
                  strokeWidth="1"
                />

                <polyline
                  fill="none"
                  stroke="#77B6E2"
                  strokeWidth="3"
                  points={trendPolylinePoints}
                />

                {rankingTrend.map((point) => (
                  <circle
                    key={`trend-${point.matchNumber}`}
                    cx={getX(point.matchNumber)}
                    cy={getY(point.rank)}
                    r="4"
                    fill="#1f78b4"
                  />
                ))}

                <text x={chartPadding.left} y={chartPadding.top + plotHeight + 24} fill="#444" fontSize="12">Match {minMatch}</text>
                <text x={chartPadding.left + plotWidth - 60} y={chartPadding.top + plotHeight + 24} fill="#444" fontSize="12">Match {maxMatch}</text>
                <text x={8} y={chartPadding.top + 10} fill="#444" fontSize="12">Rank 1</text>
                <text x={8} y={chartPadding.top + plotHeight} fill="#444" fontSize="12">Rank {maxRank}</text>
              </svg>
            </div>

            <p style={{ marginTop: '10px', marginBottom: 0, color: '#333' }}>
              Current match #: {rankingTrendMeta.currentMatch} • Teams with submissions: {rankingTrendMeta.teamsWithData}
              {latestTrendPoint ? ` • Latest rank: ${latestTrendPoint.rank}/${latestTrendPoint.teamsRanked} (score ${latestTrendPoint.score.toFixed(2)})` : ''}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default TeamStats
