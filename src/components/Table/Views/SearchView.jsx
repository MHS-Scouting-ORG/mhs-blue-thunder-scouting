import React, { useState, useEffect } from 'react';
import { apigetMatchesForRegional, apiListTeams, apiGetSimpleTeamsForRegional } from '../../../api';
import TeamStats from '../Tables/TeamStats';
import tableStyles from '../Table.module.css';

function SearchView({ tableData, regional, teamsClicked, setTeamsClicked }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [simpleTeams, setSimpleTeams] = useState([]);

  useEffect(() => {
    // pull basic BlueAlliance team info for name lookup
    if (regional) {
      apiGetSimpleTeamsForRegional(regional)
        .then(data => {
          setSimpleTeams(data || []);
        })
        .catch(err => console.log('failed to load simple teams', err));
    }
  }, [regional]);

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
    let num = null;
    // digits only -> team number
    if (/^\d+$/.test(term)) {
      num = term;
    } else {
      // first, check DB for custom name
      try {
        const list = await apiListTeams();
        const items = list?.data?.listTeams?.items || [];
        const found = items.find(t =>
          t.TeamAttributes?.name?.toLowerCase().includes(term.toLowerCase())
        );
        if (found) {
          num = String(found.id || '');
        }
      } catch (err) {
        console.log('failed to list teams for name lookup', err);
      }
      // if not found, fall back to blue alliance nicknames
      if (!num) {
        const foundBA = simpleTeams.find(s =>
          s.nickname && s.nickname.toLowerCase().includes(term.toLowerCase())
        );
        if (foundBA) {
          num = String(foundBA.team_number || foundBA.TeamNumber || '');
        }
      }
    }

    return num;
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;
    const teamNum = await lookupTeamNumber(term);
    if (teamNum) {
      setSelectedTeam(teamNum);
      setSearchTerm('');
      setTeamsClicked(prev => {
        // also toggle in the summary list so that it matches other views
        if (prev.find(x => x.TeamNumber === teamNum)) return prev;
        return [...prev, { TeamNumber: teamNum }];
      });
    } else {
      alert('Team not found');
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
          setSelectedTeam(display);
          setTeamsClicked(prev => {
            if (prev.find(x => x.TeamNumber === display)) return prev;
            return [...prev, { TeamNumber: display }];
          });
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
                            <div>Endgame: {m?.Teleop?.Endgame || 'None'}</div>
                            <div>Active: {stringifyList(m?.ActiveStrat)} • Inactive: {stringifyList(m?.InactiveStrat)}</div>
                            <div>Driver: {m?.RobotInfo?.DriverSkill || 'None'} • Robot: {m?.RobotInfo?.RobotSpeed || 'None'} / {m?.RobotInfo?.ShooterSpeed || 'None'} • Balls: {Number(m?.RobotInfo?.BallsShot || 0)}</div>
                            <div>Penalties: {Object.entries(m?.Penalties?.PenaltiesCommitted || {}).filter(([, v]) => v).map(([k]) => k).join(', ') || 'None'}</div>
                            {m?.Comment ? <div>Comment: {m.Comment}</div> : null}
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
