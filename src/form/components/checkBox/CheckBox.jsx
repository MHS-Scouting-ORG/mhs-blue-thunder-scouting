import React from 'react';

function CheckBox(props) {

    return (
        <div>
            <label>{props.label + ': '}
                <input type="checkbox" checked={props.checked} onChange={props.changeState} />
            </label>
        </div>
    )
}

export default CheckBox;