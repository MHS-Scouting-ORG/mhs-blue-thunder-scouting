import { getTeams, getTeamsMatchesAndTableData } from "./MTUtils"

  async function ueTableData(mtable, regional){
    try {
        const teamData = await getTeams(regional)
        const tableData = await getTeamsMatchesAndTableData(teamData, mtable, regional)
        return tableData;
    }
    catch(err) {
      console.log(err)
    }
  }


export { ueTableData, }