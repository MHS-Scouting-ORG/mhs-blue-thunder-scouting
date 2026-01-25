import React, { useState } from 'react'; 
import './Practice.css'; //imports the css file to jsx file
import { use } from 'react';
//className is used in jsx file
function Practice() {
//UserName
function userName() {
    let username = document.getElementById("userInput")
}

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

const [] = useState(0)

    return(
    <div>
        <h1>Input Name</h1>
        <input placeholder="type in name here" className="userName" id="userInput"></input>
        <button className="userName">Enter Name</button>
        <div className="something" style={{ border: "5px solid purple"}}> 
        <h1>Hey there {}</h1>
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
        <h1 className="calculated">press buttons below</h1>
        <button className="calculatorDesign">/</button>
        <button className="calculatorDesign">7</button>
        <button className="calculatorDesign">8</button>
        <button className="calculatorDesign">9</button>
        <br></br>
        <button className="calculatorDesign">x</button>
        <button className="calculatorDesign">4</button>
        <button className="calculatorDesign">5</button>
        <button className="calculatorDesign">6</button>
        <br></br>
        <button className="calculatorDesign">-</button>
        <button className="calculatorDesign">1</button>
        <button className="calculatorDesign">2</button>
        <button className="calculatorDesign">3</button>
        <br></br>
        <button className="calculatorDesign">+</button>
        <button className="calculatorDesign">0</button>
        <button className="calculatorDesign">.</button>
        <button className="calculatorDesign">=</button>
        </div>

    </div>
    )
}

export default Practice;