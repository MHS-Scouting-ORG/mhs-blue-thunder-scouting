import React, { useState, useEffect, useMemo } from 'react';
import TeamStats from '../Tables/TeamStats';
import tableStyles from '../Table.module.css';
import { apiGetAllianceSelection } from '../../../api';
import { formatShooterType, getShooterTypeFromRow, isTurretShooter } from '../../../utils/shooterType';

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
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

function ElimsView({ tableData, regional, teamsClicked, setTeamsClicked }) {
  const [alliances, setAlliances] = useState(null);
  const [blueAllianceIndex, setBlueAllianceIndex] = useState('');
  const [redAllianceIndex, setRedAllianceIndex] = useState('');
  const [blueTeams, setBlueTeams] = useState([]);
  const [redTeams, setRedTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [rankingsByAvgPoints, setRankingsByAvgPoints] = useState([]);

  // Load saved alliances from server
  useEffect(() => {
    const loadAlliances = async () => {
      if (!regional) return;

      // Fetch from server
      try {
        const saved = await apiGetAllianceSelection(regional)
        if (saved) {
          setAlliances(saved);
        }
      } catch (err) {
        console.log('Error loading alliances from server', err);
      }
    };
    loadAlliances();
  }, [regional]);

  // When alliance selections change, populate team slots
  useEffect(() => {
    if (!alliances) return;

    const getTeamsForAlliance = (idx) => {
      if (!idx) return [];
      const key = `alliance${idx}`;
      const a = alliances[key];
      if (!a) return [];
      const arr = [];
      if (a.captain !== null && a.captain !== undefined && String(a.captain).trim() !== '') arr.push(String(a.captain));
      if (a.picks && a.picks[0] !== null && a.picks[0] !== undefined && String(a.picks[0]).trim() !== '') arr.push(String(a.picks[0]));
      if (a.picks && a.picks[1] !== null && a.picks[1] !== undefined && String(a.picks[1]).trim() !== '') arr.push(String(a.picks[1]));
      return arr;
    };

    setBlueTeams(getTeamsForAlliance(blueAllianceIndex));
    setRedTeams(getTeamsForAlliance(redAllianceIndex));
  }, [alliances, blueAllianceIndex, redAllianceIndex]);

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

  const getMatchPrediction = (redTeamNums, blueTeamNums) => {
    const red = getAlliancePrediction(redTeamNums);
    const blue = getAlliancePrediction(blueTeamNums);

    const ourAlliance = red;
    const oppAlliance = blue;

    const expectedDiff = Math.abs(red.totalExpected - blue.totalExpected);
    const totalMatchExpected = red.totalExpected + blue.totalExpected;
    
    // Default to predicting red win chance vs blue win chance
    const redWinChance = totalMatchExpected > 0 ? red.totalExpected / totalMatchExpected : 0.5;
    const blueWinChance = totalMatchExpected > 0 ? blue.totalExpected / totalMatchExpected : 0.5;

    let predictedWinner = 'Tied';
    let inactiveStrategySuggestion = 'Support / Standard';
    
    if (red.totalExpected > blue.totalExpected) {
      predictedWinner = 'Red';
    } else if (blue.totalExpected > red.totalExpected) {
      predictedWinner = 'Blue';
    }

    return {
      red,
      blue,
      redWinChance,
      blueWinChance,
      expectedDiff,
      predictedWinner,
      inactiveStrategySuggestion
    };
  };

  const handleTeamClick = (teamNumber) => {
    if (!teamNumber) return;
    setSelectedTeam(teamNumber);
  };

  const renderTeamButton = (teamNumber, alliance) => {
    const isSelected = selectedTeam === String(teamNumber);
    const display = teamNumber ? String(teamNumber) : '—';
    const cls = [tableStyles.AllianceButton, alliance === 'blue' ? tableStyles.AllianceButtonBlue : tableStyles.AllianceButtonRed];
    if (isSelected) cls.push(tableStyles.AllianceButtonSelected);
    return (
      <button
        key={`${alliance}-${display}`}
        onClick={() => teamNumber && handleTeamClick(String(teamNumber))}
        className={cls.join(' ')}
      >
        {display}
      </button>
    );
  };
  
  const renderMetricButton = ({ label, value }) => (
    <div
      style={{
        border: '1px solid #d0d8e0',
        backgroundColor: 'white',
        borderRadius: '6px',
        padding: '4px 8px',
        fontSize: '12px',
        cursor: 'default',
        display: 'inline-block',
      }}
    >
      <strong>{label}:</strong> {value}
    </div>
  );

  const allianceOptions = [];
  for (let i = 1; i <= 8; i++) allianceOptions.push(i);
  
  const prediction = getMatchPrediction(redTeams, blueTeams);
  const redWinPct = Math.round(prediction.redWinChance * 100);
  const blueWinPct = Math.round(prediction.blueWinChance * 100);
  const hasTeamsSelected = redTeams.length > 0 || blueTeams.length > 0;

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Elimination Matches</h2>

      {/* Alliance matchup selectors */}
      <div className={tableStyles.Card}>
        <h3 className={tableStyles.SectionHeader} style={{ marginBottom: '20px' }}>Set Match Alliances</h3>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px' }}>
          <div style={{ textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>Red Alliance</label>
            <select value={redAllianceIndex} onChange={(e) => setRedAllianceIndex(e.target.value)} style={{ padding: '10px', borderRadius: '6px' }}>
              <option value="">Select Alliance</option>
              {allianceOptions.map(n => (
                <option key={n} value={n}>Alliance {n}</option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>VS</div>

          <div style={{ textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>Blue Alliance</label>
            <select value={blueAllianceIndex} onChange={(e) => setBlueAllianceIndex(e.target.value)} style={{ padding: '10px', borderRadius: '6px' }}>
              <option value="">Select Alliance</option>
              {allianceOptions.map(n => (
                <option key={n} value={n}>Alliance {n}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '80px', marginTop: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#fc4242' }}>Red Alliance Teams</h4>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {redTeams.map((t, i) => renderTeamButton(t, 'red'))}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#5168ed' }}>Blue Alliance Teams</h4>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {blueTeams.map((t, i) => renderTeamButton(t, 'blue'))}
            </div>
          </div>
        </div>
      </div>
      
      {/* PREDICTION SECTION */}
      {hasTeamsSelected && (
        <div className={tableStyles.Card}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center', color: '#333' }}>Win Chance + Point Breakdown (Averages)</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #ddd' }}>
              <strong>Win Chance:</strong> <span style={{ color: '#cc0000', fontWeight: 'bold' }}>{redWinPct}%</span> / <span style={{ color: '#0066cc', fontWeight: 'bold' }}>{blueWinPct}%</span>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #ddd' }}>
              <strong>Expected Diff:</strong> {prediction.expectedDiff.toFixed(1)}
            </div>
            <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #ddd' }}>
              <strong>Predicted Winner:</strong> <span style={{ color: prediction.predictedWinner === 'Red' ? '#cc0000' : prediction.predictedWinner === 'Blue' ? '#0066cc' : '#333', fontWeight: 'bold' }}>{prediction.predictedWinner}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
            {/* RED ALLIANCE */}
            <div style={{ backgroundColor: '#fff', border: '2px solid #ffcccc', borderRadius: '8px', padding: '15px' }}>
              <h4 style={{ marginTop: 0, color: '#cc0000', borderBottom: '2px solid #ffcccc', paddingBottom: '10px', marginBottom: '15px', textAlign: 'center' }}>
                Red Alliance (Avg {prediction.red.totalExpected.toFixed(1)} pts)
              </h4>
              {prediction.red.byTeam.map((team) => {
                const isStar = prediction.red.starTeam?.teamNumber === team.teamNumber;
                return (
                  <div key={`red-${team.teamNumber}`} style={{ backgroundColor: isStar ? '#fffdeb' : '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '12px', marginBottom: '12px', cursor: 'pointer' }} onClick={() => handleTeamClick(team.teamNumber)}>
                    <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '10px', color: '#333' }}>
                      Team {team.teamNumber} {isStar ? <span style={{ color: '#d4af37' }}>★ Star</span> : ''}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' , marginBottom: '8px' }}>
                      {renderMetricButton({ label: 'Exp', value: team.expected.toFixed(1) })}
                      {renderMetricButton({ label: 'Auto', value: team.avgAuto.toFixed(1) })}
                      {renderMetricButton({ label: 'Tele', value: team.avgTeleop.toFixed(1) })}
                      {renderMetricButton({ label: 'End', value: team.avgEndgame.toFixed(1) })}
                      {renderMetricButton({ label: 'Rank', value: team.rank || 'N/A' })}
                    </div>
                    <div style={{ fontSize: '13px', color: '#555' }}>
                      <strong>Defense:</strong> {team.defenseEffectiveness} &bull; <strong>Shooter:</strong> {team.shooterTypeLabel}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BLUE ALLIANCE */}
            <div style={{ backgroundColor: '#fff', border: '2px solid #cce0ff', borderRadius: '8px', padding: '15px' }}>
              <h4 style={{ marginTop: 0, color: '#0066cc', borderBottom: '2px solid #cce0ff', paddingBottom: '10px', marginBottom: '15px', textAlign: 'center' }}>
                Blue Alliance (Avg {prediction.blue.totalExpected.toFixed(1)} pts)
              </h4>
              {prediction.blue.byTeam.map((team) => {
                const isStar = prediction.blue.starTeam?.teamNumber === team.teamNumber;
                return (
                  <div key={`blue-${team.teamNumber}`} style={{ backgroundColor: isStar ? '#fffdeb' : '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '12px', marginBottom: '12px', cursor: 'pointer' }} onClick={() => handleTeamClick(team.teamNumber)}>
                    <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '10px', color: '#333' }}>
                      Team {team.teamNumber} {isStar ? <span style={{ color: '#d4af37' }}>★ Star</span> : ''}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' , marginBottom: '8px' }}>
                      {renderMetricButton({ label: 'Exp', value: team.expected.toFixed(1) })}
                      {renderMetricButton({ label: 'Auto', value: team.avgAuto.toFixed(1) })}
                      {renderMetricButton({ label: 'Tele', value: team.avgTeleop.toFixed(1) })}
                      {renderMetricButton({ label: 'End', value: team.avgEndgame.toFixed(1) })}
                      {renderMetricButton({ label: 'Rank', value: team.rank || 'N/A' })}
                    </div>
                    <div style={{ fontSize: '13px', color: '#555' }}>
                      <strong>Defense:</strong> {team.defenseEffectiveness} &bull; <strong>Shooter:</strong> {team.shooterTypeLabel}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Team Statistics */}
      {selectedTeam && (
        <div ref={el => { if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } }} className={tableStyles.Card}>
          <TeamStats
            information={tableData}
            gFilter=""
            regionalEvent={regional}
            teamHandler={handleTeamClick}
            selectedTeam={selectedTeam}
          />
        </div>
      )}

      {/* Instructions */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>Instructions:</h4>
        <p>1. Choose which saved alliances will play on the blue and red sides.</p>
        <p>2. Teams from the selected alliances will populate the slots automatically.</p>
        <p>3. Win Chance & Point Breakdown will load automatically to compare the potential match.</p>
        <p>4. Click a team box above or their button to view detailed stats at the bottom.</p>
      </div>
    </div>
  );
}

export default ElimsView;
