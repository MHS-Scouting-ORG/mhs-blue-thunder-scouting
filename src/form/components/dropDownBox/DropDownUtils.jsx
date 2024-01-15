 
//  DROP DOWN COMPONENT UTILITY FUNCTIONS
//  (contains both regular dropdown AND matchdropdown)

import React from 'react';
import DropDown from './DropDown';
import MatchDropDown from './MatchDropDown';

/* REGULAR DROPDOWN */



/* MATCH DROPDOWN */

/**
 * function for making the matchdropdown
 * @param {*} matchTypeState [STRING] state of matchType (q, qf, sf, f) from Form
 * @param {*} matchNumber [NUM] state of matchNumber from Form
 * @param {*} changeMatchType [FUNCTION] changeMatchType function from Form
 * @param {*} changeElmNum [FUNCTION] changeElmNum function from Form
 * @param {*} makeMatchTypeDropDown [FUNCTION] makeMatchTypeDropDown function from Form
 * @param {*} changeMatchNumber [FUNCTION] changeMatchNumber function from Form
 * @returns 
 */
export function makeMatchDropDown(matchTypeState, matchNumber, changeMatchType, changeElmNum, makeMatchTypeDropDown, changeMatchNumber) {
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
        <MatchDropDown //makes MatchDropDown component from given params
          setMatchType={changeMatchType} //calls to changeMatchType method from the form class
          setElmNum={changeElmNum} //calls to changeElmNum method from the form class
          generateMatchTypeNum={makeMatchTypeDropDown} //calls to makeMatchTypeDropDown method from the form class
          setMatchNumber={changeMatchNumber} //calls to changeMatchNumber method from the form class
          matchTypeValue={matchState} //obtains matchstate (i.e. 'qualification', 'quarterfinal', etc. )
          matchNumber={matchNumber} //obtains matchNumber from param
        />
      </div>
    )
}

// function changeMatchType(event) {
//   let matchType = event;
//   if (matchType === 'q') {
//     this.setState({ elmNum: '' });
//   }
//   this.setState({ matchType: event });
//   this.setState({ teams: ['team1', 'team2', 'team3', 'team4', 'team5', 'team6'] });
//   this.setState({ teamNumber: ' ' });
// }

// function changeElmNum(event) {
//   this.setState({ elmNum: (event.target.value) });
//   this.setState({ teams: ['team1', 'team2', 'team3', 'team4', 'team5', 'team6'] });
//   this.setState({ teamNumber: ' ' });
// }

// function changeMatchNumber(event) {
//   if (event.target.value !== 0) {
//     this.setState({ override: false })
//   }
//   this.setState({ matchNumber: event.target.value });
//   this.setState({ teams: ['team1', 'team2', 'team3', 'team4', 'team5', 'team6'] });
//   this.setState({ teamNumber: ' ' });
// }

// function makeMatchTypeDropDown(matchType) {
//   if (matchType === 'qf' || matchType === 'sf' || matchType === 'f') {
//     return (
//       <input value={this.state.elmNum} onChange={this.changeElmNum} />
//     )
//   }
// }