import React from 'react';
import { useTable, useSortBy } from 'react-table'

const ConeAccTable = (props) => {

    const data = props.information

    const columns = React.useMemo(
        () => [
            {
                Header: 'Upper Cone Acc',
                accessor: 'AvgUpperConeAcc'
            },
            {
                Header: 'Mid Cone Acc',
                accessor: 'AvgMidConeAcc'
            },
            {
                Header: 'Low Cone Acc',
                accessor: 'AvgLowerConeAcc'
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

export default ConeAccTable