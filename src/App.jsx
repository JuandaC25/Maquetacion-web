import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Pedidos/Home.jsx';
import Admin from './components/admin/Admin';
import Tecnico from './components/Tecnico/Tecnico';
import Soliespacios from './components/Home/Espacios/Solicitud_espacios';
import Soli_port from './components/Home/Soli_Port.jsx';
import Solitelevisores from './components/Home/Pedidos/Solici_televisor.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/Usuario' element={<Home />} />
        <Route path='/Admin' element={<Admin />} />
        <Route path='/Tecnico' element={<Tecnico />} />
        <Route path='/espacios' element={<Soliespacios />} />
        <Route path='/Solicitar-Portatiles' element={<Soli_port />} />
        <Route path='/Solicitartelevisores' element={<Solitelevisores/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
