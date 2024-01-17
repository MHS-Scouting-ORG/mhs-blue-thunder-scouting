import React, { useEffect } from 'react'
import { getTeamsInRegional, getOprs } from "../../api/bluealliance";
  //seperate file for when we figure out prior problems(passing function)
async function getTeams () {
  return await (getTeamsInRegional('2023azva'))
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

export { getTeams } 