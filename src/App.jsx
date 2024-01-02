//import logo from './logo.svg';
import './App.css';
import { Amplify } from 'aws-amplify'
import * as Auth from 'aws-amplify/auth'
//import { CognitoHostedUIIdentityProvider } from 'aws-amplify/auth';
import awsconfig from './aws-exports'
import Menu from './utils/menu'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

const redirectSignInUri = awsconfig.oauth.redirectSignIn.split(',')
awsconfig.oauth.redirectSignIn = redirectSignInUri[parseInt(process.env.REACT_APP_REDIRECT_INDEX)]
const redirectSignOutUri = awsconfig.oauth.redirectSignOut.split(',')
awsconfig.oauth.redirectSignOut = redirectSignOutUri[parseInt(process.env.REACT_APP_REDIRECT_INDEX)]

Amplify.configure(awsconfig)

function AuthenticatedUI({ user }) {
 return (
    <div>

      <Menu></Menu>
      <div>
        <Outlet />
      </div>
    </div>
    )

}

function LoginUI() {
  return (
    <div>
      <button onClick={() => Auth.signInWithRedirect({

        provider: "Google"
      })}>Login</button>

    </div>
  )
}

function App() {

  const [user, setUser] = useState()


  useEffect(() => {
    (async () => {
      console.log(`async run`)
      if (!user) {
        setUser(await Auth.currentAuthenticatedUser())
      }
    })()
      .then(console.log.bind(console))
      .catch(console.error.bind(console))
  }, [user])


  return (
    <div className="App">
      <header className="App-header">
        {(_ => {

          if (user) {
            //console.log(`${JSON.stringify(user)} logged in`)
            return (<AuthenticatedUI user={user} />)
          }
          return (<LoginUI />)
        }
        )()
        }
      </header>
    </div>
  );
}

export default App;
