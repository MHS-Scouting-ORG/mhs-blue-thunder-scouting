import React, { useState, useEffect } from 'react';
import { apigetMatchesForRegional, apiGetSimpleTeamsForRegional } from '../../../api';
import TeamStats from '../Tables/TeamStats';
import tableStyles from '../Table.module.css';
import { getTopTeamSuggestions } from '../../../utils/teamSearch';

function SearchView({ tableData, regional, teamsClicked, setTeamsClicked }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [simpleTeams, setSimpleTeams] = useState([]);
  const [regionalTeamSet, setRegionalTeamSet] = useState(new Set());
  const [lookupSuggestions, setLookupSuggestions] = useState([]);

  const formatDefenseEffectiveness = (value) => {
    const normalized = String(value || '').trim()
    if (!normalized) return 'N/A'
    return normalized === 'VeryPoor' ? 'Very Poor' : normalized
  }

  const applySelectedTeam = (teamNum) => {
    setSelectedTeam(teamNum);
    setSearchTerm('');
    setLookupSuggestions([]);
    setTeamsClicked(prev => {
      if (prev.find(x => x.TeamNumber === teamNum)) return prev;
      return [...prev, { TeamNumber: teamNum }];
    });
  }

  useEffect(() => {
    // pull basic BlueAlliance team info for name lookup
    if (regional) {
      apiGetSimpleTeamsForRegional(regional)
        .then(data => {
          const teamsData = data || []
          setSimpleTeams(teamsData);
          setRegionalTeamSet(new Set(teamsData.map((t) => String(t?.team_number || t?.TeamNumber || '').trim()).filter(Boolean)));
        })
        .catch(err => {
          console.log('failed to load simple teams', err)
          setSimpleTeams([])
          setRegionalTeamSet(new Set())
        });
    } else {
      setSimpleTeams([])
      setRegionalTeamSet(new Set())
    }
  }, [regional]);

  useEffect(() => {
    const term = String(searchTerm || '').trim()
    if (!term) {
      setLookupSuggestions([])
      return
    }

    const suggestions = getTopTeamSuggestions({
      term,
      dbTeams: [],
      simpleTeams,
      resolveDbTeamNumber: () => '',
      limit: 3,
    })

    setLookupSuggestions(suggestions)
  }, [searchTerm, simpleTeams])

  useEffect(() => {
    if (selectedTeam && regional) {
      apigetMatchesForRegional(regional, selectedTeam)
        .then(res => {
          // GraphQL returns data nested under data.teamMatchesByRegional.items
          const arr = res?.data?.teamMatchesByRegional?.items || [];
          const seen = new Set()
          const normalized = arr
            .filter(m => {
              const id = String(m?.MatchId || '').trim()
              if (!id) return false
              if (seen.has(id)) return false
              seen.add(id)
              return true
            })
            .sort((a, b) => String(a?.MatchId || '').localeCompare(String(b?.MatchId || '')))

          setMatches(normalized);
        })
        .catch(err => {
          console.log('error fetching matches for team', err);
          setMatches([]);
        });
    } else {
      setMatches([]);
    }
  }, [selectedTeam, regional]);

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

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;

    if (/^\d+$/.test(term) && !regionalTeamSet.has(term)) {
      alert(`Team ${term} is not at this regional.`)
      setSelectedTeam(null)
      return
    }

    const { teamNum, suggestions } = await lookupTeamNumber(term);
    if (teamNum) {
      applySelectedTeam(teamNum)
    } else {
      setLookupSuggestions(suggestions)
      setSelectedTeam(null);
    }
  };

  const renderAllianceTeamButton = (teamNumber, alliance) => {
    if (!teamNumber) return null;
    const display = String(teamNumber).replace(/^frc/, '');
    return (
      <button
        key={display + alliance}
        onClick={() => {
          applySelectedTeam(display)
        }}
        className={tableStyles.AllianceButton}
        style={{ margin: '2px' }}
      >
        {display}
      </button>
    );
  };

  const formatMatchTitle = (match) => {
    if (match?.comp_level) {
      return `${String(match.comp_level).toUpperCase()} ${match?.match_number ?? ''}`
    }

    const raw = match?.MatchId
    if (typeof raw !== 'string' || raw.trim() === '' || raw === 'matchEntry.MatchId') {
      return 'Match'
    }

    const parts = raw.split('_')
    if (parts.length >= 2) {
      return parts[1]
    }
    return raw
  }

  const stringifyList = (val) => {
    if (!Array.isArray(val) || val.length === 0) return 'None'
    return val.join(', ')
  }

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Search Teams</h2>

      <div className={tableStyles.Card}>
        <form onSubmit={handleSearchSubmit} style={{ textAlign: 'center' }}>
          <input
            type="text"
            placeholder="Team number or name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              height: "50px",
              flex: "1",
              padding: "8px",
              fontSize: "16px",
              border: "2px solid #ddd",
              borderRadius: "8px",
              boxSizing: "border-box"
            }}
          />
          <button type="submit" className={tableStyles.PrimaryButton} style={{ marginLeft: '10px' }}>
            Lookup
          </button>
        </form>
        {lookupSuggestions.length > 0 ? (
          <div style={{ marginTop: '10px', maxWidth: '560px', marginInline: 'auto', textAlign: 'left' }}>
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: 'white',
                overflow: 'hidden'
              }}
            >
              {lookupSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion.teamNumber}
                  type="button"
                  onClick={() => applySelectedTeam(suggestion.teamNumber)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    backgroundColor: 'white',
                    border: 'none',
                    borderTop: index === 0 ? 'none' : '1px solid #eee',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {selectedTeam && (
        <>
          <div className={tableStyles.Card}>
            <TeamStats
              information={tableData}
              gFilter=""
              regionalEvent={regional}
              teamHandler={setSelectedTeam}
              selectedTeam={selectedTeam}
            />
          </div>

          <div className={tableStyles.Card}>
            <h3 className={tableStyles.SectionHeader} style={{ marginBottom: '10px' }}>
              Matches Played
            </h3>
            {matches.length === 0 ? (
              <p>No matches found for team {selectedTeam}</p>
            ) : (
              matches.map((m, idx) => {
                const key = m?.id || m?.MatchId || `${selectedTeam}-${idx}`;
                const title = formatMatchTitle(m);

                const blueKeys = Array.isArray(m?.alliances?.blue?.team_keys) ? m.alliances.blue.team_keys : [];
                const redKeys = Array.isArray(m?.alliances?.red?.team_keys) ? m.alliances.red.team_keys : [];
                const isScoutingEntry = blueKeys.length === 0 && redKeys.length === 0

                return (
                  <div key={key} style={{ marginBottom: '12px' }}>
                    <strong>{title}</strong>

                    {(blueKeys.length > 0 || redKeys.length > 0) ? (
                      <>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
                          <span>Blue:</span>
                          {blueKeys.map(k => renderAllianceTeamButton(String(k).replace('frc', ''), 'blue'))}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
                          <span>Red:</span>
                          {redKeys.map(k => renderAllianceTeamButton(String(k).replace('frc', ''), 'red'))}
                        </div>
                      </>
                    ) : (
                      <div style={{ marginTop: '6px', color: '#444' }}>
                        {isScoutingEntry ? (
                          <>
                            <div>Team {m?.Team || selectedTeam}</div>
                            <div>Auto: {Array.isArray(m?.Autonomous?.AutoStrat) ? m.Autonomous.AutoStrat.join(', ') : m?.Autonomous?.AutoStrat || 'None'} • Auto Hang: {m?.Autonomous?.AutoHang || 'None'}</div>
                            <div>Auto Win: {m?.AutoWin || 'N/A'} • Auto Impact: {m?.AutoImpact || 'N/A'}</div>
                            <div>Endgame: {m?.Teleop?.Endgame || 'None'}</div>
                            <div>Match Result: {m?.MatchResult || 'N/A'} • Team Impact: {m?.TeamImpact || 'N/A'}</div>
                            <div>Alliance Score: {Number.isFinite(Number(m?.AllianceScore)) ? Number(m?.AllianceScore) : 'N/A'} • Opponent Score: {Number.isFinite(Number(m?.OpponentScore)) ? Number(m?.OpponentScore) : 'N/A'}</div>
                            <div>Active: {stringifyList(m?.ActiveStrat)} • Inactive: {stringifyList(m?.InactiveStrat)}</div>
                            <div>Driver: {m?.RobotInfo?.DriverSkill || 'None'} • Defense: {formatDefenseEffectiveness(m?.RobotInfo?.DefenseEffectiveness)} • Robot: {m?.RobotInfo?.RobotSpeed || 'None'} / {m?.RobotInfo?.ShooterSpeed || 'None'} • Balls: {Number(m?.RobotInfo?.BallsShot || 0)}</div>
                            <div>Penalties: {Object.entries(m?.Penalties?.PenaltiesCommitted || {}).filter(([, v]) => v).map(([k]) => k).join(', ') || 'None'}</div>
                            {String(m?.RobotInfo?.Comments || '').trim() ? <div>Comments: {String(m?.RobotInfo?.Comments || '').trim()}</div> : null}
                          </>
                        ) : (
                          <div>Team {m?.Team || selectedTeam}</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SearchView;
