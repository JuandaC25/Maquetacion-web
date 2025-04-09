import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login';
import Home from './components/Home/Home.jsx';
import Admin from './components/admin/Admin';
import Inventario from './components/admin/inventario.jsx';
import AdCrear from './components/admin/adcrear.jsx'; 
import Tecnico from './components/Tecnico/Tecnico';
import Soli_port from './components/Home/Soli_Port.jsx';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/Usuario' element={<Home />} />
        <Route path='/Admin' element={<Admin />} />
        <Route path='/inventario' element={<Inventario />} />
        <Route path='/adcrear' element={<AdCrear />} />
        <Route path='/Tecnico' element={<Tecnico />} />
        <Route path='/Solicitar-Portatiles' element={<Soli_port />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


