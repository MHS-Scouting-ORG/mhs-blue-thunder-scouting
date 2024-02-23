import React from 'react'

//methods for what needs to be shown on summary table, accessors are from form people

const uniqueArr = (arr) => {
  const a = arr.map(x => x.trim());
  return a.filter((item, index) => {
    return a.indexOf(item, 0) === index;
  })
}

const getPriorities = (arr) => {
  let pri = arr.map(teamObj => teamObj.Priorities).reduce((a, b) => a.concat(b), []).filter((item) => item != undefined && item.trim() !== '');
  return uniqueArr(pri);
}

const getPenalties = (arr) => {
  let pen = arr.map(teamObj => teamObj.Penalties.Penalties).reduce((a, b) => a.concat(b), []).filter((item) => item.trim() !== 'None')
  return uniqueArr(pen)
}

const calcAvgPoints = (arr) => { //average points
  let individualPts = arr.map(val => val.Teleop.ScoringTotal != null ? val.Teleop.ScoringTotal.GridPoints : 0);
  let totalPts = 0;
  for (let i = 0; i < individualPts.length; i++) {
    totalPts = totalPts + individualPts[i];
  }
  let avgGridPts = totalPts / individualPts.length;
  return avgGridPts.toFixed(3);

  /*let individualPts = arr.map(val => val.Teleop.ScoringTotal.Total != null ? val.Teleop.ScoringTotal.Total : 0);
  return individualPts.reduce((i,j) => i + j) / individualPts.length */ //avg it
}

//avg grid points
const calcAvgGrid = (arr) => {
  let individualPts = arr.map(val => val.Teleop.ScoringTotal != null ? val.Teleop.ScoringTotal.GridPoints : 0);
  let totalPts = 0;
  for (let i = 0; i < individualPts.length; i++) {
    totalPts = totalPts + individualPts[i];
  }
  let avgGridPts = totalPts / individualPts.length;
  return avgGridPts.toFixed(3);
}

const calcAvgConePts = (arr) => {
  let indivConePts = arr.map(val => val.Teleop.ScoringTotal.Cones != null ? val.Teleop.ScoringTotal.Cones : 0)
  let totalConePts = 0
  for (let i = 0; i < indivConePts.length; i++) {
    totalConePts = totalConePts + indivConePts[i];
  }
  let avgConePts = totalConePts / indivConePts.length
  return avgConePts.toFixed(3)
}

const calcAvgConeAcc = (arr) => {
  let indivConeAcc = arr.map(val => val.Teleop.ConesAccuracy != null ? val.Teleop.ConesAccuracy.Overall : 0)
  let totalConeAcc = 0
  for (let i = 0; i < indivConeAcc.length; i++) {
    totalConeAcc = totalConeAcc + indivConeAcc[i]
  }
  let avgConeAcc = totalConeAcc / indivConeAcc.length
  return avgConeAcc.toFixed(3)
}

const calcAvgCubePts = (arr) => {
  let indivCubePts = arr.map(val => val.Teleop.ScoringTotal != null ? val.Teleop.ScoringTotal.Cubes : 0)
  let totalCubePts = 0
  for (let i = 0; i < indivCubePts.length; i++) {
    totalCubePts = totalCubePts + indivCubePts[i]
  }
  let avgCubePts = totalCubePts / indivCubePts.length
  return avgCubePts.toFixed(3)
}

