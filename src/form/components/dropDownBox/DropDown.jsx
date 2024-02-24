import React from 'react';

import { PropTypes } from 'prop-types';

function DropDown(props) {
    let choices = ['']
    if(Array.isArray(props.choices)) {
        choices = choices.concat([...props.choices]);
    }

    function checkOffOnstage(val) {
        if (val.trim() !== "Onstage") {
            props.changeHangsFaster(false)
        }
    }

    return (
        <div>
            <label>{props.title}</label>
            <select onChange={({ target : { value } }) => {
                props.changeDropDownState(value);
                checkOffOnstage(value);
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
    changeHangsFaster: PropTypes.func
}

export default DropDown;