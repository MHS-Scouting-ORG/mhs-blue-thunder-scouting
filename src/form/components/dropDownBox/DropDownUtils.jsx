 
//  DROP DOWN COMPONENT UTILITY FUNCTIONS
//  (contains both regular dropdown AND matchdropdown)

import React from 'react';
import DropDown from './DropDown';
import MatchDropDown from './MatchDropDown';

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
  return (
    <div>
      <DropDown
        title={title}
        choices={option}
        index={i}
        value={dropDownStates[i]}
        changeDropDownState={props.changeState}
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