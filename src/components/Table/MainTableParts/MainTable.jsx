import React, { useEffect, useState } from "react"
import { useExpanded, useTable, useSortBy, useGlobalFilter } from "react-table"
import { getOprs } from "../../../api/bluealliance";
import { tableHandler } from "../InnerTables/InnerTableUtils";
import {calcColumnSort} from "./CalculationUtils"
import { ueTableData, } from "./MTEffectFunc"
import { getMatchesForRegional} from "../../../api";
import GlobalFilter from "../GlobalFilter";
import List from "../List";
import Modal from "../Modal";
import CollapseTButton from "./CollapseTButton";
import CenterTable from "./CenterTable";
import StatsTable from "./StatsTable";
import RobotPerformance from "./RobotPerformance";
import RobotCapabilities from "./RobotCapabilities";
import RobotAuto from "./RobotAuto";
import CustomRanking from "./CustomRanking";
import FieldInfo from "./FieldInfo";
import Penalties from "./Penalties";
import TeamMatches from "./TeamMatches";

function MainTable(props) { 
  const regional = props.regional

  const [tableData,setTableData] = useState([]); //data on table

  // const [deletedData,setDeletedData] = useState([])
  
  const [headerState, setHeaderState] = useState([])

  const [modalState, setModalState] = useState(false);
  const [modalData, setModalData] = useState();

  const [tableState, setTableState] = useState(' ')

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
        console.log(nApiData)
    })
  }, []
)
  
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
    ueTableData(oprList, ccwmList, dprList, tableData)
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

const toggleTable = () => {
  
  console.log("    ")
  if(tableState === ' '){
  setTableState('none')
  }
  else {
    setTableState(' ')
  }
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
            <div style={{fontWeight: 'bold', fontSize: '17px', maxWidth: '20px' }}>
              {row.values.TeamNumber}
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
                //minWidth:'150px',
                whiteSpace:'normal',
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
  console.log(globalFilter)
  console.log(state)

  //setGFilterState(globalFilter),[]
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

      <div>
        {/* topRow */}
        <div style={{display:'flex', justifyContent: 'left', columnGap: '100px'}}>
          {/*left*/}
          <div>
          <RobotPerformance information = {tableData} gFilter = {globalFilter != undefined ? globalFilter : ''}></RobotPerformance>
          </div>

          {/*right*/}
          <div>
          <StatsTable information = {tableData} gFilter = {globalFilter != undefined ? globalFilter : ''}></StatsTable>
          </div>
        </div>
        {/* secondRow*/}
        <div style={{display: 'flex', justifyContent: 'left', columnGap:"100px"}}>
          <div>
          {/* left */}
          <RobotCapabilities information = {tableData} gFilter = {globalFilter != undefined ? globalFilter : ''}></RobotCapabilities>
          </div>

          <div>
          {/* middle */}
          <CustomRanking information = {tableData} gFilter = {globalFilter != undefined ? globalFilter : ''}></CustomRanking>
          </div>
          
          <div>
          {/* right */}
          <RobotAuto information = {tableData} gFilter = {globalFilter != undefined ? globalFilter : ''}></RobotAuto>
          </div>
        </div>

        {/* thirdRow */}
        <div style={{display: 'flex', justifyContent: 'left', columnGap:"100px"}}>
          <div>
          {/* left */}
          <FieldInfo information = {tableData} gFilter = {globalFilter != undefined ? globalFilter : ''}></FieldInfo>
          </div>

          <div>
          {/* right */}
          <Penalties information = {tableData} gFilter = {globalFilter != undefined ? globalFilter : ''}></Penalties>
          </div>

          <div>
          {/* right */}
          <TeamMatches information = {tableData} teamMatches = {apiData} gFilter = {globalFilter != undefined ? globalFilter : ''}></TeamMatches>
          </div>
        </div>
      </div>


    </div>
  )
}

export  default MainTable; 