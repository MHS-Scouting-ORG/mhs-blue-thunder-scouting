
//  DROP DOWN COMPONENT UTILITY FUNCTIONS
//  (contains both regular dropdown AND matchdropdown)

import React from 'react';
import DropDown from './DropDown';
import MatchDropDown from './MatchDropDown';
import TeamDropDown from './TeamDropDown';
import { PropTypes } from 'prop-types';
/**
 * function for making regular dropdown boxes
 * @param props obj from form component containing matchType, matchNumber, changeMatchType, changeElmNum, makeMatchTypeDropDown, changeMatchNumber
 * @param title title that displays next to dropdown box
 * @param option array of options
 * @param i position in state array
 * @returns a MatchDropDownBox component
 */
export function makeAutoPlacementDropDownBox(props, title, option) {
  let placement = props.autoPlacementVal;

//
  return (
    <div>
      <DropDown
        title={title}
        choices={option}
        value={placement}
        changeDropDownState={props.changeState}
      />
    </div>
  )
}

makeAutoPlacementDropDownBox.propTypes = {
  dropDownVal: PropTypes.array,
  changeState: PropTypes.func,
  title: PropTypes.string,
  option: PropTypes.array,
  i: PropTypes.number
}

/**
 * function for making the matchdropdown
 * @param props obj from form component containing matchType, matchNumber, changeMatchType, changeElmNum, makeMatchTypeDropDown, changeMatchNumber
 * @returns a MatchDropDownBox component
 */
export function makeMatchDropDown(props) {
  function makeMatchTypeDropDown(matchType) {
    if (matchType === '') { //init
      props.changeState('q', 'matchType')
    }
    if (matchType === 'qf' || matchType === 'sf' || matchType === 'f') {
      return (
        <input value={props.elmNum} onChange={({ target: { value } }) => {
          props.changeState(value, 'elmNum')
        }}/>
      )
    }
  }

  function setMatchType(matchType) {
    if (matchType === "q") {
      props.changeState(matchType, 'matchType')
      props.changeState('', 'elmNum')
    }
    else if (matchType === "qf" || matchType === "sf" || matchType === "f") {
      props.changeState(matchType, 'matchType')
    }
  }

  return (
    <div>
      <MatchDropDown //makes MatchDropDown via functions in Form component
        setMatchType={setMatchType}
        generateMatchTypeNum={makeMatchTypeDropDown}
        setMatchNumber={({ target: { value } }) => props.changeState(value, 'matchNumber')}
        matchNumber={props.matchNumber}
        matchTypeValue={props.matchType}
      >
        {makeMatchTypeDropDown(props.matchType)}
      </MatchDropDown>
    </div>
  )

}

makeMatchDropDown.propTypes = {
  matchType: PropTypes.string,
  matchNumber: PropTypes.string,
  elmNum: PropTypes.string,
  changeState: PropTypes.func
}

export function makeTeamDropDown(props) {

  return (
    <div>
      <TeamDropDown
        {...props}
      />
    </div>
  )
}

makeTeamDropDown.propTypes = {
  matchNumber: PropTypes.string,
  teamNumber: PropTypes.string,
  teams: PropTypes.object,
  changeState: PropTypes.func
}