const calcAvgCubeAcc = (arr) => {
  let indivCubeAcc = arr.map(val => val.Teleop.CubesAccuracy != null ? val.Teleop.CubesAccuracy.Overall : 0)
  let totalCubeAcc = 0
  for (let i = 0; i < indivCubeAcc.length; i++) {
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
  let upper = arr.map(val => val.Teleop.ScoringTotal.GridScoringByPlacement.High != null ? val.Teleop.ScoringTotal.GridScoringByPlacement.High : 0);
  let sumUpper = 0;
  for (let i = 0; i < upper.length; i++) {
    sumUpper = sumUpper + upper[i];
  }
  let avgUpper = sumUpper / upper.length;
  return avgUpper.toFixed(3);
}

const calcUpperGridAcc = (arr) => {
  let upperAcc = arr.map(val => (val.Teleop.ConesAccuracy.High + val.Teleop.CubesAccuracy.High) != null ? (val.Teleop.ConesAccuracy.High + val.Teleop.CubesAccuracy.High) : 0);
  let sumUpperAcc = 0;
  for (let i = 0; i < upperAcc.length; i++) {
    sumUpperAcc = sumUpperAcc + upperAcc[i];
  }
  let avgUpperAcc = sumUpperAcc / upperAcc.length;
  return avgUpperAcc.toFixed(3);
}

const calcUpperConeGrid = (arr) => {
  let upper = arr.map(val => (val.Autonomous.Scored.Cones.Upper + val.Teleop.Scored.Cones.Upper) != null ? ((val.Autonomous.Scored.Cones.Upper * 6) + (val.Teleop.Scored.Cones.Upper * 5)) : 0);
  let sumUpper = 0;
  for (let i = 0; i < upper.length; i++) {
    sumUpper = sumUpper + upper[i];
  }
  let avgUpperCone = sumUpper / upper.length;
  return avgUpperCone.toFixed(3);
}

const calcUpperConeAcc = (arr) => {
  let upperAcc = arr.map(val => val.Teleop.ConesAccuracy.High != null ? val.Teleop.ConesAccuracy.High : 0);
  let sumUpperAcc = 0;
  for (let i = 0; i < upperAcc.length; i++) {
    sumUpperAcc = sumUpperAcc + upperAcc[i];
  }
  let avgUpperConeAcc = sumUpperAcc / upperAcc.length;  //avg acc of mid
  return avgUpperConeAcc.toFixed(3);
}

const calcUpperCubeGrid = (arr) => {
  let upper = arr.map(val => (val.Autonomous.Scored.Cubes.Upper + val.Teleop.Scored.Cubes.Upper) != null ? ((val.Autonomous.Scored.Cubes.Upper * 6) + (val.Teleop.Scored.Cubes.Upper * 5)) : 0);
  let sumUpper = 0;
  for (let i = 0; i < upper.length; i++) {
    sumUpper = sumUpper + upper[i];
  }
  let avgUpperCube = sumUpper / upper.length;
  return avgUpperCube.toFixed(3);
}

const calcUpperCubeAcc = (arr) => {
  let upperAcc = arr.map(val => val.Teleop.CubesAccuracy.High != null ? val.Teleop.CubesAccuracy.High : 0);
  let sumUpperAcc = 0;
  for (let i = 0; i < upperAcc.length; i++) {
    sumUpperAcc = sumUpperAcc + upperAcc[i];
  }
  let avgUpperCubeAcc = sumUpperAcc / upperAcc.length;
  return avgUpperCubeAcc.toFixed(3);
}


const calcMidGrid = (arr) => {
  let mid = arr.map(val => val.Teleop.ScoringTotal.GridScoringByPlacement.Mid != null ? val.Teleop.ScoringTotal.GridScoringByPlacement.Mid : 0);
  let sumMid = 0;
  for (let i = 0; i < mid.length; i++) {
    sumMid = sumMid + mid[i];
  }
  let avgMid = sumMid / mid.length;
  return avgMid.toFixed(3);
}

const calcMidGridAcc = (arr) => {
  let midAcc = arr.map(val => (val.Teleop.ConesAccuracy.Mid + val.Teleop.CubesAccuracy.Mid) != null ? (val.Teleop.ConesAccuracy.Mid + val.Teleop.CubesAccuracy.Mid) : 0);
  let sumMidAcc = 0;
  for (let i = 0; i < midAcc.length; i++) {
    sumMidAcc = sumMidAcc + midAcc[i];
  }
  let avgMidAcc = sumMidAcc / midAcc.length;
  return avgMidAcc.toFixed(3);
}

const calcMidConeGrid = (arr) => {
  let mid = arr.map(val => (val.Autonomous.Scored.Cones.Mid + val.Teleop.Scored.Cones.Mid) != null ? ((val.Autonomous.Scored.Cones.Mid * 4) + (val.Teleop.Scored.Cones.Mid * 3)) : 0);
  let sumMid = 0;
  for (let i = 0; i < mid.length; i++) {
    sumMid = sumMid + mid[i];
  }
  let avgMidCone = sumMid / mid.length;
  return avgMidCone.toFixed(3);
}

const calcMidConeAcc = (arr) => {
  let midAcc = arr.map(val => val.Teleop.ConesAccuracy.Mid != null ? val.Teleop.ConesAccuracy.Mid : 0);
  let sumMidAcc = 0;
  for (let i = 0; i < midAcc.length; i++) {
    sumMidAcc = sumMidAcc + midAcc[i];
  }
  let avgMidConeAcc = sumMidAcc / midAcc.length;
  return avgMidConeAcc.toFixed(3);
}

const calcMidCubeGrid = (arr) => {
  let mid = arr.map(val => (val.Autonomous.Scored.Cubes.Mid + val.Teleop.Scored.Cubes.Mid) != null ? ((val.Autonomous.Scored.Cubes.Mid * 4) + (val.Teleop.Scored.Cubes.Mid * 3)) : 0);
  let sumMid = 0;
  for (let i = 0; i < mid.length; i++) {
    sumMid = sumMid + mid[i];
  }
  let avgMidCube = sumMid / mid.length;
  return avgMidCube.toFixed(3);
}

const calcMidCubeAcc = (arr) => {
  let midAcc = arr.map(val => val.Teleop.CubesAccuracy.Mid != null ? val.Teleop.CubesAccuracy.Mid : 0);
  let sumMidAcc = 0;
  for (let i = 0; i < midAcc.length; i++) {
    sumMidAcc = sumMidAcc + midAcc[i];
  }
  let avgMidCubeAcc = sumMidAcc / midAcc.length;
  return avgMidCubeAcc.toFixed(3);
}

const calcLowGrid = (arr) => {
  let low = arr.map(val => val.Teleop.ScoringTotal.GridScoringByPlacement.Low != null ? val.Teleop.ScoringTotal.GridScoringByPlacement.Low : 0);
  let sumLow = 0;
  for (let i = 0; i < low.length; i++) {
    sumLow = sumLow + low[i];
  }
  let avgLow = sumLow / low.length;
  return avgLow.toFixed(3);
}

const calcLowAcc = (arr) => {
  let lowAcc = arr.map(val => (val.Teleop.ConesAccuracy.Low + val.Teleop.CubesAccuracy.Low) != null ? (val.Teleop.ConesAccuracy.Low + val.Teleop.CubesAccuracy.Low) : 0);
  let sumLowAcc = 0;
  for (let i = 0; i < lowAcc.length; i++) {
    sumLowAcc = sumLowAcc + lowAcc[i];
  }
  let avgLowAcc = sumLowAcc / lowAcc.length;
  return avgLowAcc.toFixed(3);
}

const calcLowConeGrid = (arr) => {
  let low = arr.map(val => (val.Autonomous.Scored.Cones.Lower + val.Teleop.Scored.Cones.Lower) != null ? ((val.Autonomous.Scored.Cones.Lower * 3) + (val.Teleop.Scored.Cones.Lower * 2)) : 0);
  let sumLow = 0;
  for (let i = 0; i < low.length; i++) {
    sumLow = sumLow + low[i];
  }
  let avgLowCone = sumLow / low.length;
  return avgLowCone.toFixed(3);
}

const calcLowConeAcc = (arr) => {
  let lowAcc = arr.map(val => val.Teleop.ConesAccuracy.Low != null ? val.Teleop.ConesAccuracy.Low : 0);
  let sumLowAcc = 0;
  for (let i = 0; i < lowAcc.length; i++) {
    sumLowAcc = sumLowAcc + lowAcc[i];
  }
  let avgLowConeAcc = sumLowAcc / lowAcc.length;
  return avgLowConeAcc.toFixed(3);
}

const calcLowCubeGrid = (arr) => {
  let low = arr.map(val => (val.Autonomous.Scored.Cubes.Lower + val.Teleop.Scored.Cubes.Lower) != null ? ((val.Autonomous.Scored.Cubes.Lower * 3) + (val.Teleop.Scored.Cubes.Lower * 2)) : 0);
  let sumLow = 0;
  for (let i = 0; i < low.length; i++) {
    sumLow = sumLow + low[i];
  }
  let avgLowCube = sumLow / low.length;
  return avgLowCube.toFixed(3);
}

const calcLowCubeAcc = (arr) => {
  let lowAcc = arr.map(val => val.Teleop.CubesAccuracy.Low != null ? val.Teleop.CubesAccuracy.Low : 0);
  let sumLowAcc = 0;
  for (let i = 0; i < lowAcc.length; i++) {
    sumLowAcc = sumLowAcc + lowAcc[i];
  }
  let avgLowCubeAcc = sumLowAcc / lowAcc.length;
  return avgLowCubeAcc.toFixed(3);
}

const calcColumnSort = (arr, gridPts, conePts, coneAcc, cubePts, cubeAcc, charge) => {
  let sum = 0;
  if (arr.includes("Grid Points")) {
    sum = sum + gridPts;
  }
  if (arr.includes("Cone Points")) {
    sum = sum + conePts;
  }
  if (arr.includes("Accurate Cone Placement")) {
    sum = sum + coneAcc;
  }
  if (arr.includes("Cube Points")) {
    sum = sum + cubePts;
  }
  if (arr.includes("Accurate Cube Placement")) {
    sum = sum + cubeAcc;
  }
  if (arr.includes("Charge Station")) {
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
    for (let i = 0; i < distance.length; i++) {
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

const getMCRobotSpeed = (arr) => {
  let indiv = arr.map(val => val.Info.RobotSpeed !== null ? val.Info.RobotSpeed : 0)
  if (indiv.length == 0)
    return null;
  for(var i = 0; i < indiv.length; i++){
    var el = indiv[i]
    if (modeMap[el] == null)
    modeMap[el] = 1;
  else
    modeMap[el]++;
  if (modeMap[el] > maxCount) {
    maxEl = el;
    maxCount = modeMap[el];
  }
}
console.log(maxEl)
return maxEl;
  }

  const getMCRobotStrength = (arr) => {
    let indiv = arr.map(val => val.Info.RobotStrength !== null ? val.Info.RobotStrength : 0)
    if (indiv.length == 0)
      return null;
    for(var i = 0; i < indiv.length; i++){
      var el = indiv[i]
      if (modeMap[el] == null)
      modeMap[el] = 1;
    else
      modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  console.log(maxEl)
  return maxEl;
    }

    const getMCRobotSize = (arr) => {
      let indiv = arr.map(val => val.Info.RobotSize !== null ? val.Info.RobotSize : 0)
      if (indiv.length == 0)
        return null;
      for(var i = 0; i < indiv.length; i++){
        var el = indiv[i]
        if (modeMap[el] == null)
        modeMap[el] = 1;
      else
        modeMap[el]++;
      if (modeMap[el] > maxCount) {
        maxEl = el;
        maxCount = modeMap[el];
      }
    }
    console.log(maxEl)
    return maxEl;
      }

//model mode function
const arrMode = (array) => {
  if (array.length == 0)
    return null;
  var modeMap = {};
  var maxEl = array[0]
  var maxCount = 1;
  for (var i = 0; i < array.length; i++) {
    var el = array[i];
    if (modeMap[el] == null)
      modeMap[el] = 1;
    else
      modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  console.log(maxEl)
  return maxEl;
}

//==========================//

const calcAvg = (arr) => {
  let total = 0;
  for(let i = 0; i < arr.length; i++){
    total += arr[i]
  }
  let average = total / arr.length
  return average;
}



export { arrMode, uniqueArr, getMax, calcDeviation, calcColumnSort, calcLowCubeAcc, calcLowCubeGrid, calcLowConeAcc, calcLowConeGrid, calcLowAcc, calcLowGrid, calcMidCubeAcc, calcMidCubeGrid, calcMidConeAcc, calcMidConeGrid, calcMidGridAcc, calcMidGrid, calcUpperCubeAcc, calcUpperCubeGrid, calcUpperConeAcc, calcUpperConeGrid, calcUpperGridAcc, calcUpperGrid, calcAvgCS, calcAvgCubeAcc, calcAvgCubePts, calcAvgConeAcc, calcAvgConePts, calcAvgGrid, calcAvgPoints, getPenalties, getPriorities };