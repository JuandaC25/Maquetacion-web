import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home.jsx';
import Admin from './components/admin/Admin';
import Tecnico from './components/Tecnico/Tecnico';
import Pie from './components/Tecnico/Pie.jsx'; // ✅ Ruta corregida

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/Usuario' element={<Home />} />
        <Route path='/Admin' element={<Admin />} />
        <Route path='/Tecnico' element={<Tecnico />} />
        <Route path='/Pie' element={<Pie />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;

