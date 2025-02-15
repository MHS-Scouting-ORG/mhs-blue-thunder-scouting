import React, {useEffect, useState, useRef} from "react"
import {Radar} from "react-chartjs-2"
import { getTeamsInRegional} from "../../../api/bluealliance"
import { getBubbleStat } from "./Utils/GraphUtils"
import { getRankingsForRegional } from "../../../api/bluealliance";
import AvgStatSelect from "./subcomponents/AvgStatSelect"


function RadarGraph (props) {
    const matches = props.matches // apidata
    const tableData = props.tableData //tableData
    const regional = props.regional

    const [bubbleData, setBubbleData] = useState([])
    const [selectedTeam, setSelectedTeam] = useState([])
    const [statY, setStatY] = useState([])
    const [statZ, setStatZ] = useState([])

    const [rankingState, setRankingState] = useState([])

    useEffect(() => {
        getRankingsForRegional(regional)
          .then(data => {
            setRankingState(Object.values(data)[1]) 
            getTeamMatches()
          })
          .catch(err => console.log(err))
      }, [])

    const getTeamMatches = () => {
        const teamTableData = tableData.filter(x => x.TeamNumber === selectedTeam)
        const avgPts = teamTableData[0].AvgPoints
        const avgAutoPts = teamTableData[0].AvgAutoPts
        const avgEndgamePts = teamTableData[0].AvgEndgamePts
        const avgCoralPts = teamTableData[0].AvgCoralPts
        const avgAlgaePts = teamTableData[0].AvgAlgaePts
        const avgCycles = teamTableData[0].AvgCycles
        const avgCoralAcc = teamTableData[0].AvgCoralAcc
        const avgAlgaeAcc = teamTableData[0].AvgAlgaeAcc
        const avgCoralScored = teamTableData[0].AvgCoralScored
        const avgAlgaeScored = teamTableData[0].AvgAlgae
        setBubbleData(temp)
    }


    const ref = useRef()

    const data = {
        labels: [
            "Average Points",
            "Average Auto Points",
            "Average Endgame Points",
            "Average Coral Points",
            "Average Algae Points",
            "Average Cycles",
            "Average Coral Accuracy",
            "Average Algae Accuracy",
            "Average Coral Scored",
            "Average Algae Scored",
        ],
        datasets: [
            {
                label: toString(selectedTeam),
                data: [10, 20, 30, 40]
            }
        ]
    }

    return (
        <div>
            <div>
                <select onChange={(e) => {setSelectedTeam(e.target.value)}}>
                    <option>Select Team</option>
                    {
                        rankingState.map(team => {
                            const teamNum = team.team_key.substring(3)
                            return <option value={teamNum}>{teamNum}</option>
                        })
                    }
                </select>
            </div>
            <Radar ref={ref} data={data} /> 

        </div>
    )
}

export default RadarGraph;