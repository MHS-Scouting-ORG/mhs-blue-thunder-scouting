import React from 'react';

class TeamDropDown extends React.Component{
    constructor(props){
        super(props);
        this.setTeamNumber = this.setTeamNumber.bind(this);
    }

    setTeamNumber(event){
        this.props.changeState([5,0],'frc' + event.target.value)
    }

    render(){
        return parseInt(this.props.matchNumber) !== 0 ? (
            <div>
            <select onChange={this.props.changeTeam}>
                <option value={this.props.teamNumber}> {this.props.teamNumber} </option>
                {this.props.alliances.map((alliance) => <option key={alliance}> {alliance} </option>)}
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

export default TeamDropDown