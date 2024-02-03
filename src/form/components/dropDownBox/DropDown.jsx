import React from 'react';

import { PropTypes } from 'prop-types';

class DropDown extends React.Component{
//    constructor(props){
//        super(props);
//        this.dropDownChange = this.dropDownChange.bind(this);
//    }

//    dropDownChange(event){
//        this.props.changeDropDownState(event,this.props.index);
//    }

    render(){
        return (
            <div>
                <label>{this.props.title}</label>
                <select onChange={(event) => {
                    this.props.changeDropDownState(event, this.props.index);
                }} value={this.props.value}>
                    {this.props.choices.map((choice) => <option key={choice}>{choice}</option>)}
                </select>
            </div>
        )
    }
}

DropDown.propTypes = {
    title: PropTypes.string,
    choices: PropTypes.array,
    index: PropTypes.number,
    value: PropTypes.string,
    changeDropDownState: PropTypes.func
}

export default DropDown;