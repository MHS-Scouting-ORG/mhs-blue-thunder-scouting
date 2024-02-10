import React from "react";

function ChargeStation(props) {
    const changeChargeStation = function (event) {
        props.changeChargeStationUsed(event);
    }


    return (
        <div>
            <label> {"⚡Charge Station: "}
                <select onChange={changeChargeStation}>
                    <option value=""/>
                    <option value='None'>None</option>
                    <option value='DockedEngaged'>Docked & Engaged</option>
                    <option value='Docked'>Docked & Not Enaged</option>
                    <option value='Attempted'>Attempted</option>
                </select>
            </label>
        </div>
    )
}

export default ChargeStation;