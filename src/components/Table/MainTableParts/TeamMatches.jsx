import React, { useEffect, useState } from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import CollapseTButton from "./CollapseTButton";
import { uniqueArr } from './CalculationUtils'


function TeamMatches(props) {
  const filter = props.gFilter
  const teamData = props.teamMatches;
  const bookMarkFunc = props.handleBookmark
  const apiData = props.teamMatches;

  const allTeamEntries = teamData.map((data) => { return (data.Team) });
  const teams = uniqueArr(allTeamEntries);

  const [tableState, setTableState] = useState('none');
  const [teamNumber, setTeamNumber] = useState("");
  const [allTeamMatches, setAllTeamMatches] = useState([])
  const [lastThree, setLastThree] = useState([]);

  const [toggle, setToggle] = useState(true)

  useEffect(() => {
    const indivTeamMatches = teamData.filter((data) => data.Team === teamNumber);
    setAllTeamMatches(indivTeamMatches);

    const matchNumbers = indivTeamMatches.map(
      (teamMatch) => {
        return parseInt((teamMatch.id).substring((teamMatch.id).indexOf("_") + 3))
      }
    ).sort((a, b) => a - b)

    const sortLastThree = indivTeamMatches.map((teamMatch) => {
      const matchNumber = parseInt(teamMatch.id.substring((teamMatch.id).indexOf("_") + 3))
      if (matchNumber === matchNumbers[matchNumbers.length - 1]) {
        return teamMatch;
      }
      else if (matchNumber === matchNumbers[matchNumbers.length - 2]) {
        return teamMatch;
      }
      else if (matchNumber === matchNumbers[matchNumbers.length - 3]) {
        return teamMatch;
      }
      else {
        return null
      }
    })

    console.log(sortLastThree)
    const lastThreeMatches = (sortLastThree.filter((team) => team !== null)).sort((a, b) => b.id.substring((b.id).indexOf("_") + 3) - a.id.substring((a.id).indexOf("_") + 3))

    setLastThree(lastThreeMatches)
    console.log(lastThreeMatches)
  }, [teamNumber])

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


  const data = React.useMemo(
    () => (toggle ? allTeamMatches : lastThree).map(team => {
      return {
        Team: team.Team.substring(3),
        Match: team.id.substring(team.id.indexOf("_") + 1),
      }
    }), [apiData, teamNumber, allTeamMatches, teamData, toggle]
  )

  const columns = React.useMemo(
    () => [
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
        Header: 'Add Bookmark?',
        Cell: ({ row }) => {
          return <div>
            <button onClick={() => bookMarkFunc(row, apiData)}> ADD </button>
          </div>
        }
      }
    ], [apiData]
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
        <CollapseTButton label="Team Matches" toggleFunction={toggleTable}></CollapseTButton>

        <select style={{ width: '100%', display: tableState }} onChange={(event) => { setTeamNumber(event.target.value), console.log(event.target.value) }} name="teamSelect" id="0">
          <option value={null}>Select Team Number Below</option>
          {teams.map((team) => {
            return (
              <option value={team}> {team.substring(3)} </option>
            )
          })}
        </select>
        <button style={{ width: '100%', display: tableState }} onClick={() => setToggle(!toggle)}> {toggle ? "All Matches" : "Last Three Matches"} </button>

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

export default TeamMatches

