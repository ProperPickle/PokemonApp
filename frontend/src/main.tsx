import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Route, Routes, BrowserRouter, Navigate} from 'react-router-dom';
import App from './App.tsx'
import Login from './Login.tsx';
import Register from './Register.tsx';


createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pokemons" element={<App />} />  
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
  