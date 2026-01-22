import React, { useState } from 'react';
import TeamStats from '../Tables/TeamStats';
import tableStyles from '../Table.module.css';

function ElimsView({ tableData, regional, teamsClicked, setTeamsClicked }) {
  const [blueTeams, setBlueTeams] = useState(['', '', '']);
  const [redTeams, setRedTeams] = useState(['', '', '']);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleTeamInputChange = (alliance, index, value) => {
    if (alliance === 'blue') {
      const newTeams = [...blueTeams];
      newTeams[index] = value;
      setBlueTeams(newTeams);
    } else {
      const newTeams = [...redTeams];
      newTeams[index] = value;
      setRedTeams(newTeams);
    }
  };

  const handleTeamClick = (teamNumber) => {
    if (!teamNumber) return;
    setSelectedTeam(teamNumber);
  };

  const renderTeamInput = (alliance, index) => {
    const teamNumber = alliance === 'blue' ? blueTeams[index] : redTeams[index];
    const isSelected = selectedTeam === teamNumber;

    return (
      <div key={`${alliance}-${index}`} style={{ margin: '5px' }}>
        <input
          type="text"
          placeholder={`Team ${index + 1}`}
          value={teamNumber}
          onChange={(e) => handleTeamInputChange(alliance, index, e.target.value)}
          style={{
            padding: '10px',
            width: '100px',
            border: `2px solid ${alliance === 'blue' ? '#0066cc' : '#cc0000'}`,
            borderRadius: '5px',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: isSelected ? '#007bff' : alliance === 'blue' ? '#cce5ff' : '#ffcccc',
            color: isSelected ? 'white' : 'black'
          }}
        />
        {teamNumber && (
          <button
            onClick={() => handleTeamClick(teamNumber)}
            style={{
              marginLeft: '5px',
              padding: '10px',
              backgroundColor: isSelected ? '#0056b3' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {isSelected ? 'Selected' : 'View Stats'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2>Elimination Matches</h2>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
        {/* Blue Alliance */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '50px' }}>
          <h3 style={{ color: '#0066cc' }}>Blue Alliance</h3>
          {blueTeams.map((_, index) => renderTeamInput('blue', index))}
        </div>

        {/* VS */}
        <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 20px' }}>VS</div>

        {/* Red Alliance */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '50px' }}>
          <h3 style={{ color: '#cc0000' }}>Red Alliance</h3>
          {redTeams.map((_, index) => renderTeamInput('red', index))}
        </div>
      </div>

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

      {/* Instructions */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>Instructions:</h4>
        <p>1. Enter team numbers manually for each alliance position</p>
        <p>2. Click "View Stats" to see team statistics and performance data</p>
        <p>3. Selected teams will be highlighted and their stats displayed below</p>
        <p>4. Data is pulled from previously submitted scouting forms and uploads</p>
      </div>
    </div>
  );
}

export default ElimsView;