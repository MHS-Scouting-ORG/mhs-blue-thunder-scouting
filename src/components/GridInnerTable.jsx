import React from 'react';
import { useTable, useSortBy } from 'react-table'

function GridInnerTable(props) {

    const data = props.information

    const columns = React.useMemo(
        () => [
            {
                Header: 'Upper Averages',
                columns: [
                    {
                        Header: 'Upper',
                        accessor: 'AvgUpper'
                    },
                    {
                        Header: 'Upper Acc',
                        accessor: 'AvgUpperAcc'
                    },]
            },
            {
                Header: 'Mid Averages',
                columns: [
                    {
                        Header: 'Mid',
                        accessor: 'AvgMid'
                    },
                    {
                        Header: 'Mid Acc',
                        accessor: 'AvgMidAcc'
                    },]
            },
            {
                Header: 'Lower Averages',
                columns: [
                    {
                        Header: 'Lower',
                        accessor: 'AvgLower'
                    },
                    {
                        Header: 'Lower Acc',
                        accessor: 'AvgLowerAcc'
                    },]
            }
        ], []
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
  <table style={{borderCollapse: "collapse"}} {...getTableProps()}>

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
                    fontWeight: 'bold',
                    padding: '5px',
                    border: 'solid 1px gainsboro',
                    textAlign: 'center',
                    background: '#64809B'
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

export default GridInnerTable;