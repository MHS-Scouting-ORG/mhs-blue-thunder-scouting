import React from 'react';
import EndGame from './EndGame';

/**
 * function for making the endgamebox
 * @param props obj from form component containing endGameVal, changeEndGameStartBox method, changeEndGameEndBox method              
 * @returns if endgame is not nil or none, returns a time tracker
 * @returns else, returns an empty div
 */
export function makeEndGameMiscElements(props) {
  let endGameVal = props.endGameVal;

  if (endGameVal === "Onstage") {
    return(
      <div>
        <label> {"Did robot kill itself"}
          <input type="checkbox"/>
          {/* make thing that makes a checkbox for if they hang faster than us */}
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
        makeEndGameMiscElements={makeEndGameMiscElements}
        value={endGameState}
      />
    </div>
  )
}