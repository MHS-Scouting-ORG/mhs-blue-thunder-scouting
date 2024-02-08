import React from 'react';

class CheckBox extends React.Component {
    constructor(props) {
        super(props);
        this.changeCheckBoxState = this.changeCheckBoxState.bind(this);
    }

    changeCheckBoxState({ target: { checked } }) {
        if (checked) {
            this.props.changeCheckBoxState([this.props.stateIndex, this.props.index], this.props.label);
        }
        else {
            this.props.changeCheckBoxState([this.props.stateIndex, this.props.index], null);
        }
    }

    render() {
        return (
            <div>
                <label>{this.props.label.substring(0, this.props.label.length - 1) + ': '}</label>
                <input type="checkbox" checked={this.props.checked} onChange={this.changeCheckBoxState} id={this.props.label}></input>
            </div>
        )
    }
}

export default CheckBox;