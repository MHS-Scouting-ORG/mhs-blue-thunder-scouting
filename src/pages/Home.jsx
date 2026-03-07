import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: calc(100vh - 80px);
          gap: 20px;
          background-color: #f5f5f5;
          padding: 20px;
          overflow: hidden;
        }

        .home-header {
          text-align: center;
          flex-shrink: 0;
        }

        .home-header img {
          max-width: 150px;
          height: auto;
          margin-bottom: 10px;
        }

        .home-header h1 {
          font-size: 2em;
          margin: 10px 0;
          color: #333;
        }

        .home-header p {
          font-size: 0.9em;
          color: #666;
          margin: 0;
        }

        .mobile-nav {
          display: none;
        }

        @media (max-width: 767px) {
          .mobile-nav {
            display: grid;
            grid-template-columns: repeat(1, 1fr);
            gap: 12px;
            max-width: 350px;
            width: 100%;
            flex-shrink: 0;
          }

          .home-container {
            gap: 15px;
            padding: 15px;
          }

          .home-header h1 {
            font-size: 1.5em;
          }

          .home-header p {
            font-size: 0.85em;
          }

          .nav-card {
            background-color: white;
            padding: 20px 15px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
            text-decoration: none;
            color: inherit;
            transition: all 0.3s ease;
          }

          .nav-card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transform: translateY(-2px);
          }

          .nav-card h3 {
            color: #77B6E2;
            margin-top: 0;
            margin-bottom: 8px;
            font-size: 1.1em;
          }

          .nav-card p {
            color: #666;
            font-size: 0.8em;
            margin: 0;
          }
        }
      `}</style>

      <div className="home-container">
        <div className="home-header">
          <img 
            src="./images/BLUETHUNDERLOGO_BLUE.png" 
            alt="2443 Blue Thunder Scouting Logo"
          />
          <h1>2443 SCOUTING APP</h1>
          <p>Blue Thunder Robotics Team Scouting App</p>
        </div>

        <div className="mobile-nav">
          <Link 
            to="/form"
            className="nav-card"
          >
            <h3>FORM</h3>
            <p>Record match data</p>
          </Link>
          
          <Link 
            to="/table"
            className="nav-card"
          >
            <h3>TABLE</h3>
            <p>View data</p>
          </Link>
          
          <Link 
            to="/notes"
            className="nav-card"
          >
            <h3>NOTES</h3>
            <p>Team notes</p>
          </Link>
          
        </div>
      </div>
    </>  )
}

export default Home