import React, {useEffect, useState, useRef} from "react"
import {Bubble} from "react-chartjs-2"
import { getTeamsInRegional} from "../../../api/bluealliance"
import { getBubbleStat } from "./Utils/GraphUtils"
import { getRankingsForRegional } from "../../../api/bluealliance";
import AvgStatSelect from "./subcomponents/AvgStatSelect"


function BubbleGraph (props) {
    const tableData = props.tableData // tableData
    const regional = props.regional

    const [bubbleData, setBubbleData] = useState([])
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
      }, [statY, statZ])

    const getTeamMatches = () => {
        const temp = rankingState.map(team => {
            const teamTableData = tableData.filter(x => x.TeamNumber === parseInt(team.team_key.substring(3)))
            const teamStatY = getBubbleStat(teamTableData,statY)
            const teamStatZ = getBubbleStat(teamTableData, statZ)
            return {
                label: team.team_key.substring(3),
                data: [
                    {
                        x: team.rank,
                        z: teamStatZ,
                        y: teamStatY,
                    }
                ]
            }
        })
        setBubbleData(temp)
    }

    const handleStatYClicked = (ac) => {
        setStatY(ac)
        console.log(statY, "stateY")
        console.log(ac, "acY")
    }

    const handleStatZClicked = (ac) => {
        setStatZ(ac)
        console.log(statZ, "stateZ")
        console.log(ac, "acZ")
    }

    const ref = useRef()

    const data = {
        datasets: bubbleData
    }

    return (
        <div>
            <div>
                <AvgStatSelect handleStatYClicked={handleStatYClicked} id={0} />  
                <AvgStatSelect handleStatZClicked={handleStatZClicked} id={1}/>  
            </div>
            <Bubble ref={ref} data={data} /> 

        </div>
    )
}

export default BubbleGraph;