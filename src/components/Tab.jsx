import React, { useEffect, useState } from 'react'
import tableStyling from "./Table/Table.module.css";

function Tab(props) {
    const value = props.value; //passing props value from parent component
    const changeState = props.changeState; //functiom to changeState in SummaryHeader
    const state = props.state; //type of tab

    const [TabState, setTabState] = useState(false); //state of the tab 

    const handleChange = () => {
        changeState(state);

        if (TabState === false) { 
            setTabState(true)
        }
        else {
            setTabState(false)
        }
    }

    return (
        <div> 
            <button className={state ? tableStyling.CheckboxClicked : tableStyling.Checkbox} onClick={handleChange}> {value} </button>
        </div>
    )
}

export default Tab;