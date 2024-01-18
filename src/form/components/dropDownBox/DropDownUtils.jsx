 
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
        setState={props.dropDownChanged}
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
  let matchTypeState = props.matchType
  let matchState = '';
  if (matchTypeState === 'q') {
    matchState = "Qualification";
  } else if (matchTypeState === 'qf') {
    matchState = "QuarterFinal";
  } else if (matchTypeState === 'sf') {
    matchState = "SemiFinal";
  } else if (matchTypeState === 'f') {
    matchState = "Final";
  }
  return (
    <div>
      <MatchDropDown //makes MatchDropDown via functions in Form component
        setMatchType={props.changeMatchType}
        setElmNum={props.changeElmNum} 
        generateMatchTypeNum={props.makeMatchTypeDropDown} 
        setMatchNumber={props.changeMatchNumber} 
        matchTypeValue={matchState} 
        matchNumber={props.matchNumber}
      />
    </div>
  )
}