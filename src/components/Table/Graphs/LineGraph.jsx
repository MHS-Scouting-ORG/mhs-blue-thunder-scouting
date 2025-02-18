import React, {useEffect, useState, useRef} from "react"
import {Line} from "react-chartjs-2"
import { getTeamsInRegional} from "../../../api/bluealliance"
import { apigetMatchesForRegional } from "../../../api"
import { getStat } from "./Utils/GraphUtils"
import { uniqueArr } from "../TableUtils/CalculationUtils"

function LineGraph (props) {
    const regional = props.regional
    const selectedTeams = props.selectedTeams

    const [apiData, setApiData] = useState([])
    const [availableTeams, setAvailableTeams] = useState([]) 
    const [xAxis, setXAxis] = useState([])
    const [statType, setStatType] = useState([])
    const [accessor, setAccessor] = useState([])

    useEffect(() => {
        apigetMatchesForRegional(regional)
        .then(data => {
            const holdMatches = data.data.teamMatchesByRegional.items
            setApiData(holdMatches)
            const xLegend = uniqueArr(holdMatches.map(x => x.id.substring(x.id.indexOf("_") + 1)))
            setXAxis(xLegend)
            const availTeams = uniqueArr(holdMatches.map(x => x.Team))
            setAvailableTeams(availTeams)
        })
    },[selectedTeams, statType, accessor]);

    const createTeamObjArr = () => {
        return (
            availableTeams.map(x => {
                const stat = getStat(x, statType, accessor, apiData)
                return {
                    label: x,
                    data: stat,
                }
            })
        )
    
    }

    const ref = useRef()

    const lineData = {
        labels: xAxis,
        datasets: createTeamObjArr()
    }

    return (
        <div>
            <div>
                
                <select onChange = {(e) => setStatType(e.target.value)}  >
                    <option value="">Select Phase</option>
                    <option value="tele">Tele</option>
                    <option value="auto">Auto</option>
                    <option value="total">TotalPts</option>
                    <option value="fouls">Fouls</option>
                </select> 
                    <select onChange = {(e) => setAccessor(e.target.value)}>
                        <option value = "">Stat</option>
                        <option value ="CoralL1">CoralL1</option>
                        <option value ="CoralL1Missed">CoralL1Missed-Tele</option>
                        <option value ="CoralL2">CoralL2</option>
                        <option value ="CoralL2Missed">CoralL2Missed-Tele</option>
                        <option value ="CoralL2">CoralL3</option>
                        <option value ="CoralL2Missed">CoralL3Missed-Tele</option>
                        <option value ="CoralL2">CoralL4</option>
                        <option value ="CoralL2Missed">CoralL4Missed-Tele</option>
                        <option value ="Processor">Processor</option>
                        <option value ="ProcessorMissed">ProcessorMissed-Tele</option>
                        <option value ="Net">Net</option>
                        <option value ="NetMissed">NetMissed-Tele</option>
                        <option value ="Cycles">Cycles</option>
                        <option value ="Points">Points</option>
                        <option value ="AlgaePoints">AlgaePoints</option>
                        <option value ="CoralPoints">CoralPoints</option>
                        <option value ="Endgame">Endgame-Tele</option>
                        <option value ="Human">Human-Tele</option>
                        <option value ="HumanMissed">HumanMissed-Tele</option>
                        <option value ="Start">AutoStart</option>
                        <option value ="MajorFouls">MajorFouls</option>
                        <option value ="MinorFouls">MinorFouls</option>
                    </select>
            </div>
            <Line ref={ref} data={lineData} /> 

        </div>
    )
}

export default LineGraph;