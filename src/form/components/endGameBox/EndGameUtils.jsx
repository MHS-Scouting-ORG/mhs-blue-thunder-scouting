import React from 'react';
import EndGame from './EndGame';

/**
 * function for making the endgamebox
 * @param props obj from form component containing endGameVal, changeEndGameStartBox method, changeEndGameEndBox method              
 * @returns if endgame is not nil or none, returns a time tracker
 * @returns else, returns an empty div
 */
export function makeEndGameStartEndBox(props) {
  let endGameValues = props.endGameVal;

  function changeEndGameStartBox(event) {
    props.changeState(1, event.target.value);
  }

  function changeEndGameEndBox(event) {
    props.changeState(2, event.target.value);
  }

  let endGame = endGameValues[0];
  if (endGame !== "None" && endGame !== '') {
    if (endGame === "Attempted") {
      return (
        <div>
          <p>Match Timer EX:125 (1:25)</p>
          <label> {"End Game Start: "}
            <input value={props.endGameVal[1]} type="number" onChange={changeEndGameStartBox}></input>
          </label>
        </div>
      )
    } else if (endGame === 'Parked') {
      return <div></div>
    } else {
      return (
        <div>
          <div>
            <p>Match Timer | EX Start: 25 (0:25), EX End: 3 (0:03)</p>
            <label> {"End Game Start: "}
              <input value={props.endGameVal[1]} type="number" onChange={changeEndGameStartBox}></input>
            </label>
          </div>
          <div>
            <label> {"End Game End: "}
              <input value={props.endGameVal[2]} type="number" onChange={changeEndGameEndBox}></input>
            </label>
          </div>
        </div>
      )
    }
  } else {
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
    props.changeState(0, event.target.value);
  }

  return (
    <div>
      <EndGame
        changeEndGameUsed={changeEndGame}
        makeEndGameStartEndBox={makeEndGameStartEndBox}
        value={endGameState[0]}
      />
    </div>
  )
}