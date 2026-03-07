import React, { useEffect, useState } from "react"
import { useExpanded, useTable, useSortBy, useGlobalFilter } from "react-table"
import { calcColumnSort } from "./TableUtils/CalculationUtils";
import { ueTableData, } from "./TableUtils/MTEffectFunc"
import QualsView from "./Views/QualsView";
import AllianceSelectionView from "./Views/AllianceSelectionView";
import ElimsView from "./Views/ElimsView";
import SearchView from "./Views/SearchView";
import AllView from "./Views/AllView";
import AllLeaderboardView from "./Views/AllLeaderboardView";
import OurMatchesView from "./Views/OurMatchesView";
import 'chart.js/auto';

import { apiGetRegional } from "../../api"

//CSS
import tableStyles from "./Table.module.css";

function Summary() {
  const regional = apiGetRegional() //updated in aws

  const [tableData, setTableData] = useState([]); //data on table
  const [sortBy, setSortBy] = useState([]); //for grade based on checkboxes and prioritities
  const [teamsClicked, setTeamsClicked] = useState([]); //teams clicked in the default table
  const [currentView, setCurrentView] = useState(''); // current view: 'all', 'submissions', 'search', 'quals', 'alliance', 'elims'
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
      RobotSpeed: indivTeam.RobotSpeed,
      RobotHang: indivTeam.RobotHang,
      MaxLevelHang: indivTeam.MaxLevelHang ,
      MultiHang:indivTeam.MultiHang ,
      FuelCap: indivTeam.FuelCap ,
      AutoStrat: indivTeam.AutoStrat ,
      AutoHang: indivTeam.AutoHang ,
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
          const grade = calcColumnSort(sortBy, team.NHangLevel, team.NmultiHang, team.NFuelCap, team.NCrossMid, team.NPts)
          return {
            TeamNumber: team.TeamNumber,
            Matches: team.Matches,
            OPR: team.OPR,
            NHangLevel: team.NHangLevel,
            NMultiHang: team.NmultiHang,
            NFuelCap: team.NfuelCap,
            NCrossMid: team.NCrossMid,
            Npts: team.Npts,
            SumPriorities: grade !== 0.000 ? grade : 0,


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
          {["All", "Submitions", "Search", "Our Matches", "Quals", "Alliance Selection", "Elims"].map((view) => (
            <button
              key={view}
              onClick={() => {
                switch (view){
                  case "All": 
                    setCurrentView('all')
                    break;
                  case "Submitions":
                    setCurrentView('submissions')
                    break;
                  case "Quals":
                    setCurrentView('quals')
                    break;
                  case "Alliance Selection":
                    setCurrentView('alliance')
                    break;
                  case "Elims":
                    setCurrentView('elims')
                    break;
                  case "Search":
                    setCurrentView('search')
                    break;
                  case "Our Matches":
                    setCurrentView('our-matches')
                    break;
              }}}
                className={`${tableStyles.ToggleButton} ${
                  currentView ===
                    (view === "All"
                      ? 'all'
                      : view === 'Submitions'
                      ? 'submissions'
                      : view === "Alliance Selection"
                      ? 'alliance'
                      : view === 'Our Matches'
                      ? 'our-matches'
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
        <AllLeaderboardView
          tableData={tableData}
          regional={regional}
        />
      )}
      {currentView === 'submissions' && (
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
      {currentView === 'our-matches' && (
        <OurMatchesView
          tableData={tableData}
          regional={regional}
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