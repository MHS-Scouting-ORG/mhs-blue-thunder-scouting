import React, { useEffect, useMemo, useState } from 'react';
import { apiGetMatchesForRegional, apiGetSimpleTeamsForRegional } from '../../../api';
import TeamStats from '../Tables/TeamStats';
import tableStyles from '../Table.module.css';
import { formatShooterType, getShooterTypeFromRow, isTurretShooter } from '../../../utils/shooterType';

const OUR_TEAM_NUMBER = '2443';

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseMatchNumberFromId = (matchId) => {
  const normalized = String(matchId || '').toLowerCase();
  const qmMatch = normalized.match(/qm(\d+)/);
  if (qmMatch?.[1]) return Number(qmMatch[1]);

  const trailing = normalized.match(/(\d+)$/);
  if (trailing?.[1]) return Number(trailing[1]);

  return null;
};

const getTeamByNumber = (tableData, teamNumber) => {
  if (!Array.isArray(tableData)) return null;
  return tableData.find((team) => String(team?.TeamNumber || '') === String(teamNumber || '')) || null;
};

const formatDefenseEffectiveness = (value) => {
  const normalized = String(value || '').trim()
  if (!normalized) return 'N/A'
  return normalized === 'VeryPoor' ? 'Very Poor' : normalized
};

