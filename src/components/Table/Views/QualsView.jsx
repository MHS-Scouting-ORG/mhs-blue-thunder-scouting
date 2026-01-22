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
      <h2>Qualification Matches</h2>

      {/* Match Number Input */}
      <form onSubmit={handleMatchSubmit} style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label>
          Match Number:
          <input
            type="number"
            value={matchNumber}
            onChange={(e) => setMatchNumber(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', width: '80px' }}
            min="1"
          />
        </label>
        <button type="submit" style={{ marginLeft: '10px', padding: '5px 15px' }}>
          Load Match
        </button>
      </form>

      {currentMatch && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
          {/* Blue Alliance */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '50px' }}>
            <h3 style={{ color: '#0066cc' }}>Blue Alliance</h3>
            {currentMatch.alliances.blue.team_keys.map(teamKey => {
              const teamNumber = teamKey.replace('frc', '');
              return renderTeamButton(teamNumber, 'blue');
            })}
          </div>

          {/* VS */}
          <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 20px' }}>VS</div>

          {/* Red Alliance */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '50px' }}>
            <h3 style={{ color: '#cc0000' }}>Red Alliance</h3>
            {currentMatch.alliances.red.team_keys.map(teamKey => {
              const teamNumber = teamKey.replace('frc', '');
              return renderTeamButton(teamNumber, 'red');
            })}
          </div>
        </div>
      )}

      {/* Team Statistics */}
      {selectedTeam && (
        <div className={tableStyles.TableRow}>
          <div className={tableStyles.TableContainer}>
            <TeamStats
              information={tableData}
              gFilter=""
              regionalEvent={regional}
              teamHandler={handleTeamClick}
              selectedTeam={selectedTeam}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default QualsView;