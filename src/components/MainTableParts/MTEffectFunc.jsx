import { getMatchesForRegional} from "../../api";
import { getTeams, getTeamsMatchesAndTableData } from "./MTUtils"
import { getTeamsInRegional, getOprs } from "../../api/bluealliance";
import { getMax, calcDeviation, calcColumnSort, calcLowCubeAcc, calcLowCubeGrid, calcLowConeAcc, calcLowConeGrid, calcLowAcc, calcLowGrid, calcMidCubeAcc, calcMidCubeGrid, calcMidConeAcc, calcMidConeGrid, calcMidGridAcc, calcMidGrid, calcUpperCubeAcc, calcUpperCubeGrid, calcUpperConeAcc, calcUpperConeGrid, calcUpperGridAcc, calcUpperGrid, calcAvgCS, calcAvgCubeAcc, calcAvgCubePts, calcAvgConeAcc, calcAvgConePts, calcAvgGrid, calcAvgPoints, getPenalties, getPriorities } from "./CalculationUtils"
  //seperate file which holds functions for the useffect in mt
function ueDebug (){
    getMatchesForRegional('2023azva')
    .then(data => {
      console.log(data)
    }),
    []}

 function ueSetTeamObj(){ // sets team numbers of objects
  //const [teamsData, setTeamsData] = useState([]);
   getTeams()
    .then(data => {
      console.log(data)
    })
    .catch(console.log.bind(console)),[]
  }

  async function ueTableData(){
     return await getTeams()
    .then(async tData => {
        let teamObj = tData
      return await getTeamsMatchesAndTableData(teamObj)
      .then(data => {
        let tableData = data
        return tableData
      })
    })
  }

  async function tableDataForUtils(){
    return await ueTableData()
    .then(async data => {
      let UtilTableData = data
      return UtilTableData
    })
  }


export { ueDebug, ueSetTeamObj, ueTableData, tableDataForUtils };