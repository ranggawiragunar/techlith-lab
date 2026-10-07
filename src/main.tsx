import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext'
import { initializeDatabase } from './db/seed'
import { App } from './app/App'
import './styles.css'

initializeDatabase()
  .then(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </React.StrictMode>,
    )
  })
  .catch((error: unknown) => {
    console.error('Unable to initialize the local database.', error)
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <main className="startup-error"><h1>Techlith Lab could not start</h1><p>Please reload this page. Your local database could not be opened.</p></main>,
    )
  })
