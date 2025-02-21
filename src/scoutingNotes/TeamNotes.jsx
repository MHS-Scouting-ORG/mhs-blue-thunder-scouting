import React, { useEffect, useState } from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import { getRankingsForRegional, getSimpleTeamsForRegional } from '../api/bluealliance';
import { apiGetRegional } from '../api';
import GlobalFilter from '../components/Table/TableUtils/GlobalFilter';
import TableStyles from '../components/Table/Table.module.css'
import NotesStyles from './Notes.module.css'
import NotesModal from './NotesModal'


function TeamNotes() {
  const [rankingState, setRankingState] = useState([])
  const [simpleTeams, setSimpleTeams] = useState([])
  const [activeIndex, setActiveIndex] = useState([])
  const [modalShow, setModalShow] = useState(false)
  const [teamNotes, setTeamNotes] = useState("")
  const [teamNum, setTeamNum] = useState("")
  const [teamName, setTeamName] = useState("")

  const regional = apiGetRegional();

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

  
  const updateIndex = (idClicked) => {
    setActiveIndex(idClicked)
  }

  const modalClose = () => {
    setModalShow(false);
  }

  
  const data = React.useMemo(
    () => rankingState.map(team => {
      let simTeam = 'error';
      // const tableTeam = info.find(x => x.TeamNumber === parseInt(team.team_key.substring(3)))

      simpleTeams.map(sTeam => {
        if(sTeam.key.substring(3) === team.team_key.substring(3)){
          simTeam = sTeam
        }
      })

      return team !== null ?
        {
          TeamNumber: team.team_key.substring(3),
          Name: simTeam.nickname,
          Notes: "put notes here ",
        } : null

    }), [rankingState]
  )

  const columns = React.useMemo(
    () => [
      {
        Header: "Team",
        accessor: "TeamNumber",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left', }}>
            <img src="./images/autoLeaveTrue.png" style={{height: "300px"}}/>
            <div style={{ fontWeight: 'bold', fontSize: '25px', maxWidth: '20px', textAlign: 'center', }}>
              {row.original.TeamNumber}
              <div style={{ fontSize: '20px', fontWeight: 'normal' }}>
                {data.find(x => x.TeamNumber === row.original.TeamNumber).Name}
              </div>
          </div>
          </div>
        ),
      },
      {
         Header: "Notes",
         accessor: "Notes",
         Cell: ({ row }) => (
          <div style={{fontSize: "17px"}}>{row.original.Notes}</div>
        ),
      },
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
    state,
  } = tableInstance

  const { globalFilter } = state

  return (
    <div align='center'>
      {/* <header>TEAM NOTES</header> */}
      {/* Search */}
    <GlobalFilter filter={globalFilter} set={setGlobalFilter} />

    <table className={TableStyles.Table} {...getTableProps()}>
      <thead >
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
              updateIndex(row.id)
              setModalShow(true)
              setTeamNotes(row.original.Notes)
              setTeamNum(row.original.TeamNumber)
              setTeamName(row.original.Name)
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

    <NotesModal visible={modalShow} closeModal={modalClose} notes={teamNotes} teamNum={teamNum} teamName={teamName}/>
    
  </div>
  )
}

export default TeamNotes

