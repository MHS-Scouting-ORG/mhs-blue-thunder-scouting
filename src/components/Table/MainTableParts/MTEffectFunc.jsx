import { getMatchesForRegional} from "../../../api";
import { getTeams, getTeamsMatchesAndTableData } from "./MTUtils"


  //seperate file which holds functions for the useffect in mt
// function ueDebug (){
//     getMatchesForRegional('2023azva')
//     .then(data => {
//       console.log(data)
//     }),
//     []}

  async function ueTableData(oprList, ccwmList, dprList, mtable, regional){
    try {
        const teamData = await getTeams(regional)
        const tableData = await getTeamsMatchesAndTableData(teamData, oprList, ccwmList, dprList, mtable, regional)
        return tableData;
    }
    catch(err) {
      console.log(err)
    }
  }


export { ueTableData, }