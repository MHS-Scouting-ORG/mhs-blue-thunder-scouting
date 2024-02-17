import React from 'react';

function CheckBox(props) {

//    const changeCheckBoxState = function ({ target: { checked } }) {
//        props.changeCheckBoxState([props.stateIndex, props.index], checked ? props.label : null);
//    }

    return (
        <div>
            <label>{props.label + ': '}
                <input type="checkbox" checked={props.checked} onChange={props.changeState} />
            </label>
        </div>
    )
}

export default CheckBox;