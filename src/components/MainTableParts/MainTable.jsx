
import React, { useEffect, useState } from "react"
import { useExpanded, useTable, useSortBy, useGlobalFilter } from "react-table"
import { getOprs } from "../../api/bluealliance";
import { tableHandler } from "../InnerTables/InnerTableUtils";
import {calcColumnSort} from "./CalculationUtils"
import { ueTableData, } from "./MTEffectFunc"
import { getMatchesForRegional} from "../../api";
import GlobalFilter from "../GlobalFilter";
import List from "../List";
import Modal from "../Modal";

function MainTable(props) { 
  const regional = props.regional

  const [tableData,setTableData] = useState([]); //data on table

  // const [deletedData,setDeletedData] = useState([])
  
  const [headerState, setHeaderState] = useState([])

  const [modalState, setModalState] = useState(false);
  const [modalData, setModalData] = useState();

  const [sortBy,setSortBy] = useState([]);

  const [apiData, setApiData] = useState([])
  const [oprList,setOprList] = useState([]);
  const [dprList,setDprList] = useState([]);
  const [ccwmList,setCcwmList] = useState([]);

  useEffect(() => {
    getMatchesForRegional('2023azva')
      .then(data => {
        const nApiData = data.data.teamMatchesByRegional.items
        setApiData(nApiData)
    })
  },[])

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
  },[])

  useEffect(() => {
    ueTableData(oprList, ccwmList, dprList)
      .then(data => {
        let holdTableData = data
        console.log(holdTableData)
        setTableData(holdTableData)
      })
      .catch(console.log.bind(console))
  }, [])

const modalClose = () => {
  setModalState(false);
} 

const modalOpen = () => {
  setModalState(true)
  return modalState
}

const setDataModal = (row) => {

  const getApiData =  async () => {
    return await getMatchesForRegional('2023azva')
      .then(data => {
        let apiData = data.data.teamMatchesByRegional.items
          return apiData
    })
  }

    let setModal = apiData;
    setModal = getApiData().filter(x => x.Team === row.original.Team).filter(team => team.id === regional + "_" + row.original.Match);
    setModalData(setModal)
}

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
  //console.log(rows)
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
                row.isExpanded ? tableHandler(row, headerState, visibleColumns, tableData, modalOpen, setDataModal, apiData): null
              

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