import React, {useEffect, useState} from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import CollapseTButton from "./CollapseTButton"; 

function Test(props) {
  const filter = props.gFilter
  const teamData = props.teamMatches;
  const teams = teamData.map((data) => {return (data.Team)});

  const [tableState, setTableState] = useState(' ');
  const [teamNumber, setTeamNumber] = useState("");
  const [teamMatches, setTeamMatches] = useState([]);

  useEffect(() => {
    const indivTeamMatches = teamData.filter((data) => data.Team === teamNumber);
    const lastThreeMatches = indivTeamMatches.slice((indivTeamMatches.length >= 3 ? -3 : 0))
    setTeamMatches(lastThreeMatches)
    console.log(lastThreeMatches)
    console.log(teams)
  }, [teamNumber])

   useEffect(() => {
     setGlobalFilter(filter)
   }, [filter])

  const toggleTable = () => {
    if (tableState === ' ') {
      setTableState('none')
    }
    else {
      setTableState(' ')
    }
  }

  const data = React.useMemo(
  () => teamMatches.map(team => {
    //const grade = calcColumnSort(sortBy, team.NGridPoints, team.NConePoints, team.NConeAccuracy, team.NCubePoints, team.NCubeAccuracy, team.NChargeStation)
    
    return {
      // TeamNumber: team.TeamNumber,
      // Matches: team.Matches,
      // OPR: team.OPR,
      // Priorities: team.Priorities,
      // CCWM: team.CCWM, 
      // AvgPoints: team.AvgPoints,
      // AvgCSPoints: team.AvgCSPoints,
      // AvgGridPoints: team.AvgGridPoints,
      // AvgConePts: team.AvgConePts,
      // AvgConeAcc: team.AvgConeAcc,
      // AvgCubePts: team.AvgCubePts,
      // AvgCubeAcc: team.AvgCubeAcc,
      // DPR: team.DPR,
      // Penalties: team.Penalties,
      // SumPriorities: grade !== 0.000 ? grade : "",

      // NGridPoints: team.NGridPoints,
      // NConePoints: team.NConePoints, 
      // NConeAccuracy: team.NConeAccuracy, 
      // NCubePoints: team.NCubePoints, 
      // NCubeAccuracy: team.NCubeAccuracy, 
      // NChargeStation: team.NChargeStation,

      TeamNumber: team.Team.substring(3),
      TotalPts: team.Teleop.ScoringTotal.Total


    }
  }) , [teamMatches,teamNumber] 
)


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
      <CollapseTButton label="Last Three Matches" toggleFunction={toggleTable}></CollapseTButton>

      <select style={{width: '100%'}}onChange={(event) => {setTeamNumber(event.target.value), console.log(event.target.value)}} name="teamSelect" id="0">
        {teams.map((team) => {
          return (
            <option value={team}> {team.substring(3)} </option>
          )
        })}
      </select>

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

export default Test

