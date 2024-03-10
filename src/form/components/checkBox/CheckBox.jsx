import React from 'react';
import checkBox from './CheckBox.module.css';

function CheckBox(props) {

//    const changeCheckBoxState = function ({ target: { checked } }) {
//        props.changeCheckBoxState([props.stateIndex, props.index], checked ? props.label : null);
//    }

    return (
        <div>
            <label className={checkBox.Label} >{props.label + ': '}
                <input type="checkbox" checked={props.checked} onChange={props.changeState} />
            </label>
        </div>
    )
}

export default CheckBox;