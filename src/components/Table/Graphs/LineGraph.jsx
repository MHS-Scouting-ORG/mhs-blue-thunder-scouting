import React, {useEffect, useState, useRef} from "react"
import {Line} from "react-chartjs-2"
import { getTeamsInRegional} from "../../../api/bluealliance"
import { apigetMatchesForRegional } from "../../../api"
import { getStat } from "./Utils/GraphUtils"
import { uniqueArr } from "../TableUtils/CalculationUtils"

function LineGraph (props) {
    /* props from custom graph */
    const regional = props.regional //updated in aws
    const selectedTeams = props.selectedTeams // array of teams selected

    const [apiData, setApiData] = useState([]) // matches in our database
    const [availableTeams, setAvailableTeams] = useState([])  //teams that have data to view
    const [xAxis, setXAxis] = useState([]) //state to hold qms
    const [statType, setStatType] = useState([]) //stat to hold type of stat
    const [accessor, setAccessor] = useState([]) //the phase(tele/auto) or overall (total)
    
    /*
     Runs in sync with external data fetch for our database
     Finds and trims array to uniquely show qms
     does the same for teams array
     */
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
    },[selectedTeams, statType, accessor, apiData]); //runs dependin on the change of selected teams, stattype, accessor, and matches

    /* 
    creaets an object for teams  
    if there are no teams selected then show all teams
    else use the selected teams array to display that team(s)' stattype through getstat method
    */
    const createTeamObjArr = () => {
        if(selectedTeams.length === 0) {
            const dataArr =  availableTeams.map(x => {
                const stat = getStat(x, statType, accessor, apiData)
                return {
                    label: x,
                    data: stat,
                }
            })
            return (
               dataArr
            ) 
        }
        else {
            const dataArr = selectedTeams.map(x => {
                const team = `frc${x.TeamNumber}` 
                const stat = getStat(team, statType, accessor, apiData)
                return {
                    label: x.TeamNumber,
                    data: stat,
                }
            })
            return (
                dataArr
            )
        }
        
    
    }

    /* Reference for graph to be displayed */
    const ref = useRef()
    /* 
    Consolidates the charts required labels and datasets props for the graph
    check chartjs docs for more info
    */
    const lineData = {
        labels: xAxis.sort(),
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
                        <option value ="CoralL2">CoralL2</option>
                        <option value ="CoralL2">CoralL3</option>
                        <option value ="CoralL2">CoralL4</option>
                        <option value ="Processor">Processor</option>
                        <option value ="Net">Net</option>
                        <option value ="Cycles">Cycles</option>
                        <option value ="Points">Points</option>
                        <option value ="AlgaePoints">AlgaePoints</option>
                        <option value ="CoralPoints">CoralPoints</option>
                        <option value ="Endgame">Endgame-Tele</option>
                        <option value ="Human">Human-Tele</option>
                        <option value ="MajorFouls">MajorFouls</option>
                        <option value ="MinorFouls">MinorFouls</option>
                    </select>
            </div>
            <Line ref={ref} data={lineData} /> 

        </div>
    )
}

export default LineGraph;