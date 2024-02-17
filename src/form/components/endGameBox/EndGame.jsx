import React from "react";
import { PropTypes } from 'prop-types';

function Endgame(props) {

    return (
        <div>
            <label> {"⛓️End Game: "}
                <select onChange={e => props.changeEndGameUsed(e)}>
                    <option value={props.value}> {props.value} </option>
                    <option value='Onstage'>Onstage</option>
                    <option value='Attempted'>Attempted</option>
                    <option value='None'>None</option>
                </select>
            </label>
        </div>
    )
}

Endgame.propTypes = {
    value: PropTypes.String
}

export default Endgame