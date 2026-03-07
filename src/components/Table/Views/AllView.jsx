import React, { useEffect, useMemo, useState } from 'react';
import { apiListTeams, fromNotesTeamId, isNotesTeamId } from '../../../api';
import tableStyles from '../Table.module.css';

function AllView({ regional }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const loadEntries = async () => {
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

              const auto = match?.Autonomous?.AutoStrat || [];
              const autoHang = match?.Autonomous?.AutoHang || 'None';
              const autoTravel = match?.Autonomous?.TravelMid || 0;
              const endgame = match?.Teleop?.Endgame || 'None';
              const teleTravel = match?.Teleop?.TravelMid || 0;
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
                timestamp,
                updatedAt: teamUpdatedAt,
              });
            });
          });
        });

        setEntries(flat);
      } catch (err) {
        console.log('Error loading all entries', err);
        setEntries([]);
      }
    };

    loadEntries();
  }, [regional]);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      const t = (b.timestamp || 0) - (a.timestamp || 0);
      if (t !== 0) return t;
      return String(b.title || '').localeCompare(String(a.title || ''));
    });
  }, [entries]);

  const formatWhen = (entry) => {
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
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Submitions</h2>

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
              {entry.regional ? <div style={{ marginTop: '4px', color: '#666' }}>Regional: {entry.regional}</div> : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AllView;
