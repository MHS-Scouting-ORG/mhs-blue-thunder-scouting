import React, {useEffect, useState, useRef} from "react"
import {Bar, Bubble, Chart, Doughnut, Line, Pie, PolarArea, Radar, Scatter} from "react-chartjs-2"
import { apigetMatchesForRegional} from "../../../api"
import LineGraph from "./LineGraph"


function CustomGraph(props) {
    const regional = props.regional

    const [graphType, setGraphType] = useState([])
    const [apiData, setApiData] = useState([])

    useEffect(() => {
        apigetMatchesForRegional(regional)
        .then(data => {
            setApiData(data.data.teamMatchesByRegional.items)
        })
    },[graphType])

    const ref = useRef()

    return (
        <div> 
            <select onChange = {(e) => setGraphType(e.target.value)}>
                <option value = ''>Select Graph Type</option> 
                <option value = 'Line'>Line</option>
                <option value = 'Bar'>Bar</option>
                <option value = 'Bubble'>Bubble</option>
                <option value = 'Chart'>Chart</option>
                <option value = 'Doughnut'>Doughnut</option>
                <option value = 'Pie'>Pie</option>
                <option value = 'PolarArea'>Polar Area</option>
                <option value = 'Radar'>Radar</option>
                <option value = 'Scatter'>Scatter</option>
            </select>
            {
                graphType === 'Line' ? <LineGraph matches = {apiData} regional = {regional}  /> : null
            }
        </div>
    )
}

export default CustomGraph
