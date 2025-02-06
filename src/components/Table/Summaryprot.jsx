import React, { useEffect, useState } from "react"
import { useExpanded, useTable, useSortBy, useGlobalFilter } from "react-table"
import { getOprs, getTeamsInRegional } from "../../api/bluealliance";
import { calcColumnSort } from "./TableUtils/CalculationUtils";
import { ueTableData, } from "./TableUtils/MTEffectFunc"
import { getMatchesForRegional } from "../../api";
import GlobalFilter from "./TableUtils/GlobalFilter";
import List from "./TableUtils/List";
import StatsTable from "./Tables/StatsTable";
import RobotPerformance from "./Tables/RobotPerformance";
import RobotCapabilities from "./Tables/RobotCapabilities";
import TeamStats from "./Tables/TeamStats";
import Penalties from "./Tables/Penalties";
import TeamMatches from "./Tables/TeamMatches";
import Bookmarks from "./Tables/Bookmarks";
import DefaultTable from "./Tables/DefaultTable"

import { apiGetRegional } from "../../api"

//CSS
import tableStyles from "./Table.module.css";

function TableProt(props) {
  const regional = apiGetRegional()

  const [tableData, setTableData] = useState([]); //data on table

  const [sortBy, setSortBy] = useState([]);

  const [apiData, setApiData] = useState([])
  const [oprList, setOprList] = useState([]);
  // const [dprList, setDprList] = useState([]);
  // const [ccwmList, setCcwmList] = useState([]);

  const [bookmark, setBookmark] = useState([]);
  const [teamsClicked, setTeamsClicked] = useState([]);

  useEffect(() => {
    getMatchesForRegional(regional)
      .then(data => {
        const nApiData = data.data.teamMatchesByRegional.items

        console.log(regional + " regional")
        const matchEntries = nApiData.map((matchEntry) => {
          matchEntry.bookMark = false;
          return matchEntry
        })

        setApiData(matchEntries)
        console.log(matchEntries)
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {    //set opr data
    getOprs(regional)
      .then(data => {
        const oprDataArr = Object.values(data)
        // const cData = oprDataArr[0] //ccwm 
        // const dData = oprDataArr[1] //dpr
        const oData = oprDataArr[2] //opr

        setOprList(oData)
        // setDprList(dData)
        // setCcwmList(cData)
      })
  }, [])

  useEffect(() => {
    ueTableData(oprList, tableData, regional)
      .then(data => {
        let holdTableData = data
        setTableData(holdTableData)
      })
      .catch(console.log.bind(console))
  }, [apiData, oprList, sortBy,])

  const addBookmark = (row) => {
    const teamNumber = row.original.Team
    const matchNumber = row.cells[0].value;

    const changeApiData = async () => {
      try {
        const allData = await getMatchesForRegional(regional)
        const newApiData = allData.data.teamMatchesByRegional.items

        const arrNewBookmark = newApiData.filter((matchEntry) => (teamNumber === matchEntry.Team.substring(3) && matchNumber === matchEntry.id.substring((matchEntry.id).indexOf("_") + 1)))
        const newBookmarkEntry = arrNewBookmark[0]

        let tempBookmark = bookmark
        tempBookmark.find(x => teamNumber === x.Team.substring(3) && matchNumber === x.id.substring((x.id).indexOf("_") + 1)) ? null : tempBookmark.push(newBookmarkEntry)

        setBookmark(tempBookmark)
      }
      catch (err) {
        console.log(err)
      }
    }
    changeApiData();
  }

  const removeBookmark = (row) => {
    const teamNumber = row.cells[0].value
    const matchNumber = row.cells[1].value

    const newBookmarkEntries = bookmark.filter((bookmarkedEntry) => !(teamNumber === bookmarkedEntry.Team.substring(3) && matchNumber === bookmarkedEntry.id.substring((bookmarkedEntry.id).indexOf("_") + 1))).splice(0)

    setBookmark(newBookmarkEntries)
  }

  const handleTeamClicked = (team) => {
    const settingTeamsClicked = () => {
      try {
        if(teamsClicked.find((x) => x.TeamNumber === team) === undefined){
          setTeamsClicked(teamsClicked => [...teamsClicked, {TeamNumber: team}])
        }
        //console.log("team", team, "teamsClicked", teamsClicked)
        
      }
      catch (err) {
        console.log(err)
      }
    }

    settingTeamsClicked()
  }

  const data = React.useMemo(
    () => tableData.map(team => {
      const grade = calcColumnSort(sortBy, team.NSpeaker, team.NAmp, team.NCycles, team.NPts, team.NAutoPts, team.NHangPts, team.NSpeakerPts, team.NAmpPts)
      return {
        TeamNumber: team.TeamNumber,
        Matches: team.Matches,
        OPR: team.OPR,

        SumPriorities: grade !== 0.000 ? grade : 0,
        
        NSpeaker: team.NSpeaker,
        NAmp: team.NAmp,
        NCycles: team.NCycles,
        NPts: team.NPts,
        NAutoPts: team.NAutoPts,
        NHangPts: team.NHangPts,
        NSpeakerPts: team.NSpeakerPts,
        NAmpPts: team.NAmpPts,

        Selected: team.Selected,
      }
    }), [tableData, sortBy]
  )

  const columns = React.useMemo(
    () => [
      // {
      //   Header: "Team #",
      //   accessor: "TeamNumber",
      //   Cell: ({ row }) => (
      //     <span{...row.getToggleRowExpandedProps()}>
      //       <div style={{ fontWeight: 'bold', fontSize: '17px', maxWidth: '20px' }}>
      //         {row.values.TeamNumber}
      //       </div>
      //     </span>
      //   )
      // },
      // {
      //   Header: "Priorities/Strategies",
      //   accessor: "Priorities",
      //   Cell: ({ row }) => (
      //     <div
      //       style={{
      //         whiteSpace: 'normal',
      //       }}
      //     >
      //       {row.original.Priorities}
      //     </div>
      //   )
      // },

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

  //=======================================================================//
  // const tableInstance = useTable( {}, useGlobalFilter, useSortBy )
  // const {
  //   state,
  //   setGlobalFilter
  // } = tableInstance

  const { globalFilter } = state

  const filterState = {
    information: tableData,
    gFilter: globalFilter || '',
  }

  return (
    <div>
      <br></br>
      <img alt="" style={{ width: '360px' }} src={'./images/TABLEHEADER.png'}></img>
      {/* <h1 style={{ textAlign: 'center' }}>Crescendo<img src={"./images/bluethundalogo.png"} width="75px" height="75px"></img></h1> */}
      <table >
        <tbody>
          <tr>
            <td

            >

              <p style={{ fontSize: '18px' }}> Select checkboxes to choose which priorities to sort by. Then click on <strong>Grade</strong>. </p>
              {<List setList={setSortBy} />}
              <br />
              {/* first row container */}
              <div className={tableStyles.TableRow}>
                <div>
                  <div>Here will be default Table: team #, number, and Quick Evals</div>
                  <DefaultTable sortData = {data} regionalEvent={regional} teamsClicked={handleTeamClicked} {...filterState} />
                </div>

                <div>
                  <div>Here will be populated table/custom table</div>
                  <TeamStats selectedTeams={teamsClicked} {...filterState} />
                </div>

              </div>
              {/* Second row container */}
               <div className={tableStyles.TableRow}>
              
                {/* <TeamMatches handleBookmark={addBookmark} teamMatches={apiData} event={regional} {...filterState}></TeamMatches>
                <Bookmarks bookmarkData={bookmark} handleBookmark={removeBookmark} {...filterState}></Bookmarks>
 */}
              </div>
              <div>
              </div>

              <br></br>
              <br></br>

            </td>
            <td>
            </td>
          </tr>
        </tbody>
      </table>


      <GlobalFilter filter={globalFilter} set={setGlobalFilter} />

      <br></br>
      <br></br>

      <div>
        {/* topRow container */}
        <div className={tableStyles.TableRow}>

          <div>
          <div>Here will be second populated table/custom table or diff type of visualization </div>
            <RobotCapabilities {...filterState} />
          </div>
          <div>
          <div>Here will be graph </div>
            <RobotPerformance {...filterState} />
          </div>

        </div>

        {/* secondRow container*/}
        <div className={tableStyles.TableRow}>

          <div>
            <StatsTable {...filterState} />
          </div>

          <div>
            <Penalties {...filterState} />
          </div>

        </div>
      </div>


    </div>
  )
}

export default TableProt; 