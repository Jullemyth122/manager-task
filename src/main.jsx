import { Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './utility/firebase.js'
import { AuthProvider } from './context/useAuth.jsx'
import ActivityProvider from './context/useActivity.jsx'

createRoot(document.getElementById('root')).render(
  <Fragment>
    <AuthProvider>
      <ActivityProvider>
        <App />
      </ActivityProvider>
    </AuthProvider>
  </Fragment>,
)
