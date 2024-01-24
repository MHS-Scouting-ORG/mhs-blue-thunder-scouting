import { getMatchesForRegional} from "../../api";
import { getTeams, getTeamsMatches } from "./MTUtils"
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

  function ueTableData(){
    getTeams()
    .then(tData => {
      //console.log(data)
      const teamObj = tData
      getTeamsMatches(teamObj)
      .then(data => {
        tData.map(() => {
          console.log(data)

        })
      })
    })
  }


export { ueDebug, ueSetTeamObj, ueTableData };