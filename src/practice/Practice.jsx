import { useState } from 'react';


function Practice() {
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
    return(
    <div id="something">
        <h1>Hey there</h1>
        <br></br>
        <p>Starting from scratch</p>
    </div>
    )
}

export default Practice;