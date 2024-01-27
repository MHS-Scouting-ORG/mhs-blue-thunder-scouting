import React from "react";
import CounterBox from "./CounterBox";

// let counterStates

export function makeCounterBox(props, title, i) {
    let counterStates = props.counterBoxVals;
    
    function buttonMinus(i) {
        if (counterStates[i] > 0) {
            counterStates[i] = parseInt(counterStates[i] - 1)
        }
        else if (counterStates[i] <= 0) {
          counterStates[i] = 0
        }
    }

    function buttonPlus(i) {
        if (counterStates[i] >= 0) {
            counterStates[i] = parseInt(counterStates[i] + 1)
        }
        else if (counterStates[i] < 0) {
            counterStates[i] = 0
        }
    }

    return (
        <div>
            <CounterBox
                label={title}
                index={i}
                state={counterStates[i]}
                minusButton={buttonMinus}
                plusButton={buttonPlus}
            />
        </div>
    )
}

// function buttonMinus(event, i) {
//     // let counterStates = props.counterBoxVals;
//     console.log("index: ", i)
//     if (counterStates[i] > 0) {
//       counterStates[i] = parseInt(counterStates[i] - 1)
//     }
//     else if (counterStates[i] <= 0) {
//       counterStates[i] = 0
//     }
// }

// function buttonPlus(event, i) {
//     // let counterStates = props.counterBoxVals;
//     if (counterStates[i] >= 0) {
//         counterStates[i] = parseInt(counterStates[i] + 1)
//     }
//     else if (counterStates[i] < 0) {
//         counterStates[i] = 0
//     }
// }

