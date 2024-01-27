import React from 'react';

class CounterBox extends React.Component{
    constructor(props) {
        super(props);
        this.buttonMinus = this.buttonMinus.bind(this);
        this.buttonPlus = this.buttonPlus.bind(this);
        //this.counterChanged = this.counterChanged.bind(this)
        this.state = {
            count: props.state
        }
    }

    buttonMinus() {
        this.props.minusButton(this.props.index);
        let value = parseInt(this.state.count);
        if (value > 0) {
            this.setState({count:parseInt(this.state.count) - 1});
        }
        else if (value <= 0) {
            this.setState({count:0});
        }
    }
    
    buttonPlus() {
        this.props.plusButton(this.props.index);
        let value = parseInt(this.state.count)
        if (value >= 0) {
            this.setState({count:parseInt(this.state.count) + 1});
        }
        else if (value < 0) {
            this.setState({count:0})
        }
    }

    /*counterChanged(event) {
        if(event.target.value === '' || this.state.count === 0) {
            this.setState({count: 0})
            this.props.changeCounterBoxState([this.props.stateIndex,this.props.index],0)
        }
        else{
            this.setState({count: event.target.value})
            this.props.changeCounterBoxState([this.props.stateIndex,this.props.index],parseInt(event.target.value))
        }
    }*/
    
    render() {
        return(
            <div> 
                <label>{this.props.label}</label>
                <button value={this.props.state} onClick={this.buttonMinus}>-</button>
                <input style={{width: '10%', textAlign: 'center'}} type='number' min='0' id={this.props.index} readOnly={true} value={this.state.count}/>
                <button value={this.props.state} onClick={this.buttonPlus}>+</button>
            </div>
        );
    }
}

export default CounterBox;