import React from 'react'

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

  const calcAvgPoints = (arr) => { //average points
    let individualPts = arr.map(val => val.Teleop.ScoringTotal.Total);
    return individualPts.reduce((i,j) => i + j) / individualPts.length //avg it
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

export { getMax, calcDeviation, calcColumnSort, calcAvgPoints, getPenalties, getPriorities };