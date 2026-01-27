import React, { useState, useEffect } from 'react';
import TeamStats from '../Tables/TeamStats';
import tableStyles from '../Table.module.css';
import { generateClient } from 'aws-amplify/api';
import { getTeam } from '../../../graphql/queries';

const client = generateClient();

function ElimsView({ tableData, regional, teamsClicked, setTeamsClicked }) {
  const [alliances, setAlliances] = useState(null);
  const [blueAllianceIndex, setBlueAllianceIndex] = useState('');
  const [redAllianceIndex, setRedAllianceIndex] = useState('');
  const [blueTeams, setBlueTeams] = useState([]);
  const [redTeams, setRedTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Load saved alliances from server
  useEffect(() => {
    const loadAlliances = async () => {
      if (!regional) return;
      const allianceId = `alliances-${regional}`;

      // Try load from localStorage first (offline-capable)
      try {
        const local = localStorage.getItem(allianceId);
        if (local) {
          setAlliances(JSON.parse(local));
        }
      } catch (e) {
        // ignore localStorage errors
      }

      // Then try to fetch from server and overwrite local if available
      try {
        const result = await client.graphql({
          query: getTeam,
          variables: { id: allianceId }
        });
        if (result.data.getTeam && result.data.getTeam.description) {
          const saved = JSON.parse(result.data.getTeam.description);
          setAlliances(saved);
          try { localStorage.setItem(allianceId, result.data.getTeam.description); } catch (e) {}
        }
      } catch (err) {
        console.log('Server unavailable; using local alliances if present', err);
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

  const allianceOptions = [];
  for (let i = 1; i <= 8; i++) allianceOptions.push(i);

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Elimination Matches</h2>

      {/* Alliance matchup selectors */}
      <div className={tableStyles.Card}>
        <h3 className={tableStyles.SectionHeader} style={{ marginBottom: '20px' }}>Set Match Alliances</h3>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px' }}>
          <div style={{ textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>Blue Alliance</label>
            <select value={blueAllianceIndex} onChange={(e) => setBlueAllianceIndex(e.target.value)} style={{ padding: '10px', borderRadius: '6px' }}>
              <option value="">Select Alliance</option>
              {allianceOptions.map(n => (
                <option key={n} value={n}>Alliance {n}</option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>VS</div>

          <div style={{ textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>Red Alliance</label>
            <select value={redAllianceIndex} onChange={(e) => setRedAllianceIndex(e.target.value)} style={{ padding: '10px', borderRadius: '6px' }}>
              <option value="">Select Alliance</option>
              {allianceOptions.map(n => (
                <option key={n} value={n}>Alliance {n}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '80px', marginTop: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#5168ed' }}>Blue Alliance Teams</h4>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {blueTeams.map((t, i) => renderTeamButton(t, 'blue'))}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#fc4242' }}>Red Alliance Teams</h4>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {redTeams.map((t, i) => renderTeamButton(t, 'red'))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Statistics */}
      {selectedTeam && (
        <div className={tableStyles.Card}>
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
        <p>3. Click a team button to view detailed stats (same view as Qualifications).</p>
        <p>4. If alliances are not saved, open Alliance Selection to create and save them first.</p>
      </div>
    </div>
  );
}

export default ElimsView;