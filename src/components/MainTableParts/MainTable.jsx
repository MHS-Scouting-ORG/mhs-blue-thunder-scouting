
import React, { useEffect, useState } from "react"
import { useExpanded, useTable, useSortBy, useGlobalFilter } from "react-table"
import { getMatchesForRegional} from "../../api";
import { getTeamsInRegional, getOprs } from "../../api/bluealliance";
import { tableHandler } from "../InnerTables/InnerTableUtils";
import { getMax, calcDeviation, calcColumnSort, calcLowCubeAcc, calcLowCubeGrid, calcLowConeAcc, calcLowConeGrid, calcLowAcc, calcLowGrid, calcMidCubeAcc, calcMidCubeGrid, calcMidConeAcc, calcMidConeGrid, calcMidGridAcc, calcMidGrid, calcUpperCubeAcc, calcUpperCubeGrid, calcUpperConeAcc, calcUpperConeGrid, calcUpperGridAcc, calcUpperGrid, calcAvgCS, calcAvgCubeAcc, calcAvgCubePts, calcAvgConeAcc, calcAvgConePts, calcAvgGrid, calcAvgPoints, getPenalties, getPriorities } from "./CalculationUtils"
import { ueDebug, ueSetTeamObj, ueTableData } from "./MTEffectFunc"
import GlobalFilter from "../GlobalFilter";
import List from "../List";
import Modal from "../Modal";

