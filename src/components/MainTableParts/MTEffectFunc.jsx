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

  async function ueTableData(oprList, ccwmList, dprList, mtable){
     return await getTeams()
    .then(async tData => {
        let teamObj = tData
      return await getTeamsMatchesAndTableData(teamObj, oprList, ccwmList, dprList, mtable)
      .then(data => {
        let tableData = data
        return tableData
      })
    })
  }


export { ueDebug, ueSetTeamObj, ueTableData, };