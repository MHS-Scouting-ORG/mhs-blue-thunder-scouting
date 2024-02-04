import React from "react";
import { PropTypes } from "prop-types";

class MatchDropDown extends React.Component{
    constructor(props){
        super(props);
//        this.changeMatchType = this.changeMatchType.bind(this);
//        this.generateMatchTypeNum = this.generateMatchTypeNum.bind(this);
    }
    
 //   changeMatchType({ target: { value } }){
 //       this.props.setMatchType(value);
 //   }
//        let matchType = event.target.value;
//        if( matchType === 'Qualification' ){
//            this.props.setMatchType('q');
//        } else if(matchType === 'QuarterFinal'){
//            this.props.setMatchType('qf');
//        } else if(matchType === 'SemiFinal'){
//            this.props.setMatchType('sf');
//        } else if(matchType === 'Final'){
//            this.props.setMatchType('f');
//        }
    

//    generateMatchTypeNum(){
//        return(
//            this.props.generateMatchTypeNum(this.props.matchTypeValue)
//        )
//    }


    render(){
        return(
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