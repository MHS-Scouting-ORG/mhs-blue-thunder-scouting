
import React, { useEffect, useState } from "react"
import { useExpanded, useTable, useSortBy, useGlobalFilter } from "react-table"
import { getMatchesForRegional} from "../api";
import { getTeamsInRegional, getOprs } from "../api/bluealliance";
import TeamInnerTable from "./TeamInnerTable";
import GridInnerTable from './GridInnerTable';
import GlobalFilter from "./GlobalFilter";
import List from "./List";
import Modal from "./Modal";
import ConeAccTable from "./ConeAccTable"
import ConePtsTable from "./ConePtsTable"
import CubeAccTable from "./CubeAccTable"
import CubePtsTable from "./CubePtsTable"

import { apiGetRegional } from "../api";

function MainTable(props) {
  const regional = apiGetRegional()

  const [tableData,setTableData] = useState([]); //data on table
  const [teamsData,setTeamsData] = useState([]); //data of teams
  const [apiData,setApiData] = useState([]) //data retrieved 
  const [deletedData,setDeletedData] = useState([]); //stores deleted data

  const [gridState,setGridState] = useState(false); 
  const [teamState,setTeamState] = useState(false); 
  const [conePtsState,setConePtsState] = useState(false); 
  const [coneAccState,setConeAccState] = useState(false); 
  const [cubePtsState,setCubePtsState] = useState(false); 
  const [cubeAccState,setCubeAccState] = useState(false);  

  const [modalState, setModalState] = useState(false);
  const [modalData, setModalData] = useState();
  //states for innerTables ^

  const [oprList,setOprList] = useState([]);
  const [dprList,setDprList] = useState([]);
  const [ccwmList,setCcwmList] = useState([]);
  //separate variables for filtering ^

  const [sortBy,setSortBy] = useState([]);


   useEffect(() => {
    getMatchesForRegional(regional)
    .then(data => {
      console.log(data.data.teamMatchesByRegional.items)
    })
  },[]) //debug purposes or test ^ 
  
   useEffect(() => { // sets team numbers of objects
    getTeams()
      .then(data => {
        setTeamsData(data)
      })
      .catch(console.log.bind(console))
   },[]) 

   useEffect(() => { //debug, reference, or test
    getMatchesForRegional(regional)
    .then(data => {
      let setApi = data.data.teamMatchesByRegional.items;
      deletedData.map(deletedRow => {
        setApi = setApi.filter(x => x.id.substring(x.id.indexOf('_')+1) !== deletedData.original.Match)
      })

      setApiData(setApi)//data.data.teamMatchesByRegional.items)
      //console.log(data.data)       

    })
    .catch(console.log.bind(console))
  }, [teamsData, deletedData]) 

   useEffect(() => {     //set opr data
    getOprs(regional)
    .then(data => { 
      const oprDataArr = Object.values(data)
      const cData = oprDataArr[0] //ccwm 
      const dData = oprDataArr[1] //dpr
      const oData = oprDataArr[2] //opr

      setOprList(oData)
      setDprList(dData)
      setCcwmList(cData) 
    })
    .catch(console.log.bind(console))
   },[teamsData])

   useEffect(() => setTableData(teamsData.map(team => { //'big' or whole data array that is used for table

    //console.log(deletedData[0]);
    let teamStats = apiData.filter(x => x.Team === team.TeamNum)/*.filter(x => x.id !== deletedData.map(del => {
      console.log(del)
      del.original.Match
    }))//*/
    deletedData.map(deletedRow => {
      teamStats = teamStats.filter(x => x.id !== regional + "_" + deletedRow.original.Match)
    });

    console.log(teamStats)
    //console.log(apiData);

    const points = teamStats.map(x => x.Teleop.ScoringTotal.Total) //for deviation
    const gridPoints = teamStats.map(x => x.Teleop.ScoringTotal.GridPoints)
    const conePts = teamStats.map(x => x.Teleop.ScoringTotal.Cones)
    const cubePts = teamStats.map(x => x.Teleop.ScoringTotal.Cubes)
    const coneAcc = teamStats.map(x => x.Teleop.ConesAccuracy.Overall)
    const cubeAcc = teamStats.map(x => x.Teleop.CubesAccuracy.Overall)

    const mGridPoints = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgGridPoints.substring(2,8))
    const mConePoints = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgConePts.substring(2,8))
    const mConeAcc = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgConeAcc.substring(2,8)) // for sorts
    const mCubePoints = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgCubePts.substring(2,8))
    const mCubeAcc = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgCubeAcc.substring(2,8))
    const mCSPoints = tableData.filter(x => x.TeamNumber === team.TeamNumber).map(x => x.AvgCSPoints)

    const avgPoints = calcAvgPoints(teamStats)
    const avgGridPoints = calcAvgGrid(teamStats)
    const avgConePoints = calcAvgConePts(teamStats)
    const avgConeAcc = calcAvgConeAcc(teamStats) //tableData
    const avgCubePoints = calcAvgCubePts(teamStats)
    const avgCubeAcc = calcAvgCubeAcc(teamStats)
    const avgCSPoints = calcAvgCS(teamStats)

    const priorities = getPriorities(teamStats)
    const penalties = getPenalties(teamStats)

    const upperGridPts = calcUpperGrid(teamStats)
    const upperGridAcc = calcUpperGridAcc(teamStats)
    const midGridPts = calcMidGrid(teamStats)
    const midGridAcc = calcMidGridAcc(teamStats)
    const lowerGridPts = calcLowGrid(teamStats)
    const lowerGridAcc = calcLowAcc(teamStats)

    const upperConeAcc = calcUpperConeAcc(teamStats)
    const midConeAcc = calcMidConeAcc(teamStats)
    const lowerConeAcc = calcLowConeAcc(teamStats)

    const upperConePts = calcUpperConeGrid(teamStats)
    const midConePts = calcMidConeGrid(teamStats)
    const lowerConePts = calcLowConeGrid(teamStats)

    const upperCubeAcc = calcUpperCubeAcc(teamStats)
    const midCubeAcc = calcMidCubeAcc(teamStats)
    const lowerCubeAcc = calcLowCubeAcc(teamStats)

    const upperCubePts = calcUpperCubeGrid(teamStats)
    const midCubePts = calcMidCubeGrid(teamStats)
    const lowerCubePts = calcLowCubeGrid(teamStats)

    const maxGridPoints = getMax(tableData.map(team => team.AvgGridPoints.substring(2,8)))
    const maxConePoints = getMax(tableData.map(team => team.AvgConePts.substring(2,8)))
    const maxConeAcc = getMax(tableData.map(team => team.AvgConeAcc.substring(2,8))) //for sorts
    const maxCubePoints = getMax(tableData.map(team => team.AvgCubePts.substring(2,8)))
    const maxCubeAcc = getMax(tableData.map(team => team.AvgCubeAcc.substring(2,8)))
    const maxCSPoints = getMax(tableData.map(team => team.AvgCSPoints))

    const rGridPoints = mGridPoints / maxGridPoints
    const rConePoints = mConePoints / maxConePoints
    const rConeAcc = mConeAcc / maxConeAcc //for sorts
    const rCubePoints = mCubePoints / maxCubePoints
    const rCubeAcc = mCubeAcc / maxCubeAcc
    const rCSPoints = mCSPoints / maxCSPoints
    
    return {
      TeamNumber: team.TeamNumber,
      Matches: team.Matches,
      OPR: oprList[team.TeamNum] ? (oprList[team.TeamNum]).toFixed(2) : null,
      Priorities: priorities.join(', '),
      CCWM: ccwmList[team.TeamNum] ? (ccwmList[team.TeamNum]).toFixed(2) : null, 
      AvgPoints: avgPoints !== 0 && isNaN(avgPoints) !== true ? `μ=${avgPoints}, σ=${calcDeviation(points, avgPoints)}` : '', 
      AvgGridPoints: avgGridPoints !== 0 && isNaN(avgGridPoints) !== true ? `μ=${avgGridPoints}, σ=${calcDeviation(gridPoints, avgGridPoints)}` : '',
      AvgCSPoints: avgCSPoints !== 0 && isNaN(avgCSPoints) !== true ? avgCSPoints : '',
      AvgConePts: avgConePoints !== 0 && isNaN(avgConePoints) !== true ? `μ=${avgConePoints}, σ=${calcDeviation(conePts, avgConePoints)}` : '', 
      AvgConeAcc: avgConeAcc !== 0 && isNaN(avgConeAcc) !== true ? `μ=${avgConeAcc}, σ=${calcDeviation(coneAcc, avgConeAcc)}` : '', 
      AvgCubePts: avgCubePoints !== 0 && isNaN(avgCubePoints) !== true ? `μ=${avgCubePoints}, σ=${calcDeviation(cubePts, avgCubePoints)}` : '', 
      AvgCubeAcc: avgCubeAcc !== 0 && isNaN(avgCubeAcc) !== true ? `μ=${avgCubeAcc}, σ=${calcDeviation(cubeAcc, avgCubeAcc)}` : '', 
      DPR: dprList[team.TeamNum] ? (dprList[team.TeamNum]).toFixed(2) : null, 
      Penalties: penalties.join(', '),

      AvgUpper: upperGridPts,
      AvgUpperAcc: upperGridAcc,
      AvgMid: midGridPts, //for inner tables
      AvgMidAcc: midGridAcc,
      AvgLower: lowerGridPts,
      AvgLowerAcc: lowerGridAcc,

      AvgUpperConeAcc: upperConeAcc,
      AvgMidConeAcc: midConeAcc,
      AvgLowerConeAcc: lowerConeAcc,

      AvgUpperConePts: upperConePts,
      AvgMidConePts: midConePts,
      AvgLowerConePts: lowerConePts,

      AvgUpperCubeAcc: upperCubeAcc,
      AvgMidCubeAcc: midCubeAcc,
      AvgLowerCubeAcc: lowerCubeAcc,

      AvgUpperCubePts: upperCubePts,
      AvgMidCubePts: midCubePts,
      AvgLowerCubePts: lowerCubePts,

      NGridPoints: isNaN(rGridPoints) !== true ? rGridPoints : 0,
      NConePoints: isNaN(rConePoints) !== true ? rConePoints : 0, 
      NConeAccuracy: isNaN(rConeAcc) !== true ? rConeAcc : 0, //for sorts
      NCubePoints: isNaN(rCubePoints) !== true ? rCubePoints : 0, 
      NCubeAccuracy: isNaN(rCubeAcc) !== true ? rCubeAcc : 0,
      NChargeStation: isNaN(rCSPoints) !== true ? rCSPoints : 0,
    }
  })), [teamsData, oprList, dprList, ccwmList, deletedData])

