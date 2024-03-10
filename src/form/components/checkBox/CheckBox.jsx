import React from 'react';
import checkBox from './CheckBox.module.css';

function CheckBox(props) {

    return (
        <div>
            <label className={checkBox.Label} >{props.label + ': '}
                <input type="checkbox" checked={props.checked} onChange={props.changeState} />
            </label>
        </div>
    )
}

export default CheckBox;