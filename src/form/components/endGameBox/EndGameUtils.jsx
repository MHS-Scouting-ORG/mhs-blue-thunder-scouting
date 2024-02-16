import React from 'react';
import EndGame from './EndGame';

/**
 * function for making the endgamebox
 * @param props obj from form component containing endGameVal, changeEndGameStartBox method, changeEndGameEndBox method              
 * @returns if endgame is not nil or none, returns a time tracker
 * @returns else, returns an empty div
 */
export function makeEndGameMisc(props, title, i) {
  let endGameVal = props.endGameVal;

  function changeBool(e) {
    props.changeState(i, e.target.checked)
  }

  if (endGameVal === "Onstage") {
    return(
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


/**
 * function for generating endgamedropdown component
 * @param props obj from form component containing endGameVal, changeEndgame method
 * @returns endgame component
 */
export function makeEndGameDropDown(props) {
  let endGameState = props.endGameVal

  function changeEndGame(event) {
    props.changeState(event.target.value);
  }

  return (
    <div>
      <EndGame
        changeEndGameUsed={changeEndGame}
        makeEndGameMisc={makeEndGameMisc}
        value={endGameState}
      />
    </div>
  )
}