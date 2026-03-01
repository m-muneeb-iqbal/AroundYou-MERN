import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

import App from './App.jsx'

import { ToastProvider } from './context/ToastContext.jsx'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import './styles/LandingPage/Main/Section3.css'

createRoot(document.getElementById('root')).render (
    <StrictMode>
        <BrowserRouter>
            <ToastProvider>
                <App />
            </ToastProvider>
        </BrowserRouter>
    </StrictMode>
)