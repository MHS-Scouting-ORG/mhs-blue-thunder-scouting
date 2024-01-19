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
  let endGame = endGameValues[0];
  if (endGame !== "None" && endGame !== '') {
    if (endGame === "Attempted") {
      return (
        <div>
          <p>Match Timer EX:125 (1:25)</p>
          <label> {"End Game Start: "}
            <input value={props.endGameVal[1]} style={{ width: '10%' }} type="number" onChange={props.changeEndGameStartBox}></input>
          </label>
        </div>
      )
    } else if (endGame === 'Parked') {
      return <div></div>
    } else {
      return (
        <div>
          <div>
            <p style={{ fontSize: '14px' }}>Match Timer | EX Start: 25 (0:25), EX End: 3 (0:03)</p>
            <label> {"End Game Start: "}
              <input value={props.endGameVal[1]} style={{ width: '10%' }} type="number" onChange={props.changeEndGameStartBox}></input>
            </label>
          </div>
          <div>
            <label> {"End Game End: "}
              <input value={props.endGameVal[2]} style={{ width: '10%' }} type="number" onChange={props.changeEndGameEndBox}></input>
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
  return (
    <div>
      <EndGame
        changeEndGameUsed={props.changeEndGame}
        makeEndGameStartEndBox={makeEndGameStartEndBox}
        value={endGameState[0]}
      />
    </div>
  )
}

  // export function changeEndGameStartBox(event, endGame) {
  //   let endGame = props.endGameVal;
  //   endGame[1] = event.target.value;
  // }

  // export function changeEndGameEndBox(event, endGame) {
  //   let endGame = props.endGameVal;
  //   endGame[2] = event.target.value;
  // }