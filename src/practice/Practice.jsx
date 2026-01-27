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
const [number, setNumber] = useState("");
const operators = ["/", "*", "-", "+", "."];
const [calculated, getCalculated] = useState("");

const getUpdCalc = value => {
    setNumber(calculated + value);
}
function resetAllCalc(){
    setNumber(0)
}
// Faster way to generate the numbers apparently (test)
/*
const CreateCalcNum = () => {
    const calcDigits = [];

    for (let i=1; i<10; i++ );
        calcDigits.push
        return calcDigits
}
*/
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
    
        <div className="calculator">
        <br></br>
        <h1 className="calculated">{number || "press things below"}</h1>
        <br></br>
        <button onClick={() => getUpdCalc("/")} className="calculatorDesignOperator">/</button>
        <button className="calculatorDesignButton">7</button>
        <button className="calculatorDesignButton">8</button>
        <button className="calculatorDesignButton">9</button>
        <br></br>
        <button onClick={() => getUpdCalc("*")} className="calculatorDesignOperator">x</button>
        <button className="calculatorDesignButton">4</button>
        <button className="calculatorDesignButton">5</button>
        <button className="calculatorDesignButton">6</button>
        <br></br>
        <button onClick={() => getUpdCalc("-")} className="calculatorDesignOperator">-</button>
        <button className="calculatorDesignButton">1</button>
        <button className="calculatorDesignButton">2</button>
        <button className="calculatorDesignButton">3</button>
        <br></br>
        <button onClick={() => getUpdCalc("+")} className="calculatorDesignOperator">+</button>
        <button className="calculatorDesignButton">0</button>
        <button onClick={() => getUpdCalc(".")} className="calculatorDesignButton">.</button>
        <button className="calculatorDesignButton">=</button>
        <button className="calculatorDesignButtonDel">Cancel All</button>
        <p className="Manufacturer" manufacturer-Data="This product was made in China"><strong>Made in China</strong></p>
        </div>

    </div>
    )
}

export default Practice;