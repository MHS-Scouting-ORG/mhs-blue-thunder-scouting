import React from 'react';
import { PropTypes } from 'prop-types';
class CounterBox extends React.Component {
    constructor(props) {
        super(props);
        this.buttonMinus = this.buttonMinus.bind(this);
        this.buttonPlus = this.buttonPlus.bind(this);
    }

    buttonMinus() {
        this.props.minusButton(this.props.index);
    }

    buttonPlus() {
        this.props.plusButton(this.props.index);
    }

    render() {
        return (
            <div>
                <label>{this.props.label}</label>
                <button onClick={this.buttonMinus}>-</button>
                <input style={{ width: '10%', textAlign: 'center' }} type='number' min='0' id={this.props.index} readOnly={true} value={this.props.state} />
                <button onClick={this.buttonPlus}>+</button>
            </div>
        );
    }
}

CounterBox.propTypes = {
    label: PropTypes.string,
    index: PropTypes.number,
    state: PropTypes.number,
    minusButton: PropTypes.func,
    plusButton: PropTypes.func
}
export default CounterBox;