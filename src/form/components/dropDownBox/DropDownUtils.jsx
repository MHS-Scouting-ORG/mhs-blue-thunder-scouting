 
//  DROP DOWN COMPONENT UTILITY FUNCTIONS
//  (contains both regular dropdown AND matchdropdown)

import React from 'react';
import DropDown from './DropDown';
import MatchDropDown from './MatchDropDown';

/* REGULAR DROPDOWN */



/* MATCH DROPDOWN */

/**
 * function for making the matchdropdown
 * @param {*} props passes down the form component
 * @returns 
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
        matchNumber={props.state.matchNumber}
      />
    </div>
  )
}