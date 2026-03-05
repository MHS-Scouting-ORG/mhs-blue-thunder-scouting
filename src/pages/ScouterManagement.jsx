import React, { useState, useEffect } from 'react';
import {
  apiGetMatchesForRegional,
  apiGetSimpleTeamsForRegional,
  apiGetRegional,
  apiListTeams,
  apiGetScoutingAssignments,
  apiSaveScoutingAssignments,
} from '../api';
import {
  loadAssignmentsState,
  saveAssignmentsState,
  generateAssignments,
  buildCompletionCounts,
  upsertScouter,
  removeScouterById,
  normalizeExcludedTeams,
} from '../utils/scoutingAssignments';
import { normalizeTeamId } from '../utils/teamId';

function ScouterManagement({ user }) {
  const [assignmentState, setAssignmentState] = useState(() => loadAssignmentsState());
  const [assignmentLoaded, setAssignmentLoaded] = useState(false);
  const [newScouterEmail, setNewScouterEmail] = useState('');
  const [newScouterName, setNewScouterName] = useState('');
  const [newExcludedTeam, setNewExcludedTeam] = useState('');
  const [regional, setRegional] = useState(apiGetRegional());
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [completionCounts, setCompletionCounts] = useState({});

  useEffect(() => {
    if (regional) return;
    const id = setInterval(() => {
      const reg = apiGetRegional();
      if (reg) {
        setRegional(reg);
        clearInterval(id);
      }
    }, 500);
    return () => clearInterval(id);
  }, [regional]);

  useEffect(() => {
    if (!regional) return;

    const loadAssignmentState = async () => {
      try {
        const remote = await apiGetScoutingAssignments(regional);
        if (remote && typeof remote === 'object') {
          const merged = {
            ...loadAssignmentsState(),
            ...remote,
          };
          setAssignmentState(merged);
          saveAssignmentsState(merged);
        }
      } catch (err) {
        console.log('Failed to load remote scouting assignments', err);
      } finally {
        setAssignmentLoaded(true);
      }
    };

    loadAssignmentState();
  }, [regional]);

  useEffect(() => {
    if (!regional) return;

    const loadData = async () => {
      try {
        const [matchData, teamData, listData] = await Promise.all([
          apiGetMatchesForRegional(regional),
          apiGetSimpleTeamsForRegional(regional),
          apiListTeams(),
        ]);

        const quals = (Array.isArray(matchData) ? matchData : [])
          .filter(m => m?.comp_level === 'qm')
          .sort((a, b) => Number(a?.match_number || 0) - Number(b?.match_number || 0));

        setMatches(quals);
        setTeams(Array.isArray(teamData) ? teamData : []);

        const allTeams = listData?.data?.listTeams?.items || [];
        setCompletionCounts(buildCompletionCounts(allTeams, regional));
      } catch (err) {
        console.log('Error loading data:', err);
      }
    };

    loadData();

    const intervalId = setInterval(loadData, 15000);
    return () => clearInterval(intervalId);
  }, [regional]);

  const persistState = async (state) => {
    setAssignmentState(state);
    saveAssignmentsState(state);

    if (!regional) return;
    try {
      await apiSaveScoutingAssignments(regional, state);
    } catch (err) {
      console.log('Failed to save scouting assignments', err);
    }
  };

  const regenerateAndPersist = (baseState) => {
    const assignments = generateAssignments({
      matches,
      scouters: baseState.scouters,
      excludedTeams: baseState.excludedTeams,
    });

    persistState({
      ...baseState,
      assignments,
    });
  };

  useEffect(() => {
    if (!assignmentLoaded) return;
    regenerateAndPersist(assignmentState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches, assignmentLoaded]);

  const handleAddScouter = () => {
    if (!newScouterEmail || !newScouterName) {
      alert('Please enter both name and email');
      return;
    }

    const nextState = upsertScouter(assignmentState, {
      id: Date.now().toString(),
      name: newScouterName,
      email: newScouterEmail,
    });

    regenerateAndPersist(nextState);
    setNewScouterEmail('');
    setNewScouterName('');
  };

  const handleRemoveScouter = (scouterId) => {
    const nextState = removeScouterById(assignmentState, scouterId);
    regenerateAndPersist(nextState);
  };

  const handleAddExcludedTeam = () => {
    const normalized = normalizeTeamId(newExcludedTeam);
    if (!normalized) return;

    const nextState = {
      ...assignmentState,
      excludedTeams: normalizeExcludedTeams([
        ...assignmentState.excludedTeams,
        normalized,
      ]),
    };

    regenerateAndPersist(nextState);
    setNewExcludedTeam('');
  };

  const handleRemoveExcludedTeam = (teamNumber) => {
    if (teamNumber === '2443') return;

    const nextState = {
      ...assignmentState,
      excludedTeams: normalizeExcludedTeams(
        assignmentState.excludedTeams.filter((team) => team !== teamNumber)
      ),
    };

    regenerateAndPersist(nextState);
  };

  const handleCurrentMatchChange = (value) => {
    const parsed = Number.parseInt(value, 10);
    const nextMatch = Number.isNaN(parsed) ? 1 : Math.max(1, parsed);

    persistState({
      ...assignmentState,
      currentMatchNumber: nextMatch,
    });
  };

  const teamNameByNumber = teams.reduce((acc, team) => {
    acc[String(team?.team_number)] = team?.nickname || '';
    return acc;
  }, {});

  const assignmentsByMatch = assignmentState.assignments.reduce((acc, assignment) => {
    const key = Number(assignment?.matchNumber || 0);
    if (!acc[key]) acc[key] = [];
    acc[key].push(assignment);
    return acc;
  }, {});

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <img 
          src="./images/BLUETHUNDERLOGO_BLUE.png" 
          alt="2443 Blue Thunder Logo"
          style={{ maxWidth: "100px", height: "auto", marginBottom: "10px" }}
        />
        <h1 style={{ margin: "0", color: "#333", fontSize: "1.8em" }}>SCOUTER MANAGEMENT</h1>
      </div>

      {/* Add New Scouter */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>Add New Scouter</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="text"
            placeholder="Scouter Name"
            value={newScouterName}
            onChange={(e) => setNewScouterName(e.target.value)}
            style={{
              padding: "12px",
              fontSize: "16px",
              border: "2px solid #ddd",
              borderRadius: "8px",
              width: "100%",
              boxSizing: "border-box"
            }}
          />
          <input
            type="email"
            placeholder="Scouter Email"
            value={newScouterEmail}
            onChange={(e) => setNewScouterEmail(e.target.value)}
            style={{
              padding: "12px",
              fontSize: "16px",
              border: "2px solid #ddd",
              borderRadius: "8px",
              width: "100%",
              boxSizing: "border-box"
            }}
          />
          <button
            onClick={handleAddScouter}
            style={{
              padding: "12px 24px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600"
            }}
          >
            Add Scouter
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>Scouting Controls</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Current Match Number</label>
            <input
              type="number"
              min="1"
              value={assignmentState.currentMatchNumber}
              onChange={(e) => handleCurrentMatchChange(e.target.value)}
              style={{
                padding: "12px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Excluded Teams (never scout)</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="number"
                min="1"
                placeholder="Team number"
                value={newExcludedTeam}
                onChange={(e) => setNewExcludedTeam(e.target.value)}
                style={{
                  padding: "12px",
                  fontSize: "16px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={handleAddExcludedTeam}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#77B6E2",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "600",
                }}
              >
                Add
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
              {assignmentState.excludedTeams.map((team) => (
                <button
                  key={team}
                  onClick={() => handleRemoveExcludedTeam(team)}
                  disabled={team === '2443'}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #999",
                    borderRadius: "8px",
                    cursor: team === '2443' ? "not-allowed" : "pointer",
                    backgroundColor: team === '2443' ? "#ddd" : "#fff",
                    color: "#333",
                  }}
                  title={team === '2443' ? 'Team 2443 is always excluded' : 'Click to remove'}
                >
                  Team {team} {team === '2443' ? '(us)' : '✕'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Manage Scouters */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>Manage Scouters</h2>
        
        {assignmentState.scouters.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>No scouters added yet</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {assignmentState.scouters.map(scouter => (
              <div key={scouter.id} style={{
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0" }}>{scouter.name}</h3>
                    <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>{scouter.email}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveScouter(scouter.id)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#ff6b6b",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>Qualification Match Assignments</h2>
        {matches.length === 0 ? (
          <p style={{ margin: 0, color: "#666" }}>No qualification matches loaded yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {matches.map((match) => {
              const matchNumber = Number(match?.match_number || 0);
              const matchAssignments = (assignmentsByMatch[matchNumber] || []).sort((a, b) => {
                if (a.allianceColor === b.allianceColor) {
                  return Number(a.teamNumber || 0) - Number(b.teamNumber || 0);
                }
                return a.allianceColor === 'red' ? -1 : 1;
              });

              const completed = Number(completionCounts?.[matchNumber] || 0) >= 2;

              return (
                <div
                  key={match.key}
                  style={{
                    backgroundColor: completed ? "#e0e0e0" : "white",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <strong>Match {matchNumber}</strong>
                    <span style={{ color: "#666", fontSize: "13px" }}>
                      {completed ? `Completed (${completionCounts[matchNumber]} forms)` : `Forms: ${completionCounts[matchNumber] || 0}/2`}
                    </span>
                  </div>

                  {matchAssignments.length === 0 ? (
                    <div style={{ color: "#999", fontSize: "14px" }}>No assignments (all teams excluded or no scouters).</div>
                  ) : (
                    <div style={{ display: "grid", gap: "6px" }}>
                      {matchAssignments.map((assignment) => {
                        const nickname = teamNameByNumber[String(assignment.teamNumber)];
                        return (
                          <div
                            key={`${assignment.scouterId}-${assignment.matchKey}-${assignment.teamNumber}-${assignment.allianceColor}`}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              border: "1px solid #ececec",
                              borderRadius: "6px",
                              padding: "8px 10px",
                              backgroundColor: "#fafafa",
                            }}
                          >
                            <span>
                              {assignment.allianceColor.toUpperCase()} • Team {assignment.teamNumber}
                              {nickname ? ` (${nickname})` : ''}
                            </span>
                            <span style={{ fontWeight: 600 }}>{assignment.scouterName}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ScouterManagement;