const getTeams = async () => {
   return await (getTeamsInRegional(regional))
    .catch(err => console.log(err))
    .then(data => {
      return data.map(obj => {
        const teamNumObj = {
          TeamNumber: obj.team_number,
          Matches: '',
          OPR: "",
          Priorities: '',
          CCWM: "", 
          AvgPoints: 0,
          AvgGridPoints: 0,
          AvgConePts: 0,
          AvgConeAcc: 0,
          AvgCubePts: 0,
          AvgCubeAcc: 0,
          AvgCSPoints: 0,
          DPR: "",
          Penalties: "",
          TeamNum: `frc${obj.team_number}`,

          NGridPoints: 0,
          NConePoints: 0, 
          NConeAccuracy: 0, 
          NCubePoints: 0, 
          NCubeAccuracy: 0, 
          NChargeStation: 0,
        }

        return teamNumObj
      })
    })
    .catch(err => console.log(err))
}

const handleDelete = (row) => {
  console.log(row);
  //setDeletedData([deletedData.length](row));
  let deleted = deletedData;
  setDeletedData(deletedData.concat(row));
  console.log(deletedData);
  //console.log(regional);
  /*let array = [];
  array[0] = row;
  console.log(array);//*/
  //console.log("CLICKED")
}

//EDIT

