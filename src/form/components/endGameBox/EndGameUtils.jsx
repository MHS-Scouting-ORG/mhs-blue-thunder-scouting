import React from 'react';
//import EndGame from './EndGame';
import DropDown from '../dropDownBox/DropDown';
import RadioButton from '../radiobuttons/RadioButton';
import { Radio } from '@aws-amplify/ui-react';

export function makeEndGameMiscCheckbox(props, title, i) {
  let endGameVal = props.endGameVal;

  function changeBool(e) {
    props.changeState(e.target.checked)
  }

  if (endGameVal === "Onstage") {
    return (
      <div>
        <label> {title}:
          <input type="checkbox" onChange={e => changeBool(e)}></input>
        </label>
      </div>
    )
  }
  else {
    return <div></div>;
  }
}

export function makeEndGameMiscRadio(props, title) {
  let endGameVal = props.endGameVal;

  if (endGameVal === "Onstage") {
    return (
      <div>
        <p>{title}</p>
        <RadioButton
          label="startingPosition"
          options={[
            { value: 'Left', label: "Left" },
            { value: 'Right', label: "Right" },
            { value: 'Center', label: "Center" },
          ]}
          changeState={props.changeState}
          selected={props.stagePosition}
        />
      </div>

    )
  }
  else {
    return <div></div>;
  }
}


/**
 * function for generating endgamedropdown component
 * @param props obj from form component containing endGameVal, changeEndgame method
 * @returns endgame component
 */
export function makeEndGameDropDown(props) {
  let endGameState = props.endGameVal

  function changeEndGame(value) {
    props.changeState(value);
  }

  function changeHangsFaster(value) {
    props.changeHangsFaster(value)
  }

  function changeStagePosition(value) {
    props.changeStagePosition(value)
  }

  return (
    <div>
      <DropDown
        title="⛓️End Game"
        choices={["Onstage", "Attempted", "Parked", "None"]}

        value={endGameState}

        changeDropDownState={changeEndGame}
        changeHangsFaster={changeHangsFaster}
        changeStagePosition={changeStagePosition}
        isAPlacement={false}
      />
    </div>
  )

  //  return (
  //    <div>
  //      <EndGame
  //        changeEndGameUsed={changeEndGame}
  //        makeEndGameMisc={makeEndGameMisc}
  //        value={endGameState}
  //      />
  //    </div>
  //  )
}