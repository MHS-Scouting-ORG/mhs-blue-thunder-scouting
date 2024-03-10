import React from 'react';
import tableStyling from '../Table.module.css';

class Checkbox extends React.Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            checked: true
        }
    }

    handleChange(){
        this.setState({checked: !this.state.checked});
        this.props.changeState(this.state.checked, this.props.value, this.props.id);
    }

    render(){
        return (
            <div>
                <button className={!this.state.checked ? tableStyling.CheckboxClicked : tableStyling.Checkbox} onClick={this.handleChange}> {this.props.value + " "} </button>
            </div>
        )
    }
}

export default Checkbox;