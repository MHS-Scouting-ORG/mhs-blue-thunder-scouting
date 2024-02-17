import React from "react";
import { PropTypes } from "prop-types";
import DropDown from "./DropDown";
function MatchDropDown(props) {
    return (
        <div>
            <DropDown
                title="Match Type"
                choices={[
                    { value: "q", label: "Qualification" }, 
                    { value: "qf", label: "QuarterFinal" }, 
                    { value: "sf", label: "SemiFinal" }, 
                    { value: "f", label: "Final" }
                ]}
                value={props.matchTypeValue}
                changeDropDownState={props.setMatchType}
            />
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