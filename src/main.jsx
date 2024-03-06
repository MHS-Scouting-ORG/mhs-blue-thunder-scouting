import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import MainTable from './components/MainTable.jsx'
import Form from './form/Form.jsx'
import { apiGetRegional } from './api/index.js'

const regional = await apiGetRegional()
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/table",
        element: <MainTable regional={regional} />
      },
      {
        path: "/form",
        element: <Form regional={regional}/>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,

)
