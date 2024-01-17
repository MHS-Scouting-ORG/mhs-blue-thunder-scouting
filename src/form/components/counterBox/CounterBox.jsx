import React from 'react';

class CounterBox extends React.Component{
    constructor(props) {
        super(props);
        this.buttonMinus = this.buttonMinus.bind(this);
        this.buttonPlus = this.buttonPlus.bind(this);
        this.counterChanged = this.counterChanged.bind(this)
        this.state = {
            count: props.state
        }
    }

    buttonMinus(event) {
        this.props.minusButton(event,this.props.place);
        const input = document.getElementById(this.props.place);
        let value = parseInt(this.state.count);
        if (value > 0) {
            this.setState({count:parseInt(this.state.count) - 1});
            input.value = parseInt(this.state.count) - 1;
        }
        else if (value <= 0) {
            this.setState({count:0});
            input.value = 0;
        }
    }
    
    buttonPlus(event) {
        this.props.plusButton(event,this.props.place);
        const input = document.getElementById(this.props.place);
        if (event.target.value >= 0) {
            this.setState({count:parseInt(this.state.count) + 1});
            input.value = parseInt(this.state.count) + 1;
        }
        else if (event.target.value < 0) {
            this.setState({count:0});
            input.value = 0;
        }
    }

    counterChanged(event) {
        if(event.target.value === '') {
            this.setState({counter: 0})
        }
        else {
            this.setState({counter: event.target.value})
        }
        this.props.setState(event, this.props.place)
    }
    
    render() {
        return(
            <div> 
                <label>{this.props.label}</label>
                <button value={this.props.state} onClick={this.buttonMinus}>-</button>
                <input style={{width: '10%', textAlign: 'center'}} type='number' min='0' id={this.props.place} onChange={this.counterChanged} readOnly={true} value={this.state.count}/>
                <button value={this.props.state} onClick={this.buttonPlus}>+</button>
                
                
            </div>
        );
    }
}

export default CounterBox;