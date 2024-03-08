import { getTeams, getTeamsMatchesAndTableData } from "./MTUtils"

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