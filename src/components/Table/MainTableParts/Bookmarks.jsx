import React, {useEffect, useState} from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import CollapseTButton from "./CollapseTButton";
import { uniqueArr } from './CalculationUtils'
 

function Bookmarks(props) {
  const filter = props.gFilter
  const teamData = props.teamMatches

  const [tableState, setTableState] = useState(' ')

   useEffect(() => {
     setGlobalFilter(filter)
   }, [filter])


    const toggleTable = () => {
        //console.log("    ")
        if(tableState === ' '){
        setTableState('none')
        }
        else {
          setTableState(' ')
        }
      }


  const data = React.useMemo(
    () => teamData.map(team => {
        return {
          TeamNumber: team.Team.substring(3),
          Match: team.id.substring(team.id.indexOf("_") + 1),
        }
      }), [teamData]
  )

    const columns = React.useMemo(
        () => [
            {
              Header: "Team Number",
              accessor: "TeamNumber",
            },
            {
              Header: "Match Type",
              accessor: "Match",
            },
              {
                Header: 'TotalPts',
                acessor: 'TotalPts'
              },
              {
                Header: 'AutoPts',
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
                    <button onClick={() => props.handleBookmark(row)}> DELETE </button>
                  </div>
                }
              }
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
      <CollapseTButton label="Bookmarked Matches" toggleFunction={toggleTable}></CollapseTButton>

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

export default Bookmarks

