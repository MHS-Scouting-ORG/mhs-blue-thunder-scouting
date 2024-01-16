import React from "react";
import CheckBox from "./CheckBox";

export function makeWhoWonBox(props, name, i) {
    let rankingStates = props.state.rankingState;
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

export function makeStrategyBox(props, name, i) {
    let strategyState = props.state.strategyVal;
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