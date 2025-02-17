import React, {useEffect, useState, useRef} from "react"
import { apigetMatchesForRegional} from "../../../api"
import LineGraph from "./LineGraph"
import BubbleGraph from "./BubbleGraph"
import RadarGraph from './RadarGraph'



function CustomGraph(props) {
    const regional = props.regional || props.regionalEvent
    const tableData = props.information
    const selectedTeams = props.selectedTeams

    const [graphType, setGraphType] = useState([])
    const [apiData, setApiData] = useState([])

    useEffect(() => {
        apigetMatchesForRegional(regional)
        .then(data => {
            setApiData(data.data.teamMatchesByRegional.items)
        })
    },[graphType])

    const ref = useRef()

    const graphState = {
        matches: apiData,
        regional: regional,
        tableData: tableData,
        selectedTeams: selectedTeams,
    }

    return (
        <div> 
            <LineGraph {...graphState} />
            {/* <select onChange = {(e) => setGraphType(e.target.value)}>
                <option value = ''>Select Graph Type</option> 
                <option value = 'Line'>Line</option>
                <option value = 'Bar'>Bar</option>
                <option value = 'Bubble'>Bubble</option>
                <option value = 'PolarArea'>Polar Area</option>
                <option value = 'Radar'>Radar</option>
            </select>
            {
                graphType === 'Line' ? <LineGraph {...graphState} /> : null
            }
            {
                graphType === 'Bubble' ? <BubbleGraph {...graphState}  /> : null
            }
            {
                graphType === 'Radar' ? <RadarGraph {...graphState}  /> : null
            } */}
        </div>
    )
}

export default CustomGraph
