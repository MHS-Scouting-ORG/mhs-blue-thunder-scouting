import React from 'react';
import { useTable, useSortBy } from 'react-table'

const TeamInnerTable = (props) => {

    const data = props.information;
    const deleteHandler = props.delete;
    const editHandler = props.setModal;

    const columns = React.useMemo(
        () => [
            {
                Header: 'Match Summary',
                columns: [
                    {
                        Header: 'Match',
                        accessor: 'Match'
                    },
                    {
                        Header: 'Priorities/Strategies',
                        accessor: 'Strategy',
                        Cell: ({row}) => {
                          return <div
                            style={{
                              minWidth:'200px',
                              //overflowWrap: 'normal',
                              whiteSpace: 'normal',
                            }}
                          >{row.original.Strategy}</div>
                        }
                    },
                    {
                        Header: 'Total Pts',
                        accessor: 'TotalPts'
                    },
                    {
                      Header: 'Grid Pts',
                      accessor: 'GridPts',
                    },
                    {
                        Header: '🔺 Acc',
                        accessor: 'ConeAcc'
                    },
                    {
                        Header: '🟪 Acc',
                        accessor: 'CubeAcc'
                    },], 
            },
            {
                Header: 'Autonomous',
                columns: [
                    {
                        Header: 'Auto Placement',
                        accessor: 'AutoPlacement'
                    },
                    {
                        Header: 'Mobility',
                        accessor: 'Mobility'
                    },
                    {
                        Header: 'Upper 🔺 ',
                        accessor: 'AutoUpperConePts'
                    },
                    {
                        Header: 'Upper 🟪 ',
                        accessor: 'AutoUpperCubePts'
                    },
                    {
                        Header: 'Mid 🔺 ',
                        accessor: 'AutoMidConePts'
                    },
                    {
                      Header: 'Mid 🟪 ',
                      accessor: 'AutoMidCubePts'
                    },
                    {
                        Header: 'Low 🔺 ',
                        accessor: 'AutoLowConePts'
                    },
                    {
                      Header: 'Low 🟪 ',
                      accessor: 'AutoLowCubePts'
                    },
                    {
                      Header: 'Charge Station',
                      accessor: 'AutoChargeStationPts'
                    },]
            },
            {
                Header: 'Tele-Op',
                columns: [
                    {
                        Header: 'Upper 🔺 ',
                        accessor: 'TeleUpperConePts'
                    },
                    {
                      Header: 'Upper 🟪 ',
                      accessor: 'TeleUpperCubePts'
                    },
                    {
                        Header: 'Mid 🔺 ',
                        accessor: 'TeleMidConePts'
                    },
                    {
                      Header: 'Mid 🟪 ',
                      accessor: 'TeleMidCubePts'
                    },
                    {
                        Header: 'Low 🔺 ',
                        accessor: 'TeleLowConePts'
                    },
                    {
                      Header: 'Low 🟪 ',
                      accessor: 'TeleLowCubePts'
                    },
                    {
                        Header: 'Endgame',
                        accessor: 'TeleEndgame'
                    },
                    {
                      Header: 'CS Start',
                      accessor: 'CSStart',
                    },
                    {
                      Header: 'CS End',
                      accessor: 'CSEnd',
                    },
                    {
                      Header: 'Creates Links',
                      accessor: 'SmartPlacement',
                    },
                    {
                      Header: 'Foul | Tech',
                      accessor: 'NumberOfFoulAndTech',
                    },
                    {
                      Header: 'Penalties',
                      accessor: 'Penalties',
                      Cell: ({row}) => {
                        return <div
                          style={{
                            minWidth:'300px',
                            whiteSpace: 'normal',
                          }}
                        >{row.original.Penalties}</div>
                      }
                    },
                    {
                      Header: 'Ranking Points',
                      accessor: 'NumberOfRankingPoints',
                    },]
            },
            {
              Header: 'Drive',
              columns: [
                    {
                      Header: 'Drive Strength',
                      accessor: 'DriveStrength',
                    },
                    {
                      Header: 'Drive Speed',
                      accessor: 'DriveSpeed',
                    },]
            },
            {
              Header: 'Other',
              columns: [
                    {
                      Header: 'Comments',
                      accessor: 'Comments',
                      Cell: ({row}) => {
                        return <div
                          style={{
                            minWidth:'350px',
                            whiteSpace: 'normal',
                          }}
                        >{row.original.Comments}</div>
                      }
                    },
                    {
                      Header: 'Delete',
                      Cell: ({row}) => {
                        return <div>
                          <button onClick={() => deleteHandler(row)}> DELETE </button>
                        </div>
                      }
                    },
                    {
                      Header: 'Edit',
                      Cell: ({row}) => {
                        return <div>
                          <button onClick={() => editHandler(row)}> EDIT </button>
                        </div>
                      }
                    }
                  ],
            },
        ],[]
    )

    const tableInstance = useTable({columns, data}, useSortBy)

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = tableInstance

       return (
    <div>
      <table style={{borderCollapse: 'collapse'}}{...getTableProps()}>

        <thead>
          {
            headerGroups.map(headerGroup =>
            (
              <tr {...headerGroup.getHeaderGroupProps()} >
                {
                  headerGroup.headers.map(column =>
                  (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      style={{
                        padding: '5px',
                        border: 'solid 1px gainsboro',
                        textAlign: 'center',
                        background: '#64809B',
                      }}
                    >
                      {column.render('Header')}
                    </th>
                  )
                  )
                }
              </tr>
            )
            )
          }
        </thead>

        <tbody {...getTableBodyProps()}>
          {
            rows.map(row => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {
                    row.cells.map(cell => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          style={{
                            padding: '5px',
                            borderBlock: 'solid 1px gainsboro',
                            textAlign: 'center',
                          }}
                        >
                          {cell.render('Cell')}
                        </td>
                      )
                    }
                    )
                  }
                </tr>
              )
            }
            )
          }
        </tbody>

      </table>
    </div>
  )

} 

export default TeamInnerTable;