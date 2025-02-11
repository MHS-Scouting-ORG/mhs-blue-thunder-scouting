import React, { useEffect, useState } from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import CollapseTButton from "../TableUtils/CollapseTButton";
import { getRankingsForRegional, getSimpleTeamsForRegional } from "../../../api/bluealliance";
import tableStyles from "../Table.module.css";


function DefaultTable(props) {
  const filter = props.gFilter
  const regional = props.regionalEvent
  const tableData = props.sortData
  const teamsClickedFunc = props.teamsClicked

  const [rankingState, setRankingState] = useState([])
  const [simpleTeams, setSimpleTeams] = useState([])
  const [tableState, setTableState] = useState('')

  useEffect(() => {
    getRankingsForRegional(regional)
      .then(data => {
        console.log(data)
        setRankingState(Object.values(data)[1])
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    getSimpleTeamsForRegional(regional) 
    .then(data => {
      setSimpleTeams(data)
    })
  }, [])

  useEffect(() => {
    setGlobalFilter(filter)
  }, [filter])


  const toggleTable = () => {
    if (tableState === '') {
      setTableState('none ')
    }
    else {
      setTableState('')
    }
  }
  
  const data = React.useMemo(
    () => rankingState.map(team => {
      let simTeam = 'error';
      simpleTeams.map(sTeam => {
        if(sTeam.key.substring(3) === team.team_key.substring(3)){
          simTeam = sTeam
        }
      })

      const sumSort = tableData.filter(x => x.TeamNumber === parseInt(team.team_key.substring(3)))
      
      return team !== null ?
        {
          TeamNumber: team.team_key.substring(3),
          Name: simTeam.nickname,
          SumPriorities: sumSort[0] === undefined ? 0.000 : sumSort[0].SumPriorities,
        } : null
    }), [rankingState,tableData]
  )

  const columns = React.useMemo(
    () => [
      {
        Header: "Team Number",
        accessor: "TeamNumber",
        Cell: ({ row }) => (
          <div style={{ fontWeight: 'bold', fontSize: '17px', maxWidth: '20px' }} onClick={() => {teamsClickedFunc(row.original.TeamNumber)}}>
            {row.values.TeamNumber}
          </div>
        )
      },
      {
        Header: "Name",
        accessor: "Name",
      },
      {
        Header: "Evaluation",
        accessor: "Evaluation"
      },
      {
        Header: "Grade",
        accessor: "SumPriorities"
      },
    ], [data]
  )
  const tableInstance = useTable({ columns, data }, useGlobalFilter, useSortBy)

  const {
    state,
  } = tableInstance

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    setGlobalFilter,
    prepareRow,
  } = tableInstance

  const { globalFilter } = state



  return (
    <div>
      <div>
        <CollapseTButton label="All Teams" toggleFunction={toggleTable}></CollapseTButton>

        <div style={{ display: tableState, maxHeight: '15rem', overflowY: 'scroll' }}>

          {/* Search */}
         <input placeholder='Search' value={globalFilter || ''} onChange={e => setGlobalFilter(e.target.value)}/>

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
                return (<React.Fragment>
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

export default DefaultTable

