//import logo from './logo.svg';
import './App.css';
import * as Auth from 'aws-amplify/auth'
import Menu from './utils/menu'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { apiUpdateRegional } from './api';

function AuthenticatedUI({ user }) {
  return (
    <div>

      <Menu user={user}></Menu>
      <div>
        <Outlet context={{ user }} />
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
      if (user) return

      try {
        // Avoid triggering unauth identity pool credentials for logged-out users.
        // If not signed in, getCurrentUser() throws and we show the login UI.
        await Auth.getCurrentUser()

        const session = await Auth.fetchAuthSession()
        setUser(session)

        // Only call IAM-protected AWS services once we have an authenticated session.
        await apiUpdateRegional()
      } catch (err) {
        // Not signed in (or session invalid) => render LoginUI
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    })()
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