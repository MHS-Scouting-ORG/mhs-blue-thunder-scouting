import React from "react";
import { PropTypes } from "prop-types";

class MatchDropDown extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div>
                <select onChange={this.props.setMatchType}>
                    <option value="q"> Qualification</option>
                    <option value="qf"> QuarterFinal </option>
                    <option value="sf"> SemiFinal </option>
                    <option value="f"> Final </option>
                </select>
                {this.props.children}
                <label> Match: </label>
                <input value={this.props.matchNumber} onChange={this.props.setMatchNumber}></input>
            </div>
        )
    }
}

MatchDropDown.propTypes = {
    matchTypeValue: PropTypes.string,
    matchNumber: PropTypes.string,
    setMatchType: PropTypes.func,
    setMatchNumber: PropTypes.func,
}

export default MatchDropDown;