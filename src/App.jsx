//import logo from './logo.svg';
import './App.css';
import { Amplify } from 'aws-amplify'
import * as Auth from 'aws-amplify/auth'
//import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import awsconfig from './aws-exports'
import Menu from './utils/menu'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { apiUpdateRegional } from './api';

const redirectSignInUri = awsconfig.oauth.redirectSignIn.split(',')
awsconfig.oauth.redirectSignIn = redirectSignInUri[parseInt(import.meta.env.VITE_REDIRECT_INDEX)]
const redirectSignOutUri = awsconfig.oauth.redirectSignOut.split(',')
awsconfig.oauth.redirectSignOut = redirectSignOutUri[parseInt(import.meta.env.VITE_REDIRECT_INDEX)]

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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '30px',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        textAlign: 'center'
      }}>
        <img 
          src="./images/BLUETHUNDERLOGO_BLUE.png" 
          alt="2443 Blue Thunder Scouting Logo"
          style={{
            maxWidth: '200px',
            height: 'auto',
            marginBottom: '20px'
          }}
        />
        <h1 style={{
          fontSize: '2.5em',
          margin: '20px 0',
          color: '#333'
        }}>2443 SCOUTING APP</h1>
        <p style={{
          fontSize: '1.1em',
          color: '#666',
          marginBottom: '30px'
        }}>Blue Thunder Robotics Team Scouting Platform</p>
      </div>
      
      <button 
        onClick={() => Auth.signInWithRedirect({
          provider: "Google"
        })}
        style={{
          padding: '15px 40px',
          fontSize: '1.1em',
          backgroundColor: '#77B6E2',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#5a9cc4'
          e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)'
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#77B6E2'
          e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        Sign in with Google
      </button>
    </div>
  )
}

function App() {

  const [user, setUser] = useState()
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    (async () => {
      //console.log(`async run`)
      if (!user) {
        const session = await Auth.fetchAuthSession()
        await apiUpdateRegional()
        setUser(session)
        setIsLoading(false)
      }
    })()
      .then(console.log.bind(console))
      .catch(console.error.bind(console))
  }, [user])


  if (isLoading) {
    return <div></div>
  }

  return (
    <div className="App">
      <header className="App-header">
        {(_ => {

          if (user?.tokens) {
            //console.log(`${JSON.stringify(user)} logged in`)
            (async () => { await apiUpdateRegional() })()
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