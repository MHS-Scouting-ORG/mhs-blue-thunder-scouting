import React, { useState, useEffect, useMemo } from 'react';
import { rankTeamsForAllianceSelection } from '../TableUtils/AllianceRankingAlgorithm';
import tableStyles from '../Table.module.css';
import { generateClient } from 'aws-amplify/api';
import { createTeam, updateTeam } from '../../../graphql/mutations';
import { getTeam } from '../../../graphql/queries';

const client = generateClient();

const pickingOrder = [
  { alliance: 1, type: 'captain' },
  { alliance: 1, type: 'pick1' },
  { alliance: 2, type: 'captain' },
  { alliance: 2, type: 'pick1' },
  { alliance: 3, type: 'captain' },
  { alliance: 3, type: 'pick1' },
  { alliance: 4, type: 'captain' },
  { alliance: 4, type: 'pick1' },
  { alliance: 5, type: 'captain' },
  { alliance: 5, type: 'pick1' },
  { alliance: 6, type: 'captain' },
  { alliance: 6, type: 'pick1' },
  { alliance: 7, type: 'captain' },
  { alliance: 7, type: 'pick1' },
  { alliance: 8, type: 'captain' },
  { alliance: 8, type: 'pick1' },
  { alliance: 8, type: 'pick2' },
  { alliance: 7, type: 'pick2' },
  { alliance: 6, type: 'pick2' },
  { alliance: 5, type: 'pick2' },
  { alliance: 4, type: 'pick2' },
  { alliance: 3, type: 'pick2' },
  { alliance: 2, type: 'pick2' },
  { alliance: 1, type: 'pick2' },
];

