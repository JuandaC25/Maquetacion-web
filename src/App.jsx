import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home.jsx';
import Admin from './components/admin/Admin';
import Tecnico from './components/Tecnico/Tecnico';
import Cuadro_pedidos from './components/Home/Cuadro_pedidos.jsx';
import Soli_port from './components/Home/Soli_Port.jsx';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path='/Usuario' element={<Home></Home>}></Route>
      <Route path='/Admin' element={<Admin></Admin>}></Route>
      <Route path='/Tecnico' element={<Tecnico></Tecnico>}></Route>
      <Route path='/Solicitar-Portatiles' element={<Soli_port></Soli_port>}></Route>
    </Routes>
    </BrowserRouter>
  );
}
export default App;
