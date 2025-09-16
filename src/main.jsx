import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppRoutes from './router'
import { BrowserRouter } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import ScrollToTop from './components/common/ScrollToTop'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ScrollToTop/>
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
  </StrictMode>
)
