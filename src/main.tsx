import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import { PrimeReactProvider } from 'primereact/api'
import { NotificationProvider } from './context/NotificationContext.tsx'
import { ToastContainer } from 'react-toastify'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
 
    <BrowserRouter>
      <PrimeReactProvider value={{ ripple: true }}>
        
        <NotificationProvider>
          <App />
          < ToastContainer  /> 
        </NotificationProvider>
      
      </PrimeReactProvider>
    </BrowserRouter>


  </StrictMode>,
)
