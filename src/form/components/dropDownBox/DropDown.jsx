import React from 'react';

import { PropTypes } from 'prop-types';

function DropDown(props) {
    let choices = [...props.choices]
    choices = [''].concat(choices)

    return (
        <div>
            <label>{props.title}</label>
            <select onChange={({ target : { value } }) => {
                props.changeDropDownState(value);
            }} value={props.value}>
                {choices.map((choice) => <option key={choice}>{choice}</option>)}
            </select>
        </div>
    )
}

DropDown.propTypes = {
    title: PropTypes.string,
    choices: PropTypes.array,
    value: PropTypes.string,
    changeDropDownState: PropTypes.func
}

export default DropDown;