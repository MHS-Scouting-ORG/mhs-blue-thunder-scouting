import React from 'react';
import { PropTypes } from 'prop-types';
function CounterBox({ minusButton, plusButton, index, state, label }) {

    return (
        <div>
            <label>{label}</label>
            <button onClick={() => minusButton(index)}>-</button>
            <input style={{ width: '10%', textAlign: 'center' }} type='number' min='0' id={index} readOnly={true} value={state} />
            <button onClick={() => plusButton(index)}>+</button>
        </div>
    );
}
//
CounterBox.propTypes = {
    label: PropTypes.string,
    index: PropTypes.number,
    state: PropTypes.number,
    minusButton: PropTypes.func,
    plusButton: PropTypes.func
}
export default CounterBox;