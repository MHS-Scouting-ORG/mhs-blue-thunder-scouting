import React from "react";
import CounterBox from "./CounterBox";
import { PropTypes } from "prop-types";
// let counterStates

export function makeCounterBox(props, title, i) {
    //let counterStates = props.counterBoxVals;
    
    function buttonMinus(i) {
    //    if (counterStates[i] > 0) {
    //        counterStates[i] = parseInt(counterStates[i] - 1)
    //    }
    //    else if (counterStates[i] <= 0) {
    //      counterStates[i] = 0
    //    }
        props.changeState(i, props.counterBoxVals[i] - 1)
    }

    function buttonPlus(i) {
    //    if (counterStates[i] >= 0) {
    //        counterStates[i] = parseInt(counterStates[i] + 1)
    //    }
    //    else if (counterStates[i] < 0) {
    //        counterStates[i] = 0
    //    }
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
