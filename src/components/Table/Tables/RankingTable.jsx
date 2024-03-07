import React, { useEffect, useState } from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import CollapseTButton from "../TableUtils/CollapseTButton";
import { getRankingsForRegional } from "../../../api/bluealliance";


function RankingTable(props) {
  const filter = props.gFilter
  const regional = props.regionalEvent
  const tableData = props.sortData

  const [rankingState, setRankingState] = useState([])
  const [tableState, setTableState] = useState('none')

  useEffect(() => {
    getRankingsForRegional(regional)
      .then(data => {
        // console.log(data)
        setRankingState(Object.values(data)[1])
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    setGlobalFilter(filter)
  }, [filter])


  const toggleTable = () => {
    //console.log("    ")
    if (tableState === 'none') {
      setTableState(' ')
    }
    else {
      setTableState('none')
    }
  }

  const removeTeam = (row) => {
    console.log(row.original.TeamNumber)
    const clickedTeam = rankingState.find(x => x.rank === row.original.Rank)
    const removedTeam = rankingState.toSpliced(rankingState.indexOf(clickedTeam), 1)
    setRankingState(removedTeam)
    console.log(removedTeam)
  }


  const data = React.useMemo(
    () => rankingState.map(team => {

      const sumSort = tableData.filter(x => x.TeamNumber === parseInt(team.team_key.substring(3)))
      console.log(sumSort)
      return team !== null ?
        {
          TeamNumber: team.team_key.substring(3),
          Rank: team.rank,
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
          <div style={{ fontWeight: 'bold', fontSize: '17px', maxWidth: '20px' }}>
            {row.values.TeamNumber}
          </div>
        )
      },
      {
        Header: "Rank",
        accessor: "Rank",
      },
      {
        Header: "Grade",
        accessor: "SumPriorities"
      },
      {
        Header: 'Remove?',
        Cell: ({ row }) => {
          return <div>
            <button onClick={() => { removeTeam(row) }}> X </button>
          </div>
        }
      }
    ], [data]
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
        <CollapseTButton label="Team List" toggleFunction={toggleTable}></CollapseTButton>

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

export default RankingTable