function MainTable(props) {
  const regional = props.regional

  const [tableData,setTableData] = useState([]); //data on table
  const [teamsData,setTeamsData] = useState([]); //data of teams
  const [apiData,setApiData] = useState([]) //data retrieved 
  const [deletedData,setDeletedData] = useState([])
  
  const [headerState, setHeaderState] = useState([])

  const [modalState, setModalState] = useState(false);
  const [modalData, setModalData] = useState();

  const [oprList,setOprList] = useState([]);
  const [dprList,setDprList] = useState([]);
  const [ccwmList,setCcwmList] = useState([]);
  //separate variables for filtering ^

  const [sortBy,setSortBy] = useState([]);

  useEffect(ueTableData) //debug purposes or test ^ 

  //useEffect()

   useEffect(() => {
    getTeams()
      .then(data => {
        setTeamsData(data)
        console.log(data)
      })
      .catch(console.log.bind(console))
   },[])
   //^sets team numbers of objects 

   useEffect(() => { //debug, reference, or test
    getMatchesForRegional(regional)
    .then(data => {
      let setApi = data.data.teamMatchesByRegional.items;
      console.log(setApi)      
      deletedData.map(deletedRow => {
        setApi = setApi.filter(x => x.id.substring(x.id.indexOf('_')+1) !== deletedData.original.Match)
      })

      setApiData(setApi)//data.data.teamMatchesByRegional.items)
      //console.log(data.data)       

    })
    .catch(console.log.bind(console))
  }, [teamsData, deletedData]) 

   useEffect(() => {     //set opr data
    getOprs(regional)
    .then(data => { 
      const oprDataArr = Object.values(data)
      const cData = oprDataArr[0] //ccwm 
      const dData = oprDataArr[1] //dpr
      const oData = oprDataArr[2] //opr
      console.log(data)

      setOprList(oData)
      setDprList(dData)
      setCcwmList(cData) 
    })
    .catch(console.log.bind(console))
   },[teamsData])

   useEffect(() => setTableData(teamsData.map(team => { //'big' or whole data array that is used for table

    //console.log(deletedData[0]);
    let teamStats = apiData.filter(x => x.Team === team.TeamNum)/*.filter(x => x.id !== deletedData.map(del => {
      console.log(del)
      del.original.Match
    }))//*/
    deletedData.map(deletedRow => {
      teamStats = teamStats.filter(x => x.id !== regional + "_" + deletedRow.original.Match)
    });

    console.log(teamStats)
    console.log(apiData);

    const points = teamStats.map(x => x.Teleop.ScoringTotal.Total) //for deviation
    const gridPoints = teamStats.map(x => x.Teleop.ScoringTotal.GridPoints)
    const conePts = teamStats.map(x => x.Teleop.ScoringTotal.Cones)
    const cubePts = teamStats.map(x => x.Teleop.ScoringTotal.Cubes)
    const coneAcc = teamStats.map(x => x.Teleop.ConesAccuracy.Overall)
    const cubeAcc = teamStats.map(x => x.Teleop.CubesAccuracy.Overall)

    const mGridPoints = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgGridPoints.substring(2,8))
    const mConePoints = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgConePts.substring(2,8))
    const mConeAcc = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgConeAcc.substring(2,8)) // for sorts
    const mCubePoints = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgCubePts.substring(2,8))
    const mCubeAcc = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgCubeAcc.substring(2,8))
    const mCSPoints = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgCSPoints)

    const avgPoints = calcAvgPoints(teamStats)
    const avgGridPoints = calcAvgGrid(teamStats)
    const avgConePoints = calcAvgConePts(teamStats)
    const avgConeAcc = calcAvgConeAcc(teamStats) //tableData
    const avgCubePoints = calcAvgCubePts(teamStats)
    const avgCubeAcc = calcAvgCubeAcc(teamStats)
    const avgCSPoints = calcAvgCS(teamStats)

    const priorities = getPriorities(teamStats)
    const penalties = getPenalties(teamStats)

    const upperGridPts = calcUpperGrid(teamStats)
    const upperGridAcc = calcUpperGridAcc(teamStats)
    const midGridPts = calcMidGrid(teamStats)
    const midGridAcc = calcMidGridAcc(teamStats)
    const lowerGridPts = calcLowGrid(teamStats)
    const lowerGridAcc = calcLowAcc(teamStats)

    const upperConeAcc = calcUpperConeAcc(teamStats)
    const midConeAcc = calcMidConeAcc(teamStats)
    const lowerConeAcc = calcLowConeAcc(teamStats)

    const upperConePts = calcUpperConeGrid(teamStats)
    const midConePts = calcMidConeGrid(teamStats)
    const lowerConePts = calcLowConeGrid(teamStats)

    const upperCubeAcc = calcUpperCubeAcc(teamStats)
    const midCubeAcc = calcMidCubeAcc(teamStats)
    const lowerCubeAcc = calcLowCubeAcc(teamStats)

    const upperCubePts = calcUpperCubeGrid(teamStats)
    const midCubePts = calcMidCubeGrid(teamStats)
    const lowerCubePts = calcLowCubeGrid(teamStats)

    const maxGridPoints = getMax(tableData.map(team => team.AvgGridPoints.substring(2,8)))
    const maxConePoints = getMax(tableData.map(team => team.AvgConePts.substring(2,8)))
    const maxConeAcc = getMax(tableData.map(team => team.AvgConeAcc.substring(2,8))) //for sorts
    const maxCubePoints = getMax(tableData.map(team => team.AvgCubePts.substring(2,8)))
    const maxCubeAcc = getMax(tableData.map(team => team.AvgCubeAcc.substring(2,8)))
    const maxCSPoints = getMax(tableData.map(team => team.AvgCSPoints))

    const rGridPoints = mGridPoints / maxGridPoints
    const rConePoints = mConePoints / maxConePoints
    const rConeAcc = mConeAcc / maxConeAcc //for sorts
    const rCubePoints = mCubePoints / maxCubePoints
    const rCubeAcc = mCubeAcc / maxCubeAcc
    const rCSPoints = mCSPoints / maxCSPoints
    
    return {
      TeamNumber: team.TeamNumber,
      Matches: team.Matches,
      OPR: oprList[team.TeamNum] ? (oprList[team.TeamNum]).toFixed(2) : null,
      Priorities: priorities.join(', '),
      CCWM: ccwmList[team.TeamNum] ? (ccwmList[team.TeamNum]).toFixed(2) : null, 
      AvgPoints: avgPoints !== 0 && isNaN(avgPoints) !== true ? `μ=${avgPoints}, σ=${calcDeviation(points, avgPoints)}` : '', 
      AvgGridPoints: avgGridPoints !== 0 && isNaN(avgGridPoints) !== true ? `μ=${avgGridPoints}, σ=${calcDeviation(gridPoints, avgGridPoints)}` : '',
      AvgCSPoints: avgCSPoints !== 0 && isNaN(avgCSPoints) !== true ? avgCSPoints : '',
      AvgConePts: avgConePoints !== 0 && isNaN(avgConePoints) !== true ? `μ=${avgConePoints}, σ=${calcDeviation(conePts, avgConePoints)}` : '', 
      AvgConeAcc: avgConeAcc !== 0 && isNaN(avgConeAcc) !== true ? `μ=${avgConeAcc}, σ=${calcDeviation(coneAcc, avgConeAcc)}` : '', 
      AvgCubePts: avgCubePoints !== 0 && isNaN(avgCubePoints) !== true ? `μ=${avgCubePoints}, σ=${calcDeviation(cubePts, avgCubePoints)}` : '', 
      AvgCubeAcc: avgCubeAcc !== 0 && isNaN(avgCubeAcc) !== true ? `μ=${avgCubeAcc}, σ=${calcDeviation(cubeAcc, avgCubeAcc)}` : '', 
      DPR: dprList[team.TeamNum] ? (dprList[team.TeamNum]).toFixed(2) : null, 
      Penalties: penalties.join(', '),

      AvgUpper: upperGridPts,
      AvgUpperAcc: upperGridAcc,
      AvgMid: midGridPts, //for inner tables
      AvgMidAcc: midGridAcc,
      AvgLower: lowerGridPts,
      AvgLowerAcc: lowerGridAcc,

      AvgUpperConeAcc: upperConeAcc,
      AvgMidConeAcc: midConeAcc,
      AvgLowerConeAcc: lowerConeAcc,

      AvgUpperConePts: upperConePts,
      AvgMidConePts: midConePts,
      AvgLowerConePts: lowerConePts,

      AvgUpperCubeAcc: upperCubeAcc,
      AvgMidCubeAcc: midCubeAcc,
      AvgLowerCubeAcc: lowerCubeAcc,

      AvgUpperCubePts: upperCubePts,
      AvgMidCubePts: midCubePts,
      AvgLowerCubePts: lowerCubePts,

      NGridPoints: isNaN(rGridPoints) !== true ? rGridPoints : 0,
      NConePoints: isNaN(rConePoints) !== true ? rConePoints : 0, 
      NConeAccuracy: isNaN(rConeAcc) !== true ? rConeAcc : 0, //for sorts
      NCubePoints: isNaN(rCubePoints) !== true ? rCubePoints : 0, 
      NCubeAccuracy: isNaN(rCubeAcc) !== true ? rCubeAcc : 0,
      NChargeStation: isNaN(rCSPoints) !== true ? rCSPoints : 0,
    }
  })), [teamsData, oprList, dprList, ccwmList, deletedData])

