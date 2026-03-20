/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { apiListTeams, apiDeleteMatchSubmission, apiDeleteTeam, fromNotesTeamId, isNotesTeamId } from '../../../api';
import { isTableNotesAllowed } from '../../../utils/tableNotesPermissions';
import tableStyles from '../Table.module.css';

function Submissions({ regional }) {
  const { user } = useOutletContext() ?? {}
  const canDelete = isTableNotesAllowed(user)

  const [entries, setEntries] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deletingId, setDeletingId] = useState(null);

  const loadEntries = useCallback(async () => {
    try {
      const response = await apiListTeams();
      const teams = response?.data?.listTeams?.items || [];

      const flat = [];

      const formatMatchLabel = (matchId) => {
        if (!matchId) return 'Match'
        const parts = String(matchId).split('_')
        if (parts.length >= 2) return parts[1]
        return String(matchId)
      }

      const stringifyList = (val) => {
        if (!Array.isArray(val) || val.length === 0) return 'None'
        return val.join(', ')
      }

      const stringifyCapabilities = (value) => {
        if (Array.isArray(value)) {
          const filtered = value.filter(v => v && v !== 'None')
          return filtered.length > 0 ? filtered.join(', ') : 'None'
        }
        if (typeof value === 'string' && value && value !== 'None') return value
        return 'None'
      }

      teams.forEach(team => {
        const teamId = String(team?.id || '');
        const notesRecord = isNotesTeamId(teamId)
        const displayTeamNumber = notesRecord ? fromNotesTeamId(teamId) : teamId
        const teamUpdatedAt = team?.updatedAt || null;
        const teamChangedAt = Number(team?._lastChangedAt || 0);
        const timestamp = teamChangedAt > 0
          ? teamChangedAt
          : (teamUpdatedAt ? Date.parse(teamUpdatedAt) : 0);

        const attrs = team?.TeamAttributes || {};
        const noteParts = []
        if (attrs?.Notes) noteParts.push(String(attrs.Notes))
        if (attrs?.DeclaredFuelCap) noteParts.push(`Fuel Cap: ${attrs.DeclaredFuelCap}`)
        if (attrs?.CyclesPerMatch) noteParts.push(`Cycles: ${attrs.CyclesPerMatch}`)
        if (attrs?.FuelPerCycle) noteParts.push(`Fuel/Cycle: ${attrs.FuelPerCycle}`)
        if (attrs?.NumAutos) noteParts.push(`Autos: ${attrs.NumAutos}`)
        const capabilities = stringifyCapabilities(attrs?.Capabilities)
        if (capabilities !== 'None') noteParts.push(`Capabilities: ${capabilities}`)
        if (attrs?.MaxHang && attrs.MaxHang !== 'None') noteParts.push(`Max Hang: ${attrs.MaxHang}`)
        if (attrs?.HangTeamwork && attrs.HangTeamwork !== 'None') noteParts.push(`Teamwork: ${attrs.HangTeamwork}`)

        if (notesRecord && noteParts.length > 0) {

          flat.push({
            id: `note-${displayTeamNumber}`,
            type: 'Note',
            team: displayTeamNumber,
            regional: attrs?.Regional || '',
            title: `Team ${displayTeamNumber} notes`,
            detail: noteParts.join(' • '),
            timestamp,
            updatedAt: teamUpdatedAt,
            deleteMeta: { kind: 'note', teamId },
          });
        }

        if (notesRecord) return

        const regionals = Array.isArray(team?.Regionals)
          ? team.Regionals
          : (team?.Regionals ? [team.Regionals] : []);

        regionals.forEach(reg => {
          if (regional && reg?.RegionalId && reg.RegionalId !== regional) return;

          const teamMatches = Array.isArray(reg?.TeamMatches)
            ? reg.TeamMatches
            : (reg?.TeamMatches ? [reg.TeamMatches] : []);

          teamMatches.forEach((match, idx) => {
            const matchId = typeof match?.MatchId === 'string' ? match.MatchId.trim() : '';
            if (!matchId || matchId === 'matchEntry.MatchId') return;

            const matchTimestampFromName = Date.parse(String(match?.name || ''))
            const matchTimestamp = Number.isNaN(matchTimestampFromName) ? 0 : matchTimestampFromName

            const auto = match?.Autonomous?.AutoStrat || [];
            const autoHang = match?.Autonomous?.AutoHang || 'None';
            const endgame = match?.Teleop?.Endgame || 'None';
            const active = stringifyList(match?.ActiveStrat)
            const inactive = stringifyList(match?.InactiveStrat)
            const robotSpeed = match?.RobotInfo?.RobotSpeed || 'None'
            const driverSkill = match?.RobotInfo?.DriverSkill || 'None'
            const shooterSpeed = match?.RobotInfo?.ShooterSpeed || 'None'
            const ballsShot = Number(match?.RobotInfo?.BallsShot || 0)
            const fuelCap = Number(match?.RobotInfo?.FuelCapacity || 0)
            const penalties = match?.Penalties?.PenaltiesCommitted || {}
            const penaltyList = Object.entries(penalties)
              .filter(([, v]) => v === true)
              .map(([k]) => k)
              .join(', ') || 'None'
            const comment = match?.Comment ? ` • Comment: ${match.Comment}` : ''
            const autoStr = Array.isArray(auto) ? auto.join(', ') : auto

            flat.push({
              id: `form-${teamId}-${matchId}-${idx}`,
              type: 'Form',
              team: String(match?.Team || teamId),
              regional: reg?.RegionalId || '',
              title: formatMatchLabel(matchId),
              detail: `Auto: ${autoStr} (${autoHang}) • Endgame: ${endgame} • Active: ${active} • Inactive: ${inactive} • Driver: ${driverSkill} • Robot: ${robotSpeed}/${shooterSpeed} • Balls: ${ballsShot} • Fuel Cap: ${fuelCap} • Penalties: ${penaltyList}${comment}`,
              submittedBy: match?.SubmittedBy || 'Unknown',
              timestamp: matchTimestamp,
              updatedAt: teamUpdatedAt,
              deleteMeta: {
                kind: 'match',
                teamId,
                regionalId: reg?.RegionalId || '',
                matchId,
              },
            });
          });
        });
      });

      setEntries(flat);
    } catch (err) {
      console.log('Error loading all entries', err);
      setEntries([]);
    }
  }, [regional]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries, refreshKey]);

  const handleDeleteEntry = async (entry) => {
    if (!canDelete) return;
    if (!entry?.deleteMeta) return;
    const confirmed = window.confirm('Are you sure you want to delete this submission?');
    if (!confirmed) return;
    setDeletingId(entry.id);

    try {
      if (entry.deleteMeta.kind === 'match') {
        await apiDeleteMatchSubmission({
          teamId: entry.deleteMeta.teamId,
          regionalId: entry.deleteMeta.regionalId,
          matchId: entry.deleteMeta.matchId,
        });
      } else if (entry.deleteMeta.kind === 'note') {
        await apiDeleteTeam(entry.deleteMeta.teamId);
      }

      // Refresh list after delete
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Failed to delete submission', err);
      window.alert('Failed to delete submission. See console for details.');
    } finally {
      setDeletingId(null);
    }
  };

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      const t = (b.timestamp || 0) - (a.timestamp || 0);
      if (t !== 0) return t;
      return String(b.title || '').localeCompare(String(a.title || ''));
    });
  }, [entries]);

  const formatWhen = (entry) => {
    if (entry?.type === 'Form') {
      if (entry?.timestamp) {
        const d = new Date(entry.timestamp);
        if (!Number.isNaN(d.getTime())) return d.toLocaleString();
      }
      return 'Unknown time';
    }
    if (entry?.updatedAt) {
      const d = new Date(entry.updatedAt);
      if (!Number.isNaN(d.getTime())) return d.toLocaleString();
    }
    if (entry?.timestamp) {
      const d = new Date(entry.timestamp);
      if (!Number.isNaN(d.getTime())) return d.toLocaleString();
    }
    return 'Unknown time';
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Submissions</h2>

      <div className={tableStyles.Card}>
        {sortedEntries.length === 0 ? (
          <p>No form or note submissions found yet.</p>
        ) : (
          sortedEntries.map(entry => (
            <div
              key={entry.id}
              style={{
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '10px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <strong>{entry.type} • Team {entry.team}</strong>
                <span style={{ color: '#666' }}>{formatWhen(entry)}</span>
              </div>
              <div style={{ marginTop: '4px' }}>{entry.title}</div>
              <div style={{ marginTop: '4px', color: '#444' }}>{entry.detail}</div>
              {entry.submittedBy ? (
                <div style={{ marginTop: '4px', color: '#666' }}>Submitted by: {entry.submittedBy}</div>
              ) : null}
              {entry.regional ? <div style={{ marginTop: '4px', color: '#666' }}>Regional: {entry.regional}</div> : null}
                      {entry.deleteMeta && canDelete ? (
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    disabled={deletingId === entry.id}
                    onClick={() => handleDeleteEntry(entry)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(0,0,0,0.2)',
                      backgroundColor: deletingId === entry.id ? '#ccc' : '#f44336',
                      color: 'white',
                      cursor: deletingId === entry.id ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {deletingId === entry.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Submissions;
