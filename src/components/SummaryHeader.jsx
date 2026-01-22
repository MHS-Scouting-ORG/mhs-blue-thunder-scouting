import React, { useEffect, useState } from 'react'
import tableStyling from "./Table/Table.module.css";
import Tab from './Tab';

function SummaryHeader(props) {
    const [HeaderState, setHeaderState] = useState('none') //toggle header state]

    const toggleHeader = () => { //function to update header display
        if (HeaderState === 'none') { 
            setHeaderState(' ')
        }
        else {
            setHeaderState('none')
        }
    }

    return (
        <div> 
             <div className={tableStyling.List}>
                <Tab value = "Qualifications" id={0} OnClick={toggleHeader} />
                <Tab value = "Alliance Selection" id={1} onClick={toggleHeader} />
            </div>
            <div style={{display: HeaderState}}> test</div>
        </div>
    )
}

export default SummaryHeader