function AllianceSelectionView({ tableData, regional }) {
  const [rankedTeams, setRankedTeams] = useState([]);
  const [alliances, setAlliances] = useState({
    alliance1: { captain: null, picks: [null, null] },
    alliance2: { captain: null, picks: [null, null] },
    alliance3: { captain: null, picks: [null, null] },
    alliance4: { captain: null, picks: [null, null] },
    alliance5: { captain: null, picks: [null, null] },
    alliance6: { captain: null, picks: [null, null] },
    alliance7: { captain: null, picks: [null, null] },
    alliance8: { captain: null, picks: [null, null] }
  });
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    const ranked = rankTeamsForAllianceSelection(tableData);
    setRankedTeams(ranked);
  }, [tableData]);

  // Load alliances from database
  useEffect(() => {
    const loadAlliances = async () => {
      try {
        const allianceId = `alliances-${regional}`;
        const result = await client.graphql({
          query: getTeam,
          variables: { id: allianceId }
        });
        if (result.data.getTeam && result.data.getTeam.description) {
          const savedAlliances = JSON.parse(result.data.getTeam.description);
          setAlliances(savedAlliances);
        }
      } catch (error) {
        console.log('No saved alliances found for this regional');
      }
    };
    if (regional) {
      loadAlliances();
    }
  }, [regional]);

  // Save alliances to database
  const saveAlliances = async () => {
    try {
      const allianceId = `alliances-${regional}`;
      const alliancesData = JSON.stringify(alliances);
      
      // Try to update existing alliance data
      try {
        await client.graphql({
          query: updateTeam,
          variables: {
            input: {
              id: allianceId,
              name: `Alliances for ${regional}`,
              description: alliancesData
            }
          }
        });
      } catch (updateError) {
        // If update fails (alliance doesn't exist), create new
        await client.graphql({
          query: createTeam,
          variables: {
            input: {
              id: allianceId,
              name: `Alliances for ${regional}`,
              description: alliancesData
            }
          }
        });
      }
      
      alert('Alliances saved successfully!');
    } catch (error) {
      console.error('Error saving alliances:', error);
      alert('Error saving alliances. Please try again.');
    }
  };

  const availableTeams = useMemo(() => {
    const selectedTeams = Object.values(alliances).flatMap(alliance =>
      [alliance.captain, ...alliance.picks].filter(Boolean)
    );
    return rankedTeams.filter(team => !selectedTeams.includes(team.TeamNumber));
  }, [rankedTeams, alliances]);

  const handleTeamSelect = (teamNumber) => {
    if (!teamNumber || currentPickIndex >= pickingOrder.length) return;

    const currentPick = pickingOrder[currentPickIndex];
    const allianceKey = `alliance${currentPick.alliance}`;

    setAlliances(prev => {
      const newAlliances = { ...prev };
      if (currentPick.type === 'captain') {
        newAlliances[allianceKey].captain = teamNumber;
      } else if (currentPick.type === 'pick1') {
        newAlliances[allianceKey].picks[0] = teamNumber;
      } else if (currentPick.type === 'pick2') {
        newAlliances[allianceKey].picks[1] = teamNumber;
      }
      return newAlliances;
    });

    setCurrentPickIndex(currentPickIndex + 1);
  };

  const handleInputChange = (allianceKey, type, value, index = null) => {
    const num = value ? parseInt(value) : null;
    setAlliances(prev => {
      const newAlliances = { ...prev };
      if (type === 'captain') {
        newAlliances[allianceKey].captain = num;
      } else if (type === 'pick') {
        newAlliances[allianceKey].picks[index] = num;
      }
      return newAlliances;
    });
  };

  const handleRemove = (allianceKey, type, index = null) => {
    setAlliances(prev => {
      const newAlliances = { ...prev };
      if (type === 'captain') {
        newAlliances[allianceKey].captain = null;
      } else if (type === 'pick') {
        newAlliances[allianceKey].picks[index] = null;
      }
      return newAlliances;
    });
  };

  const renderAllianceDiagram = () => {
    const currentPick = pickingOrder[currentPickIndex];
    const currentAlliance = currentPick ? currentPick.alliance : null;
    const currentType = currentPick ? currentPick.type : null;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {Object.entries(alliances).map(([key, alliance], index) => (
          <div
            key={key}
            style={{
              border: `3px solid ${currentAlliance === index + 1 ? '#007bff' : '#dee2e6'}`,
              borderRadius: '10px',
              padding: '15px',
              backgroundColor: currentAlliance === index + 1 ? '#f8f9ff' : 'white'
            }}
          >
            <h4 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>
              Alliance {index + 1}
              {currentAlliance === index + 1 && currentType && ` (Picking ${currentType})`}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="number"
                  value={alliance.captain || ''}
                  onChange={(e) => handleInputChange(key, 'captain', e.target.value)}
                  placeholder="Captain"
                  style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button
                  onClick={() => handleRemove(key, 'captain')}
                  style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                >
                  X
                </button>
              </div>
              {[0, 1].map(pickIndex => (
                <div key={pickIndex} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="number"
                    value={alliance.picks[pickIndex] || ''}
                    onChange={(e) => handleInputChange(key, 'pick', e.target.value, pickIndex)}
                    placeholder={`Pick ${pickIndex + 1}`}
                    style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                  />
                  <button
                    onClick={() => handleRemove(key, 'pick', pickIndex)}
                    style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    X
                  </button>
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
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Alliance Selection</h2>

      {/* Alliance Selection Diagram */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "20px", textAlign: "center" }}>Alliance Diagram</h3>
        {renderAllianceDiagram()}
      </div>

      {/* Leaderboard */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "20px", textAlign: "center" }}>Team Leaderboard</h3>
        {renderLeaderboard()}
      </div>

      {/* Save Button */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "30px" }}>
          <button onClick={() => {setConfirm(!confirm)}} style={{backgroundColor: confirm ? "red" : "white", padding: "15px", borderRadius: "8px", cursor: "pointer"}}>
            {
            confirm ? 
            /* Not Yet */
            <div><img src="./images/BLUETHUNDERLOGO_WHITE.png" style={{width:"100px", height: "90px"}}></img><div style={{fontSize: "20px"}}>Not yet</div></div> 
            /* Save Alliances */
            : <div><img src="./images/BLUETHUNDERLOGO_BLUE.png" style={{width:"100px", height: "90px"}}></img><div style={{fontSize: "20px"}}>Save Alliances</div></div>
            }
          </button>

          {/* Confirm Save */}
          {confirm ? <button style={{backgroundColor:"White", padding: "15px", borderRadius: "8px", cursor: "pointer"}} onClick={saveAlliances}>
            {<img src="./images/BLUETHUNDERLOGO_BLUE.png" style={{width:"100px", height: "90px"}}></img>}<div style={{fontSize: "20px"}}>Confirm Save</div>
          </button> : null}
        </div>
      </div>

      {/* Instructions */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Instructions</h3>
        <p>1. Alliance Selection follows FRC format: Top 8 ranked teams become Alliance Captains</p>
        <p>2. Round 1: Captains pick in order 1-8, each followed by their first pick</p>
        <p>3. Round 2: Second picks are made in reverse order (8-1)</p>
        <p>4. Selected teams are removed from the leaderboard</p>
        <p>5. You can manually type team numbers into the alliance slots or use the leaderboard to select</p>
        <p>6. Use the X button to remove a selection from an alliance slot</p>
      </div>
    </div>
  );
}

export default AllianceSelectionView;