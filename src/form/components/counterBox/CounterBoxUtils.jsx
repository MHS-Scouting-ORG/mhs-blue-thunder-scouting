import React from "react";
import CounterBox from "./CounterBox";
import { PropTypes } from "prop-types";

export function makeCounterBox(props, title) {

    function buttonMinus() {
        if (props.counterBoxVals - 1 == -1) {
            console.log("out of bounds!")
            return
        }
        props.changeState(props.counterBoxVals - 1)
    }

    function buttonPlus() {
        props.changeState(props.counterBoxVals + 1)
    }

    return (
        <div>
            <CounterBox
                label={title}
                state={props.counterBoxVals}
                minusButton={buttonMinus}
                plusButton={buttonPlus}
            />
        </div>
    )
}

makeCounterBox.propTypes = {
    counterBoxVals: PropTypes.number,
    changeState: PropTypes.func

}