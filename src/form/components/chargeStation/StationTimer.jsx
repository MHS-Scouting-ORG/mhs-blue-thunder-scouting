import React from "react";

class StationTimer extends React.Component {
    constructor(props) {
        super(props);
        this.runTimer = this.runTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.timeChanged = this.timeChanged.bind(this);
        this.state = {
            timer: 0.0,
            debounce: 0,
            stop: false
        }
    }

    runTimer(event) {
        this.props.startButton(event, this.props.index);
        const time = document.getElementById("time");
        this.setState({ stop: false, debounce: this.state.debounce + 1 });
        if (this.state.debounce < 1 && this.state.stop === false) {
            setInterval(() => {
                if (this.state.stop === true) {
                    return;
                }
                this.setState({ timer: Math.round((this.state.timer + .1) * 10) / 10 })
                time.value = parseInt(Math.round((this.state.timer + .1) * 10) / 10);
            }, 100)
        } else {
            return;
        }
    }

    stopTimer(event) {
        const time = document.getElementById("time");
        this.props.stopButton(event, this.props.index);
        time.value = parseInt(Math.round((this.state.timer + .1) * 10) / 10);
        this.setState({ stop: true, debounce: 0 });
    }

    timeChanged(event) {
        this.setState({ timer: event.target.value })
        this.props.setState(event, this.props.state);
    }


    render() {
        return (
            <div>
                <label>{this.props.label}</label>
                <input type='number' onChange={this.timeChanged} id="time" />
                <br></br>
                <button onClick={this.runTimer}>Start</button>
                <button onClick={this.stopTimer}>Stop</button>
            </div>
        )
    }
}

export default StationTimer;