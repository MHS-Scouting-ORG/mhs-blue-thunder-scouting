import React from 'react'
import GridInnerTable from './GridInnerTable';
import ConeAccTable from "./ConeAccTable"
import ConePtsTable from "./ConePtsTable"
import CubeAccTable from "./CubeAccTable"
import CubePtsTable from "./CubePtsTable"
import TeamInnerTable from './TeamInnerTable'

const renderRowSubComponentGrid = (row, tableData) => {

  const g = tableData.filter(x => x.TeamNumber === row.values.TeamNumber)

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
      <div>{<GridInnerTable information={disp} />} </div>
    </pre>)
    : (
      <div style={{
        padding: '5px',
      }}> No data collected. </div>
    );
}

const renderRowSubComponentConeAccTable = (row, tableData) => {
  const g = tableData.filter(x => x.TeamNumber === row.values.TeamNumber)

  const disp = g.map(x => {
    return {
      AvgUpperConeAcc: x.AvgUpperConeAcc !== 0 ? `μ=${x.AvgUpperConeAcc}` : '',
      AvgMidConeAcc: x.AvgMidConeAcc !== 0 ? `μ=${x.AvgMidConeAcc}` : '',
      AvgLowerConeAcc: x.AvglowerConeAcc !== 0 ? `μ=${x.AvgLowerConeAcc}` : '',
    }
  })

  return disp !== undefined ?
    (<pre>
      <div>{<ConeAccTable information={disp} />} </div>
    </pre>)
    : (
      <div style={{
        padding: '5px',
      }}> No data collected. </div>
    );
}

const renderRowSubComponentConePtsTable = (row, tableData) => {
  const g = tableData.filter(x => x.TeamNumber === row.values.TeamNumber)

  const disp = g.map(x => {
    return {
      AvgUpperCone: x.AvgUpperConePts !== 0 ? `μ=${x.AvgUpperConePts}` : '',
      AvgMidCone: x.AvgMidConePts !== 0 ? `μ=${x.AvgMidConePts}` : '',
      AvgLowCone: x.AvgLowerConePts !== 0 ? `μ=${x.AvgLowerConePts}` : '',
    }
  })

  return disp !== undefined ?
    (<pre>
      <div>{<ConePtsTable information={disp} />} </div>
    </pre>)
    : (
      <div style={{
        padding: '5px',
      }}> No data collected. </div>
    );
}

const renderRowSubComponentCubeAccTable = (row, tableData) => {
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
      <div>{<CubeAccTable information={disp} />} </div>
    </pre>)
    : (
      <div style={{
        padding: '5px',
      }}> No data collected. </div>
    );
}

const renderRowSubComponentCubePtsTable = (row, tableData) => {
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
      <div>{<CubePtsTable information={disp} />} </div>
    </pre>)
    : (
      <div style={{
        padding: '5px',
      }}> No data collected. </div>
    );
}

const renderRowSubComponent = ( row, modalFunction, modalDataFunction, apiData) => {

  const t = apiData.filter(x => x.Team === `frc${row.values.TeamNumber}`) 

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
      <div style={{ maxWidth: "100rem", overflowX: "scroll", borderCollapse: "collapse", }}>{<TeamInnerTable modalOn={modalFunction} /*delete={handleDelete}*/ information={disp} setModalData={modalDataFunction} />} </div>
    </pre>)
    : (
      <div style={{
        padding: '5px',
      }}> No data collected for Team {row.values.TeamNumber}. </div>
    );

}

function tableHandler(row, header, visibleColumns, tableData, modalFunction, setModalData, apiData) { //handles which state and inner table should be shown

  if (header === 'Avg Grid Points') {
    return (
      <tr>
        <td colSpan={visibleColumns.length}
          style={{
            maxWidth: "10rem"
          }}
        >
          {renderRowSubComponentGrid(row, tableData)} { /*needs tableData from maintable component*/}
        </td>
      </tr>
    )
  }
  else if (header === 'Avg Cone Acc') {
    return (
      <tr>
        <td colSpan={visibleColumns.length}
          style={{
            maxWidth: "1200px"
          }}
        >
          {renderRowSubComponentConeAccTable(row, tableData)}
        </td>
      </tr>
    )
  }
  else if (header === 'Avg Cone Points') {
    return (
      <tr>
        <td colSpan={visibleColumns.length}
          style={{
            maxWidth: "1200px"
          }}
        >
          {renderRowSubComponentConePtsTable(row, tableData)}
        </td>
      </tr>
    )
  }
  else if (header === 'Avg Cube Acc') {
    return (
      <tr>
        <td colSpan={visibleColumns.length}
          style={{
            maxWidth: "1200px"
          }}
        >
          {renderRowSubComponentCubeAccTable(row, tableData)}
        </td>
      </tr>
    )
  }
  else if (header === 'Avg Cube Points') {
    return (
      <tr>
        <td colSpan={visibleColumns.length}
          style={{
            maxWidth: "1200px"
          }}
        >
          {renderRowSubComponentCubePtsTable(row, tableData)}
        </td>
      </tr>
    )
  }
  else if (header === 'Team #') {
    return (
      <tr>
        <td colSpan={visibleColumns.length}
          style={{
            maxWidth: "1200px"
          }}
        >
          {renderRowSubComponent(row, modalFunction, setModalData, apiData)}
        </td>
      </tr>
    )
  }
  else { console.log('error in tablehandler or nothing shown') }
}

export { tableHandler, };