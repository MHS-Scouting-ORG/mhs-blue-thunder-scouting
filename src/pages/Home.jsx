import React from 'react'

function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 80px)',
      gap: '30px',
      backgroundColor: '#f5f5f5',
      padding: '40px 20px'
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
    </div>
  )
}

export default Home
