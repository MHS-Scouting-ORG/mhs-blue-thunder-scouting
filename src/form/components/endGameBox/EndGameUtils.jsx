import React from 'react';
import EndGame from './components/endGameBox/EndGame';

/**
 * function for making the endgamebox
 * @param props obj from form component containing endGameVal,              
 * @returns 
 */
export function makeEndGameStartEndBox(props) {
    let endGameValues = this.state.endGameVal;
    let endGame = endGameValues[0];
    if (endGame !== "None" && endGame !== '') {
      if (endGame === "Attempted") {
        return (
          <div>
            <p>Match Timer EX:125 (1:25)</p>
            <label> {"End Game Start: "}
              <input value={this.state.endGameVal[1]} style={{ width: '10%' }} type="number" onChange={changeEndGameStartBox}></input>
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
                <input value={this.state.endGameVal[1]} style={{ width: '10%' }} type="number" onChange={this.changeEndGameStartBox}></input>
              </label>
            </div>
            <div>
              <label> {"End Game End: "}
                <input value={this.state.endGameVal[2]} style={{ width: '10%' }} type="number" onChange={this.changeEndGameEndBox}></input>
              </label>
            </div>
          </div>
        )
      }
    } else {
      return <div></div>;
    }
  }

  export function makeEndGameDropDown() {
    let endGameState = this.state.endGameVal
    return (
      <div>
        <EndGame
          changeEndGameUsed={this.changeEndGame}
          makeEndGameStartEndBox={this.makeEndGameStartEndBox}
          value={endGameState[0]}
        />
      </div>
    )
  }

  export function changeEndGameStartBox(event, endGame) {
    let endGame = this.state.endGameVal;
    endGame[1] = event.target.value;
  }

  export function changeEndGameEndBox(event, endGame) {
    let endGame = this.state.endGameVal;
    endGame[2] = event.target.value;
  }