const handleEdit = (row) => {
  setModalState(true);
  //console.log(row);
  //console.log(apiData)
  let setModal = apiData;
  setModal = setModal.filter(x => x.Team === row.original.Team).filter(team => team.id === regional + "_" + row.original.Match);
  setModalData(setModal);
}

const modalClose = () => {
  setModalState(false);
}

// ================================= !MINI/INNER TABLES! ===========
const renderRowSubComponent = ({ row }) => {
  let t = apiData.filter(x => x.Team === `frc${row.values.TeamNumber}`)
  
  deletedData.map(deletedRow => {
    t = t.filter(x => x.id.substring(x.id.indexOf('_')+1) !== deletedRow.original.Match) 
  })

  const disp = t.map(x => {

    const penalties = x.Penalties.Penalties.filter(x => x != 'None') 
    const rankingPts = x.RankingPts.filter(x => x != 'None' || '',)
        return {
            Team: x.Team,
            Match: x.id.substring(x.id.indexOf('_')+1),
            Strategy: x.Priorities.filter(val => val != undefined && val.trim() !== '').length !== 0 ? x.Priorities.filter(val => val != undefined && val.trim() !== '').map(val => val.trim()).join(', ') : '',
            TotalPts: x.Teleop.ScoringTotal.Total !== null  ? x.Teleop.ScoringTotal.Total : '',
            GridPts: x.Teleop.ScoringTotal.GridPoints !== null ? x.Teleop.ScoringTotal.GridPoints : '',
            ConeAcc: x.Teleop.ConesAccuracy.Overall !== 0 && x.Teleop.ConesAccuracy.Overall !== null ? (x.Teleop.ConesAccuracy.Overall.toFixed(2)) : '',
            CubeAcc: x.Teleop.CubesAccuracy.Overall !== 0 && x.Teleop.CubesAccuracy.Overall !== null ? x.Teleop.CubesAccuracy.Overall.toFixed(2) : '',
            AutoPlacement: x.Autonomous.AutonomousPlacement !== 0 ? x.Autonomous.AutonomousPlacement : '',
            Mobility: x.Autonomous.LeftCommunity === true ? 'yes' : 'no',
            AutoUpperConePts: `${x.Autonomous.Scored.Cones.Upper}/${x.Autonomous.Scored.Cones.Upper + x.Autonomous.Attempted.Cones.Upper}`,
            AutoUpperCubePts: `${x.Autonomous.Scored.Cubes.Upper}/${x.Autonomous.Scored.Cubes.Upper + x.Autonomous.Attempted.Cubes.Upper}`,
            AutoMidConePts: `${x.Autonomous.Scored.Cones.Mid}/${x.Autonomous.Scored.Cones.Mid + x.Autonomous.Attempted.Cones.Mid}`,
            AutoMidCubePts: `${x.Autonomous.Scored.Cubes.Mid}/${x.Autonomous.Scored.Cubes.Mid + x.Autonomous.Attempted.Cubes.Mid}`,
            AutoLowConePts: `${x.Autonomous.Scored.Cones.Lower}/${x.Autonomous.Scored.Cones.Lower + x.Autonomous.Attempted.Cones.Lower}`,
            AutoLowCubePts: `${x.Autonomous.Scored.Cubes.Lower}/${x.Autonomous.Scored.Cubes.Lower + x.Autonomous.Attempted.Cubes.Lower}`,
            AutoChargeStationPts: x.Autonomous.ChargeStation,
            TeleUpperConePts: `${x.Teleop.Scored.Cones.Upper}/${x.Teleop.Scored.Cones.Upper + x.Teleop.Attempted.Cones.Upper}`,
            TeleUpperCubePts: `${x.Teleop.Scored.Cubes.Upper}/${x.Teleop.Scored.Cubes.Upper + x.Teleop.Attempted.Cubes.Upper}`,
            TeleMidConePts: `${x.Teleop.Scored.Cones.Mid}/${x.Teleop.Scored.Cones.Mid + x.Teleop.Attempted.Cones.Mid}`,
            TeleMidCubePts: `${x.Teleop.Scored.Cubes.Mid}/${x.Teleop.Scored.Cubes.Mid + x.Teleop.Attempted.Cubes.Mid}`,
            TeleLowConePts: `${x.Teleop.Scored.Cones.Lower}/${x.Teleop.Scored.Cones.Lower + x.Teleop.Attempted.Cones.Lower}`,
            TeleLowCubePts: `${x.Teleop.Scored.Cubes.Lower}/${x.Teleop.Scored.Cubes.Lower + x.Teleop.Attempted.Cubes.Lower}`,
            TeleEndgame: x.Teleop.EndGame !== undefined ? x.Teleop.EndGame : '',
            CSStart: x.Teleop.EndGameTally.Start !== 0 ? x.Teleop.EndGameTally.Start : '',
            CSEnd: x.Teleop.EndGameTally.End !== 0 ? x.Teleop.EndGameTally.End : '',
            DriveStrength: x.Teleop.DriveStrength !== undefined ? x.Teleop.DriveStrength : '',
            DriveSpeed: x.Teleop.DriveSpeed !== "0" ? x.Teleop.DriveSpeed : '',
            SmartPlacement: x.Teleop.SmartPlacement === true ? `yes` : `no`,
            NumberOfFoulAndTech: x.Penalties.Fouls !== 0 || x.Penalties.Tech !== 0 ? `${x.Penalties.Fouls} | ${x.Penalties.Tech}` : ``,
            Penalties: penalties.join(', '),
            NumberOfRankingPoints: rankingPts.join(', '),
            Comments: x.Comments !== undefined ? x.Comments.trim() : '',
        };
    })

  return disp.length > 0 ?
  (<pre>
    <div style={{maxWidth: "100rem", overflowX: "scroll", borderCollapse: "collapse", }}>{<TeamInnerTable setModal={handleEdit} delete={handleDelete} information = {disp}/>} </div>
  </pre>)
  : (
    <div style={{
      padding: '5px',
  }}> No data collected for Team {row.values.TeamNumber}. </div>
  );
}

