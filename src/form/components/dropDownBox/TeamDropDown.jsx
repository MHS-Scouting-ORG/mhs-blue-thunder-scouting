import React from 'react';
import { PropTypes } from 'prop-types';
function TeamDropDown(props) {

    const setTeamNumber = function ({ target: { value } }) {
        props.changeState(`frc${value}`)
    }

    return !isNaN(parseInt(props.matchNumber)) ? (
        <div>
            <select onChange={({ target: { value } }) => props.changeState(value)}>
                {[<option value="" />].concat(props.teams.map((alliance) => <option key={alliance} value={alliance}> {alliance} </option>))}
            </select>
        </div>
    ) : (
        <div>
            <label> Team Number
                <input type='number' onChange={setTeamNumber} ></input>
            </label>
        </div>
    )
}

TeamDropDown.propTypes = {
    matchNumber: PropTypes.string,
    teamNumber: PropTypes.string,
    alliances: PropTypes.array,
    changeState: PropTypes.func,
}
export default TeamDropDown