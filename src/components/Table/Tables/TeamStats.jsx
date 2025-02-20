import React, {useEffect, useState} from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import CollapseTButton from "../TableUtils/CollapseTButton";
import tableStyles from "../Table.module.css";

function TeamStats(props) {
  const filter = props.gFilter
  const selectedTeams = props.selectedTeams

  const [tableState, setTableState] = useState('')
  const [tableColumns, setTableColumns] = useState([{Header: "Team", accessor: "TeamNumber", Cell: ({ row }) => (<div style={{fontWeight: 'bold', fontSize: '17px', maxWidth: '20px' }}> {row.values.TeamNumber} </div>)}])

  const [ptsState, setPtsState] = useState('none')
  const [amtState, setAmtState] = useState('none')
  const [robotInfo, setRobotInfo] = useState('none')
  const [penalties, setPenalties] = useState('none')

    useEffect(() => {
      setGlobalFilter(filter)
      
    }, [filter])

  const toggleTable = () => {
      if(tableState === ''){
      setTableState('none')
      }
      else {
        setTableState('')
      }
    }

  const togglePts = () => {
    if(ptsState === 'none'){
      setPtsState('')
    }
    else {
      setPtsState('none')
    }
  }

  const toggleAmt = () => {
    if(amtState === 'none'){
      setAmtState('')
    }
    else {
      setAmtState('none')
    }
  }

  const toggleRobotInfo = () => {
    if(robotInfo === 'none'){
      setRobotInfo('')
    }
    else {
      setRobotInfo('none')
    }
  }

  const togglePenalties = () => {
    if(penalties === 'none'){
      setPenalties('')
    }
    else {
      setPenalties('none')
    }
  }
  
  const data = React.useMemo(
    () => selectedTeams
    ,[selectedTeams]
  )

  const columns = React.useMemo(
      () => tableColumns
      ,[tableColumns]
  )
  const tableInstance = useTable({columns, data}, useGlobalFilter, useSortBy)

  const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      setGlobalFilter,
      prepareRow,
    } = tableInstance



  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '100%'}}> 
      <div>
        <CollapseTButton label="Team Stats" toggleFunction={toggleTable}></CollapseTButton>
        <div style={{display: tableState, maxHeight: '15rem', overflowY: 'scroll'}}>

      <div display="flex" style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

        <div>
        <CollapseTButton label="Points" toggleFunction={togglePts} type={"form"}></CollapseTButton>
        <div style={{display: ptsState}}>
          <div>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "AVG PTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG PTS", accessor: "AvgPoints"}])): setTableColumns(tableColumns.filter((x) => x.Header !== "AVG PTS"))}>AVG PTS</button>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "AVG Auto PTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG Auto PTS", accessor: "AvgAutoPts"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG Auto PTS"))}>AVG Auto PTS</button>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "AVG Endgame PTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG Endgame PTS", accessor: "AvgEndgamePts"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG Endgame PTS"))}>AVG Endgame PTS</button>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "AVG Coral PTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG Coral PTS", accessor: "AvgCoralPts"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG Coral PTS"))}>AVG Coral PTS</button>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "AVG Algae PTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG Algae PTS", accessor: "AvgAlgaePts"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG Algae PTS"))}>AVG Algae PTS</button>
          </div>
        </div>

        <div>
          <CollapseTButton label="Scored" toggleFunction={toggleAmt} type={"form"}></CollapseTButton>
          <div style={{display: amtState}}>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "AVG Cycles") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG Cycles", accessor: "AvgCycles"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG Cycles"))}>AVG Cycles</button>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "AVG Coral AMT") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG Coral AMT", accessor: "AvgCoral"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG Coral AMT"))}>AVG Coral AMT</button>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "AVG Algae AMT") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG Algae AMT", accessor: "AvgAlgae"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG Algae AMT"))}>AVG Algae AMT</button>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "AVG MINOR") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG MINOR", accessor: "Fouls"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG MINOR"))}>AVG MINOR</button>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "AVG MAJOR") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG MAJOR", accessor: "Tech"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG MAJOR"))}>AVG MAJOR</button>
          </div>
        </div>

        <div>
          <CollapseTButton label="Robot Info" toggleFunction={toggleRobotInfo} type={"form"}></CollapseTButton>
          <div style={{display: robotInfo}}>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "R SPEED") === undefined ? setTableColumns(tableColumns.concat([{Header: "R SPEED", accessor: "RobotSpeed"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "R SPEED"))}>R SPEED</button>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "R HANG") === undefined ? setTableColumns(tableColumns.concat([{Header: "R HANG", accessor: "RobotHang"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "R HANG"))}>R HANG</button>
          </div>
        </div>
    
        <div>
          <CollapseTButton label="Penalties" toggleFunction={togglePenalties} type={"form"}></CollapseTButton>
          <div style={{display: penalties}}>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "YELLOW MTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "YELLOW MTS", accessor: "YellowCard"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "YELLOW MTS"))}>YELLOW MTS</button>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "RED MTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "RED MTS", accessor: "RedCard"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "RED MTS"))}>RED MTS</button>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "BROKEN MTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "BROKEN MTS", accessor: "BrokenRobot"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "BROKEN MTS"))}>BROKEN MTS</button>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "DISABLED MTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "DISABLED MTS", accessor: "Disabled"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "DISABLED MTS"))}>DISABLED MTS</button>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "DQ MTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "DQ MTS", accessor: "DQ"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "DQ MTS"))}>DQ MTS</button>
            <button style={{height: "50px"}} onClick={() => tableColumns.find((e) => e.Header === "NOSHOW MTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "NOSHOW MTS", accessor: "NoShow"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "NOSHOW MTS"))}>NOSHOW MTS</button>
          </div>
        </div>
      </div>
      
    <div>
      <table className={tableStyles.Table}{...getTableProps()}>
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
                  </React.Fragment>
            )
          })}  
        </tbody>
      </table>
    </div>
    </div>

      </div>
    </div>
  </div>
  )
}

  export default TeamStats;

