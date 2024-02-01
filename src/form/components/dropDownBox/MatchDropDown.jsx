import React from "react";

class MatchDropDown extends React.Component{
    constructor(props){
        super(props);
        this.changeMatchType = this.changeMatchType.bind(this);
        this.generateMatchTypeNum = this.generateMatchTypeNum.bind(this);
    }
    
    changeMatchType(event){
        let matchType = event.target.value;
        if( matchType === 'Qualification' ){
            this.props.setMatchType('q');
        } else if(matchType === 'QuarterFinal'){
            this.props.setMatchType('qf');
        } else if(matchType === 'SemiFinal'){
            this.props.setMatchType('sf');
        } else if(matchType === 'Final'){
            this.props.setMatchType('f');
        }
    }

    generateMatchTypeNum(){
        return(
            this.props.generateMatchTypeNum(this.props.matchTypeValue)
        )
    }


    render(){
        return(
            <div>
                <select onChange={this.changeMatchType}>
                    <option></option>
                    <option> Qualification</option>
                    <option> QuarterFinal </option>
                    <option> SemiFinal </option>
                    <option> Final </option>
                </select>
                {this.generateMatchTypeNum()}
                <label> Match: </label>
                <input value={this.props.matchNumber} onChange={this.props.setMatchNumber}></input>
            </div>
        )
    }
}

export default MatchDropDown;