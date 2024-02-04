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
  let data = props.matchData
  let rankingStates = props.rankingState

  let savedRankingPts;
  function whoWonClicked(){
    if (data === "not found") {
      window.alert("PICK A TEAM FIRST");
    }
    else {
      if (rankingStates[0] === name) {
        savedRankingPts = props.changeState([11,0],0)
        rankingStates[0] = '';
      }
      else if (rankingStates[0] !== name) {
        rankingStates[0] = name;

        console.log('HELL YEAH')
        if (name === "Team Won ") {
          // this.setState({ rankingPts: 2 })\
          savedRankingPts = props.changeState([11,0],2)
          console.log("won")
        }
        else if (name === "Team Tied ") {
          // this.setState({ rankingPts: 1 })\
          savedRankingPts = props.changeState([11,0],1)
          console.log("tied")
        }
        else if (name === "Team Lost ") {
          // this.setState({ rankingPts: 0 })\
          savedRankingPts = props.changeState([11,0],0)
          console.log("lost")
        }
        
      }

      rankingStates[1] = '';
      rankingStates[2] = '';

      // this.setState({ rankingState: rankingStates })
      props.changeState([12,-1], rankingStates,savedRankingPts)
    }
  }

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
        changeCheckBoxState={whoWonClicked}
        index={i}
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
    props.changeState([17,i],booleanStates[i])
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

  function bonusBoxChecked(){
    let ranking = rankingState.slice();
    let savedRankingPts;
    if (ranking[i] === name) {
      // this.setState({ rankingPts: this.state.rankingPts - 1 });
      savedRankingPts = props.changeState([11,0], rankingPts - 1)
    } else {
      // this.setState({ rankingPts: this.state.rankingPts + 1 });
      savedRankingPts = props.changeState([11,0], rankingPts + 1)
    }

    if (ranking[i] === name) {
      ranking[i] = ' ';
    } else {
      ranking[i] = name;
    }

    // this.setState({ rankingState: ranking })
    console.log("ranking state" + ranking)
    props.changeState([12,-1],ranking,savedRankingPts)
  }

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
        changeCheckBoxState={bonusBoxChecked}
        index={i}
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