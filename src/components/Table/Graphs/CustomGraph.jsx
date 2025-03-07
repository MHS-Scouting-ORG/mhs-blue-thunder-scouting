import React, {useEffect, useState, useRef} from "react"
import { apigetMatchesForRegional} from "../../../api"
import LineGraph from "./LineGraph"



function CustomGraph(props) {
    const regional = props.regional || props.regionalEvent //regional (changed in aws)
    const tableData = props.information //data consolidated after form entries and calculations
    const selectedTeams = props.selectedTeams //array of tracked teams that are clicked

    const [apiData, setApiData] = useState([]) //state to hold matches

    /* Runs in sync with external function that grabs our database's matches based on every entry */
    useEffect(() => {
        apigetMatchesForRegional(regional)
        .then(data => {
            setApiData(data.data.teamMatchesByRegional.items)
        })
    },[])

    /* Constant that consolidates props used in LineGraph*/
    const graphState = {
        matches: apiData,
        regional: regional,
        tableData: tableData,
        selectedTeams: selectedTeams,
    }

    return (
        <div display="flex" flexDirection="row"> 
            <div>Phase = (Tele & Auto) OR (Overall TPts & Fouls)</div>
            <div>Certain Stats are only visible to Tele or Auto</div>
            <LineGraph {...graphState} />
        </div>
    )
}

export default CustomGraph
