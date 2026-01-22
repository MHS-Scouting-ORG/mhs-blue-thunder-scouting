import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Home from './pages/Home.jsx'
import Form from './form/Form.jsx'
import Summary from './components/Table/Summary.jsx'
import Notes from './scoutingNotes/Notes.jsx'
// import * as Auth from 'aws-amplify/auth'
// import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm"
import { apiGetRegional } from './api/index.js'
import { Table } from '@aws-amplify/ui-react'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/form",
        element: <Form/>
      },
      {
        path: "/table",
        element: <Summary/>
      },
      {
        path: "/notes",
        element: <Notes/>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,

)