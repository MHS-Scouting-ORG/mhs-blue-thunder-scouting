import React from "react";
import ChargeStation from "./ChargeStation";

export function makeChargeStationAuto(props) {
    let chargeStationState = props.chargeStationValAuto;

    function changeChargeStation(event){
      // this.setState({ chargeStationValAuto: event.target.value });
      props.changeState([9,0],event.target.value)
    }
  
    return (
      <div>
        <ChargeStation
          changeChargeStationUsed={changeChargeStation}
          value={chargeStationState}
        />
      </div>
    )
}