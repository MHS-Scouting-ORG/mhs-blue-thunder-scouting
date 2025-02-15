import React, {useState} from "react";

function AvgStatSelect (props) {
const y = props.handleStatYClicked //func 
const z = props.handleStatZClicked
    return (
        <div>
            {
                props.id === 0 ? <div>StatY</div>: <div>StatZ</div>
            }
            <select onChange = {(e) => { props.id === 0 ? y(e.target.value) : z(e.target.value)}}>
                {
                    props.id === 0 ? <option value = "">SetY</option> : <option value = "">SetZ</option>
                }
                <option value ="AvgPoints">Avg Points</option>
                <option value ="AvgAutoPts">Avg Auto Points</option>
                <option value ="AvgEndgamePts">Avg Endgame Points</option>
                <option value ="AvgCoralPts">Avg Coral Points</option>
                <option value ="AvgAlgaePts">Avg Algae Points</option>
                <option value ="AvgCycles">Avg Cycles</option>
                <option value ="AvgCoral">Avg Coral Scored</option>
                <option value ="AvgAlgae">Avg Algae Scored</option>
                <option value ="AvgMissedCoralL1">Avg Missed Coral L1</option>
                <option value ="AvgMissedCoralL2">Avg Missed Coral L2</option>
                <option value ="AvgMissedCoralL3">Avg Missed Coral L3</option>
                <option value ="AvgMissedCoralL4">Avg Missed Coral L4</option>
                <option value ="AvgMissedCoral">Avg Missed Coral</option>
                <option value ="AvgMissedProcessor">Avg Missed Processor</option>
                <option value ="AvgMissedNet">Avg Missed Net</option>
                <option value ="AvgMissedAlgae">Avg Missed Algae</option>
                <option value ="CoralL1Acc">Coral L1 Acc</option>
                <option value ="CoralL2Acc">Coral L2 Acc</option>
                <option value ="CoralL3Acc">Coral L3 Acc</option>
                <option value ="CoralL4Acc">Coral L4 Acc</option>
                <option value ="CoralAcc">Coral Acc</option>
                <option value ="ProcessorAcc">Processor Acc</option>
                <option value ="NetAcc">Net Acc</option>
                <option value ="Fouls">Avg Fouls</option>
                <option value ="Tech">Avg Tech Fouls</option>
            </select>
        </div>
    )
}

export default AvgStatSelect