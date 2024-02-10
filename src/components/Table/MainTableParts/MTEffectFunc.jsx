import { getMatchesForRegional} from "../../../api";
import { getTeams, getTeamsMatchesAndTableData } from "./MTUtils"


  //seperate file which holds functions for the useffect in mt
function ueDebug (){
    getMatchesForRegional('2023azva')
    .then(data => {
      console.log(data)
    }),
    []}

  async function ueTableData(oprList, ccwmList, dprList, mtable){
    try {
        const teamData = await getTeams()
        const tableData = await getTeamsMatchesAndTableData(teamData, oprList, ccwmList, dprList, mtable)
        return tableData;
    }
    catch(err) {
      console.log(err)
    }
  }


export { ueDebug, ueTableData, };