const buildTeamGraphData = (teamRow) => {
  const matches = Array.isArray(teamRow?.TeamMatches) ? teamRow.TeamMatches : [];
  const pointsByMatch = matches
    .map((entry) => {
      const matchNumber = parseMatchNumberFromId(entry?.MatchId);
      if (!matchNumber || Number.isNaN(matchNumber)) return null;

      const autoActions = Array.isArray(entry?.Autonomous?.AutoStrat) ? entry.Autonomous.AutoStrat : [];
      const autoPoints = autoActions.reduce((sum, action) => {
        const lower = String(action || '').toLowerCase();
        if (lower.includes('scored') || lower.includes('goal')) return sum + 8;
        if (lower.includes('left') || lower.includes('starting') || lower.includes('zone')) return sum + 3;
        return sum;
      }, 0) + (String(entry?.Autonomous?.AutoHang || '') === 'Level1' ? 15 : 0);

      const endgame = String(entry?.Teleop?.Endgame || 'None');
      const endgamePoints = endgame === 'Level3' ? 30 : endgame === 'Level2' ? 20 : endgame === 'Level1' ? 10 : 0;
      const teleTravel = toNumber(entry?.Teleop?.TravelMid, 0) * 2;
      const ballsShot = toNumber(entry?.RobotInfo?.BallsShot, 0);
      const telePoints = teleTravel + ballsShot;
      const totalPoints = autoPoints + endgamePoints + telePoints;

      return {
        matchNumber,
        points: totalPoints,
        autoPoints,
        telePoints,
        endgamePoints,
        alliance: toNumber(entry?.AllianceScore, 0),
        opponent: toNumber(entry?.OpponentScore, 0),
        ballsShot,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.matchNumber - b.matchNumber);

  return pointsByMatch;
};

const GraphByMatch = ({ title, points, valueFormatter = (value) => String(value) }) => {
  if (!Array.isArray(points) || points.length === 0) {
    return <p style={{ marginTop: '8px', marginBottom: 0, color: '#555' }}>No match data available for graph.</p>;
  }

  const width = 640;
  const height = 220;
  const padding = { top: 18, right: 16, bottom: 34, left: 52 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const minMatch = Math.min(...points.map((point) => point.matchNumber));
  const maxMatch = Math.max(...points.map((point) => point.matchNumber));
  const values = points.map((point) => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const getX = (matchNumber) => {
    if (maxMatch === minMatch) return padding.left + plotWidth / 2;
    return padding.left + ((matchNumber - minMatch) / (maxMatch - minMatch)) * plotWidth;
  };

  const getY = (value) => {
    if (maxValue === minValue) return padding.top + plotHeight / 2;
    return padding.top + (1 - ((value - minValue) / (maxValue - minValue))) * plotHeight;
  };

  const polylinePoints = points.map((point) => `${getX(point.matchNumber)},${getY(point.value)}`).join(' ');
  const latestPoint = points[points.length - 1];

  return (
    <div style={{ marginTop: '10px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '10px', overflowX: 'auto' }}>
      <div style={{ fontWeight: 700, marginBottom: '8px' }}>{title}</div>
      <svg width={width} height={height} role="img" aria-label={`${title} by match`}>
        <line
          x1={padding.left}
          y1={padding.top + plotHeight}
          x2={padding.left + plotWidth}
          y2={padding.top + plotHeight}
          stroke="#777"
          strokeWidth="1"
        />
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + plotHeight}
          stroke="#777"
          strokeWidth="1"
        />

        <polyline fill="none" stroke="#2f7d32" strokeWidth="3" points={polylinePoints} />

        {points.map((point) => (
          <circle
            key={`${title}-${point.matchNumber}`}
            cx={getX(point.matchNumber)}
            cy={getY(point.value)}
            r="4"
            fill="#1f78b4"
          />
        ))}

        <text x={padding.left} y={padding.top + plotHeight + 24} fill="#444" fontSize="12">Match {minMatch}</text>
        <text x={padding.left + plotWidth - 65} y={padding.top + plotHeight + 24} fill="#444" fontSize="12">Match {maxMatch}</text>
        <text x={8} y={padding.top + 10} fill="#444" fontSize="12">{valueFormatter(maxValue)}</text>
        <text x={8} y={padding.top + plotHeight} fill="#444" fontSize="12">{valueFormatter(minValue)}</text>
      </svg>

      <p style={{ margin: 0, color: '#333' }}>
        Latest: Match {latestPoint.matchNumber} = {valueFormatter(latestPoint.value)}
      </p>
    </div>
  );
};

function OurMatchesView({ tableData, regional }) {
  const [matches, setMatches] = useState([]);
  const [isOurTeamAtRegional, setIsOurTeamAtRegional] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMatchKey, setSelectedMatchKey] = useState(null);
  const [expandedMatchKey, setExpandedMatchKey] = useState(null);
  const [expandedMetric, setExpandedMetric] = useState(null);
  const [expandedTeamNumber, setExpandedTeamNumber] = useState(OUR_TEAM_NUMBER);
  const [rankingsByAvgPoints, setRankingsByAvgPoints] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (!regional) {
        setMatches([]);
        setIsOurTeamAtRegional(false);
        setSelectedTeam(null);
        setSelectedMatchKey(null);
        return;
      }

      try {
        const [simpleTeams, allMatches] = await Promise.all([
          apiGetSimpleTeamsForRegional(regional),
          apiGetMatchesForRegional(regional)
        ]);

        const teamList = Array.isArray(simpleTeams) ? simpleTeams : [];
        const hasOurTeam = teamList.some(team => String(team?.team_number || team?.TeamNumber || '') === OUR_TEAM_NUMBER);
        setIsOurTeamAtRegional(hasOurTeam);

        const regionalMatches = Array.isArray(allMatches) ? allMatches : [];
        const ourQuals = regionalMatches
          .filter(match => match?.comp_level === 'qm')
          .filter(match => {
            const blueKeys = Array.isArray(match?.alliances?.blue?.team_keys) ? match.alliances.blue.team_keys : [];
            const redKeys = Array.isArray(match?.alliances?.red?.team_keys) ? match.alliances.red.team_keys : [];
            return [...blueKeys, ...redKeys].some(key => String(key).replace('frc', '') === OUR_TEAM_NUMBER);
          })
          .sort((a, b) => Number(a?.match_number || 0) - Number(b?.match_number || 0));

        setMatches(ourQuals);
        setSelectedTeam(null);
        setSelectedMatchKey(null);
        setExpandedMatchKey(null);
        setExpandedMetric(null);
        setExpandedTeamNumber(OUR_TEAM_NUMBER);
      } catch (err) {
        console.log('Error loading Our Matches view data:', err);
        setMatches([]);
        setIsOurTeamAtRegional(false);
        setSelectedTeam(null);
        setSelectedMatchKey(null);
        setExpandedMatchKey(null);
        setExpandedMetric(null);
        setExpandedTeamNumber(OUR_TEAM_NUMBER);
      }
    };

    loadData();
  }, [regional]);

  const statusMessage = useMemo(() => {
    if (!regional) return 'No regional selected.';
    if (!isOurTeamAtRegional) return `Team ${OUR_TEAM_NUMBER} is not at this regional.`;
    if (matches.length === 0) return `No qualification matches found yet for team ${OUR_TEAM_NUMBER}.`;
    return null;
  }, [regional, isOurTeamAtRegional, matches.length]);

  useEffect(() => {
    const ranked = (Array.isArray(tableData) ? tableData : [])
      .map((team) => ({
        teamNumber: String(team?.TeamNumber || ''),
        avgPoints: toNumber(team?.AvgPoints, 0),
      }))
      .filter((entry) => entry.teamNumber)
      .sort((a, b) => {
        if (b.avgPoints !== a.avgPoints) return b.avgPoints - a.avgPoints;
        return Number(a.teamNumber) - Number(b.teamNumber);
      });

    setRankingsByAvgPoints(ranked);
  }, [tableData]);

  const getRankByAveragePoints = (teamNumber) => {
    const index = rankingsByAvgPoints.findIndex((entry) => entry.teamNumber === String(teamNumber));
    return index >= 0 ? index + 1 : null;
  };

  const getShooterTypeForTeam = (teamNumber) => {
    const row = getTeamByNumber(tableData, teamNumber);
    return getShooterTypeFromRow(row);
  };

  const isTurretTeam = (teamNumber) => {
    return isTurretShooter(getShooterTypeForTeam(teamNumber));
  };

  const getAlliancePrediction = (teamNumbers) => {
    const rows = teamNumbers
      .map((teamNumber) => getTeamByNumber(tableData, teamNumber))
      .filter(Boolean);

    const totalExpected = rows.reduce((sum, row) => sum + toNumber(row?.AvgPoints, 0), 0);
    const totalAuto = rows.reduce((sum, row) => sum + toNumber(row?.AvgAutoPts, 0), 0);
    const totalEndgame = rows.reduce((sum, row) => sum + toNumber(row?.AvgEndgamePts, 0), 0);
    const totalTeleop = Math.max(0, totalExpected - totalAuto - totalEndgame);

    const byTeam = teamNumbers.map((teamNumber) => {
      const row = getTeamByNumber(tableData, teamNumber);
      const expected = toNumber(row?.AvgPoints, 0);
      const avgAuto = toNumber(row?.AvgAutoPts, 0);
      const avgEndgame = toNumber(row?.AvgEndgamePts, 0);
      const avgTeleop = Math.max(0, expected - avgAuto - avgEndgame);
      const shooterType = getShooterTypeForTeam(teamNumber);
      return {
        teamNumber,
        expected,
        avgAuto,
        avgTeleop,
        avgEndgame,
        rank: getRankByAveragePoints(teamNumber),
        hasTurret: isTurretShooter(shooterType),
        shooterType,
        shooterTypeLabel: formatShooterType(shooterType),
        defenseEffectiveness: formatDefenseEffectiveness(row?.DefenseEffectiveness),
      };
    });

    const starTeam = byTeam.reduce((best, current) => {
      if (!best) return current;
      return current.expected > best.expected ? current : best;
    }, null);

    return {
      totalExpected,
      totalAuto,
      totalTeleop,
      totalEndgame,
      byTeam,
      starTeam,
    };
  };

  const getMatchPrediction = (match) => {
    const redTeams = Array.isArray(match?.alliances?.red?.team_keys)
      ? match.alliances.red.team_keys.map((key) => String(key).replace('frc', ''))
      : [];
    const blueTeams = Array.isArray(match?.alliances?.blue?.team_keys)
      ? match.alliances.blue.team_keys.map((key) => String(key).replace('frc', ''))
      : [];

    const red = getAlliancePrediction(redTeams);
    const blue = getAlliancePrediction(blueTeams);

    const ourIsRed = redTeams.includes(OUR_TEAM_NUMBER);
    const ourAlliance = ourIsRed ? red : blue;
    const oppAlliance = ourIsRed ? blue : red;

    const expectedDiff = ourAlliance.totalExpected - oppAlliance.totalExpected;
    const totalMatchExpected = ourAlliance.totalExpected + oppAlliance.totalExpected;
    const ourWinChance = totalMatchExpected > 0 ? ourAlliance.totalExpected / totalMatchExpected : 0.5;
    const opponentWinChance = totalMatchExpected > 0 ? oppAlliance.totalExpected / totalMatchExpected : 0.5;

    let inactiveStrategySuggestion = 'Support';
    if (expectedDiff > 0) {
      inactiveStrategySuggestion = 'Hoarding';
    } else {
      const prioritized = [...oppAlliance.byTeam].sort((a, b) => {
        if (a.hasTurret !== b.hasTurret) {
          if (a.hasTurret && !b.hasTurret) return 1;
          if (!a.hasTurret && b.hasTurret) return -1;
        }
        return b.expected - a.expected;
      });
      const target = prioritized[0];
      inactiveStrategySuggestion = target
        ? `Defense on ${target.teamNumber}${target.shooterType === 'Static' ? ' (preferred static shooter target)' : target.shooterType === 'Turret' ? ' (turret shooter)' : ''}`
        : 'Defense';
    }

    return {
      red,
      blue,
      ourIsRed,
      ourAlliance,
      oppAlliance,
      expectedDiff,
      ourWinChance,
      opponentWinChance,
      inactiveStrategySuggestion,
    };
  };

  const getGraphPointsForMetric = (metric, teamNumber) => {
    const teamRow = getTeamByNumber(tableData, teamNumber);
    const teamGraphData = buildTeamGraphData(teamRow);
    if (teamGraphData.length === 0) return [];

    if (metric === 'expected') {
      return teamGraphData.map((entry) => ({ matchNumber: entry.matchNumber, value: entry.points }));
    }
    if (metric === 'auto') {
      return teamGraphData.map((entry) => ({ matchNumber: entry.matchNumber, value: entry.autoPoints }));
    }
    if (metric === 'teleop') {
      return teamGraphData.map((entry) => ({ matchNumber: entry.matchNumber, value: entry.telePoints }));
    }
    if (metric === 'endgame') {
      return teamGraphData.map((entry) => ({ matchNumber: entry.matchNumber, value: entry.endgamePoints }));
    }
    if (metric === 'balls') {
      return teamGraphData.map((entry) => ({ matchNumber: entry.matchNumber, value: entry.ballsShot }));
    }
    if (metric === 'alliance') {
      return teamGraphData.map((entry) => ({ matchNumber: entry.matchNumber, value: entry.alliance }));
    }
    if (metric === 'opponent') {
      return teamGraphData.map((entry) => ({ matchNumber: entry.matchNumber, value: entry.opponent }));
    }
    if (metric === 'rank') {
      return teamGraphData.map((entry) => {
        const peerRows = (Array.isArray(tableData) ? tableData : [])
          .map((row) => ({
            teamNumber: String(row?.TeamNumber || ''),
            points: buildTeamGraphData(row).find((x) => x.matchNumber === entry.matchNumber)?.points ?? null,
          }))
          .filter((row) => row.teamNumber && row.points !== null)
          .sort((a, b) => b.points - a.points);

        const rank = peerRows.findIndex((row) => row.teamNumber === String(teamNumber)) + 1;
        return {
          matchNumber: entry.matchNumber,
          value: rank > 0 ? rank : peerRows.length,
        };
      });
    }

    return [];
  };

  const openMetricGraph = (matchKey, teamNumber, metric) => {
    setExpandedMatchKey(matchKey);
    setExpandedTeamNumber(String(teamNumber || OUR_TEAM_NUMBER));
    setExpandedMetric(metric);
  };

  const renderMetricButton = ({ label, value, onClick }) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      style={{
        border: '1px solid #d0d8e0',
        backgroundColor: 'white',
        borderRadius: '6px',
        padding: '4px 8px',
        fontSize: '12px',
        cursor: 'pointer',
      }}
    >
      <strong>{label}:</strong> {value}
    </button>
  );

  const renderTeamButton = (teamKey, alliance, matchKey) => {
    const teamNumber = String(teamKey).replace('frc', '');
    const isOurTeam = teamNumber === OUR_TEAM_NUMBER;
    const isSelected = selectedTeam === teamNumber && !isOurTeam;
    const cls = [
      tableStyles.AllianceButton,
      alliance === 'blue' ? tableStyles.AllianceButtonBlue : tableStyles.AllianceButtonRed
    ];

    if (isSelected) cls.push(tableStyles.AllianceButtonSelected);

    return (
      <button
        key={`${alliance}-${teamNumber}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!isOurTeam) {
            if (isSelected && selectedMatchKey === matchKey) {
              setSelectedTeam(null);
              setSelectedMatchKey(null);
            } else {
              setSelectedTeam(teamNumber);
              setSelectedMatchKey(matchKey);
            }
          }
        }}
        className={cls.join(' ')}
        style={{
          width: 'auto',
          minWidth: '72px',
          margin: '2px',
          padding: '8px 10px',
          ...(isOurTeam ? { borderWidth: '8px', borderStyle: 'solid', fontWeight: 800, cursor: 'default' } : { cursor: 'pointer' })
        }}
      >
        {teamNumber}{isOurTeam ? '' : ''}
      </button>
    );
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Our Matches</h2>

      <div className={tableStyles.Card}>
        {!statusMessage ? (
          <>
            <h3 className={tableStyles.SectionHeader} style={{ marginBottom: '15px' }}>
              Qualification Matches for Team {OUR_TEAM_NUMBER}
            </h3>

            {matches.map(match => {
              const matchKey = match?.key || `qm-${match?.match_number}`;
              const showStatsForMatch = selectedMatchKey === matchKey && selectedTeam;
              const prediction = getMatchPrediction(match);
              const redWinChance = prediction.ourIsRed ? prediction.ourWinChance : prediction.opponentWinChance;
              const redWinPct = Math.round(redWinChance * 100);
              const blueWinPct = 100 - redWinPct;
              const isExpanded = expandedMatchKey === matchKey;

              const metricTeam = isExpanded ? expandedTeamNumber : OUR_TEAM_NUMBER;
              const metricPoints = isExpanded && expandedMetric
                ? getGraphPointsForMetric(expandedMetric, metricTeam)
                : [];

              const metricLabelMap = {
                expected: `Expected points by match for team ${metricTeam}`,
                auto: `Auto points by match for team ${metricTeam}`,
                teleop: `Teleop points by match for team ${metricTeam}`,
                endgame: `Endgame points by match for team ${metricTeam}`,
                rank: `Rank by match for team ${metricTeam}`,
                balls: `Balls shot by match for team ${metricTeam}`,
                alliance: `Alliance score by match for team ${metricTeam}`,
                opponent: `Opponent score by match for team ${metricTeam}`,
              };

              const toggleExpanded = () => {
                setExpandedMatchKey((prev) => {
                  const next = prev === matchKey ? null : matchKey;
                  if (next) {
                    setExpandedMetric('expected');
                    setExpandedTeamNumber(OUR_TEAM_NUMBER);
                  }
                  return next;
                });
              };

              return (
                <div
                  key={matchKey}
                  style={{
                    backgroundColor: isExpanded ? '#f8fbff' : 'white',
                    border: isExpanded ? '2px solid #77B6E2' : '1px solid #ddd',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    marginBottom: '10px',
                    transition: 'all 0.2s ease',
                    boxShadow: isExpanded ? '0 2px 8px rgba(119,182,226,0.18)' : '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                >
                <div
                  onClick={toggleExpanded}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    const parent = e.currentTarget.parentElement;
                    if (!isExpanded) {
                      parent.style.borderColor = '#a8d4f0';
                      parent.style.boxShadow = '0 2px 8px rgba(119,182,226,0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const parent = e.currentTarget.parentElement;
                    if (!isExpanded) {
                      parent.style.borderColor = '#ddd';
                      parent.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                    }
                  }}
                >
                  <div style={{ textAlign: 'center', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#2f4f73' }}>
                      Match {match?.match_number}
                    </span>
                    <span style={{ fontSize: '12px', color: '#999', transition: 'transform 0.2s ease', display: 'inline-block', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', columnGap: '16px', rowGap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ marginBottom: '6px', fontWeight: 600, color: '#cc0000', fontSize: '14px' }}>Red</div>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                        {(match?.alliances?.red?.team_keys || []).map(teamKey => renderTeamButton(teamKey, 'red', matchKey))}
                      </div>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '16px', textAlign: 'center' }}>VS</div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ marginBottom: '6px', fontWeight: 600, color: '#0066cc', fontSize: '14px' }}>Blue</div>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                        {(match?.alliances?.blue?.team_keys || []).map(teamKey => renderTeamButton(teamKey, 'blue', matchKey))}
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded ? (
                  <div style={{ marginTop: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '20px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center', color: '#333' }}>Win Chance + Point Breakdown (Averages)</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                      <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #ddd' }}>
                        <strong>Win Chance:</strong> <span style={{ color: '#cc0000', fontWeight: 'bold' }}>{redWinPct}%</span> / <span style={{ color: '#0066cc', fontWeight: 'bold' }}>{blueWinPct}%</span>
                      </div>
                      <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #ddd' }}>
                        <strong>Expected Diff:</strong> {prediction.expectedDiff.toFixed(1)}
                      </div>
                      <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #ddd' }}>
                        <strong>Suggested Strategy:</strong> {prediction.inactiveStrategySuggestion}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
                      <div style={{ backgroundColor: '#fff', border: '2px solid #ffcccc', borderRadius: '8px', padding: '15px' }}>
                        <h4 style={{ marginTop: 0, color: '#cc0000', borderBottom: '2px solid #ffcccc', paddingBottom: '10px', marginBottom: '15px', textAlign: 'center' }}>
                          Red Alliance (Avg {prediction.red.totalExpected.toFixed(1)} pts)
                        </h4>
                        {prediction.red.byTeam.map((team) => {
                          const isStar = prediction.red.starTeam?.teamNumber === team.teamNumber;
                          return (
                            <div key={`red-${team.teamNumber}`} style={{ backgroundColor: isStar ? '#fffdeb' : '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '10px', color: '#333' }}>
                                Team {team.teamNumber} {isStar ? <span style={{ color: '#d4af37' }}>★ Star</span> : ''}
                              </div>
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {renderMetricButton({ label: 'Exp', value: team.expected.toFixed(1), onClick: () => openMetricGraph(matchKey, team.teamNumber, 'expected') })}
                                {renderMetricButton({ label: 'Auto', value: team.avgAuto.toFixed(1), onClick: () => openMetricGraph(matchKey, team.teamNumber, 'auto') })}
                                {renderMetricButton({ label: 'Tele', value: team.avgTeleop.toFixed(1), onClick: () => openMetricGraph(matchKey, team.teamNumber, 'teleop') })}
                                {renderMetricButton({ label: 'End', value: team.avgEndgame.toFixed(1), onClick: () => openMetricGraph(matchKey, team.teamNumber, 'endgame') })}
                                {renderMetricButton({ label: 'Rank', value: team.rank || 'N/A', onClick: () => openMetricGraph(matchKey, team.teamNumber, 'rank') })}
                              </div>
                              <div style={{ marginTop: '8px', fontSize: '13px', color: '#555' }}>
                                Defense: {team.defenseEffectiveness} • Shooter: {team.shooterTypeLabel}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ backgroundColor: '#fff', border: '2px solid #cce5ff', borderRadius: '8px', padding: '15px' }}>
                        <h4 style={{ marginTop: 0, color: '#0066cc', borderBottom: '2px solid #cce5ff', paddingBottom: '10px', marginBottom: '15px', textAlign: 'center' }}>
                          Blue Alliance (Avg {prediction.blue.totalExpected.toFixed(1)} pts)
                        </h4>
                        {prediction.blue.byTeam.map((team) => {
                          const isStar = prediction.blue.starTeam?.teamNumber === team.teamNumber;
                          return (
                            <div key={`blue-${team.teamNumber}`} style={{ backgroundColor: isStar ? '#fffdeb' : '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '10px', color: '#333' }}>
                                Team {team.teamNumber} {isStar ? <span style={{ color: '#d4af37' }}>★ Star</span> : ''}
                              </div>
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {renderMetricButton({ label: 'Exp', value: team.expected.toFixed(1), onClick: () => openMetricGraph(matchKey, team.teamNumber, 'expected') })}
                                {renderMetricButton({ label: 'Auto', value: team.avgAuto.toFixed(1), onClick: () => openMetricGraph(matchKey, team.teamNumber, 'auto') })}
                                {renderMetricButton({ label: 'Tele', value: team.avgTeleop.toFixed(1), onClick: () => openMetricGraph(matchKey, team.teamNumber, 'teleop') })}
                                {renderMetricButton({ label: 'End', value: team.avgEndgame.toFixed(1), onClick: () => openMetricGraph(matchKey, team.teamNumber, 'endgame') })}
                                {renderMetricButton({ label: 'Rank', value: team.rank || 'N/A', onClick: () => openMetricGraph(matchKey, team.teamNumber, 'rank') })}
                              </div>
                              <div style={{ marginTop: '8px', fontSize: '13px', color: '#555' }}>
                                Defense: {team.defenseEffectiveness} • Shooter: {team.shooterTypeLabel}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {expandedMetric ? (
                      <GraphByMatch
                        title={metricLabelMap[expandedMetric] || 'Metric by match'}
                        points={metricPoints}
                        valueFormatter={expandedMetric === 'rank' ? (value) => `#${Math.round(value)}` : (value) => Number(value).toFixed(1)}
                      />
                    ) : null}
                  </div>
                ) : null}

                {showStatsForMatch && (
                  <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '12px', borderTop: '1px solid #ddd', paddingTop: '12px' }}>
                    <TeamStats
                      information={tableData}
                      gFilter=""
                      regionalEvent={regional}
                      teamHandler={setSelectedTeam}
                      selectedTeam={selectedTeam}
                    />
                  </div>
                )}
              </div>
              );
            })}
          </>
        ) : (
          <p style={{ textAlign: 'center', margin: 0, fontWeight: 600 }}>{statusMessage}</p>
        )}
      </div>
    </div>
  );
}

export default OurMatchesView;