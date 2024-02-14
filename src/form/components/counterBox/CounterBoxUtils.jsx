import React from "react";
import CounterBox from "./CounterBox";
import { PropTypes } from "prop-types";
// let counterStates

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

export function makeFoulCounterBox(props, title, i) {

    function makeInputBox() {
        console.log("fart")
        return(
            <div>
                <input></input>
            </div>
        )
    }

    function buttonMinus(i) {
        props.changeState(i, props.counterBoxVals[i] - 1)
    }

    function buttonPlus(i) {
        makeInputBox()
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