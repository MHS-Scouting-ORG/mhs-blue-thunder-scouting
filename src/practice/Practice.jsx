import React, { useState } from 'react'; 
import './Practice.css'; //imports the css file to jsx file
//className is used in jsx file
function Practice() {
    
    /*<p>Previous Score was {previousScore}</p>*/
//Incremental Button
const wrongButton = () => {
    window.alert("Not me, the other guy")
}   

const [count, setCount] = useState(0)
function setClick(){
setCount(count + 1);
}
function resetCount(){
setCount(0)
}


    return(
    <div>
        <div className="something" style={{ border: "5px solid purple"}}> 
        <h1>Hey there</h1>
        <br></br>
        <p>Starting from scratch</p>
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
    </div>
    
    </div>
    )
}

export default Practice;
/*
<>
<div className="awesome" style={{ border: "1px solid red" }}>
<label htmlFor="name">Enter your name: </label>
<input type="text" id="name" />
</div>
<p>Enter your HTML here</p>
</>
*/
//TicTacToe Game Code    
/*function TicTacSquare({ value, onSquareClick}) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}
    function TicTacBoard({ xIsNext, squares, onPlay}) {
        function handleClick(i) {
            if (calculateTicTacWinner(squares) || squares[i] ) {
                return;
            }
            const nextSquares = squares.slice();
            if (xIsNext) {
                nextSquares[i] = "X";
            } else {
                nextSquares[i] = 'O'
            }
            onPlay(nextSquares);
            }
        }
}*/