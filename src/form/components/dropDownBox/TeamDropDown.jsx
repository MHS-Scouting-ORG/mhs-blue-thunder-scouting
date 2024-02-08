import React from 'react';
import { PropTypes } from 'prop-types';
class TeamDropDown extends React.Component {
    constructor(props) {
        super(props);
        this.setTeamNumber = this.setTeamNumber.bind(this);
    }

    setTeamNumber({ target: { value } }) {
        this.props.changeState(`frc${value}`)
    }

    render() {
        return !isNaN(parseInt(this.props.matchNumber)) ? (
            <div>
                <select onChange={({ target: { value } }) => this.props.changeState(value)}>
                    {[<option value="" />].concat(this.props.teams.map((alliance) => <option key={alliance} value={alliance}> {alliance} </option>))}
                </select>
            </div>
        ) : (
            <div>
                <label> Team Number
                    <input type='number' onChange={this.setTeamNumber} ></input>
                </label>
            </div>
        )
    }
}

TeamDropDown.propTypes = {
    matchNumber: PropTypes.string,
    teamNumber: PropTypes.string,
    alliances: PropTypes.array,
    changeState: PropTypes.func,
}
export default TeamDropDown