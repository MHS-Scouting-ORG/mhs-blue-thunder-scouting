import React, { useEffect, useState } from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import CollapseTButton from "../TableUtils/CollapseTButton";
import { getRankingsForRegional, getSimpleTeamsForRegional } from "../../../api/bluealliance";
import TableStyles from "../Table.module.css";


function DefaultTable(props) {
  const filter = props.gFilter
  const regional = props.regional || props.regionalEvent
  const tableData = props.sortData
  const teamsClickedFunc = props.teamHandler
  const info = props.information

  const [rankingState, setRankingState] = useState([])
  const [simpleTeams, setSimpleTeams] = useState([])
  const [tableState, setTableState] = useState('')
  const [activeIndex, setActiveIndex] = useState([])

  useEffect(() => {
    getRankingsForRegional(regional)
      .then(data => {
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
      const tableTeam = info.find(x => x.TeamNumber === parseInt(team.team_key.substring(3)))

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
          Evaluation: tableTeam === undefined ? '' : tableTeam.Evaluations,
        } : null
    }), [rankingState,tableData]
  )

  const getRowId = (idClicked, val) => {
    if(val === "leftClick"){
      setActiveIndex(id => {
        if(id.find(x => x === idClicked) === undefined){
          return [...id, idClicked]
        }
        else {
          return id
        }
      })
    }
    else if(val === "rightClick"){
      setActiveIndex(teamsClicked => teamsClicked.splice(teamsClicked.indexOf(idClicked), teamsClicked.indexOf(idClicked)+ 1))
    }
    else{
      console.log("error")
    }
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "Team Number",
        accessor: "TeamNumber",
        Cell: ({ row }) => (
          <div style={{ fontWeight: 'bold', fontSize: '17px', maxWidth: '20px', textAlign: 'center', }} >
            {row.values.TeamNumber}
          </div>
        ),
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
         <input style={{width: "100%"}} placeholder='Search' value={globalFilter || ''} onChange={e => setGlobalFilter(e.target.value)}/>

          <table className={TableStyles.Table} {...getTableProps()}>
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
            <tbody {...getTableBodyProps()} >
              
              {rows.map(row => {
                prepareRow(row)
                return (<React.Fragment>
                  <tr {...row.getRowProps()} 
                  style={{background: activeIndex.includes(row.id) ? "#77B6E2" : "white" }}


                  onClick={() => {
                    getRowId(row.id, "leftClick")
                    teamsClickedFunc(row.original.TeamNumber, "leftClick")
                  }}

                  onContextMenu={() => {
                    getRowId(row.id, "rightClick")
                    teamsClickedFunc(row.original.TeamNumber, "rightClick")
                  }}
                  
                  >
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

