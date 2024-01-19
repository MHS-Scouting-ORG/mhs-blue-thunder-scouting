import React from "react";
import ChargeStation from "./ChargeStation";

export function makeChargeStationAuto(props) {
    let chargeStationState = props.chargeStationValAuto;
    return (
      <div>
        <ChargeStation
          changeChargeStationUsed={props.changeChargeStation}
          value={chargeStationState}
        />
      </div>
    )
}