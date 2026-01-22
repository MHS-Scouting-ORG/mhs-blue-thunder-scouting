import React, {useEffect, useState} from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import CollapseTButton from "../TableUtils/CollapseTButton";
import { getUrl } from 'aws-amplify/storage';
import tableStyles from "../Table.module.css";

// Component for team cell with photo
function TeamCell({ row }) {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const loadPhoto = async () => {
      if (row.original.photo) {
        if (row.original.photo.startsWith('http')) {
          setPhotoUrl(row.original.photo);
        } else {
          try {
            const url = await getUrl({ key: row.original.photo });
            setPhotoUrl(url.url.href);
          } catch (err) {
            console.log('Failed to load photo for team', row.values.TeamNumber);
          }
        }
      }
    };
    loadPhoto();
  }, [row.original.photo, row.values.TeamNumber]);

  return (
    <div style={{fontWeight: 'bold', fontSize: '17px', maxWidth: '20px' }}> 
      {row.values.TeamNumber} 
      {photoUrl && (
        <div style={{ marginTop: '5px' }}>
          <img 
            src={photoUrl}
            alt={`Team ${row.values.TeamNumber}`} 
            style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}
    </div>
  );
}

function TeamStats(props) {
  /* Prop for global filter and selected teams */
  const filter = props.gFilter
  const selectedTeams = props.selectedTeams //teams selected (same as teams clicked in default table)

  const [tableState, setTableState] = useState('') //toggle state for table display
  /* Table Columns state instatiating the team number object to be updated with other header objects */
  const [tableColumns, setTableColumns] = useState([{Header: "Team", accessor: "TeamNumber", Cell: TeamCell}])

  const [ptsState, setPtsState] = useState('none') //toggle for pts buttons
  const [amtState, setAmtState] = useState('none') //toggle for amt buttons
  const [robotInfo, setRobotInfo] = useState('none') //toggle for robot info
  const [penalties, setPenalties] = useState('none') //toggle for penalties

    /* Run in sync with global filter */
    useEffect(() => {
      setGlobalFilter(filter)
    }, [filter])

    /* Function for toggle of table display */
  const toggleTable = () => {
      if(tableState === ''){
      setTableState('none')
      }
      else {
        setTableState('')
      }
    }
  
    /* function for toggle of pts buttons display */
  const togglePts = () => {
    if(ptsState === 'none'){
      setPtsState('')
    }
    else {
      setPtsState('none')
    }
  }
    /* function for toggle of amt buttons display */
  const toggleAmt = () => {
    if(amtState === 'none'){
      setAmtState('')
    }
    else {
      setAmtState('none')
    }
  }
    /* function for toggle of robot info buttons display */
  const toggleRobotInfo = () => {
    if(robotInfo === 'none'){
      setRobotInfo('')
    }
    else {
      setRobotInfo('none')
    }
  }
    /* function for toggle of penalties buttons display */
  const togglePenalties = () => {
    if(penalties === 'none'){
      setPenalties('')
    }
    else {
      setPenalties('none')
    }
  }
  
  /* data is an array of teams that are selected(rows) */
  const data = React.useMemo(
    () => selectedTeams
    ,[selectedTeams]
  )
  /* Based upon the headers objects in the columns state from the buttons clicked */
  const columns = React.useMemo(
      () => tableColumns
      ,[tableColumns]
  )
  const tableInstance = useTable({columns, data}, useGlobalFilter, useSortBy)

  const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      setGlobalFilter,
      prepareRow,
    } = tableInstance



  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '100%'}}> 
      <div>
        <CollapseTButton label="Team Stats" toggleFunction={toggleTable}></CollapseTButton>
        <div style={{display: tableState, maxHeight: '15rem', overflowY: 'scroll'}}>

      <div display="flex" style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

        <div>
        <CollapseTButton label="Points" toggleFunction={togglePts} type={"form"}></CollapseTButton>
        <div style={{display: ptsState}}>
          <div>
            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "AVG PTS") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }} 
              onClick={() => tableColumns.find((e) => e.Header === "AVG PTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG PTS", accessor: "AvgPoints"}])): setTableColumns(tableColumns.filter((x) => x.Header !== "AVG PTS"))}
            >AVG PTS</button>

            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "AVG Auto PTS") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }} 
              onClick={() => tableColumns.find((e) => e.Header === "AVG Auto PTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG Auto PTS", accessor: "AvgAutoPts"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG Auto PTS"))}
            >AVG Auto PTS</button>

            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "AVG Endgame PTS") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }} 
              onClick={() => tableColumns.find((e) => e.Header === "AVG Endgame PTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG Endgame PTS", accessor: "AvgEndgamePts"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG Endgame PTS"))}  
            >AVG Endgame PTS</button>

            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "AVG Coral PTS") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }} 
              onClick={() => tableColumns.find((e) => e.Header === "AVG Coral PTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG Coral PTS", accessor: "AvgCoralPts"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG Coral PTS"))}
            >AVG Coral PTS</button>

            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "AVG Algae PTS") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }} 
              onClick={() => tableColumns.find((e) => e.Header === "AVG Algae PTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG Algae PTS", accessor: "AvgAlgaePts"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG Algae PTS"))}
            >AVG Algae PTS</button>

          </div>
        </div>

        <div>
          <CollapseTButton label="Scored" toggleFunction={toggleAmt} type={"form"}></CollapseTButton>
          <div style={{display: amtState}}>

            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "AVG Cycles") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }} 
              onClick={() => tableColumns.find((e) => e.Header === "AVG Cycles") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG Cycles", accessor: "AvgCycles"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG Cycles"))}
            >AVG Cycles</button>

            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "AVG Coral AMT") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }}  
              onClick={() => tableColumns.find((e) => e.Header === "AVG Coral AMT") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG Coral AMT", accessor: "AvgCoral"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG Coral AMT"))}
            >AVG Coral AMT</button>

            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "AVG Algae AMT") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }} 
              onClick={() => tableColumns.find((e) => e.Header === "AVG Algae AMT") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG Algae AMT", accessor: "AvgAlgae"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG Algae AMT"))}
            >AVG Algae AMT</button>

            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "AVG MINOR") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }}
              onClick={() => tableColumns.find((e) => e.Header === "AVG MINOR") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG MINOR", accessor: "Fouls"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG MINOR"))}
            >AVG MINOR</button>

            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "AVG MAJOR") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }} 
              onClick={() => tableColumns.find((e) => e.Header === "AVG MAJOR") === undefined ? setTableColumns(tableColumns.concat([{Header: "AVG MAJOR", accessor: "Tech"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "AVG MAJOR"))}
            >AVG MAJOR</button>

          </div>
        </div>

        <div>
          <CollapseTButton label="Robot Info" toggleFunction={toggleRobotInfo} type={"form"}></CollapseTButton>
          <div style={{display: robotInfo}}>
            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "R SPEED") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }}
              onClick={() => tableColumns.find((e) => e.Header === "R SPEED") === undefined ? setTableColumns(tableColumns.concat([{Header: "R SPEED", accessor: "RobotSpeed"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "R SPEED"))}
            >R SPEED</button>

            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "R HANG") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }}
              onClick={() => tableColumns.find((e) => e.Header === "R HANG") === undefined ? setTableColumns(tableColumns.concat([{Header: "R HANG", accessor: "RobotHang"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "R HANG"))}
            >R HANG</button>

          </div>
        </div>
    
        <div>
          <CollapseTButton label="Penalties" toggleFunction={togglePenalties} type={"form"}></CollapseTButton>
          <div style={{display: penalties}}>

            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "YELLOW MTS") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }} 
              onClick={() => tableColumns.find((e) => e.Header === "YELLOW MTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "YELLOW MTS", accessor: "YellowCard"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "YELLOW MTS"))}
            >YELLOW MTS</button>

            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "RED MTS") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }} 
              onClick={() => tableColumns.find((e) => e.Header === "RED MTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "RED MTS", accessor: "RedCard"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "RED MTS"))}
            >RED MTS</button>

            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "BROKEN MTS") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }}  
              onClick={() => tableColumns.find((e) => e.Header === "BROKEN MTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "BROKEN MTS", accessor: "BrokenRobot"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "BROKEN MTS"))}
            >BROKEN MTS</button>

            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "DISABLED MTS") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }}  
              onClick={() => tableColumns.find((e) => e.Header === "DISABLED MTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "DISABLED MTS", accessor: "Disabled"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "DISABLED MTS"))}
            >DISABLED MTS</button>

            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "DQ MTS") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }}  
              onClick={() => tableColumns.find((e) => e.Header === "DQ MTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "DQ MTS", accessor: "DQ"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "DQ MTS"))}
            >DQ MTS</button>

            <button 
              style={{
                backgroundColor: tableColumns.some(x => x.Header === "NOSHOW MTS") ? "#77B6E2" : "darkgray", 
                border: "none",
                fontSize: "15px",
                padding: "8px",
                borderRadius: "6px",
                margin: "7px",
                fontWeight: "bold",
              }}  
              onClick={() => tableColumns.find((e) => e.Header === "NOSHOW MTS") === undefined ? setTableColumns(tableColumns.concat([{Header: "NOSHOW MTS", accessor: "NoShow"}])) : setTableColumns(tableColumns.filter((x) => x.Header !== "NOSHOW MTS"))}
            >NOSHOW MTS</button>

          </div>
        </div>
      </div>
      
    <div>
      <table className={tableStyles.Table}{...getTableProps()}>
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
                  </React.Fragment>
            )
          })}  
        </tbody>
      </table>
    </div>
    </div>

      </div>
    </div>
  </div>
  )
}

  export default TeamStats;