const renderRowSubComponentGrid = ({row}) => {
  const g = tableData.filter(x => x.TeamNumber === row.values.TeamNumber )
  
    const disp = g.map(x => {
      return {
        AvgUpper: x.AvgUpper !== 0 ? `μ=${x.AvgUpper}` : '',
        AvgUpperAcc: x.AvgUpperAcc !== 0 ? `μ=${x.AvgUpperAcc}` : '',
        AvgMid: x.AvgMid !== 0 ? `μ=${x.AvgMid}` : '',
        AvgMidAcc: x.AvgMidAcc !== 0 ? `μ=${x.AvgMidAcc}` : '',
        AvgLower: x.AvgLower !== 0 ? `μ=${x.AvgLower}` : '',
        AvgLowerAcc: x.AvgLowerAcc !== 0 ? `μ=${x.AvgLowerAcc}` : '',
      };
   })
  
      
  return disp !== undefined ?
  (<pre>
    <div>{<GridInnerTable information = {disp}/>} </div>
  </pre>)
  : (
    <div style={{
      padding: '5px',
  }}> No data collected. </div>
  );
}

const renderRowSubComponentConeAccTable = ({row}) => {
  const g = tableData.filter(x => x.TeamNumber === row.values.TeamNumber )

  const disp = g.map(x => {
    return {
        AvgUpperConeAcc:  x.AvgUpperConeAcc !== 0 ? `μ=${x.AvgUpperConeAcc}` : '',
        AvgMidConeAcc: x.AvgMidConeAcc !== 0 ? `μ=${x.AvgMidConeAcc}` : '',
        AvgLowerConeAcc: x.AvglowerConeAcc !== 0? `μ=${x.AvgLowerConeAcc}` : '',
      }
    })

    return disp !== undefined ?
    (<pre>
      <div>{<ConeAccTable information = {disp}/>} </div>
    </pre>)
    : (
      <div style={{
        padding: '5px',
    }}> No data collected. </div>
    );
  }

  const renderRowSubComponentConePtsTable = ({row}) => {
    const g = tableData.filter(x => x.TeamNumber === row.values.TeamNumber)
      console.log(g)
      const disp = g.map(x => {
      return {
        AvgUpperCone: x.AvgUpperConePts !== 0 ? `μ=${x.AvgUpperConePts}` : '',
        AvgMidCone: x.AvgMidConePts !== 0 ? `μ=${x.AvgMidConePts}` : '',
        AvgLowCone: x.AvgLowerConePts !== 0 ? `μ=${x.AvgLowerConePts}` : '',
      }
    })

      return disp !== undefined ?
      (<pre>
        <div>{<ConePtsTable information = {disp}/>} </div>
      </pre>)
      : (
        <div style={{
          padding: '5px',
      }}> No data collected. </div>
      );
    }

    const renderRowSubComponentCubeAccTable = ({row}) => {
      const g = tableData.filter(x => x.TeamNumber === row.values.TeamNumber)
      
      const disp = g.map(x => { 
        return {
          UpperCubesAcc: x.AvgUpperCubeAcc !== 0 ? `μ=${x.AvgUpperCubeAcc}` : '',
          MidCubesAcc: x.AvgMidCubeAcc !== 0 ? `μ=${x.AvgMidCubeAcc}` : '',
          LowCubesAcc: x.AvgLowerCubeAcc !== 0 ? `μ=${x.AvgLowerCubeAcc}` : '',
      }
    })
      
        return disp !== undefined ?
        (<pre>
          <div>{<CubeAccTable information = {disp}/>} </div>
        </pre>)
        : (
          <div style={{
            padding: '5px',
        }}> No data collected. </div>
        );
      }

      const renderRowSubComponentCubePtsTable = ({row}) => {
        const g = tableData.filter(x => x.TeamNumber === row.values.TeamNumber)
        
        const disp = g.map(x => {
          return {
            AvgUpperCubes: x.AvgUpperCubePts !== 0 ? `μ=${x.AvgUpperCubePts}` : '',
            AvgMidCubes: x.AvgMidCubePts !== 0 ? `μ=${x.AvgMidCubePts}` : '',
            AvgLowCubes: x.AvgLowerCubePts !== 0 ? `μ=${x.AvgLowerCubePts}` : '',

        }
      })  
        
          return disp !== undefined ?
          (<pre>
            <div>{<CubePtsTable information = {disp}/>} </div>
          </pre>)
          : (
            <div style={{
              padding: '5px',
          }}> No data collected. </div>
          );
        }

function gridStateHandler(bool, bool2, bool3, bool4, bool5, bool6){
  setGridState(bool);
  setConePtsState(bool2);
  setConeAccState(bool3);
  setCubeAccState(bool4);
  setCubePtsState(bool5);
  setTeamState(bool6);
}

