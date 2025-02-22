import React, { useEffect, useState, useRef } from "react"
import { useExpanded, useTable, useSortBy, useGlobalFilter } from "react-table"
import { getOprs } from "../../api/bluealliance";
import { calcColumnSort } from "./TableUtils/CalculationUtils";
import { ueTableData, } from "./TableUtils/MTEffectFunc"
import { apigetMatchesForRegional } from "../../api";
import GlobalFilter from "./TableUtils/GlobalFilter";
import List from "./TableUtils/List";
import TeamStats from "./Tables/TeamStats";
import DefaultTable from "./Tables/DefaultTable"
import CustomGraph from "./Graphs/CustomGraph"
import 'chart.js/auto';

import { apiGetRegional } from "../../api"

//CSS
import tableStyles from "./Table.module.css";

function Summary(props) {
  const regional = apiGetRegional()

  const [tableData, setTableData] = useState([]); //data on table

  const [sortBy, setSortBy] = useState([]);

  const [apiData, setApiData] = useState([])
  const [oprList, setOprList] = useState([]);

  const [teamsClicked, setTeamsClicked] = useState([]);

  useEffect(() => {
    apigetMatchesForRegional(regional)
      .then(data => {
        const nApiData = data.data.teamMatchesByRegional.items

        console.log(regional + " regional")
        const matchEntries = nApiData.map((matchEntry) => {
          matchEntry.bookMark = false;
          return matchEntry
        })

        setApiData(matchEntries)
        console.log("current matches", matchEntries)

      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {    //change to statbotics
    getOprs(regional)
      .then(data => {
        const oprDataArr = Object.values(data)
        const oData = oprDataArr[2] 

        setOprList(oData)
      })
  }, [])

  useEffect(() => {
    ueTableData(oprList, tableData, regional)
      .then(data => {
        let holdTableData = data
        setTableData(holdTableData)
      })
      .catch(console.log.bind(console))
  }, [apiData, oprList, sortBy, teamsClicked])

  const handleTeamClicked = (team, val) => {
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

  const filterState = {
    information: tableData,
    gFilter: globalFilter || '',
    regionalEvent: regional,
    teamHandler: handleTeamClicked,
    selectedTeams: teamsClicked,
  }

  return (
    <div>
      <br></br>
      <img alt="" style={{ width: '360px' }} src={'./images/STATS-HEADER.png'}></img>

      <p style={{ fontSize: '18px' }}> Select checkboxes to choose which priorities to sort by. Then click on <strong>Grade</strong>. </p>
      {<List setList={setSortBy} />}
      <GlobalFilter filter={globalFilter} set={setGlobalFilter} />
      <br />
      {/* first row container */}
      <div className={tableStyles.TableRow}>

        <div className={tableStyles.TableContainer}>
          <DefaultTable sortData={data} {...filterState} />
        </div>

        <div>
          {/* Custom Graph */}
          <CustomGraph {...filterState}></CustomGraph>
        </div>

      </div>

      <div className={tableStyles.TableRow}>
        <div className={tableStyles.TableContainer}>
          <TeamStats {...filterState} />
        </div>
      </div>
    </div>
  )
}

export default Summary; 