import React from "react";
import ChargeStation from "./ChargeStation";

export function makeChargeStationAuto(props) {
  let chargeStationState = props.chargeStationValAuto;

  function changeChargeStation(event) {
    props.changeState(event.target.value)
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