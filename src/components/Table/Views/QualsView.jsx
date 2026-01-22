import React, { useState, useEffect } from 'react';
import { getMatchesForRegional } from '../../../api/bluealliance';
import TeamStats from '../Tables/TeamStats';
import tableStyles from '../Table.module.css';

function QualsView({ tableData, regional, teamsClicked, setTeamsClicked }) {
  const [matchNumber, setMatchNumber] = useState('');
  const [currentMatch, setCurrentMatch] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // Load matches for the regional
    getMatchesForRegional(regional)
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
    }
  };

  const handleTeamClick = (teamNumber) => {
    setSelectedTeam(teamNumber);
  };

  const renderTeamButton = (teamNumber, alliance) => {
    const isSelected = selectedTeam === teamNumber;
    return (
      <button
        key={teamNumber}
        onClick={() => handleTeamClick(teamNumber)}
        style={{
          padding: '15px',
          margin: '5px',
          backgroundColor: isSelected ? '#007bff' : alliance === 'blue' ? '#cce5ff' : '#ffcccc',
          color: isSelected ? 'white' : 'black',
          border: `2px solid ${alliance === 'blue' ? '#0066cc' : '#cc0000'}`,
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          width: '120px',
          transition: 'all 0.3s ease'
        }}
      >
        {teamNumber}
      </button>
    );
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Qualification Matches</h2>

      {/* Match Selection */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Select Match</h3>
        <form onSubmit={handleMatchSubmit} style={{ textAlign: 'center' }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Match Number:
            <input
              type="number"
              value={matchNumber}
              onChange={(e) => setMatchNumber(e.target.value)}
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
          <button type="submit" style={{
            marginLeft: "10px",
            padding: "8px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px"
          }}>
            Load Match
          </button>
        </form>
      </div>

      {currentMatch && (
        <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
          <h3 style={{ marginTop: 0, marginBottom: "20px", textAlign: "center" }}>Match Alliances</h3>
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
        <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
          <TeamStats
            information={tableData}
            gFilter=""
            regionalEvent={regional}
            teamHandler={handleTeamClick}
            selectedTeam={selectedTeam}
          />
        </div>
      )}
    </div>
  );
}

export default QualsView;