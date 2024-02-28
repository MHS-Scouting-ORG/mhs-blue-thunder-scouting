import React from 'react';

import { PropTypes } from 'prop-types';

function DropDown(props) {
    let choices = ['']
    if(Array.isArray(props.choices)) {
        choices = choices.concat([...props.choices]);
    }

    function dropDownChanged(val) {
        if (props.isAPlacement) {
            props.changeDropDownState(parseInt(val))
        }

        else {
            props.changeDropDownState(val)
            if (val.trim() !== "Onstage") {
                if (props.changeHangsFaster === undefined || props.changeStagePosition === undefined) {
                    return
                }
                props.changeHangsFaster(false)
                props.changeStagePosition("None")
            }
        }
    }

    return (
        <div>
            <label>{props.title}</label>
            <select onChange={({ target : { value } }) => {
                dropDownChanged(value)
            }} value={props.value}>
                {choices.map((choice) => 
                    typeof(choice) !== 'object' ?
                    <option key={choice}>{choice}</option> : <option value={choice.value} key={choice.value}>{choice.label}</option> )}
            </select>
        </div>
    )
}

DropDown.propTypes = {
    title: PropTypes.string,
    choices: PropTypes.array,
    changeDropDownState: PropTypes.func,
    changeHangsFaster: PropTypes.func,
}

export default DropDown;