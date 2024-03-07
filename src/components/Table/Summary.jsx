import React, { useEffect, useState } from "react"
import { useExpanded, useTable, useSortBy, useGlobalFilter } from "react-table"
import { getOprs } from "../../api/bluealliance";
import { calcColumnSort } from "./TableUtils/CalculationUtils"
import { ueTableData, } from "./TableUtils/MTEffectFunc"
import { getMatchesForRegional } from "../../api";
import GlobalFilter from "./TableUtils/GlobalFilter";
import List from "./TableUtils/List";
import StatsTable from "./Tables/StatsTable";
import RobotPerformance from "./Tables/RobotPerformance";
import RobotCapabilities from "./Tables/RobotCapabilities";
import RobotAuto from "./Tables/RobotAuto";
import Penalties from "./Tables/Penalties";
import TeamMatches from "./Tables/TeamMatches";
import Bookmarks from "./Tables/Bookmarks";
import RankingTable from "./Tables/RankingTable"

function Summary(props) {
  const regional = props.regional

  const [tableData, setTableData] = useState([]); //data on table

  const [sortBy, setSortBy] = useState([]);

  const [apiData, setApiData] = useState([])
  const [oprList, setOprList] = useState([]);
  const [dprList, setDprList] = useState([]);
  const [ccwmList, setCcwmList] = useState([]);

  const [bookmark, setBookmark] = useState([]);

  useEffect(() => {
    getMatchesForRegional(regional)
      .then(data => {
        const nApiData = data.data.teamMatchesByRegional.items

        //console.log(nApiData)
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
        const cData = oprDataArr[0] //ccwm 
        const dData = oprDataArr[1] //dpr
        const oData = oprDataArr[2] //opr

        setOprList(oData)
        setDprList(dData)
        setCcwmList(cData)
      })
  }, [])

  useEffect(() => {
    ueTableData(oprList, ccwmList, dprList, tableData, regional)
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
      }
    }), [tableData, sortBy]
  )

  const columns = React.useMemo(
    () => [
      {
        Header: "Team #",
        accessor: "TeamNumber",
        Cell: ({ row }) => (
          <span{...row.getToggleRowExpandedProps()}>
            <div style={{ fontWeight: 'bold', fontSize: '17px', maxWidth: '20px' }}>
              {row.values.TeamNumber}
            </div>
          </span>
        )
      },
      {
        Header: "Priorities/Strategies",
        accessor: "Priorities",
        Cell: ({ row }) => (
          <div
            style={{
              whiteSpace: 'normal',
            }}
          >
            {row.original.Priorities}
          </div>
        )
      },

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
      <h1 style={{ textAlign: 'center' }}>Crescendo<img src={"./images/bluethundalogo.png"} width="75px" height="75px"></img>
      </h1>
      <table >
        <tbody>
          <tr>
            <td

            >

              <p style={{ fontSize: '18px' }}> Select checkboxes to choose which priorities to sort by. Then click on <strong>Grade</strong>. </p>
              {<List setList={setSortBy} />}
              <br />
              {/* first row container */}
              <div >

                <div>
                  <RankingTable sortData = {data} regionalEvent={regional} {...filterState} />
                </div>

                <div>
                  <RobotAuto {...filterState} />
                </div>

              </div>
              {/* Second row container */}
              <div>

                <TeamMatches handleBookmark={addBookmark} teamMatches={apiData} event={regional} {...filterState}></TeamMatches>
                <Bookmarks bookmarkData={bookmark} handleBookmark={removeBookmark} {...filterState}></Bookmarks>

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
        <div >

          <div>
            <RobotCapabilities {...filterState} />
          </div>
          <div>
            <RobotPerformance {...filterState} />
          </div>

        </div>

        {/* secondRow container*/}
        <div >

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

export default Summary; 