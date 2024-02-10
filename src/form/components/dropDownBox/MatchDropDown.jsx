import React from "react";
import { PropTypes } from "prop-types";

function MatchDropDown(props) {
    return (
        <div>
            <select onChange={props.setMatchType}>
                <option value="q"> Qualification</option>
                <option value="qf"> QuarterFinal </option>
                <option value="sf"> SemiFinal </option>
                <option value="f"> Final </option>
            </select>
            {props.children}
            <label> Match: </label>
            <input value={props.matchNumber} onChange={props.setMatchNumber}></input>
        </div>
    )
}

MatchDropDown.propTypes = {
    matchTypeValue: PropTypes.string,
    matchNumber: PropTypes.string,
    setMatchType: PropTypes.func,
    setMatchNumber: PropTypes.func,
}

export default MatchDropDown;