import React, { useEffect, useState } from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import CollapseTButton from "../TableUtils/CollapseTButton";
import { getRankingsForRegional, getSimpleTeamsForRegional, getMatchesForRegional } from "../../../api/bluealliance";
import TableStyles from "../Table.module.css";


function DefaultTable(props) {
  /* props from summary */
  const filter = props.gFilter //for global filter
  const regional = props.regional || props.regionalEvent //updated in aws
  const tableData = props.sortData //for grade function
  const teamsClickedFunc = props.teamHandler //function to pass props as teams are clicked
  const info = props.information //data from table after match entries and calculations

  console.log("info", info) //check table data

  const [rankingState, setRankingState] = useState([]) //rankings of bluealliance 
  const [simpleTeams, setSimpleTeams] = useState([]) //simple teams data from bluealliance
  const [tableState, setTableState] = useState('') //toggle table state
  const [activeIndex, setActiveIndex] = useState([]) //active/selected teams

  /* Runs in sync with blue alliance to set rankings of a regional */
  useEffect(() => {
    getRankingsForRegional(regional)
      .then(data => {
        setRankingState(Object.values(data)[1])
      })
      .catch(err => console.log(err))
  }, [])

  /* Runs in sync with blue alliance to set rankings of a regional */
  useEffect(() => {
    getMatchesForRegional(regional)
      .then(data => {
        console.log("matches data", data)
      })
      .catch(err => console.log(err))
  }, [])

  /* Runs in sync with blue alliance to set the simple data of teams */
  useEffect(() => {
    getSimpleTeamsForRegional(regional) 
    .then(data => {
      setSimpleTeams(data)
      console.log("simple teams", data)
    })
  }, [])
  /* Changes in sync with global filter */
  useEffect(() => {
    setGlobalFilter(filter)
  }, [filter])

  /* switches table state for display */
  const toggleTable = () => {
    if (tableState === '') {
      setTableState('none ')
    }
    else {
      setTableState('')
    }
  }
  
  /* 
  Table's data based on each team using the ranking state 
  finds team from teams in the table and set it into the table team constat
  based on info, maps each of the teams from the regional in the array and changes it into only the team's name
  sumSort is for table's grade function
  returns, if the object is there, the team's number, name, notes, and grade 
  */
  const data = React.useMemo(
    () => rankingState.map(team => {
      let simTeam = 'error';
      const tableTeam = info.find(x => x.TeamNumber === parseInt(team.team_key.substring(3)))

      simpleTeams.map(sTeam => {
        if(sTeam.key.substring(3) === team.team_key.substring(3)){
          simTeam = sTeam
        }
      },[info])

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

  /* 
  function to update the teams that are selected
  uses the index of the row and finds the id taht is clicked
  if the row is not found in the active indexes(returns undefined) then return the idClicked with the array
  if the row is already found in the active indexes then returns the old array
  */
  const updateIndex = (idClicked) => {
    setActiveIndex(id => {
      if(id.find(x => x === idClicked) === undefined){
        return [...id, idClicked]
      }
      else {
        const index = id.indexOf(idClicked)
        if(index > -1)
          return [...id.slice(0, index), ...id.slice(index + 1)]
        return id
      }
    })
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

  /* Table State */
  const {
    state,
  } = tableInstance

  /* Table props, does not really change */
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    setGlobalFilter,
    prepareRow,
  } = tableInstance

  const { globalFilter } = state //state for global filter



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
                  /* the changed style of the selected rows */
                  style={{background: activeIndex.includes(row.id) ? "#77B6E2" : "white" }}
                  /* passes the functions for onClick of row*/
                  onClick={() => {
                    updateIndex(row.id)
                    teamsClickedFunc(row.original.TeamNumber)
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

