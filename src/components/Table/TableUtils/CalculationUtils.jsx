
//methods for what needs to be shown on summary table, accessors are from form people

const uniqueArr = (arr) => {
  const a = arr.map(x => x.trim());
  return a.filter((item, index) => {
    return a.indexOf(item, 0) === index;
  })
}

const getCan = (arr) => {
  let can = 'no'
  for(let i = 0; i < arr.length; i++) {
    if(arr[i] > 0){
      can = 'yes'
    }
  }
  return can
}
//grade
const calcColumnSort = (arr, speaker, amp, cycles, pts, autoPts, hang, speakerPts, ampPts) => {
  let sum = 0;
  if (arr.includes("Speaker")) {
    sum = sum + speaker;
  }
  if (arr.includes("Amp")) {
    sum = sum + amp;
  }
  if (arr.includes("Cycles")) {
    sum = sum + cycles;
  }
  if (arr.includes("Total Points")) {
    sum = sum + pts;
  }
  if (arr.includes("Auto Points")) {
    sum = sum + autoPts;
  }
  if (arr.includes("Hang Points")) {
    sum = sum + hang;
  }
  if (arr.includes("Speaker Points")) {
    sum = sum + speakerPts;
  }
  if (arr.includes("Amp Points")) {
    sum = sum + ampPts;
  }

  return sum.toFixed(3);
}
//mode
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
  return maxEl;
}

const calcAvg = (arr) => {
  let total = 0;
  for(let i = 0; i < arr.length; i++){
    total += arr[i]
  }
  let average = total / arr.length
  return average;
}

const getReliability = (arr, mode) => {
  let modeCount = 0;
  for(let i = 0; i < arr.length; i++){
    if(arr[i] === mode){
      modeCount++
    }
  }
  return ((modeCount/arr.length) * 100).toFixed(0)
}

const getMatchesOfPenalty = (arr,penalty) => {
  const matchesWithPenalty = arr.filter(teamObj => {
    const teamPenaltiesArr = Object.entries(teamObj.Penalties.PenaltiesCommitted)
    const penaltyArr = teamPenaltiesArr.filter(penaltiesArr => penaltiesArr[0] === penalty)
    return penaltyArr[0][1]
  })
  const penaltyMatchNumbers = matchesWithPenalty.map(matchEntry => matchEntry.id.substring(matchEntry.id.indexOf("_") + 1))
  return penaltyMatchNumbers;
}

const getMax = (arr) => {
  return arr.sort((a, b) => b - a).shift();
} 

export {uniqueArr, arrMode, calcAvg, getCan, calcColumnSort, getReliability, getMatchesOfPenalty, getMax};