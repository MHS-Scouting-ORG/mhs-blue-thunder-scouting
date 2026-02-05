import React, { useState } from 'react'; 
import './Practice.css'; //imports the css file to jsx file
import { use } from 'react';
import styles from './Practice.module.css';
import {ROBOTS} from './Robots.jsx'
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
// Input colors
const [colors, setColors] = useState(["blue", "purple", "blurple"]);

function addColor(){
    const newColor = document.getElementById('colorInput').value;
    document.getElementById('colorInput').value = '';
    setColors(c =>[...c, newColor]);
}
function removeColor(index){
    setColors(colors.filter((_,ind) => ind !== index))
}
//rainbow Finder
const RAINBOW_COLORS = [
    {id: "1", name: "Red", },
    {id: "2", name: "Orange", },
    {id: "3", name: "Yellow", },
    {id: "4", name: "Green", },
    {id: "5", name: "Blue", },
    {id: "6", name: "Indigo", },
    {id: "7", name: "Violet", }
]
    const [rbColors, setRbColors] = useState(RAINBOW_COLORS)
    const [searchRbColors, setSearchRbColors] = useState('')

    function addRbColor(){
    const newRbColor = document.getElementById('rbColorInput').value;
    document.getElementById('rbColorInput').value = '';
    setRbColors(r =>[...r, newRbColor]);
};
const searchingColor = (event) => {
    const search = event.target.value;
    setSearchRbColors(search)

    if (!search) {
        setRbColors(RAINBOW_COLORS)
        setSearchRbColors(search)
        return
    }

    const filterRbColors = rbColors.filter((raibowcol) => {
    return raibowcol.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    })
    setRbColors(filterRbColors)
}
//NEW WAYS OF SORTING LEARNING
const CLOTHES = [
    {placement:'top', name:'Jacket'},
    {placement:'bottom', name:'Socks'},
    {placement:'bottom', name:'Shoes'},
    {placement:'top', name:'Shirt'},
    {placement:'bottom', name:'Pants'},
    {placement:'top', name:'Hat'},
]
const [clothing, setClothing] = useState(CLOTHES);
const [filterClothing, setFilterClothing] = useState();
const [revOrd, setRevOrd] = useState();

const sortingClothing = (e) => {
    const sort = e.target.value; 
    setFilterClothing(sort)      
    
    if (!sort) {
        setClothing(CLOTHES);
        setFilterClothing(sort);
        return
    }
    const sortsClothes = clothing.filter((apparel)  => {
    return apparel.name.toLowerCase().indexOf(sort.toLowerCase()) !== -1;
    })
    setClothing(sortsClothes)
}


return(
    <div>
            <div>
        <h1>Number Sorting</h1>
        <ul>
            <input value={filterClothing} onChange={sortingClothing} type="text" placeholder='Clothing search'></input>
            <select>
                <option>Default</option>
                <option>Reverse Order</option>
                <option>Top</option>
                <option>Bottom</option>
            </select>
            {clothing.map((cloth, index) => <li key={index}>{cloth.name} {cloth.placement}</li>)}
            {clothing.length === 0 && <h2>NO DRIP</h2>}
        </ul>
        </div>
        <div>
            <h1>Color</h1>
            <ul>
                {colors.map((color, index) => <li key={index} onClick={() => removeColor(index)}>{color}</li>)}
            <input type="text" id='colorInput' placeholder='Type favorite primary color'/>
            <button onClick={addColor} className={styles.colorate}>Add Your Color</button>
            </ul>
        </div>

        <div className="rainbowColors"> 
            <h1>Rainbow Colors</h1>
            <div className='listOfRainbowColors'>
            <ul>
                <input value={searchRbColors} onChange={searchingColor} type="text" placeholder='Search Favorite Rainbow Color'></input>
                {/*<select>
                    <option>Does not function</option>
                    <option >Rainbow Order Descending</option>
                    <option>Rainbow Order Ascending</option>                
                    </select>
                */}
                {rbColors.map((rbColor, index) => <li key={index}>{rbColor.id} {rbColor.name}</li>)}
                {rbColors.length === 0 && <h2>NO RAINBOW COLOR AAAAAAAAAAAAAAAA!!!</h2>}
                {/*<input type="text" id='rbColorInput' placeholder="Type in more colors"/>
                <button onClick={addRbColor}>Add additional colors</button>
                <p className='underConstruction'>not working currently*</p>
                */}
            </ul>
            </div>

        </div>
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
        
        <div className='newCalculator'>
            <ul>    
                    <div className='newCalcBackground'>
                    <br></br>
                    <input className='calculatedAns' placeholder='Press below'></input>
                    <br></br>
                    <br></br>
                    <button className='newCalcButtons'>/</button>
                    <button className='newCalcButtons'>7</button>
                    <button className='newCalcButtons'>8</button>
                    <button className='newCalcButtons'>9</button>
                    <br></br>
                    <button className='newCalcButtons'>*</button>
                    <button className='newCalcButtons'>4</button>
                    <button className='newCalcButtons'>5</button>
                    <button className='newCalcButtons'>6</button>
                    <br></br>
                    <button className='newCalcButtons'>-</button>
                    <button className='newCalcButtons'>1</button>
                    <button className='newCalcButtons'>2</button>
                    <button className='newCalcButtons'>3</button>
                    <br></br>
                    <button className='newCalcButtons'>+</button>
                    <button className='newCalcButtons'>0</button>
                    <button className='newCalcButtons'>.</button>
                    <button className='newCalcButtons'>=</button>
                    <br></br>
                    <button className='newCalcCancel'>Cancel</button>
                    <br></br>
                    <p>New Calc</p>
                    </div>
            </ul>
        </div>

    </div>
    )
}
export default Practice;