function tableHandler(row){ //handles which state and inner table should be shown
    if(gridState === true){
      return (
      <tr>
        <td colSpan={visibleColumns.length}
        style = {{
          maxWidth: "10rem"
        }}
        >
          {renderRowSubComponentGrid ({row})}
        </td>
      </tr>
      )
    }
    else if(coneAccState === true){
      return (
      <tr>
        <td colSpan={visibleColumns.length}
        style = {{
          maxWidth: "1200px"
        }}
        >
          {renderRowSubComponentConeAccTable ({row})}
        </td>
      </tr>
      )
    }
    else if(conePtsState === true){
      return (
      <tr>
        <td colSpan={visibleColumns.length}
        style = {{
          maxWidth: "1200px"
        }}
        >
          {renderRowSubComponentConePtsTable ({row})}
        </td>
      </tr>
      )
    }
    else if(cubeAccState === true){
      return (
      <tr>
        <td colSpan={visibleColumns.length}
        style = {{
          maxWidth: "1200px"
        }}
        >
          {renderRowSubComponentCubeAccTable ({row})}
        </td>
      </tr>
      )
    }
    else if(cubePtsState === true){
      return (
      <tr>
        <td colSpan={visibleColumns.length}
        style = {{
          maxWidth: "1200px"
        }}
        >
          {renderRowSubComponentCubePtsTable ({row})}
        </td>
      </tr>
      )
    }
    else if(teamState === true){
      return (
      <tr>
        <td colSpan={visibleColumns.length}
        style = {{
          maxWidth: "1200px"
        }}
        >
          {renderRowSubComponent ({row})}
        </td>
      </tr>
      )
    }
    else{console.log('error in tablehandler or nothing shown')}
  } 

// ================================================ !CALC HERE! ========================

