 
//  DROP DOWN COMPONENT UTILITY FUNCTIONS
//  (contains both regular dropdown AND matchdropdown)

import React from 'react';
import DropDown from './DropDown';
import MatchDropDown from './MatchDropDown';
import TeamDropDown from './TeamDropDown';

/**
 * function for making regular dropdown boxes
 * @param props obj from form component containing matchType, matchNumber, changeMatchType, changeElmNum, makeMatchTypeDropDown, changeMatchNumber
 * @param title title that displays next to dropdown box
 * @param option array of options
 * @param i position in state array
 * @returns a MatchDropDownBox component
 */
export function makeDropDownBox(props, title, option, i) {
  let dropDownStates = props.dropDownVal;

  function dropDownChanged(event, i){
    props.changeState([14,i],event.target.value)
  }

  return (
    <div>
      <DropDown
        title={title}
        choices={option}
        index={i}
        value={dropDownStates[i]}
        changeDropDownState={dropDownChanged}
        stateIndex={14}
      />
    </div>
  )
}

/**
 * function for making the matchdropdown
 * @param props obj from form component containing matchType, matchNumber, changeMatchType, changeElmNum, makeMatchTypeDropDown, changeMatchNumber
 * @returns a MatchDropDownBox component
 */
export function makeMatchDropDown(props) {

  function changeElmNum(event){
    props.changeState([2,0], event.target.value)
  }

  function makeMatchTypeDropDown(matchType){
    if (matchType === 'qf' || matchType === 'sf' || matchType === 'f') {
      return (
        <input value={props.elmNum} onChange={changeElmNum} />
      )
    }
  }

  function changeMatchType(matchType){
    const savedMatchType = props.changeState([1,0], matchType)
    const savedResetTeams = props.changeState([6,-1],['team1', 'team2', 'team3', 'team4', 'team5', 'team6'],savedMatchType);
    const savedResetTeamNumber = props.changeState([5,0],"",savedResetTeams)

    if (matchType === 'q') {
      props.changeState([2,0],'',savedResetTeamNumber)
    }
  }

  function changeMatchNumber(event){
    props.changeState([3,0], event.target.value)
  }

  return (
    <div>
      <MatchDropDown //makes MatchDropDown via functions in Form component
        setMatchType={changeMatchType}
        generateMatchTypeNum={makeMatchTypeDropDown} 
        setMatchNumber={changeMatchNumber} 
        matchNumber={props.matchNumber}
        matchTypeValue={props.matchType}
      />
    </div>
  )

}

export function makeTeamDropDown(props) {
  
  function changeTeam(event){
    // this.setState({ teamNumber: event.target.value });
    const savedTeamNumber = props.changeState([5,0],event.target.value)
    let data = props.matchData;
    let teamColor = 'red';
    let selectedTeam = event.target.value;
    data.alliances.blue.team_keys.map((team) => {
      if (team === selectedTeam) {
        teamColor = 'blue';
      }
    })

    let whoWon = '';

    if (data.alliances.blue.score > data.alliances.red.score) {
      whoWon = 'blue';
    } else if (data.alliances.blue.score < data.alliances.red.score) {
      whoWon = 'red';
    } else {
      whoWon = 'Tie';
    }

    let rankingStates = props.rankingStates;
    let savedRankingPoints;

    if (teamColor === whoWon) {
      // this.setState({ rankingPts: 2 });
      savedRankingPoints = props.changeState([11,0],2,savedTeamNumber)
      rankingStates[0] = "Team Won ";
    } else if (whoWon === 'Tie') {
      // this.setState({ rankingPts: 1 });
      savedRankingPoints = props.changeState([11,0],1,savedTeamNumber)
      rankingStates[0] = "Team Tied ";
    } else if ((whoWon === 'blue' || whoWon === 'red') && teamColor !== whoWon) {
      // this.setState({ rankingPts: 0 });
      savedRankingPoints = props.changeState([11,0],0,savedTeamNumber)
      rankingStates[0] = "Team Lost ";
    }

    rankingStates[1] = '';
    rankingStates[2] = '';
    // this.setState({ whoWon: whoWon });
    const savedRankingStates = props.changeState([12,-1],rankingStates,savedRankingPoints)
    props.changeState([10,0],whoWon,savedRankingStates)
  }

  return (
    <div>
      <TeamDropDown
        matchNumber = {props.matchNumber}
        teamNumber = {props.teamNumber}
        alliances = {props.teams}
        changeTeam = {changeTeam}
        changeState = {props.changeState}
      />
    </div>
  )
}