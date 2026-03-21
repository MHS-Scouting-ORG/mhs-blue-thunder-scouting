import React, { useState, useEffect } from 'react';
import { apiGetMatchesForRegional } from '../../../api';
import TeamStats from '../Tables/TeamStats';
import tableStyles from '../Table.module.css';

function QualsView({ tableData, regional, teamsClicked, setTeamsClicked }) {
  const [matchNumber, setMatchNumber] = useState('');
  const [currentMatch, setCurrentMatch] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // Load matches for the regional
    apiGetMatchesForRegional(regional)
      .then(data => {
        setMatches(data);
      })
      .catch(err => console.log('Error loading matches:', err));
  }, [regional]);

  const handleMatchSubmit = (e) => {
    e.preventDefault();
    const match = matches.find(m => m.match_number === parseInt(matchNumber) && m.comp_level === 'qm');
    if (match) {
      setCurrentMatch(match);
      setSelectedTeam(null);
    } else {
      alert(`Qualification match ${matchNumber} not found for this regional.`);
    }
  };

  const handleTeamClick = (teamNumber) => {
    setSelectedTeam(teamNumber);
  };

  const renderTeamButton = (teamNumber, alliance) => {
    const isSelected = selectedTeam === teamNumber;
    const cls = [tableStyles.AllianceButton, alliance === 'blue' ? tableStyles.AllianceButtonBlue : tableStyles.AllianceButtonRed];
    if (isSelected) cls.push(tableStyles.AllianceButtonSelected);
    return (
      <button
        key={teamNumber}
        onClick={() => handleTeamClick(teamNumber)}
        className={cls.join(' ')}
      >
        {teamNumber}
      </button>
    );
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Qualification Matches</h2>

      {/* Match Selection */}
      <div className={tableStyles.Card}>
        <h3 className={tableStyles.SectionHeader}>Select Match</h3>
        <form onSubmit={handleMatchSubmit} style={{ textAlign: 'center' }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Match Number:
            <input
              type="number"
              value={matchNumber}
              onChange={(e) => setMatchNumber(e.target.value)}
              onWheel={(e) => e.target.blur()}
              style={{
                marginLeft: "10px",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                width: "80px"
              }}
              min="1"
            />
          </label>
          <button type="submit" className={tableStyles.PrimaryButton} style={{ marginLeft: '10px' }}>
            Load Match
          </button>
        </form>
      </div>

      {currentMatch && 
      (
        <div className={tableStyles.Card}>
          <h3 className={tableStyles.SectionHeader} style={{ marginBottom: '20px' }}>Match Alliances</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* Blue Alliance */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '50px' }}>
              <h4 style={{ color: '#0066cc', marginBottom: '10px' }}>Blue Alliance</h4>
              {currentMatch.alliances.blue.team_keys.map(teamKey => {
                const teamNumber = teamKey.replace('frc', '');
                return renderTeamButton(teamNumber, 'blue');
              })}
            </div>

            {/* VS */}
            <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 20px' }}>VS</div>

            {/* Red Alliance */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '50px' }}>
              <h4 style={{ color: '#cc0000', marginBottom: '10px' }}>Red Alliance</h4>
              {currentMatch.alliances.red.team_keys.map(teamKey => {
                const teamNumber = teamKey.replace('frc', '');
                return renderTeamButton(teamNumber, 'red');
              })}
            </div>
          </div>
        </div>
      )}

      {/* Team Statistics */}
      {selectedTeam && (
        <div className={tableStyles.Card}>
          <TeamStats
            information={tableData}
            gFilter=""
            regionalEvent={regional}
            teamHandler={setSelectedTeam}
            selectedTeam={selectedTeam}
          />
        </div>
      )}
    </div>
  );
}

export default QualsView;