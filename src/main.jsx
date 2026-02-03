import './amplifyConfig.js'

import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Home from './pages/Home.jsx'
import Form from './form/Form.jsx'
import Summary from './components/Table/Summary.jsx'
import Notes from './scoutingNotes/Notes.jsx'

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