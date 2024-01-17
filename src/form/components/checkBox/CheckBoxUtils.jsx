import React from "react";
import CheckBox from "./CheckBox";

/* WhoWon Box */

/**
 * function for making the whoWon box
 * @param props obj from form component containing rankingState, whoWonClicked method
 * @param name text that displays next to checkbox
 * @param i array position
 * @returns checkbox component
 */
export function makeWhoWonBox(props, name, i) {
  let rankingStates = props.rankingState;
    let checkVal;
    if (rankingStates[0] === name) {
      checkVal = true;
    } else {
      checkVal = false;
    }
    return (
      <div>
        <CheckBox
          label={name}
          changeCheckBoxState={props.whoWonClicked}
          place={i}
          checked={checkVal}
        />
      </div>
    )
  }

/**
 * function for making the strategy box
 * @param props obj from form component containing strategyVal, strategyBoxChanged method
 * @param name text that displays next to checkbox
 * @param i array position
 * @returns checkbox component
 */
export function makeStrategyBox(props, name, i) {
  let strategyState = props.strategyVal;
  let checkedVal;
  if (strategyState[i] === name) {
  checkedVal = true;
  } else {
    checkedVal = false;
  }
  return (
    <div>
      <CheckBox
        label={name}
        changeCheckBoxState={props.strategyBox}
        place={i}
        checked={checkedVal}
      />
    </div>
  )
}

/**
 * function for making boolean boxes (mobility, smartplacement)
 * @param props obj from form component containing booleans, changeBooleanCheckBox method
 * @param name text that displays next to checkbox
 * @param i array position
 * @returns checkbox component
 */
export function makeBooleanCheckBox(props, name, i) {
  let booleanStates = props.booleans;
  return (
    <div>
      <CheckBox
        label={name}
        changeCheckBoxState={props.changeBooleanCheckBox}
        place={i}
        checked={booleanStates[i]}
      />
    </div>
  )
}

/**
 * function for making penalty boxes
 * @param props obj from form component containing penaltyVal, penaltyBoxChecked method
 * @param name text that displays next to checkbox
 * @param i array position
 * @returns checkbox component
 */
export function makePenaltyBox(props, name, i) {
  let penaltyStates = props.penaltyVal;
  let checkedVal;
  if (penaltyStates[i] === name) {
    checkedVal = true;
  } else {
    checkedVal = false
  }
  return (
    <div>
      <CheckBox
        label={name}
        changeCheckBoxState={props.penaltyBoxChecked}
        place={i}
        checked={checkedVal}
      />
    </div>
  )
}

/**
 * function for making bonus boxes
 * @param props obj from form component containing booleans, changeBooleanCheckBox method
 * @param name text that displays next to checkbox
 * @param i array position
 * @returns checkbox component
 */
export function makeBonusBox(props, name, i) {
  let rankingState = props.rankingState;
  let checkedVal;
  if (rankingState[i] === name) {
    checkedVal = true;
  }
  else {
    checkedVal = false;
  }
  return (
    <div>
      <CheckBox
        label={name}
        changeCheckBoxState={props.bonusBoxChecked}
        place={i}
        checked={checkedVal}
      />
    </div>
  )
}

/**
 * function for making override boxes
 * @param props obj from form component containing override bool, overrideChange method
 * @param name text that displays next to checkbox
 * @param i array position
 * @returns checkbox component
 */
export function makeOverrideBox(props) {
  let overrideState = props.override;
  return (
    <div>
      <CheckBox
        label={"Overide "}
        changeCheckBoxState={props.overrideChange}
        checked={overrideState}
      />
    </div>
  )
}