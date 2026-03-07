import React, { useEffect, useMemo, useState } from 'react';
import { apiGetMatchesForRegional, apiGetSimpleTeamsForRegional } from '../../../api';
import TeamStats from '../Tables/TeamStats';
import tableStyles from '../Table.module.css';

const OUR_TEAM_NUMBER = '2443';

function OurMatchesView({ tableData, regional }) {
  const [matches, setMatches] = useState([]);
  const [isOurTeamAtRegional, setIsOurTeamAtRegional] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMatchKey, setSelectedMatchKey] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!regional) {
        setMatches([]);
        setIsOurTeamAtRegional(false);
        setSelectedTeam(null);
        setSelectedMatchKey(null);
        return;
      }

      try {
        const [simpleTeams, allMatches] = await Promise.all([
          apiGetSimpleTeamsForRegional(regional),
          apiGetMatchesForRegional(regional)
        ]);

        const teamList = Array.isArray(simpleTeams) ? simpleTeams : [];
        const hasOurTeam = teamList.some(team => String(team?.team_number || team?.TeamNumber || '') === OUR_TEAM_NUMBER);
        setIsOurTeamAtRegional(hasOurTeam);

        const regionalMatches = Array.isArray(allMatches) ? allMatches : [];
        const ourQuals = regionalMatches
          .filter(match => match?.comp_level === 'qm')
          .filter(match => {
            const blueKeys = Array.isArray(match?.alliances?.blue?.team_keys) ? match.alliances.blue.team_keys : [];
            const redKeys = Array.isArray(match?.alliances?.red?.team_keys) ? match.alliances.red.team_keys : [];
            return [...blueKeys, ...redKeys].some(key => String(key).replace('frc', '') === OUR_TEAM_NUMBER);
          })
          .sort((a, b) => Number(a?.match_number || 0) - Number(b?.match_number || 0));

        setMatches(ourQuals);
        setSelectedTeam(null);
        setSelectedMatchKey(null);
      } catch (err) {
        console.log('Error loading Our Matches view data:', err);
        setMatches([]);
        setIsOurTeamAtRegional(false);
        setSelectedTeam(null);
        setSelectedMatchKey(null);
      }
    };

    loadData();
  }, [regional]);

  const statusMessage = useMemo(() => {
    if (!regional) return 'No regional selected.';
    if (!isOurTeamAtRegional) return `Team ${OUR_TEAM_NUMBER} is not at this regional.`;
    if (matches.length === 0) return `No qualification matches found yet for team ${OUR_TEAM_NUMBER}.`;
    return null;
  }, [regional, isOurTeamAtRegional, matches.length]);

  const renderTeamButton = (teamKey, alliance, matchKey) => {
    const teamNumber = String(teamKey).replace('frc', '');
    const isOurTeam = teamNumber === OUR_TEAM_NUMBER;
    const isSelected = selectedTeam === teamNumber && !isOurTeam;
    const cls = [
      tableStyles.AllianceButton,
      alliance === 'blue' ? tableStyles.AllianceButtonBlue : tableStyles.AllianceButtonRed
    ];

    if (isSelected) cls.push(tableStyles.AllianceButtonSelected);

    return (
      <button
        key={`${alliance}-${teamNumber}`}
        onClick={() => {
          if (!isOurTeam) {
            setSelectedTeam(teamNumber);
            setSelectedMatchKey(matchKey);
          }
        }}
        className={cls.join(' ')}
        style={{
          width: 'auto',
          minWidth: '72px',
          margin: '2px',
          padding: '8px 10px',
          ...(isOurTeam ? { borderWidth: '8px', borderStyle: 'solid', fontWeight: 800, cursor: 'default' } : { cursor: 'pointer' })
        }}
      >
        {teamNumber}{isOurTeam ? '' : ''}
      </button>
    );
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Our Matches</h2>

      <div className={tableStyles.Card}>
        {!statusMessage ? (
          <>
            <h3 className={tableStyles.SectionHeader} style={{ marginBottom: '15px' }}>
              Qualification Matches for Team {OUR_TEAM_NUMBER}
            </h3>

            {matches.map(match => {
              const matchKey = match?.key || `qm-${match?.match_number}`;
              const showStatsForMatch = selectedMatchKey === matchKey && selectedTeam;

              return (
                <div
                  key={matchKey}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '10px'
                  }}
                >
                <div style={{ textAlign: 'center', fontWeight: 700, marginBottom: '10px' }}>
                  Match {match?.match_number}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', columnGap: '16px', rowGap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '6px', fontWeight: 600, color: '#cc0000', fontSize: '14px' }}>Red</div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                      {(match?.alliances?.red?.team_keys || []).map(teamKey => renderTeamButton(teamKey, 'red', matchKey))}
                    </div>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '16px', textAlign: 'center' }}>VS</div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '6px', fontWeight: 600, color: '#0066cc', fontSize: '14px' }}>Blue</div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                      {(match?.alliances?.blue?.team_keys || []).map(teamKey => renderTeamButton(teamKey, 'blue', matchKey))}
                    </div>
                  </div>
                </div>

                {showStatsForMatch && (
                  <div style={{ marginTop: '12px', borderTop: '1px solid #ddd', paddingTop: '12px' }}>
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
            })}
          </>
        ) : (
          <p style={{ textAlign: 'center', margin: 0, fontWeight: 600 }}>{statusMessage}</p>
        )}
      </div>
    </div>
  );
}

export default OurMatchesView;