const getTeams = async () => {
   return await (getTeamsInRegional(regional))
    .catch(err => console.log(err))
    .then(data => {
      return data.map(obj => {
        const teamNumObj = {
          TeamNumber: obj.team_number,
          Matches: '',
          OPR: "",
          Priorities: '',
          CCWM: "", 
          AvgPoints: 0,
          AvgGridPoints: 0,
          AvgConePts: 0,
          AvgConeAcc: 0,
          AvgCubePts: 0,
          AvgCubeAcc: 0,
          AvgCSPoints: 0,
          DPR: "",
          Penalties: "",
          TeamNum: `frc${obj.team_number}`,

          NGridPoints: 0,
          NConePoints: 0, 
          NConeAccuracy: 0, 
          NCubePoints: 0, 
          NCubeAccuracy: 0, 
          NChargeStation: 0,
        }

        return teamNumObj
      })
    })
    .catch(err => console.log(err))
}

const modalClose = () => {
  setModalState(false);
} 

const modalOpen = () => {
  setModalState(true)
  return modalState
}

const setDataModal = (row) => {
    let setModal = apiData;
    setModal = setModal.filter(x => x.Team === row.original.Team).filter(team => team.id === regional + "_" + row.original.Match);
    setModalData(setModal)
}


// ======================================= !TABLE HERE! ===========================================
const data = /*tableData;*/ React.useMemo(
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
  }) , [tableData, sortBy] 
)

  const columns = React.useMemo(
    () => [
      {
        Header: "Team #",
        accessor: "TeamNumber",
        Cell: ({ row }) => (
          <span{...row.getToggleRowExpandedProps()}>
            <div style={{fontWeight: 'bold', fontSize: '17px', }}>
              {row.values.TeamNumber}
              {row.isExpanded ? console.log(modalState) : console.log()}
            </div>
          </span>
          )
      },
      {
        Header: "Priorities/Strategies",
        accessor: "Priorities",
        Cell:({ row }) => (
          <div
              style = {{
                minWidth:'150px',
                whiteSpace:'normal',
              }}
          >
            {row.original.Priorities}
          </div>
        ) 
      },
      {
        Header: "OPR",
        accessor: "OPR",
      },
      {
        Header: "CCWM",
        accessor: "CCWM",
      },
      {
        Header: "Avg Points",
        accessor: "AvgPoints",
      },
      {
        Header: "Avg CS Points",
        accessor: "AvgCSPoints"
      },
      {
        Header: "Avg Grid Points",
        accessor: "AvgGridPoints",
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
              {row.values.AvgGridPoints}
          </span>) 
      },
      {
        Header: "Avg Cone Points",
        accessor: "AvgConePts",
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
              {row.values.AvgConePts}
          </span>) 
      },
      {
        Header: "Avg Cone Acc",
        accessor: "AvgConeAcc",
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
              {row.values.AvgConeAcc}
          </span>) 
      },
      {
        Header: "Avg Cube Points",
        accessor: "AvgCubePts",
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
              {row.values.AvgCubePts}
          </span>) 
      },
      {
        Header: "Avg Cube Acc",
        accessor: "AvgCubeAcc",
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
              {row.values.AvgCubeAcc}
          </span>) 
      },
      {
        Header: "DPR",
        accessor: "DPR",
      },
      {
        Header: "Penalties",
        accessor: "Penalties",
        Cell: ({ row }) => (
          <div
              style = {{
                minWidth:'20px',
                whiteSpace: 'normal',
              }}
          >
            {row.original.Penalties}
          </div>
        )
      },
      {
        Header: "Grade",
        accessor: "SumPriorities",
      }
    ], []
  )

  const tableInstance = useTable({ columns, data}, useGlobalFilter, useSortBy, useExpanded);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    setGlobalFilter,
    prepareRow,
    visibleColumns,
  } = tableInstance

  const {globalFilter} = state
  
  return (
    <div>
      <Modal regional={regional} onOff={modalState} offFunction={modalClose} data={modalData}></Modal>

      <h1>CHARGED UP STATISTICS  <img src={"./images/bluethundalogo.png"} width="75px" height= "75px"></img>
      </h1>
            <table style={{ width:'1250px'}} >
                <tbody>
                    <tr>
                        <td
                            style={{
                                minWidth: '750px',
                                textAlign: 'left',
                            }}
                        >
                            <p style={{fontSize: '18px'}}> Select checkboxes to choose which priorities to sort by. Then click on <strong>Grade</strong>. </p>
                            {<List setList={setSortBy}/>}
                            <br/>
                        </td>
                        <td>
                        <p style={{
                            textAlign: 'center',
                            border: '2px solid white',
                            maxWidth: '600px',
                            display: 'inline-block',
                            padding: '5px',
                            fontSize: '20px',
                          }}>
                          <strong>KEY:</strong> 
                          <br/> "Avg" / μ = Average
                          <br/> σ = Standard Deviation
                          <br/> Acc = Accuracy
                      </p>
                      <img src={"./images/community.jpg"} width="260px" height="240px"
                          style={{
                              display: 'inline-block',
                              padding: '10px',
                          }}
                        ></img>
                        </td>
                    </tr>
                </tbody>
            </table>


      <GlobalFilter filter={globalFilter} set={setGlobalFilter}/>
      <br></br>
      <br></br>
      <table style={{ width:'1250px', borderCollapse: 'collapse', overflowX: 'scroll', }} {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                
                
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    background: '#78797A',
                  }}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        
          {rows.map(row => {
            prepareRow(row)
            return ( <React.Fragment>
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (   
                    <td 
                      onClick = {() => {
                        setHeaderState(cell.column.Header)
                      }}
                   
                      {...cell.getCellProps()}
                      style={{
                        padding: '8px',
                        borderBlock: 'solid 2px #78797A',
                        textAlign: 'center',
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>

              {
                row.isExpanded ? tableHandler(row, headerState, visibleColumns, tableData, apiData, modalOpen, setDataModal): null


              }
                  </React.Fragment>
            )
          })} 
        </tbody>
      </table>
      <br></br>
    </div>
  )
}

export  default MainTable; 