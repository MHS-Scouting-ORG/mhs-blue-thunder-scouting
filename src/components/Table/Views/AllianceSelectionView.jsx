import React, { useState, useEffect, useMemo } from 'react';
import { getDefaultAllianceRankingOptions, rankTeamsForAllianceSelection } from '../TableUtils/AllianceRankingAlgorithm';
import tableStyles from '../Table.module.css';
import { apiGetAllianceSelection, apiSaveAllianceSelection, apiGetSimpleTeamsForRegional } from '../../../api';
import { getTopTeamSuggestions } from '../../../utils/teamSearch';

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

const getEmptyAlliances = () => ({
  alliance1: { captain: null, picks: [null, null] },
  alliance2: { captain: null, picks: [null, null] },
  alliance3: { captain: null, picks: [null, null] },
  alliance4: { captain: null, picks: [null, null] },
  alliance5: { captain: null, picks: [null, null] },
  alliance6: { captain: null, picks: [null, null] },
  alliance7: { captain: null, picks: [null, null] },
  alliance8: { captain: null, picks: [null, null] }
});

function AllianceSelectionView({ tableData, regional }) {
  const defaultRankingOptions = useMemo(() => getDefaultAllianceRankingOptions('frc2026Rebuilt'), []);
  const defaultMetricWeights = useMemo(() => ({ ...(defaultRankingOptions.metricWeights || {}) }), [defaultRankingOptions]);

  const [metricWeights, setMetricWeights] = useState(defaultMetricWeights);
  const [rankedTeams, setRankedTeams] = useState([]);
  const [simpleTeams, setSimpleTeams] = useState([]);
  const [regionalTeamSet, setRegionalTeamSet] = useState(new Set());
  const [inputDrafts, setInputDrafts] = useState({});
  const [draftSuggestions, setDraftSuggestions] = useState({});
  const [alliances, setAlliances] = useState(getEmptyAlliances());
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [confirm, setConfirm] = useState(false);

  const weightFields = [
    { key: 'autoActions', label: 'Auto Actions' },
    { key: 'autoHang', label: 'Auto Hang' },
    { key: 'teleopMobility', label: 'Teleop Mobility' },
    { key: 'endgame', label: 'Endgame' },
    { key: 'ballsShot', label: 'Balls Shot' },
    { key: 'shootingCycles', label: 'Shooting Cycles' },
    { key: 'robotSpeed', label: 'Robot Speed' },
    { key: 'shooterSpeed', label: 'Shooter Speed' },
    { key: 'driverSkill', label: 'Driver Skill' },
    { key: 'teamImpact', label: 'Team Impact' },
    { key: 'strategyExecution', label: 'Strategy Execution' },
    { key: 'reliability', label: 'Reliability' }
  ];

  const normalizeTeamNumber = (value) => String(value ?? '').trim();

  const rankingOptions = useMemo(() => ({
    gameProfile: 'frc2026Rebuilt',
    metricWeights,
  }), [metricWeights]);

  useEffect(() => {
    const ranked = rankTeamsForAllianceSelection(tableData, rankingOptions);
    setRankedTeams(ranked);
  }, [tableData, rankingOptions]);

  useEffect(() => {
    if (!regional) {
      setSimpleTeams([]);
      return;
    }

    apiGetSimpleTeamsForRegional(regional)
      .then(data => {
        const teamsData = data || []
        setSimpleTeams(teamsData)
        setRegionalTeamSet(new Set(teamsData.map((t) => String(t?.team_number || t?.TeamNumber || '').trim()).filter(Boolean)))
      })
      .catch(err => {
        console.log('failed to load simple teams', err);
        setSimpleTeams([]);
        setRegionalTeamSet(new Set());
      });
  }, [regional]);

  // Load alliances from database
  useEffect(() => {
    const loadAlliances = async () => {
      if (!regional) return;
      const allianceId = `alliances-${regional}`;

      // Load from server
      try {
        const savedAlliances = await apiGetAllianceSelection(regional)
        if (savedAlliances) {
          setAlliances(savedAlliances);
          setInputDrafts({
            alliance1captain: savedAlliances?.alliance1?.captain ? String(savedAlliances.alliance1.captain) : '',
            alliance1pick0: savedAlliances?.alliance1?.picks?.[0] ? String(savedAlliances.alliance1.picks[0]) : '',
            alliance1pick1: savedAlliances?.alliance1?.picks?.[1] ? String(savedAlliances.alliance1.picks[1]) : '',
            alliance2captain: savedAlliances?.alliance2?.captain ? String(savedAlliances.alliance2.captain) : '',
            alliance2pick0: savedAlliances?.alliance2?.picks?.[0] ? String(savedAlliances.alliance2.picks[0]) : '',
            alliance2pick1: savedAlliances?.alliance2?.picks?.[1] ? String(savedAlliances.alliance2.picks[1]) : '',
            alliance3captain: savedAlliances?.alliance3?.captain ? String(savedAlliances.alliance3.captain) : '',
            alliance3pick0: savedAlliances?.alliance3?.picks?.[0] ? String(savedAlliances.alliance3.picks[0]) : '',
            alliance3pick1: savedAlliances?.alliance3?.picks?.[1] ? String(savedAlliances.alliance3.picks[1]) : '',
            alliance4captain: savedAlliances?.alliance4?.captain ? String(savedAlliances.alliance4.captain) : '',
            alliance4pick0: savedAlliances?.alliance4?.picks?.[0] ? String(savedAlliances.alliance4.picks[0]) : '',
            alliance4pick1: savedAlliances?.alliance4?.picks?.[1] ? String(savedAlliances.alliance4.picks[1]) : '',
            alliance5captain: savedAlliances?.alliance5?.captain ? String(savedAlliances.alliance5.captain) : '',
            alliance5pick0: savedAlliances?.alliance5?.picks?.[0] ? String(savedAlliances.alliance5.picks[0]) : '',
            alliance5pick1: savedAlliances?.alliance5?.picks?.[1] ? String(savedAlliances.alliance5.picks[1]) : '',
            alliance6captain: savedAlliances?.alliance6?.captain ? String(savedAlliances.alliance6.captain) : '',
            alliance6pick0: savedAlliances?.alliance6?.picks?.[0] ? String(savedAlliances.alliance6.picks[0]) : '',
            alliance6pick1: savedAlliances?.alliance6?.picks?.[1] ? String(savedAlliances.alliance6.picks[1]) : '',
            alliance7captain: savedAlliances?.alliance7?.captain ? String(savedAlliances.alliance7.captain) : '',
            alliance7pick0: savedAlliances?.alliance7?.picks?.[0] ? String(savedAlliances.alliance7.picks[0]) : '',
            alliance7pick1: savedAlliances?.alliance7?.picks?.[1] ? String(savedAlliances.alliance7.picks[1]) : '',
            alliance8captain: savedAlliances?.alliance8?.captain ? String(savedAlliances.alliance8.captain) : '',
            alliance8pick0: savedAlliances?.alliance8?.picks?.[0] ? String(savedAlliances.alliance8.picks[0]) : '',
            alliance8pick1: savedAlliances?.alliance8?.picks?.[1] ? String(savedAlliances.alliance8.picks[1]) : ''
          });
        }
      } catch (error) {
        console.log('Error loading alliances from server', error);
      }
    };
    if (regional) {
      loadAlliances();
    }
  }, [regional]);

  // Save alliances to database
  const saveAlliances = async () => {
    // Save to the server
    try {
      await apiSaveAllianceSelection(regional, alliances)
      alert('Alliances saved to server.');
    } catch (error) {
      console.error('Error saving alliances to server:', error);
      alert('Error saving alliances. Please try again.');
    }
  };

  const availableTeams = useMemo(() => {
    const selectedTeams = new Set(
      Object.values(alliances)
        .flatMap(alliance => [alliance.captain, ...alliance.picks])
        .filter(Boolean)
        .map(normalizeTeamNumber)
    );

    return rankedTeams.filter(team => !selectedTeams.has(normalizeTeamNumber(team.TeamNumber)));
  }, [rankedTeams, alliances]);

  const handleTeamSelect = (teamNumber) => {
    if (!teamNumber || currentPickIndex >= pickingOrder.length) return;

    const normalizedTeamNumber = normalizeTeamNumber(teamNumber);

    const currentPick = pickingOrder[currentPickIndex];
    const allianceKey = `alliance${currentPick.alliance}`;
    const draftKey = currentPick.type === 'captain'
      ? `${allianceKey}captain`
      : currentPick.type === 'pick1'
        ? `${allianceKey}pick0`
        : `${allianceKey}pick1`;

    setAlliances(prev => {
      const newAlliances = { ...prev };
      if (currentPick.type === 'captain') {
        newAlliances[allianceKey].captain = normalizedTeamNumber;
      } else if (currentPick.type === 'pick1') {
        newAlliances[allianceKey].picks[0] = normalizedTeamNumber;
      } else if (currentPick.type === 'pick2') {
        newAlliances[allianceKey].picks[1] = normalizedTeamNumber;
      }
      return newAlliances;
    });

    setInputDrafts(prev => ({ ...prev, [draftKey]: normalizedTeamNumber }));

    setCurrentPickIndex(prev => prev + 1);
  };

  const lookupTeamNumber = async (term) => {
    const normalizedTerm = String(term || '').trim()

    if (/^\d+$/.test(normalizedTerm)) {
      if (!regionalTeamSet.has(normalizedTerm)) {
        return { teamNum: null, suggestions: [] }
      }
      return { teamNum: normalizedTerm, suggestions: [] };
    }

    const suggestions = getTopTeamSuggestions({
      term,
      dbTeams: [],
      simpleTeams,
      resolveDbTeamNumber: () => '',
      limit: 3,
    });

    return {
      teamNum: suggestions[0]?.teamNumber || null,
      suggestions,
    };
  };

  const handleDraftChange = (key, value) => {
    setInputDrafts(prev => ({ ...prev, [key]: value }));

    const term = String(value || '').trim()
    if (!term) {
      setDraftSuggestions(prev => ({ ...prev, [key]: [] }));
      return
    }

    const suggestions = getTopTeamSuggestions({
      term,
      dbTeams: [],
      simpleTeams,
      resolveDbTeamNumber: () => '',
      limit: 3,
    })

    setDraftSuggestions(prev => ({ ...prev, [key]: suggestions }));
  };

  const applyTeamToDraftSlot = (allianceKey, type, teamNum, index = null) => {
    setAlliances(prev => {
      const newAlliances = { ...prev };
      if (type === 'captain') {
        newAlliances[allianceKey].captain = teamNum;
      } else {
        newAlliances[allianceKey].picks[index] = teamNum;
      }
      return newAlliances;
    });

    const key = type === 'captain' ? `${allianceKey}captain` : `${allianceKey}pick${index}`;
    setInputDrafts(prev => ({ ...prev, [key]: String(teamNum) }));
    setDraftSuggestions(prev => ({ ...prev, [key]: [] }));
  }

  const commitDraft = async (allianceKey, type, index = null) => {
    const key = type === 'captain' ? `${allianceKey}captain` : `${allianceKey}pick${index}`;
    const term = String(inputDrafts[key] || '').trim();

    if (!term) {
      setAlliances(prev => {
        const newAlliances = { ...prev };
        if (type === 'captain') {
          newAlliances[allianceKey].captain = null;
        } else {
          newAlliances[allianceKey].picks[index] = null;
        }
        return newAlliances;
      });
      return;
    }

    if (/^\d+$/.test(term) && !regionalTeamSet.has(term)) {
      alert(`Team ${term} is not at this regional.`)
      return
    }

    const { teamNum, suggestions } = await lookupTeamNumber(term);
    if (!teamNum) {
      setDraftSuggestions(prev => ({ ...prev, [key]: suggestions }));
      return;
    }

    applyTeamToDraftSlot(allianceKey, type, teamNum, index);
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

    const key = type === 'captain' ? `${allianceKey}captain` : `${allianceKey}pick${index}`;
    setInputDrafts(prev => ({ ...prev, [key]: '' }));
    setDraftSuggestions(prev => ({ ...prev, [key]: [] }));
  };

  const handleWeightChange = (key, value) => {
    const parsed = Number(value);
    setMetricWeights((prev) => ({
      ...prev,
      [key]: Number.isFinite(parsed) ? Math.max(0, parsed) : 0
    }));
  };

  const resetWeights = () => {
    setMetricWeights(defaultMetricWeights);
  };

  const resetAlliances = () => {
    setAlliances(getEmptyAlliances());
    setInputDrafts({});
    setDraftSuggestions({});
    setCurrentPickIndex(0);
    setConfirm(false);
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
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="text"
                    value={inputDrafts[`${key}captain`] ?? (alliance.captain ? String(alliance.captain) : '')}
                    onChange={(e) => handleDraftChange(`${key}captain`, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        commitDraft(key, 'captain');
                      }
                    }}
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
                {Array.isArray(draftSuggestions[`${key}captain`]) && draftSuggestions[`${key}captain`].length > 0 ? (
                  <div style={{ marginTop: '6px' }}>
                    <div style={{ border: '1px solid #ddd', borderRadius: '6px', backgroundColor: 'white', overflow: 'hidden' }}>
                      {draftSuggestions[`${key}captain`].map((suggestion, idx) => (
                        <button
                          key={`${key}captain-${suggestion.teamNumber}`}
                          type="button"
                          onClick={() => applyTeamToDraftSlot(key, 'captain', suggestion.teamNumber)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 10px',
                            border: 'none',
                            borderTop: idx === 0 ? 'none' : '1px solid #eee',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          {suggestion.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              {[0, 1].map(pickIndex => (
                <div key={pickIndex}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                      type="text"
                      value={inputDrafts[`${key}pick${pickIndex}`] ?? (alliance.picks[pickIndex] ? String(alliance.picks[pickIndex]) : '')}
                      onChange={(e) => handleDraftChange(`${key}pick${pickIndex}`, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          commitDraft(key, 'pick', pickIndex);
                        }
                      }}
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
                  {Array.isArray(draftSuggestions[`${key}pick${pickIndex}`]) && draftSuggestions[`${key}pick${pickIndex}`].length > 0 ? (
                    <div style={{ marginTop: '6px' }}>
                      <div style={{ border: '1px solid #ddd', borderRadius: '6px', backgroundColor: 'white', overflow: 'hidden' }}>
                        {draftSuggestions[`${key}pick${pickIndex}`].map((suggestion, idx) => (
                          <button
                            key={`${key}pick${pickIndex}-${suggestion.teamNumber}`}
                            type="button"
                            onClick={() => applyTeamToDraftSlot(key, 'pick', suggestion.teamNumber, pickIndex)}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '8px 10px',
                              border: 'none',
                              borderTop: idx === 0 ? 'none' : '1px solid #eee',
                              backgroundColor: 'white',
                              cursor: 'pointer',
                              fontSize: '13px'
                            }}
                          >
                            {suggestion.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLeaderboard = () => {
    const getRSOutOfFive = (team) => {
      const confidence = Number(team?.confidence ?? 0);
      const normalized = Math.max(0, Math.min(1, confidence));
      return (normalized * 5).toFixed(1);
    };

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
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>RS</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {availableTeams.map((team, index) => (
                <tr key={team.TeamNumber} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa' }}>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                    {rankedTeams.findIndex(t => normalizeTeamNumber(t.TeamNumber) === normalizeTeamNumber(team.TeamNumber)) + 1}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>
                    {team.TeamNumber}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                    {team.allianceScore?.toFixed(2) || '0.00'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                    {getRSOutOfFive(team)} / 5
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Alliance Diagram</h3>
          <button
            onClick={resetAlliances}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            Reset All
          </button>
        </div>
        {renderAllianceDiagram()}
      </div>

      {/* Leaderboard */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "20px", textAlign: "center" }}>Team Leaderboard</h3>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '14px', marginBottom: '16px', border: '1px solid #e5e5e5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px', flexWrap: 'wrap' }}>
            <h4 style={{ margin: 0 }}>2026 Ranking Weights</h4>
            <button
              onClick={resetWeights}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white', cursor: 'pointer' }}
            >
              Reset Defaults
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
            {weightFields.map((field) => (
              <label key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
                {field.label}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={metricWeights?.[field.key] ?? 0}
                  onChange={(e) => handleWeightChange(field.key, e.target.value)}
                  style={{ height: '34px', padding: '6px 8px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </label>
            ))}
          </div>
        </div>

        {renderLeaderboard()}
      </div>

      {/* Save Button */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "30px", flexWrap: 'wrap' }}>
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
            <div><img src="./images/BLUETHUNDERLOGO_WHITE.png" style={{width:"60px", height: "auto"}}></img><div style={{fontSize: "16px"}}>Not yet</div></div> 
            /* Save Alliances */
            : <div><img src="./images/BLUETHUNDERLOGO_BLUE.png" style={{width:"60px", height: "auto"}}></img><div style={{fontSize: "16px"}}>Save Alliances</div></div>
            }
          </button>

          {/* Confirm Save */}
          {confirm ? <button style={{
            padding: "15px 30px",
            backgroundColor: "white",
            border: "2px solid #ddd",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600"
          }} onClick={saveAlliances}>
            <div><img src="./images/BLUETHUNDERLOGO_BLUE.png" style={{width:"60px", height: "auto"}}></img><div style={{fontSize: "16px"}}>Confirm Save</div></div>
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
        <p>5. You can type team number or team name into alliance slots, then press Enter to resolve to a team number</p>
        <p>6. Use the X button to remove a selection from an alliance slot</p>
      </div>
    </div>
  );
}

export default AllianceSelectionView;