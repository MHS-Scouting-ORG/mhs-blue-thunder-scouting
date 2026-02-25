
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
const calcColumnSort = (arr, coral, algae, cycles, pts, autoPts, endgame, coralPts, algaePts) => {
  let sum = 0;
  if (arr.includes("Coral")) {
    sum = sum + coral;
  }
  if (arr.includes("Algae")) {
    sum = sum + algae;
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
  if (arr.includes("Endgame Points")) {
    sum = sum + endgame;
  }
  if (arr.includes("Coral Points")) {
    sum = sum + coralPts;
  }
  if (arr.includes("Algae Points")) {
    sum = sum + algaePts;
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
/* averages of an array */
const calcAvg = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return 0
  let total = 0;
  for(let i = 0; i < arr.length; i++){
    total += arr[i]
  }
  let average = total / arr.length
  return average;
}

/* mode or most common in an array */
const getReliability = (arr, mode) => {
  let modeCount = 0;
  for(let i = 0; i < arr.length; i++){
    if(arr[i] === mode){
      modeCount++
    }
  }
  return ((modeCount/arr.length) * 100).toFixed(0)
}
/* access each form entry to find the match fo the penalty */
const getMatchesOfPenalty = (arr,penalty) => {
  const matchesWithPenalty = arr.filter(teamObj => {
    const committed = teamObj?.Penalties?.PenaltiesCommitted || {}
    const teamPenaltiesArr = Object.entries(committed)
    const penaltyArr = teamPenaltiesArr.filter(penaltiesArr => penaltiesArr[0] === penalty)
    return Boolean(penaltyArr?.[0]?.[1])
  })
  const penaltyMatchNumbers = matchesWithPenalty
    .map(matchEntry => {
      const matchId = matchEntry?.MatchId || matchEntry?.id || ''
      if (typeof matchId !== 'string' || matchId.length === 0) return null
      if (!matchId.includes('_')) return matchId
      return matchId.substring(matchId.indexOf("_") + 1)
    })
    .filter(Boolean)
  return penaltyMatchNumbers;
}
/* gets the max */
const getMax = (arr) => {
  return arr.sort((a, b) => b - a).shift();
} 
/* gets the notes of robot info in form */
const getSummary = (arr) => {
  const newarr = arr
    .map((match) => {
      const comment = match?.Comment ?? match?.RobotInfo?.Comments
      if (!comment) return null
      return `${comment}, `
    })
    .filter(Boolean)
  let sumComment = ""
  for(let i = 0; i < newarr.length; i++){
    sumComment += newarr[i];
  }
  return sumComment
}

export {uniqueArr, arrMode, calcAvg, getCan, calcColumnSort, getReliability, getMatchesOfPenalty, getMax, getSummary};