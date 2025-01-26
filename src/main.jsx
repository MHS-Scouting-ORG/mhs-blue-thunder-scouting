import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import MainTable from './components/Table/Summary.jsx'
import Form from './form/Form.jsx'
import Formprac from './form/Formprac.jsx'
// import * as Auth from 'aws-amplify/auth'
// import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm"
import { apiGetRegional } from './api/index.js'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/table",
        element: <MainTable />
      },
      {
        path: "/form",
        element: <Form />
      },
      /* IN ORDER TO SEE FORM AS IT GETS CONVERTED INTO FUNCTIONAL COMP */
      {
        path: "/formprac",
        element: <Formprac/>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,

)