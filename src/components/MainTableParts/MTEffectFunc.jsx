import { getMatchesForRegional} from "../../api";
import { getTeams, getTeamsMatchesAndTableData } from "./MTUtils"
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
  //doesn't work ^(attempts)

  async function ueTableData(){
     return await getTeams()
    .then(async tData => {
      const teamObj = tData
      return await getTeamsMatchesAndTableData(teamObj)
      .then(data => {
        const tableData = data
        return tableData
      })
    })
  }


export { ueDebug, ueSetTeamObj, ueTableData };