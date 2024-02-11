import React, {useState} from 'react'
import { useTable, useSortBy } from 'react-table'
import CollapseTButton from "./CollapseTButton";
 

function FieldInfo(props) {
    const [tableState, setTableState] = useState(' ')

    const toggleTable = () => {
        //console.log("    ")
        if(tableState === ' '){
        setTableState('none')
        }
        else {
          setTableState(' ')
        }
      }

    const data = props.information

    const columns = React.useMemo(
        () => [
            {
                Header: "Team #",
                accessor: "TeamNumber",
                Cell: ({ row }) => (
                  //<span{...row.getToggleRowExpandedProps()}>
                    <div style={{fontWeight: 'bold', fontSize: '17px', maxWidth: '20px' }}>
                      {row.values.TeamNumber}
                    </div>
                  //</span>
                  )
              },
              {
                Header: 'Stage Pos',
                accessor: 'StagePosition'
              },
              {
                Header: 'Auto Start',
                accessor: 'AutoStart'
              },
              {
                Header: 'Most Common Scored',
                accessor: 'MostCommonScoredElement'
              },
        ], []
    )
    const tableInstance = useTable({columns, data}, useSortBy)

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = tableInstance

    return (
        <div> 
            <div>
      <CollapseTButton label="Field Information" toggleFunction={toggleTable}></CollapseTButton>
      
      <div style={{display: tableState, maxHeight: '15rem', overflowY: 'scroll'}}>
      
      <table style={{width: '250px', borderCollapse: 'collapse', overflowX: 'scroll'}}{...getTableProps()}>
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

              {/*
                row.isExpanded ? tableHandler(row, headerState, visibleColumns, tableData, modalOpen, setDataModal, apiData): null
            */}
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

export default FieldInfo

