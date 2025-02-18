import React, {useEffect, useState, useRef} from "react"
import { apigetMatchesForRegional} from "../../../api"
import LineGraph from "./LineGraph"



function CustomGraph(props) {
    const regional = props.regional || props.regionalEvent
    const tableData = props.information
    const selectedTeams = props.selectedTeams

    const [apiData, setApiData] = useState([])

    useEffect(() => {
        apigetMatchesForRegional(regional)
        .then(data => {
            setApiData(data.data.teamMatchesByRegional.items)
        })
    },[])

    const graphState = {
        matches: apiData,
        regional: regional,
        tableData: tableData,
        selectedTeams: selectedTeams,
    }

    return (
        <div> 
            <div>Key: Phase = Tele & Auto or Overall TPts & Fouls</div>
            <div>Certain Stats are only visible to Tele or Auto</div>
            <LineGraph {...graphState} />
        </div>
    )
}

export default CustomGraph
