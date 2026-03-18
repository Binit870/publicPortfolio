import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from "react-hot-toast"
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    <App />
  </HelmetProvider>
)