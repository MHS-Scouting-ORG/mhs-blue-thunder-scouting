import React, { useState, useEffect, useMemo } from 'react';
import { rankTeamsForAllianceSelection } from '../TableUtils/AllianceRankingAlgorithm';
import tableStyles from '../Table.module.css';

function AllianceSelectionView({ tableData, regional }) {
  const [rankedTeams, setRankedTeams] = useState([]);
  const [alliances, setAlliances] = useState({
    alliance1: { captain: null, picks: [] },
    alliance2: { captain: null, picks: [] },
    alliance3: { captain: null, picks: [] },
    alliance4: { captain: null, picks: [] },
    alliance5: { captain: null, picks: [] },
    alliance6: { captain: null, picks: [] },
    alliance7: { captain: null, picks: [] },
    alliance8: { captain: null, picks: [] }
  });
  const [currentPickingAlliance, setCurrentPickingAlliance] = useState(1);
  const [pickNumber, setPickNumber] = useState(1);

  useEffect(() => {
    const ranked = rankTeamsForAllianceSelection(tableData);
    setRankedTeams(ranked);
  }, [tableData]);

  const availableTeams = useMemo(() => {
    const selectedTeams = Object.values(alliances).flatMap(alliance =>
      [alliance.captain, ...alliance.picks].filter(Boolean)
    );
    return rankedTeams.filter(team => !selectedTeams.includes(team.TeamNumber));
  }, [rankedTeams, alliances]);

  const handleTeamSelect = (teamNumber) => {
    if (!teamNumber) return;

    setAlliances(prev => {
      const newAlliances = { ...prev };
      const allianceKey = `alliance${currentPickingAlliance}`;

      if (pickNumber === 1) {
        // Captain pick
        newAlliances[allianceKey].captain = teamNumber;
      } else {
        // Regular pick
        newAlliances[allianceKey].picks.push(teamNumber);
      }

      return newAlliances;
    });

    // Move to next pick
    if (pickNumber < 3) {
      setPickNumber(pickNumber + 1);
    } else {
      // Move to next alliance
      if (currentPickingAlliance < 8) {
        setCurrentPickingAlliance(currentPickingAlliance + 1);
        setPickNumber(1);
      }
    }
  };

  const renderAllianceDiagram = () => {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {Object.entries(alliances).map(([key, alliance], index) => (
          <div
            key={key}
            style={{
              border: `3px solid ${currentPickingAlliance === index + 1 ? '#007bff' : '#dee2e6'}`,
              borderRadius: '10px',
              padding: '15px',
              backgroundColor: currentPickingAlliance === index + 1 ? '#f8f9ff' : 'white'
            }}
          >
            <h4 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>
              Alliance {index + 1}
              {currentPickingAlliance === index + 1 && ` (Picking #${pickNumber})`}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{
                padding: '8px',
                backgroundColor: alliance.captain ? '#cce5ff' : '#f8f9fa',
                borderRadius: '5px',
                textAlign: 'center',
                fontWeight: alliance.captain ? 'bold' : 'normal'
              }}>
                Captain: {alliance.captain || 'Not selected'}
              </div>
              {[1, 2].map(pickIndex => (
                <div key={pickIndex} style={{
                  padding: '8px',
                  backgroundColor: alliance.picks[pickIndex - 1] ? '#cce5ff' : '#f8f9fa',
                  borderRadius: '5px',
                  textAlign: 'center',
                  fontWeight: alliance.picks[pickIndex - 1] ? 'bold' : 'normal'
                }}>
                  Pick {pickIndex}: {alliance.picks[pickIndex - 1] || 'Not selected'}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLeaderboard = () => {
    return (
      <div className={tableStyles.TableContainer}>
        <h3>Available Teams Leaderboard</h3>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Rank</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Team</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Alliance Score</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Avg Points</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>OPR</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {availableTeams.slice(0, 20).map((team, index) => (
                <tr key={team.TeamNumber} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa' }}>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                    {rankedTeams.findIndex(t => t.TeamNumber === team.TeamNumber) + 1}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>
                    {team.TeamNumber}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                    {team.allianceScore?.toFixed(2) || '0.00'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                    {team.AvgPoints?.toFixed(1) || '0.0'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                    {team.OPR?.toFixed(1) || '0.0'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                    <button
                      onClick={() => handleTeamSelect(team.TeamNumber)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2>Alliance Selection</h2>

      {/* Alliance Selection Diagram */}
      {renderAllianceDiagram()}

      {/* Leaderboard */}
      {renderLeaderboard()}

      {/* Instructions */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>Instructions:</h4>
        <p>1. Alliances pick in reverse order of qualification ranking</p>
        <p>2. The highest ranked team picks first (captain), then the next highest, and so on</p>
        <p>3. Each alliance captain picks 2 additional teams</p>
        <p>4. Selected teams are removed from the leaderboard</p>
      </div>
    </div>
  );
}

export default AllianceSelectionView;