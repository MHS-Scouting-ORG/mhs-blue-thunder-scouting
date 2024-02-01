import React from 'react';

class DropDown extends React.Component{
    constructor(props){
        super(props);
        this.dropDownChange = this.dropDownChange.bind(this);
    }

    dropDownChange(event){
        this.props.changeDropDownState(event,this.props.index);
    }

    render(){
        return (
            <div>
                <label>{this.props.title}</label>
                <select onChange={this.dropDownChange}>
                    <option key={"empty"} value={this.props.value}> {this.props.value} </option>
                    {this.props.choices.map((choice) => <option key={choice}>{choice}</option>)}
                </select>
            </div>
        )
    }
}

export default DropDown;