//methods for what needs to be shown on summary table, accessors are from form people

  const uniqueArr = (arr) => {  
    const a = arr.map(x => x.trim());
      return a.filter((item, index) => {
          return a.indexOf(item, 0) === index;
      })
  }

  const getPriorities = (arr) => {
    let pri = arr.map(teamObj => teamObj.Priorities).reduce((a,b) => a.concat(b), []).filter((item) => item != undefined && item.trim() !== '');
    return uniqueArr(pri);
  }

  const getPenalties = (arr) => {
    let pen = arr.map(teamObj => teamObj.Penalties.Penalties).reduce((a,b) => a.concat(b), []).filter((item) => item.trim() !== 'None')
    return uniqueArr(pen) 
  }

  /*REMOVING DELETED DATA FROM CALCULATIONS

  const removeDeleted = (arr) => {
    //use arr and check with all instances of deleted data? idk bruh
  }
  //*/

  //avg total points
  const calcAvgPoints = (arr) => { //average points
    let individualPts = arr.map(val => val.Teleop.ScoringTotal.Total);
    let totalPts = 0;
    for(let i = 0; i < individualPts.length; i++){
      totalPts = totalPts + individualPts[i]; //total pts
    }
    let avgPts = totalPts / individualPts.length;
    return avgPts.toFixed(3); //avg it
  }

  //avg grid points
  const calcAvgGrid = (arr) => {
    let individualPts = arr.map(val => val.Teleop.ScoringTotal != null ? val.Teleop.ScoringTotal.GridPoints : 0);
    let totalPts = 0;
    for(let i = 0; i < individualPts.length; i++){
      totalPts = totalPts + individualPts[i];
    }
    let avgGridPts = totalPts / individualPts.length;
    return avgGridPts.toFixed(3);
  }
  
  const calcAvgConePts = (arr) => {
    let indivConePts = arr.map(val => val.Teleop.ScoringTotal.Cones != null ? val.Teleop.ScoringTotal.Cones : 0)
    let totalConePts = 0
    for(let i = 0; i < indivConePts.length; i++){
      totalConePts = totalConePts + indivConePts[i];
    }
    let avgConePts = totalConePts / indivConePts.length
    return avgConePts.toFixed(3)
  }
 
  const calcAvgConeAcc = (arr) => {
    let indivConeAcc = arr.map(val => val.Teleop.ConesAccuracy != null ? val.Teleop.ConesAccuracy.Overall : 0)
    let totalConeAcc = 0
    for(let i = 0; i < indivConeAcc.length; i++){
      totalConeAcc = totalConeAcc + indivConeAcc[i]
    }
    let avgConeAcc = totalConeAcc / indivConeAcc.length
    return avgConeAcc.toFixed(3)
  }

  const calcAvgCubePts = (arr) => {
    let indivCubePts = arr.map(val => val.Teleop.ScoringTotal != null ? val.Teleop.ScoringTotal.Cubes: 0)
    let totalCubePts = 0
    for(let i = 0; i < indivCubePts.length; i++){
      totalCubePts = totalCubePts + indivCubePts[i]
    }
    let avgCubePts = totalCubePts / indivCubePts.length
    return avgCubePts.toFixed(3)
  }

  const calcAvgCubeAcc = (arr) => {
    let indivCubeAcc = arr.map(val => val.Teleop.CubesAccuracy != null ? val.Teleop.CubesAccuracy.Overall: 0)
    let totalCubeAcc = 0
    for(let i = 0; i < indivCubeAcc.length; i++){
      totalCubeAcc = totalCubeAcc + indivCubeAcc[i]
    }
    let avgCubeAcc = totalCubeAcc / indivCubeAcc.length
    return avgCubeAcc.toFixed(3)
  }

  const calcAvgCS = (arr) => {
    const indivTeleCSDocked = arr.filter(val => val.Teleop.EndGame === "Docked")
    const indivTeleCSDockedPts = indivTeleCSDocked.length * 6
    const indivTeleCSDockedEng = arr.filter(val => val.Teleop.EndGame === "DockedEngaged")
    const indivTeleCSDockedEngPts = indivTeleCSDockedEng.length * 10
    const indivAutoCSDocked = arr.filter(val => val.Autonomous.ChargeStation === "Docked")
    const indivAutoCSDockedPts = indivAutoCSDocked.length * 8
    const indivAutoCSDockedEng = arr.filter(val => val.Autonomous.ChargeStation === "DockedEngaged")
    const indivAutoCSDockedEngPts = indivAutoCSDockedEng.length * 12

    const totalCSPts = indivTeleCSDockedPts + indivTeleCSDockedEngPts + indivAutoCSDockedPts + indivAutoCSDockedEngPts 
    const avgCSPts = totalCSPts / (arr.length)
    return avgCSPts.toFixed(2)
  }

  const calcUpperGrid = (arr) => {
    let upper = arr.map(val => val.Teleop.ScoringTotal.GridScoringByPlacement.High != null ? val.Teleop.ScoringTotal.GridScoringByPlacement.High: 0);
    let sumUpper = 0;
    for(let i = 0; i < upper.length; i++){
      sumUpper = sumUpper + upper[i];
    }
    let avgUpper = sumUpper / upper.length;
    return avgUpper.toFixed(3);
  }

  const calcUpperGridAcc = (arr) => {
    let upperAcc = arr.map(val => (val.Teleop.ConesAccuracy.High + val.Teleop.CubesAccuracy.High) != null ? (val.Teleop.ConesAccuracy.High + val.Teleop.CubesAccuracy.High) : 0);
    let sumUpperAcc = 0;
    for(let i = 0; i < upperAcc.length; i++){
      sumUpperAcc = sumUpperAcc + upperAcc[i];
    }
    let avgUpperAcc = sumUpperAcc / upperAcc.length;
    return avgUpperAcc.toFixed(3);
  }

  const calcUpperConeGrid = (arr) => {  
    let upper = arr.map(val => (val.Autonomous.Scored.Cones.Upper + val.Teleop.Scored.Cones.Upper) != null ? ((val.Autonomous.Scored.Cones.Upper * 6) + (val.Teleop.Scored.Cones.Upper * 5)) : 0);
    let sumUpper = 0;
    for(let i = 0; i < upper.length; i++){
      sumUpper = sumUpper + upper[i];      
    }
    let avgUpperCone = sumUpper / upper.length;
    return avgUpperCone.toFixed(3);      
  }

  const calcUpperConeAcc = (arr) => { 
    let upperAcc = arr.map(val => val.Teleop.ConesAccuracy.High != null ? val.Teleop.ConesAccuracy.High : 0);
    let sumUpperAcc = 0;
    for(let i = 0; i < upperAcc.length; i++){
      sumUpperAcc = sumUpperAcc + upperAcc[i];  
    }
    let avgUpperConeAcc = sumUpperAcc / upperAcc.length;  //avg acc of mid
    return avgUpperConeAcc.toFixed(3); 
  }

  const calcUpperCubeGrid = (arr) => { 
    let upper = arr.map(val => (val.Autonomous.Scored.Cubes.Upper + val.Teleop.Scored.Cubes.Upper) != null ? ((val.Autonomous.Scored.Cubes.Upper * 6) + (val.Teleop.Scored.Cubes.Upper * 5)) : 0);
    let sumUpper = 0;
    for(let i = 0; i < upper.length; i++){
      sumUpper = sumUpper + upper[i];      
    }
    let avgUpperCube = sumUpper / upper.length;
    return avgUpperCube.toFixed(3);       
  }

  const calcUpperCubeAcc = (arr) => { 
    let upperAcc = arr.map(val => val.Teleop.CubesAccuracy.High != null ? val.Teleop.CubesAccuracy.High : 0);
    let sumUpperAcc = 0;
    for(let i = 0; i < upperAcc.length; i++){
      sumUpperAcc = sumUpperAcc + upperAcc[i];  
    }
    let avgUpperCubeAcc = sumUpperAcc / upperAcc.length; 
    return avgUpperCubeAcc.toFixed(3); 
  }

 
  const calcMidGrid = (arr) => {
    let mid = arr.map(val => val.Teleop.ScoringTotal.GridScoringByPlacement.Mid != null ? val.Teleop.ScoringTotal.GridScoringByPlacement.Mid : 0);
    let sumMid = 0;
    for(let i = 0; i < mid.length; i++){
      sumMid = sumMid + mid[i];
    }
    let avgMid = sumMid / mid.length;
    return avgMid.toFixed(3);
  }

  const calcMidGridAcc = (arr) => {
    let midAcc = arr.map(val => (val.Teleop.ConesAccuracy.Mid + val.Teleop.CubesAccuracy.Mid) != null ? (val.Teleop.ConesAccuracy.Mid + val.Teleop.CubesAccuracy.Mid) : 0);
    let sumMidAcc = 0;
    for(let i = 0; i < midAcc.length; i++){
      sumMidAcc = sumMidAcc + midAcc[i];
    }
    let avgMidAcc = sumMidAcc / midAcc.length;
    return avgMidAcc.toFixed(3);
  }

  const calcMidConeGrid = (arr) => { 
    let mid = arr.map(val => (val.Autonomous.Scored.Cones.Mid + val.Teleop.Scored.Cones.Mid) != null ? ((val.Autonomous.Scored.Cones.Mid * 4) + (val.Teleop.Scored.Cones.Mid * 3)) : 0);
    let sumMid = 0;
    for(let i = 0; i < mid.length; i++){
      sumMid = sumMid + mid[i];      
    }
    let avgMidCone = sumMid / mid.length;
    return avgMidCone.toFixed(3);       
  }

  const calcMidConeAcc = (arr) => { 
    let midAcc = arr.map(val => val.Teleop.ConesAccuracy.Mid != null ? val.Teleop.ConesAccuracy.Mid : 0);
    let sumMidAcc = 0;
    for(let i = 0; i < midAcc.length; i++){
      sumMidAcc = sumMidAcc + midAcc[i];  
    }
    let avgMidConeAcc = sumMidAcc / midAcc.length;  
    return avgMidConeAcc.toFixed(3); 
  }

  const calcMidCubeGrid = (arr) => { 
    let mid = arr.map(val => (val.Autonomous.Scored.Cubes.Mid + val.Teleop.Scored.Cubes.Mid) != null ? ((val.Autonomous.Scored.Cubes.Mid * 4) + (val.Teleop.Scored.Cubes.Mid * 3)) : 0);
    let sumMid = 0;
    for(let i = 0; i < mid.length; i++){
      sumMid = sumMid + mid[i];      
    }
    let avgMidCube = sumMid / mid.length;
    return avgMidCube.toFixed(3);       
  }

  const calcMidCubeAcc = (arr) => { 
    let midAcc = arr.map(val => val.Teleop.CubesAccuracy.Mid != null ? val.Teleop.CubesAccuracy.Mid : 0);
    let sumMidAcc = 0;
    for(let i = 0; i < midAcc.length; i++){
      sumMidAcc = sumMidAcc + midAcc[i];  
    }
    let avgMidCubeAcc = sumMidAcc / midAcc.length;  
    return avgMidCubeAcc.toFixed(3); 
  }

  const calcLowGrid = (arr) => {
    let low = arr.map(val => val.Teleop.ScoringTotal.GridScoringByPlacement.Low != null ? val.Teleop.ScoringTotal.GridScoringByPlacement.Low : 0);
    let sumLow = 0;
    for(let i = 0; i < low.length; i++){
      sumLow = sumLow + low[i];
    }
    let avgLow = sumLow / low.length;
    return avgLow.toFixed(3);
  }

  const calcLowAcc = (arr) => {
    let lowAcc = arr.map(val => (val.Teleop.ConesAccuracy.Low + val.Teleop.CubesAccuracy.Low) != null ? (val.Teleop.ConesAccuracy.Low + val.Teleop.CubesAccuracy.Low) : 0);
    let sumLowAcc = 0;
    for(let i = 0; i < lowAcc.length; i++){
      sumLowAcc = sumLowAcc + lowAcc[i];
    }
    let avgLowAcc = sumLowAcc / lowAcc.length;
    return avgLowAcc.toFixed(3);
  }

  const calcLowConeGrid = (arr) => { 
    let low = arr.map(val => (val.Autonomous.Scored.Cones.Lower + val.Teleop.Scored.Cones.Lower) != null ? ((val.Autonomous.Scored.Cones.Lower * 3) + (val.Teleop.Scored.Cones.Lower * 2)) : 0);
    let sumLow = 0;
    for(let i = 0; i < low.length; i++){
      sumLow = sumLow + low[i];      
    }
    let avgLowCone = sumLow / low.length;
    return avgLowCone.toFixed(3);       
  }

  const calcLowConeAcc = (arr) => { 
    let lowAcc = arr.map(val => val.Teleop.ConesAccuracy.Low != null ? val.Teleop.ConesAccuracy.Low : 0);
    let sumLowAcc = 0;
    for(let i = 0; i < lowAcc.length; i++){
      sumLowAcc = sumLowAcc + lowAcc[i];  
    }
    let avgLowConeAcc = sumLowAcc / lowAcc.length;  
    return avgLowConeAcc.toFixed(3); 
  }

  const calcLowCubeGrid = (arr) => { 
    let low = arr.map(val => (val.Autonomous.Scored.Cubes.Lower + val.Teleop.Scored.Cubes.Lower) != null ? ((val.Autonomous.Scored.Cubes.Lower * 3) + (val.Teleop.Scored.Cubes.Lower * 2)) : 0);
    let sumLow = 0;
    for(let i = 0; i < low.length; i++){
      sumLow = sumLow + low[i];      
    }
    let avgLowCube = sumLow / low.length;
    return avgLowCube.toFixed(3);       
  }

  const calcLowCubeAcc = (arr) => { 
    let lowAcc = arr.map(val => val.Teleop.CubesAccuracy.Low != null ? val.Teleop.CubesAccuracy.Low : 0);
    let sumLowAcc = 0;
    for(let i = 0; i < lowAcc.length; i++){
      sumLowAcc = sumLowAcc + lowAcc[i];  
    }
    let avgLowCubeAcc = sumLowAcc / lowAcc.length; 
    return avgLowCubeAcc.toFixed(3); 
  }

  const calcColumnSort = (arr,gridPts,conePts,coneAcc,cubePts,cubeAcc,charge) => {
    let sum = 0;
    if(arr.includes("Grid Points")){
      sum = sum + gridPts;
    }
    if(arr.includes("Cone Points")){
      sum = sum + conePts;
    }
    if(arr.includes("Accurate Cone Placement")){
      sum = sum + coneAcc;
    }
    if(arr.includes("Cube Points")){
      sum = sum + cubePts;
    }
    if(arr.includes("Accurate Cube Placement")){
      sum = sum + cubeAcc;
    }
    if(arr.includes("Charge Station")){
      sum = sum + charge;
    }

    return sum.toFixed(3);
  }

  const calcDeviation = (arr, mean) => { //standard deviation
    const distance = arr.map(val => {
      return (val - mean) ** 2;
    })

    const sumDistance = () => {
      let sum = 0;
      for(let i = 0; i < distance.length; i++){
        sum = sum + distance[i];
      }
      return sum;
    }

    const devi = Math.sqrt(sumDistance() / (distance.length));
    return devi.toFixed(3); //rounds standard deviation to thousandths
  }
  
  const getMax = (arr) => {
    return arr.sort((a, b) => b - a).shift();
  } 

