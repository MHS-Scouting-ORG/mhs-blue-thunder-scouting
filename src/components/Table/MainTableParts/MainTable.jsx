import React, { useEffect, useState } from "react"
import { useExpanded, useTable, useSortBy, useGlobalFilter } from "react-table"
import { getOprs } from "../../../api/bluealliance";
import { calcColumnSort, arrMode } from "./CalculationUtils"
import { ueTableData, } from "./MTEffectFunc"
import { getMatchesForRegional } from "../../../api";
import GlobalFilter from "../GlobalFilter";
import List from "../List";
import Modal from "../Modal";
import StatsTable from "./StatsTable";
import RobotPerformance from "./RobotPerformance";
import RobotCapabilities from "./RobotCapabilities";
import RobotAuto from "./RobotAuto";
import CustomRanking from "./CustomRanking";
import FieldInfo from "./FieldInfo";
import Penalties from "./Penalties";
import TeamMatches from "./TeamMatches";
import Bookmarks from "./Bookmarks";
import RankingTable from "./RankingTable"

function MainTable(props) {
  const regional = props.regional

  const [tableData, setTableData] = useState([]); //data on table

  const [modalState, setModalState] = useState(false);
  const [modalData, setModalData] = useState();

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

        const matchEntries = nApiData.map((matchEntry) => {
          matchEntry.bookMark = false;
          return matchEntry
        })

        setApiData(matchEntries)
        console.log(matchEntries)
      })
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
        console.log(holdTableData)
        setTableData(holdTableData)
      })
      .catch(console.log.bind(console))
  }, [apiData, oprList, sortBy,])

  const modalClose = () => {
    setModalState(false);
  }

  // const modalOpen = () => {
  //   setModalState(true)
  //   return modalState
  // }

  // const setDataModal = (row) => {

  //   const getApiData =  async () => {
  //     return await getMatchesForRegional('2023azva')
  //       .then(data => {
  //         let apiData = data.data.teamMatchesByRegional.items
  //           return apiData
  //     })
  //   }

  //     let setModal = apiData;
  //     setModal = getApiData().filter(x => x.Team === row.original.Team).filter(team => team.id === regional + "_" + row.original.Match);
  //     setModalData(setModal)
  // }


  //=========================================================//

  const addBookmark = (row) => {
    console.log(bookmark)
    console.log(row)
    const teamNumber = row.original.Team
    const matchNumber = row.cells[0].value;
    console.log(teamNumber)
    console.log(matchNumber)

    const changeApiData = async () => {
      try {
        const allData = await getMatchesForRegional(regional)
        const newApiData = allData.data.teamMatchesByRegional.items

        const arrNewBookmark = newApiData.filter((matchEntry) => (teamNumber === matchEntry.Team.substring(3) && matchNumber === matchEntry.id.substring((matchEntry.id).indexOf("_") + 1)))
        const newBookmarkEntry = arrNewBookmark[0]
        console.log(newBookmarkEntry)

        let tempBookmark = bookmark
        tempBookmark.find(x => teamNumber === x.Team.substring(3) && matchNumber === x.id.substring((x.id).indexOf("_") + 1)) ? null : tempBookmark.push(newBookmarkEntry)


        console.log(tempBookmark)
        setBookmark(tempBookmark)
      }
      catch (err) {
        console.log(err)
      }
    }
    console.log(bookmark)
    changeApiData();
  }

  const removeBookmark = (row) => {
    const teamNumber = row.cells[0].value
    const matchNumber = row.cells[1].value

    const newBookmarkEntries = bookmark.filter((bookmarkedEntry) => !(teamNumber === bookmarkedEntry.Team.substring(3) && matchNumber === bookmarkedEntry.id.substring((bookmarkedEntry.id).indexOf("_") + 1))).splice(0)

    console.log(newBookmarkEntries)
    setBookmark(newBookmarkEntries)
  }
  //   const newMatchEntries = newApiData.forEach((matchEntry) => {
  //     if(teamNumber === matchEntry.Team.substring(3) && matchNumber === matchEntry.id.substring((matchEntry.id).indexOf("_") + 1)){
  //       //bookmark[bookmark.length] = matchEntry
  //       console.log(bookmark)
  //       setBookmark(bookmark.push(matchEntry))
  //       console.log(bookmark)
  //       // matchEntry.bookMark = !matchEntry.bookMark
  //     })
  // }



  const data = React.useMemo(
    () => tableData.map(team => {
      const grade = calcColumnSort(sortBy, team.NGridPoints, team.NConePoints, team.NConeAccuracy, team.NCubePoints, team.NCubeAccuracy, team.NChargeStation)

      return {
        TeamNumber: team.TeamNumber,
        Matches: team.Matches,
        OPR: team.OPR,
        Priorities: team.Priorities,
        CCWM: team.CCWM,
        AvgPoints: team.AvgPoints,
        AvgCSPoints: team.AvgCSPoints,
        AvgGridPoints: team.AvgGridPoints,
        AvgConePts: team.AvgConePts,
        AvgConeAcc: team.AvgConeAcc,
        AvgCubePts: team.AvgCubePts,
        AvgCubeAcc: team.AvgCubeAcc,
        DPR: team.DPR,
        Penalties: team.Penalties,
        SumPriorities: grade !== 0.000 ? grade : "",

        NGridPoints: team.NGridPoints,
        NConePoints: team.NConePoints,
        NConeAccuracy: team.NConeAccuracy,
        NCubePoints: team.NCubePoints,
        NCubeAccuracy: team.NCubeAccuracy,
        NChargeStation: team.NChargeStation,

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
    // getTableProps,
    // getTableBodyProps,
    // headerGroups,
    // rows,
    state,
    setGlobalFilter,
    // prepareRow,
    // visibleColumns,
  } = tableInstance

  const { globalFilter } = state

  return (
    <div>
      <Modal regional={regional} onOff={modalState} offFunction={modalClose} data={modalData}></Modal>
      <h1 style={{ textAlign: 'center' }}>Crescendo<img src={"./images/bluethundalogo.png"} width="75px" height="75px"></img>
      </h1>
      <table style={{ width: '1250px' }} >
        <tbody>
          <tr>
            <td
              style={{
                minWidth: '750px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '18px' }}> Select checkboxes to choose which priorities to sort by. <strong>For Custom Ranking.</strong> Then click on <strong>Grade</strong>. </p>
              {<List setList={setSortBy} />}
              <br />
              <div style={{ display: 'flex', justifyContent: 'center', columnGap: '100px' }}>
                <div>
                  <CustomRanking information={tableData} gFilter={globalFilter != undefined ? globalFilter : ''}></CustomRanking>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', columnGap: '100px' }}>
                  <RankingTable regionalEvent={regional} gFilter={globalFilter != undefined ? globalFilter : ''} />
                </div>
                <div>
                  <FieldInfo information={tableData} gFilter={globalFilter != undefined ? globalFilter : ''} />
                </div>
              </div>


              <div style={{ display: 'flex', justifyContent: 'center', columnGap: '100px' }}>
                <TeamMatches handleBookmark={addBookmark} information={tableData} teamMatches={apiData} gFilter={globalFilter != undefined ? globalFilter : ''}></TeamMatches>
                <Bookmarks bookmarkData={bookmark} handleBookmark={removeBookmark} information={tableData} gFilter={globalFilter != undefined ? globalFilter : ''}></Bookmarks>
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
        {/* topRow */}
        <div style={{ display: 'flex', justifyContent: 'center', columnGap: '100px' }}>
          <div>
            <RobotCapabilities information={tableData} gFilter={globalFilter != undefined ? globalFilter : ''} />
          </div>
          <div>
            <RobotPerformance information={tableData} gFilter={globalFilter != undefined ? globalFilter : ''} />
          </div>
        </div>
        {/* secondRow*/}
        <div style={{ display: 'flex', justifyContent: 'center', columnGap: "100px" }}>

          <div>
            <StatsTable information={tableData} gFilter={globalFilter != undefined ? globalFilter : ''} />
          </div>
          <div>
            <Penalties information={tableData} gFilter={globalFilter != undefined ? globalFilter : ''} />
          </div>
          <div>
            {/* right */}
            <RobotAuto information={tableData} gFilter={globalFilter != undefined ? globalFilter : ''} />
          </div>
        </div>
      </div>


    </div>
  )
}

export default MainTable; 