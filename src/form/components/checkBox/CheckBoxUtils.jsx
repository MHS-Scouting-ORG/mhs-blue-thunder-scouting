import React from "react";
import CheckBox from "./CheckBox";


function factFunction(props, name, stateIndex, index) {
  return function( { target : { checked } }) {
    props.changeState([stateIndex, index], checked ? name : null);
  }
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
  return (
    <div>
      <CheckBox
        label={name}
        changeState={factFunction(props, name, 16, i)}
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
export function makeBooleanCheckBox(props, name) {
  let bool = props.booleans;

  function changeBooleanCheckBox({ target : { checked } }){
    props.changeState(checked)
  }

  return (
    <div>
      <CheckBox
        label={name}
        changeState={changeBooleanCheckBox}
        checked={bool}
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
        changeState={factFunction(props, name, 13, i)}
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
  let bonusChecked = props.bonusStatus[i];

  return (
    <div>
      <CheckBox
        label={name}
        changeState={({ target: { checked }}) => props.changeState(i, checked, name)}
        checked={bonusChecked}
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

  function overrideClicked({ target : { checked } }){
    props.changeState(checked)
  }

  return (
    <div>
      <CheckBox
        label={"Overide "}
        changeState={overrideClicked}
        checked={props.override}
      />
    </div>
  )
}