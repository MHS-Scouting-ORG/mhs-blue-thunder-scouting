import React, { useEffect, useState } from 'react'
import tableStyling from "./Table/Table.module.css";
import Tab from './Tab';
import Qualifications from './Qualifications';

function SummaryHeader(props) {
    const [QualView, setQualView] = useState('none') //toggle qual view state
    const [SelectionView, setSelectionView] = useState('none') // toggle selection view state
    const [QualState, setQualState] = useState(false);
    const [SelectionState, setSelectionState] = useState(false);

    const toggleHeader = (type) => { //function to update header display passed to changeState prop
        if (QualView === '') { 
            setQualView('none')
            setQualState(false)
            setSelectionView('')
            setSelectionState(true)
        }
        else {
            setQualView('')
            setQualState(true)
            setSelectionView('none')
            setSelectionState(false)
        }
    }

    

    return (
        <div> 
             <div className={tableStyling.List}>
                <Tab value = "Qualifications" state={QualState} changeState={toggleHeader} />
                <Tab value = "Alliance Selection" state={SelectionState} changeState={toggleHeader} />
            </div>
            <div style={{display: QualView}}> <Qualifications /></div>
            <div style={{display: SelectionView}}> selection</div>
        </div>
    )
}

export default SummaryHeader