import React, { useEffect, useState } from "react"
import { useExpanded, useTable, useSortBy, useGlobalFilter } from "react-table"
import { calcColumnSort } from "./TableUtils/CalculationUtils";
import { ueTableData, } from "./TableUtils/MTEffectFunc"
import QualsView from "./Views/QualsView";
import AllianceSelectionView from "./Views/AllianceSelectionView";
import ElimsView from "./Views/ElimsView";
import SearchView from "./Views/SearchView";
import AllView from "./Views/AllView";
import 'chart.js/auto';

import { apiGetRegional } from "../../api"

//CSS
import tableStyles from "./Table.module.css";

function Summary() {
  const regional = apiGetRegional() //updated in aws

  const [tableData, setTableData] = useState([]); //data on table
  const [sortBy, setSortBy] = useState([]); //for grade based on checkboxes and prioritities
  const [teamsClicked, setTeamsClicked] = useState([]); //teams clicked in the default table
  const [currentView, setCurrentView] = useState(''); // current view: 'all', 'search', 'quals', 'alliance', 'elims'
  /* runs in sync with the functions of EffectFunc function to call the function for the table data(avgs/modes/stats) */
  useEffect(() => {
    ueTableData(tableData, regional)
      .then(data => {
        setTableData(data)
      })
      .catch(err => console.error('error building table data', err))
  }, [sortBy, teamsClicked, regional]) //depended on the teams clicked, sortby, and regional readiness

  /* Function to return an object to an array with game specific avgs for the individual team clicked */
  const handleTeamClicked = (team) => {
    const indivTeam = tableData.find((x) => x.TeamNumber === parseInt(team))
    const teamObj = {
      TeamNumber: team,
      AvgPoints: indivTeam.AvgPoints,
      AvgAutoPts: indivTeam.AvgAutoPts,
      AvgEndgamePts: indivTeam.AvgEndgamePts,
      AvgCoralPts: indivTeam.AvgCoralPts,
      AvgAlgaePts: indivTeam.AvgAlgaePts,
      AvgCycles: indivTeam.AvgCycles,
      AvgCoral: indivTeam.AvgCoral,
      AvgAlgae: indivTeam.AvgAlgae,
      RobotSpeed: indivTeam.RobotSpeed,
      RobotHang: indivTeam.RobotHang,
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
          const grade = calcColumnSort(sortBy, team.NCoral, team.NAlgae, team.NCycles, team.NPts, team.NAutoPts, team.NEndgamePts, team.NCoralPts, team.NAlgaePts)
          return {
            TeamNumber: team.TeamNumber,
            Matches: team.Matches,
            OPR: team.OPR,

            SumPriorities: grade !== 0.000 ? grade : 0,

            NCoral: team.NCoral,
            NAlgae: team.NAlgae,
            NCycles: team.NCycles,
            NPts: team.NPts,
            NAutoPts: team.NAutoPts,
            NEndgamePts: team.NEndgamePts,
            NCoralPts: team.NCoralPts,
            NAlgaePts: team.NAlgaePts,
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
    regionalEvent: regional,
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
          {["All", "Search","Quals", "Alliance Selection", "Elims"].map((view) => (
            <button
              key={view}
              onClick={() => {
                if (view === "All") setCurrentView('all');
                else if (view === "Quals") setCurrentView('quals');
                else if (view === "Alliance Selection") setCurrentView('alliance');
                else if (view === "Elims") setCurrentView('elims');
                else if (view === "Search") setCurrentView('search');
              }}
                className={`${tableStyles.ToggleButton} ${
                  currentView ===
                    (view === "All"
                      ? 'all'
                      : view === "Alliance Selection"
                      ? 'alliance'
                      : view === 'Search'
                      ? 'search'
                      : view.toLowerCase())
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
      {currentView === 'all' && (
        <AllView
          regional={regional}
        />
      )}
      {currentView === 'search' && (
        <SearchView
          tableData={tableData}
          regional={regional}
          teamsClicked={teamsClicked}
          setTeamsClicked={setTeamsClicked}
        />
      )}
      {currentView === 'quals' && (
        <QualsView 
          tableData={tableData} 
          regional={regional} 
          teamsClicked={teamsClicked}
          setTeamsClicked={setTeamsClicked}
        />
      )}
      {currentView === 'alliance' && (
        <AllianceSelectionView 
          tableData={tableData} 
          regional={regional} 
        />
      )}
      {currentView === 'elims' && (
        <ElimsView 
          tableData={tableData} 
          regional={regional} 
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