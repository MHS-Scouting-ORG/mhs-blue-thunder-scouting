import React, {useEffect, useState} from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import CollapseTButton from "../TableUtils/CollapseTButton";
import tableStyles from "../Table.module.css";

function TeamStats(props) {
  const filter = props.gFilter
  const selectedTeams = props.selectedTeams

  const [tableState, setTableState] = useState('none')
  const [tableColumns, setTableColumns] = useState([])
  //const [columns, setColumns] = useState([])

  //const test = {Header: "test2"}

    useEffect(() => {
      setGlobalFilter(filter)
      
    }, [filter])

  //  useEffect(() => {
  //    columns.push()
  //  },[]),

  const toggleTable = () => {
      if(tableState === 'none'){
      setTableState(' ')
      }
      else {
        setTableState('none')
      }
    }

    //const data = props.information
    

  const data = React.useMemo(
    () => selectedTeams
    , [selectedTeams]
  )

  const columns = React.useMemo(
      () => [
        {
          Header: "Team",
          accessor: "TeamNumber",
          Cell: ({ row }) => (
          <div style={{fontWeight: 'bold', fontSize: '17px', maxWidth: '20px' }}>
            {row.values.TeamNumber}
          </div>
        )
        }
      ],[]
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
      <div> 
          <div>
    <CollapseTButton label="Team Stats" toggleFunction={toggleTable}></CollapseTButton>
      <button onClick={() => tableColumns.push(test)}>test</button> 
    
    <div style={{display: tableState, maxHeight: '15rem', overflowY: 'scroll'}}>
    
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
  )
  }

  export default TeamStats;

