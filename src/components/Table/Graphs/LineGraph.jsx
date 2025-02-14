import React, {useEffect, useState, useRef} from "react"
import {Line} from "react-chartjs-2"
import { getTeamsInRegional} from "../../../api/bluealliance"
import { getStat } from "./GraphUtils"

function LineGraph (props) {
    const matches = props.matches
    const regional = props.regional

    const [currentTeams, setCurrentTeams] = useState([])
    const [selectedTeam, setSelectedTeam] = useState([])
    const [teamMatches, setTeamMatches] = useState([]) 
    const [xAxis, setXAxis] = useState([])
    const [yAxis, setYAxis] = useState ([])
    const [statType, setStatType] = useState([])
    const [accessor, setAccessor] = useState([])

    useEffect(() => {
        getTeamsInRegional(regional)
        .then(data => {
            const temp = data.map(x => x.key.substring(3))
            setCurrentTeams(temp)
            getTeamMatches(selectedTeam)
            //console.log("teamMatches", teamMatches)
            const xLegend = teamMatches.map(x => (x.id).substring((x.id).indexOf("_") + 1)) 
            setXAxis(xLegend)
            setYAxis(getStat(teamMatches, statType, accessor))
        })
    },[selectedTeam, teamMatches, statType]);

    const getTeamMatches = (team) => {
        const temp = matches.filter(x => x.Team.substring(3) === team)
        setTeamMatches(temp)
    }

    const ref = useRef()

    const lineData = {
        labels: xAxis,
        datasets: [
            {
            label: selectedTeam, 
            data: yAxis, 
            },
        ]
    }

    return (
        <div>
            <div>
                <select onChange = {(e) => {setSelectedTeam(e.target.value)}}>
                    <option value = "">Select Team</option> 
                    {
                        currentTeams.map((team) => {
                            return <option value={team}>{team}</option>
                        })
                    }
                </select>
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