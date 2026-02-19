import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'
import './index.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Toaster position='bottom-right' toastOptions={{duration : 3000}}>
           <App />
        </Toaster>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
