import React, { useEffect, useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';


const dummyData = [
    {teamNum: "2443",  }, 
    {teamNum: "6",  }

]

function CommentsOnly() {
  
    
    const data = React.useMemo(
        () => {
        return dummyData;
        }
    )

//pasted from react table
    const EditableCell = ({
      value: initialValue,
      row: { index },
      column: { id },
      updateMyData, 
    }) => {
      
      const [value, setValue] = React.useState(initialValue)
    
      const onChange = e => {
        setValue(e.target.value)
      }
    
      
      const onBlur = () => {
        updateMyData(index, id, value)
      }
    
      
      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])
    
      return <input value={value} onChange={onChange} onBlur={onBlur} />
    }

    const defaultColumn = {
      Cell: EditableCell
    };
  
    const columns = React.useMemo(
      () => [
        {
          Header: 'Team #',
          accessor: 'teamNum',
        },
        {
          Header: 'Comments',
          accessor: 'comments',
        },
      ],
      []
    )
  
    const tableInstance = useTable({ columns, data, defaultColumn, }, useSortBy, usePagination);
  
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = tableInstance
  
    return (
      <div>
        <h2>comments table</h2>
        <table {...getTableProps()}>
  
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
                              border: 'solid 1px black',
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
  
  export default CommentsOnly;