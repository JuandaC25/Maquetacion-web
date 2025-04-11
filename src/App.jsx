import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Pedidos/Home.jsx';
import Admin from './components/admin/Admin';
import Inventario from './components/admin/inventario.jsx';
import AdCrear from './components/admin/adcrear.jsx'; 
import Tecnico from './components/Tecnico/Tecnico';
import Pie from './components/Tecnico/Pie.jsx';
import Tercera from './components/Tecnico/tercera.jsx';
import Cuarta from '/src/components/Tecnico/Cuarta.jsx'; 
import Quinta from './components/Tecnico/Quinta.jsx';
import Soliespacios from './components/Home/Espacios/Solicitud_espacios';
import Soli_port from './components/Home/Soli_Port.jsx';
import Solitelevisores from './components/Home/Pedidos/Solici_televisor.jsx';
import Sexta from './components/Tecnico/Sexta.jsx';
import Septima from './components/Tecnico/Septima.jsx';
function App() {
  return (
    <BrowserRouter>
      <Routes>    
        <Route path='/Pie' element={<Pie />} /> 
        <Route path='/Tercera' element={<Tercera />} />
        <Route path='/Cuarta' element={<Cuarta />} />
        <Route path='/Quinta'element={<Quinta />} />
        <Route path='/inventario' element={<Inventario />} />
        <Route path='/adcrear' element={<AdCrear />} />
        <Route path='/Tecnico' element={<Tecnico />} />
        <Route path='/espacios' element={<Soliespacios />} />
        <Route path='/Solicitar-Portatiles' element={<Soli_port />} />
        <Route path='/Solicitartelevisores' element={<Solitelevisores/>} />
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/Usuario' element={<Home></Home>}></Route>
        <Route path='/Admin' element={<Admin></Admin>}></Route>
        <Route path='/Tecnico' element={<Tecnico></Tecnico>}></Route>
        <Route path='/Sexta' element={<Sexta></Sexta>}></Route>
        <Route path='/Septima' element={<Septima />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


