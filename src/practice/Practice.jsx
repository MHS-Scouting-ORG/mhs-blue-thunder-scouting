import React, { useState } from 'react'; 
import './Practice.css'; //imports the css file to jsx file
import { use } from 'react';
//className is used in jsx file
function Practice() {
//UserName
const [inputname, setInputName] = useState("");
//Incremental Button
const wrongButton = () => {
    window.alert("Not me, the other guy")
}   

const [count, setCount] = useState(0)
function setClick(){
setCount(count + 1);
if (count == 66) {
    window.alert("six seven");
}
}
function resetCount(){
setCount(0);
}
//Calculator 
let [number, setNumber] = useState("");
const value = ["/" || "*" || "-" || "+"  || "."];
const [calculated, getCalculated] = useState("");
const getUpdCalc = value => {
    setNumber(number + value);
    calculated = (number + value)
    getCalculated(calculated)
} 
const calculate = (number)  => {
    const calculater = (number + value)
    getCalculated(calculater)
}
function resetAllCalc(){
    setNumber(0)
}

return(
    
    <div> 
        <h1>Input Name</h1>
        <input placeholder="type in name here" className="userName" id="userInput" autoComplete='off' type="text"
        username={inputname}
        onChange={(eve) => setInputName(eve.target.value)}></input>
        <div className="something" style={{ border: "5px solid purple"}}> 
        <h1>Hey there {inputname} </h1>
        <br></br>
        <p>Welcome to the PRACTICE page</p>
    </div>

    <br></br>
    
    <div>
    <h1 onClick={wrongButton} className="numberClick">{count}</h1>
    <button onClick={setClick} className="clickButton">
        Click Me
    </button>
    <br></br>
    <button onClick={resetCount} className="resetClickButton">
        Reset
    </button>
    <br></br>
    <br></br>
    </div>
        <h1>number adder only apparently</h1>
        <div className="calculator">
        <br></br>
        <h1 className="calculated">{number || "press things below" || calculated}</h1>
        <br></br>
        <button onClick={() => getUpdCalc("/")} className="calculatorDesignOperator">/</button>
        <button onClick={() => getUpdCalc(7)} className="calculatorDesignButton">7</button>
        <button onClick={() => getUpdCalc(8)} className="calculatorDesignButton">8</button>
        <button onClick={() => getUpdCalc(9)} className="calculatorDesignButton">9</button>
        <br></br>
        <button onClick={() => getUpdCalc("*")} className="calculatorDesignOperator">x</button>
        <button onClick={() => getUpdCalc(4)} className="calculatorDesignButton">4</button>
        <button onClick={() => getUpdCalc(5)} className="calculatorDesignButton">5</button>
        <button onClick={() => getUpdCalc(6)} className="calculatorDesignButton">6</button>
        <br></br>
        <button onClick={() => getUpdCalc("-")} className="calculatorDesignOperator">-</button>
        <button onClick={() => getUpdCalc(1)} className="calculatorDesignButton">1</button>
        <button onClick={() => getUpdCalc(2)} className="calculatorDesignButton">2</button>
        <button onClick={() => getUpdCalc(3)}  className="calculatorDesignButton">3</button>
        <br></br>
        <button onClick={() => getUpdCalc("+")} className="calculatorDesignOperator">+</button>
        <button onClick={() => getUpdCalc(0)} className="calculatorDesignButton">0</button>
        <button onClick={() => getUpdCalc(".")} className="calculatorDesignButton">.</button>
        <button onClick={() => calculate()} className="calculatorDesignButton">=</button>
        <button onClick={() => resetAllCalc()} className="calculatorDesignButtonDel">Cancel All</button>
        <p className="Manufacturer" manufacturer-Data="This product was made in China"><strong>Made in China</strong></p>
        </div>
    </div>
    )
}
export default Practice;