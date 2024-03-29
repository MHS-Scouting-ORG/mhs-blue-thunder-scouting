import React, {useEffect, useState} from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import CollapseTButton from "../TableUtils/CollapseTButton";
import tableStyles from "../Table.module.css";

function Bookmarks(props) {
  const filter = props.gFilter
  const bookmarkedMatches = props.bookmarkData
  const bookMarkFunc = props.handleBookmark

  const [tableState, setTableState] = useState('none')

   useEffect(() => {
     setGlobalFilter(filter)
   }, [filter])


    const toggleTable = () => {
        if(tableState === 'none'){
        setTableState(' ')
        }
        else {
          setTableState('none')
        }
      }


  const data = React.useMemo(
    () => bookmarkedMatches.map(team => {
        return {
          TeamNumber: team.Team.substring(3),
          Match: team.id.substring(team.id.indexOf("_") + 1),
        }
      }),[tableState]
  )

    const columns = React.useMemo(
        () => [
            {
              Header: "Team #",
              accessor: "TeamNumber",
            },
            {
              Header: "Match Type",
              accessor: "Match",
            },
              {
                Header: 'Total',
                acessor: 'TotalPts'
              },
              {
                Header: 'Auto',
                accessor: 'AutoPts'
              },
              {
                Header: 'Speaker',
                accessor: 'SpeakerPts'
              },
              {
                Header: 'Amp',
                accessor: 'AmpPts'
              },
              {
                Header: 'Endgame',
                accessor: 'EndgamePts'
              },
              {
                Header: 'Fouls',
                accessor: 'Fouls'
              },
              {
                Header: 'Remove Bookmark?',
                Cell: ({row}) => {
                  return <div>
                    <button onClick={() => {bookMarkFunc(row,bookmarkedMatches)}}> DELETE </button>
                  </div>
                }
              }
        ], [tableState]
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
      <CollapseTButton label="Bookmarked Matches" toggleFunction={toggleTable}></CollapseTButton>

      <div style={{display: tableState, maxHeight: '15rem', overflowY: 'scroll'}}>
      
      <table className={tableStyles.Table} {...getTableProps()}>
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

export default Bookmarks

