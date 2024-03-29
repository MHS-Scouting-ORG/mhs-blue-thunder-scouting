import React from 'react';
import { PropTypes } from 'prop-types';
import DropDown from './DropDown';
function TeamDropDown(props) {

    const setTeamNumber = function ({ target: { value } }) {
        props.changeState(`frc${value}`)
    }

    return !isNaN(parseInt(props.matchNumber)) ? (
        <div>
            <DropDown
                title="Team: "
                choices={props.teams}
                value={props.teamNumber}
                changeDropDownState={props.changeState}
                isAPlacement={false}
            />
        </div>
    ) : (
        <div>
            <label> Team Number:
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