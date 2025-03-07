import { getTeams, getTeamsMatchesAndTableData } from "./MTUtils"
/* async runs and calls the functions to set the data for tables and data to be run in the useEffect of Summary */
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