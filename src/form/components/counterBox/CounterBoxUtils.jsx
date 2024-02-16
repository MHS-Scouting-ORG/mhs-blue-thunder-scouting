import React from "react";
import { useState } from "react";
import CounterBox from "./CounterBox";
import { PropTypes } from "prop-types";

export function makeCounterBox(props, title, i) {

    function buttonMinus(i) {
        props.changeState(i, props.counterBoxVals[i] - 1)
    }

    function buttonPlus(i) {
        props.changeState(i, props.counterBoxVals[i] + 1)
    }

    return (
        <div>
            <CounterBox
                label={title}
                index={i}
                state={props.counterBoxVals[i]}
                minusButton={buttonMinus}
                plusButton={buttonPlus}
            />
        </div>
    )
}

makeCounterBox.propTypes = {
    counterBoxVals: PropTypes.array,
    changeState: PropTypes.func

}