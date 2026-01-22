import React, { useEffect, useState } from 'react'
import tableStyling from "./Table/Table.module.css";

function Tab(props) {
    const value = props.value;
    //const test = props.OnClick;

    const [TabState, setTabState] = useState(false);

    const handleChange = () => {
        if (TabState === true) { 
            setTabState(false)
        }
        else {
            setTabState(true)
        }
        //console.log(test)
    }

    return (
        <div> 
            <button className={TabState ? tableStyling.CheckboxClicked : tableStyling.Checkbox} onClick={handleChange}> {value} </button>
        </div>
    )
}

export default Tab;