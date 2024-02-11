import React from 'react';

function CheckBox(props) {

    const changeCheckBoxState = function ({ target: { checked } }) {
        props.changeCheckBoxState([props.stateIndex, props.index], checked ? props.label : null);
    }

    return (
        <div>
            <label>{props.label.substring(0, props.label.length - 1) + ': '}
                <input type="checkbox" checked={props.checked} onChange={changeCheckBoxState} />
            </label>
        </div>
    )
}

export default CheckBox;