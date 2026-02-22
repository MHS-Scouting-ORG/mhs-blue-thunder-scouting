import React, { useEffect, useState, useRef } from "react"
import { useExpanded, useTable, useSortBy, useGlobalFilter } from "react-table"
import { calcColumnSort } from "./TableUtils/CalculationUtils";
import { ueTableData, } from "./TableUtils/MTEffectFunc"
import { apigetMatchesForRegional } from "../../api";
import GlobalFilter from "./TableUtils/GlobalFilter";
import List from "./TableUtils/List";
import TeamStats from "./Tables/TeamStats";
import DefaultTable from "./Tables/DefaultTable"
import CustomGraph from "./Graphs/CustomGraph"
import QualsView from "./Views/QualsView";
import AllianceSelectionView from "./Views/AllianceSelectionView";
import ElimsView from "./Views/ElimsView";
import 'chart.js/auto';

import { apiGetRegional } from "../../api";

//CSS
import tableStyles from "./Table.module.css";

function Summary() {
  const regional = apiGetRegional()

  const [tableData, setTableData] = useState([]); //data on table
  const [sortBy, setSortBy] = useState([]); //for grade based on checkboxes and prioritities
  const [teamsClicked, setTeamsClicked] = useState([]); //teams clicked in the default table
  const [currentView, setCurrentView] = useState(''); // current view: 'quals', 'alliance', 'elims'
  /* runs in sync with the functions of EffectFunc function to call the function for the table data(avgs/modes/stats) */
  useEffect(() => {
    ueTableData(tableData)
      .then(data => {
        console.log("tableData", tableData)
        let holdTableData = data
        setTableData(holdTableData)
      })
      .catch(console.log.bind(console))
  }, [sortBy, teamsClicked]) //depended on the teams clicked and sortby

  /* Function to return an object to an array with game specific avgs for the individual team clicked */
  const handleTeamClicked = (team) => {
    const indivTeam = tableData.find((x) => x.TeamNumber === parseInt(team))
    const teamObj = {
      TeamNumber: team,
      FuelCap: indivTeam.FuelCap,
      ShootingCycles: indivTeam.ShootingCycles,
      MultiHang: indivTeam.MultiHang,
      RobotSpeed: indivTeam.RobotSpeed,
      AvgHangTime: indivTeam.AvgHangTime,
      AutoStrat: indivTeam.AutoStrat,
      AutoHang: indivTeam.AutoHang,
      EndgameHangLevel: indivTeam.EndgameHangLevel,
      ActiveStrat: indivTeam.ActiveStrat,
      InactiveStrat: indivTeam.InactiveStrat,
      ShooterSpeed: indivTeam.ShooterSpeed,
      Fouls: indivTeam.Fouls,
      Tech: indivTeam.Tech,
      YellowCard: indivTeam.YellowCard,
      RedCard: indivTeam.RedCard,
      BrokenRobot: indivTeam.BrokenRobot,
      Disabled: indivTeam.Disabled,
      DQ: indivTeam.DQ,
      NoShow: indivTeam.NoShow,
      key: team,
    }
    /* 
    sets the teams clicked by capturing the team clicked 
    and adding to the array if the find does not find it already in the array 
    */
  setTeamsClicked(teamsClicked => {
    if(teamsClicked.find((x) => x.TeamNumber === team) === undefined){
      return [...teamsClicked, teamObj]
    }
    else{
      const index = teamsClicked.findIndex(x => teamObj.TeamNumber === x.TeamNumber)
      return  teamsClicked.toSpliced(index, 1)
    }
    })
  }
  /* runs grade function to sort the default table by selected priorities by our database */
  const data = React.useMemo(
    () => {
      if (tableData) {
        return tableData.map(team => {
          const grade = calcColumnSort(sortBy, team.NPts)
          return {
            TeamNumber: team.TeamNumber,
            Matches: team.Matches,
            OPR: team.OPR,

            SumPriorities: grade !== 0.000 ? grade : 0,
            
            NFuel: team.NFuel,
            
          }
        })
      }
      else {
        return []
      }     
    }, [tableData, sortBy]
  )
  /*  used in default table*/
  const columns = React.useMemo(
    () => [
      {
        Header: "Grade",
        accessor: "SumPriorities",
      }
    ], []
  )

  const tableInstance = useTable({ columns, data }, useGlobalFilter, useSortBy, useExpanded);

  const {
    state,
    setGlobalFilter,
  } = tableInstance

  const { globalFilter } = state

  /* constant that holds the properties used in various different components (reduces repetitiveness) */
  const filterState = {
    information: tableData,
    gFilter: globalFilter || '',
    teamHandler: handleTeamClicked,
    selectedTeams: teamsClicked,
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", minHeight: "100vh", overflowY: "auto" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <img 
          src="./images/BLUETHUNDERLOGO_BLUE.png" 
          alt="2443 Blue Thunder Logo"
          style={{ maxWidth: "100px", height: "auto", marginBottom: "10px" }}
        />
        <h1 style={{ margin: "0", color: "#333", fontSize: "1.8em" }}>TABLE</h1>
      </div>

      {/* View Tabs */}
      <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
        <div style={{display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center", flexWrap: "wrap"}}>
          {["Quals", "Alliance Selection", "Elims"].map((view) => (
            <button
              key={view}
              onClick={() => {
                switch (view) {
                  case "Quals":
                    setCurrentView('quals');
                    break;
                  case "Alliance Selection":
                    setCurrentView('alliance');
                    break;
                  case "Elims":
                    setCurrentView('elims');
                }
              }}
                className={`${tableStyles.ToggleButton} ${
                  currentView === (view === "Alliance Selection" ? 'alliance' : view.toLowerCase())
                    ? tableStyles.ToggleButtonOn
                    : tableStyles.ToggleButtonOff
                }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Render Current View */}
      {currentView === 'quals' && (
        <QualsView 
          tableData={tableData} 
          teamsClicked={teamsClicked}
          setTeamsClicked={setTeamsClicked}
          regional={regional}
        />
      )}
      {currentView === 'alliance' && (
        <AllianceSelectionView 
          tableData={tableData} 
        />
      )}
      {currentView === 'elims' && (
        <ElimsView 
          tableData={tableData} 
          teamsClicked={teamsClicked}
          setTeamsClicked={setTeamsClicked}
        />
      )}

      {/* Blank space for consistent scrolling */}
      {currentView === '' && <div style={{ height: '1000px', backgroundColor: 'white' }}></div>}
    </div>
  )
}

export default Summary; 