// ======================================= !TABLE HERE! ===========================================
const data = React.useMemo(
  () => tableData.map(team => {
    const grade = calcColumnSort(sortBy, team.NGridPoints, team.NConePoints, team.NConeAccuracy, team.NCubePoints, team.NCubeAccuracy, team.NChargeStation)
    
    return {
      TeamNumber: team.TeamNumber,
      Matches: team.Matches,
      OPR: team.OPR,
      Priorities: team.Priorities,
      CCWM: team.CCWM, 
      AvgPoints: team.AvgPoints,
      AvgCSPoints: team.AvgCSPoints,
      AvgGridPoints: team.AvgGridPoints,
      AvgConePts: team.AvgConePts,
      AvgConeAcc: team.AvgConeAcc,
      AvgCubePts: team.AvgCubePts,
      AvgCubeAcc: team.AvgCubeAcc,
      DPR: team.DPR,
      Penalties: team.Penalties,
      SumPriorities: grade !== 0.000 ? grade : "",

      NGridPoints: team.NGridPoints,
      NConePoints: team.NConePoints, 
      NConeAccuracy: team.NConeAccuracy, 
      NCubePoints: team.NCubePoints, 
      NCubeAccuracy: team.NCubeAccuracy, 
      NChargeStation: team.NChargeStation,

    }
  }) , [tableData, sortBy]
) 

  const columns = React.useMemo(
    () => [
      {
        Header: "Team #",
        accessor: "TeamNumber",
        Cell: ({ row }) => (
          <span{...row.getToggleRowExpandedProps()}>
            <div style={{fontWeight: 'bold', fontSize: '17px', }}>
              {row.values.TeamNumber}
            </div>
          </span>
          )
      },
      {
        Header: "Priorities/Strategies",
        accessor: "Priorities",
        Cell: ({ row }) => (
          <div
              style = {{
                minWidth:'150px',
                whiteSpace:'normal',
              }}
          >
            {row.original.Priorities}
          </div>
        )
      },
      {
        Header: "OPR",
        accessor: "OPR",
      },
      {
        Header: "CCWM",
        accessor: "CCWM",
      },
      {
        Header: "Avg Points",
        accessor: "AvgPoints",
      },
      {
        Header: "Avg CS Points",
        accessor: "AvgCSPoints"
      },
      {
        Header: "Avg Grid Points",
        accessor: "AvgGridPoints",
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
              {row.values.AvgGridPoints}
          </span>) 
      },
      {
        Header: "Avg Cone Points",
        accessor: "AvgConePts",
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
              {row.values.AvgConePts}
          </span>) 
      },
      {
        Header: "Avg Cone Acc",
        accessor: "AvgConeAcc",
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
              {row.values.AvgConeAcc}
          </span>) 
      },
      {
        Header: "Avg Cube Points",
        accessor: "AvgCubePts",
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
              {row.values.AvgCubePts}
          </span>) 
      },
      {
        Header: "Avg Cube Acc",
        accessor: "AvgCubeAcc",
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
              {row.values.AvgCubeAcc}
          </span>) 
      },
      {
        Header: "DPR",
        accessor: "DPR",
      },
      {
        Header: "Penalties",
        accessor: "Penalties",
        Cell: ({ row }) => (
          <div
              style = {{
                minWidth:'20px',
                whiteSpace: 'normal',
              }}
          >
            {row.original.Penalties}
          </div>
        )
      },
      {
        Header: "Grade",
        accessor: "SumPriorities",
      }
    ], []
  )

  const tableInstance = useTable({ columns, data}, useGlobalFilter, useSortBy, useExpanded);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    setGlobalFilter,
    prepareRow,
    visibleColumns,
  } = tableInstance

  const {globalFilter} = state
  
  return (
    <div>
      <Modal regional={regional} onOff={modalState} offFunction={modalClose} data={modalData}></Modal>

      <h1>CHARGED UP STATISTICS  <img src={"./images/bluethundalogo.png"} width="75px" height= "75px"></img>
      </h1>
            <table style={{ width:'1250px'}} >
                <tbody>
                    <tr>
                        <td
                            style={{
                                minWidth: '750px',
                                textAlign: 'left',
                            }}
                        >
                            <p style={{fontSize: '18px'}}> Select checkboxes to choose which priorities to sort by. Then click on <strong>Grade</strong>. </p>
                            {<List setList={setSortBy}/>}
                            <br/>
                        </td>
                        <td>
                        <p style={{
                            textAlign: 'center',
                            border: '2px solid white',
                            maxWidth: '600px',
                            display: 'inline-block',
                            padding: '5px',
                            fontSize: '20px',
                          }}>
                          <strong>KEY:</strong> 
                          <br/> "Avg" / μ = Average
                          <br/> σ = Standard Deviation
                          <br/> Acc = Accuracy
                      </p>
                      <img src={"./images/community.jpg"} width="260px" height="240px"
                          style={{
                              display: 'inline-block',
                              padding: '10px',
                          }}
                        ></img>
                        </td>
                    </tr>
                </tbody>
            </table>


      <GlobalFilter filter={globalFilter} set={setGlobalFilter}/>
      <br></br>
      <br></br>
      <table style={{ width:'1250px', borderCollapse: 'collapse', overflowX: 'scroll', }} {...getTableProps()}>
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
                      onClick={() => { //calls and returns parameters for inner tables
                        if(cell.column.Header === "Avg Grid Points"){
                          gridStateHandler(!false, false, false, false, false, false ) //AVG GRID POINTS [0]
                          }
                        else if(cell.column.Header === "Team #"){
                          gridStateHandler(false, false, false, false, false, !false ) //TEAM NUMBER [5]
                          }
                        else if(cell.column.Header === "Avg Cone Points"){
                          gridStateHandler(false, !false, false, false, false, false ) //AVG CONE POINTS [1]
                          }
                        else if(cell.column.Header === "Avg Cone Acc"){
                            gridStateHandler(false, false, !false, false, false, false ) //AVG CONE ACC [2]
                            }
                        else if(cell.column.Header === "Avg Cube Points"){
                            gridStateHandler(false, false, false, false, !false, false ) //AVG CUBE POINTS [3]
                            }
                        else if(cell.column.Header === "Avg Cube Acc"){
                            gridStateHandler(false, false, false, !false, false, false ) //AVG CUBE ACC [4]
                            }
                        else {
                          console.log('wrong cell or fail')
                            }
                        }
                      }//cell.column.Header === "Avg Grid Points" ? gridStateHandler(true, false, false, false, false) : gridStateHandler(false) }}

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

              {row.isExpanded ? tableHandler(row) : null}



                  </React.Fragment>
            )
          })} 
        </tbody>
      </table>
      <br></br>
    </div>
  )
}

export default MainTable; 