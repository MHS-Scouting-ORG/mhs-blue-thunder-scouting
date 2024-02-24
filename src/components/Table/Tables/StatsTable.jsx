import React, { useEffect, useState } from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import CollapseTButton from "../TableUtils/CollapseTButton";

function StatsTable(props) {
  const filter = props.gFilter
  const [tableState, setTableState] = useState('none')

   useEffect(() => {
     setGlobalFilter(filter)
   }, [filter])

  const toggleTable = () => {
    if (tableState === 'none') {
      setTableState(' ')
    }
    else {
      setTableState('none')
    }
  }

  const data = props.information

  const columns = React.useMemo(
    () => [
      {
        Header: "Team #",
        accessor: "TeamNumber",
        Cell: ({ row }) => (
          <div style={{ fontWeight: 'bold', fontSize: '17px', maxWidth: '20px' }}>
            {row.values.TeamNumber}
          </div>
        )
      },
      {
        Header: 'Avg Pts',
        accessor: 'AvgPoints'
      },
      {
        Header: 'Avg Auto',
        accessor: 'AvgAutoPts'
      },
      {
        Header: 'Avg Cycs',
        accessor: 'AvgCycles'
      },
      {
        Header: 'Avg Made Speaker',
        accessor: 'AvgSpeaker'
      },
      {
        Header: 'Avg Made Amp',
        accessor: 'AvgAmp'
      },
      {
        Header: 'OPR',
        accessor: 'OPR'
      },
      {
        Header: 'EPA',
        accessor: 'EPA'
      },
    ], []
  )
  const tableInstance = useTable({ columns, data }, useGlobalFilter, useSortBy)

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
        <CollapseTButton label="Stats Table" toggleFunction={toggleTable}></CollapseTButton>

        <div style={{ display: tableState, maxHeight: '15rem', overflowY: 'scroll' }}>

          <table style={{ width: '250px', borderCollapse: 'collapse', overflowX: 'scroll' }}{...getTableProps()}>
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
                return (<React.Fragment>
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return (
                        <td
                          onClick={() => {
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

export default StatsTable

