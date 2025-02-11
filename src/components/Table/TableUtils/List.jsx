import React from 'react';
import Checkbox from './Checkbox'
import tableStyling from '../Table.module.css';

class List extends React.Component{
    constructor(props){
        super(props);
        this.addOnColumnSort = this.addOnColumnSort.bind(this);
        this.state = {
            list: ["", "", "", "", "", "",]
        };
    }

    addOnColumnSort(bool, value, id){
        let checkboxState = Array.from(this.state.list);

        if (bool === true) {
            checkboxState[id] = value
        } else {
            checkboxState[id] = ""
        }
        this.setState({ list: checkboxState})
        this.props.setList(checkboxState);
    }
    render(){
        return(
            <div className={tableStyling.List}>
                <Checkbox value = "Coral" changeState={this.addOnColumnSort} id ={0}></Checkbox>
                <Checkbox value = "Algae" changeState={this.addOnColumnSort} id ={1}></Checkbox>
                <Checkbox value = "Cycles" changeState={this.addOnColumnSort} id ={2}></Checkbox>
                <Checkbox value = "Total Points" changeState={this.addOnColumnSort} id ={3}></Checkbox>
                <Checkbox value = "Auto Points" changeState={this.addOnColumnSort} id ={4}></Checkbox>
                <Checkbox value = "Endgame Points" changeState={this.addOnColumnSort} id ={5}></Checkbox>
                <Checkbox value = "Coral Points" changeState={this.addOnColumnSort} id ={6}></Checkbox>
                <Checkbox value = "Algae Points" changeState={this.addOnColumnSort} id ={7}></Checkbox>

            </div>
        )
    }
}

export default List;