import React from "react";

class ChargeStation extends React.Component {
    constructor(props) {
        super(props)
        this.changeChargeStation = this.changeChargeStation.bind(this);

        this.state = {
            changeChargeStationUsed: props.value,
        }
    }

    changeChargeStation(event) {
        this.props.changeChargeStationUsed(event);
        this.setState({ changeChargeStationUsed: event.value });
    }


    render() {
        return (
            <div>
                <label> {"⚡Charge Station: "}
                    <select onChange={this.changeChargeStation}>
                        <option value={this.props.value}> {this.props.value} </option>
                        <option value='None'>None</option>
                        <option value='DockedEngaged'>Docked & Engaged</option>
                        <option value='Docked'>Docked & Not Enaged</option>
                        <option value='Attempted'>Attempted</option>
                    </select>
                </label>
            </div>
        )
    }
}

export default ChargeStation;