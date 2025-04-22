import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Home from './components/Home/Pedidos/Home.jsx';
import Admin from './components/admin/ad_equipos/Admin.jsx';
import Inventario from './components/admin/ad_inventario/inventario.jsx';
import AdCrear from './components/admin/ad_crear/adcrear.jsx'; 
import Tecnico from './components/Tecnico/Tecnico.jsx';
import Pie from './components/Tecnico/Pie.jsx';
import Tercera from './components/Tecnico/tercera.jsx';
import Cuarta from './components/Tecnico/Cuarta.jsx'; 
import Quinta from './components/Tecnico/Quinta.jsx';
import Soliespacios from './components/Home/Espacios/Solicitud_espacios';
import Soli_port from './components/Home/Soli_Port.jsx';
import Solitelevisores from './components/Home/Pedidos/Solici_televisor.jsx';
import Sexta from './components/Tecnico/Sexta.jsx';
import Septima from './components/Tecnico/Septima.jsx'; 
import './components/App.css';
import Formulario from './components/Home/Formulario.jsx';
import Pedidos_escritorio from './components/Home/Pedidos_escritorio/Pedidos_escritorio.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Información_equipos from './components/Home/Informacion_equipos/Informacion_equipos.jsx';
import Desplegable from './components/desplegable/desplegable.jsx';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/Pie' element={<Pie />} /> 
        <Route path='/Tercera' element={<Tercera />} />
        <Route path='/Cuarta' element={<Cuarta />} />
        <Route path='/Quinta' element={<Quinta />} />
        <Route path='/inventario' element={<Inventario />} />
        <Route path='/adcrear' element={<AdCrear />} />
        <Route path='/Tecnico' element={<Tecnico />} />
        <Route path='/espacios' element={<Soliespacios />} />
        <Route path='/Solicitar-Portatiles' element={<Soli_port />} />
        <Route path='/Formulario' element={<Formulario/>} />
        <Route path='/Solicitartelevisores' element={<Solitelevisores />} />
        <Route path='/login' element={<Login />} />
        <Route path='/Usuario' element={<Home />} />
        <Route path='/Admin' element={<Admin />} />
        <Route path='/Sexta' element={<Sexta />} />
        <Route path='/Septima' element={<Septima />} />
        <Route path="/Pedidoescritorio" element={<Pedidos_escritorio />} />
        <Route path="/Informacion_equipos" element={<Información_equipos/>} />
        <Route path='/Desplegable' element={<Desplegable />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


