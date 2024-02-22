import React from 'react';
import { PropTypes } from 'prop-types';
function CounterBox({ minusButton, plusButton, state, label }) {

    return (
        <div>
            <label>{label}</label>
            <button onClick={() => minusButton()}>-</button>
            <input style={{ width: '10%', textAlign: 'center' }} type='number' min='0' readOnly={true} value={state} />
            <button onClick={() => plusButton()}>+</button>
        </div>
    );
}

CounterBox.propTypes = {
    label: PropTypes.string,
    state: PropTypes.number,
    minusButton: PropTypes.func,
    plusButton: PropTypes.func
}
export default CounterBox;