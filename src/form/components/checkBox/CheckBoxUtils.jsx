import React from "react";
import CheckBox from "./CheckBox";



/**
 * function for making the strategy box
 * @param props obj from form component containing strategyVal, strategyBoxChanged method
 * @param name text that displays next to checkbox
 * @param i array position
 * @returns checkbox component
 */
export function makeStrategyBox(props, name, i) {
  let strategyState = props.strategyVal;
  return (
    <div>
      <CheckBox
        label={name}
        changeCheckBoxState={props.changeState}
        stateIndex={16}
        index={i}
        checked={strategyState[i] === name}
      />
    </div>
  )
}

/**
 * function for making boolean boxes (mobility, smartindexment)
 * @param props obj from form component containing booleans, changeBooleanCheckBox method
 * @param name text that displays next to checkbox
 * @param i array position
 * @returns checkbox component
 */
export function makeBooleanCheckBox(props, name, i) {
  let booleanStates = props.booleans;

  function changeBooleanCheckBox(){
    booleanStates[i] = !booleanStates[i]
    props.changeState(i,booleanStates[i])
  }

  return (
    <div>
      <CheckBox
        label={name}
        changeCheckBoxState={changeBooleanCheckBox}
        index={i}
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
  return (
    <div>
      <CheckBox
        label={name}
        changeCheckBoxState={props.changeState}
        stateIndex={13}
        index={i}
        checked={penaltyStates[i] === name}
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
  let rankingPts = props.rankingPoints

  return (
    <div>
      <CheckBox
        label={name}
        changeCheckBoxState={(_, label) => props.changeState(i, name, label && label.length > 0)}
        index={i}
        checked={rankingState[i] === name}
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

  function overrideClicked(){
    props.changeState([7,0],!overrideState)
  }

  return (
    <div>
      <CheckBox
        label={"Overide "}
        changeCheckBoxState={overrideClicked}
        checked={overrideState}
      />
    </div>
  )
}