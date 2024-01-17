import { getMatchesForRegional} from "../../api";
import { getTeams } from "./MTUtils"
//seperate file which holds functions for the useffect in mt
function ueDebug (){
    getMatchesForRegional('2023azva')
    .then(data => {
      console.log(data.data.teamMatchesByRegional.items)
    }),
    []}

function ueSetTeamObj(){ // sets team numbers of objects
  //const [teamsData, setTeamsData] = useState([]);
  getTeams()
    .then(data => {
      return data
    })
    .catch(console.log.bind(console)),[]
  }
  //doesn't work ^(attempts)


export { ueDebug, ueSetTeamObj };