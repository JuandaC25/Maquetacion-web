import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Home from './components/Home/Pedidos/Home.jsx';
import Admin from './components/admin/admin_ad/Admin.jsx';
import Inventario from './components/admin/inventario_ad/inventario.jsx';
import AdCrear from './components/admin/adcrear_ad/adcrear.jsx';
import Solielemento from './components/admin/solielemento_ad/solielemento_ad.jsx';
import Soliespacio from './components/admin/soliespacio_ad/soliespacio.jsx';
import Tecnico from './components/Tecnico/solicitudes_de_equipos/Soli_Equi_Tec.jsx';
import Cuarta from './components/Tecnico/informacion_de_equipos/Info_equipos_tec.jsx';
import Soliespacios from './components/Home/Espacios/Solicitud_espacios';
import Historial_ped from './components/Home/Histo_pedi/Histo_pedi.jsx';
import Soli_port from './components/Home/Pedidos_port/Soli_Port.jsx';
import Solitelevisores from './components/Home/Pedidos_Tele/Solici_televisor.jsx';
import Pedidos_ele from './components/Home/Pedidos_ele/Pedidos_ele.jsx';  
import './components/App.css';
import Pedidos_escritorio from './components/Home/Pedidos_escritorio/Pedidos_escritorio.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Información_equipos from './components/Home/Informacion_equipos/Informacion_equipos.jsx';
import Desplegable from './components/desplegable/desplegable.jsx';
import HistorialTec from './components/Tecnico/Historial/HistorialTec.jsx';
import Historial_ptec from './components/Tecnico/Historial/Historial_ptec/Historial_ptec.jsx';
import Historial_ptec2 from './components/Tecnico/Historial/Historial_ptec1/Historial_ptec2.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/Login' element={<Login/>}/> 
        <Route path='/Cuarta' element={<Cuarta />} />
        <Route path='/inventario' element={<Inventario />} />
        <Route path='/adcrear' element={<AdCrear />} />
        <Route path='/solielemento' element={<Solielemento/>} />
        <Route path='/soliespacio' element={<Soliespacio/>} />
        <Route path='/Tecnico' element={<Tecnico />} />
        <Route path='/espacios' element={<Soliespacios />} />
        <Route path='/Solicitar-Portatiles' element={<Soli_port />} />
        <Route path='/Historial_pedidos' element={<Historial_ped />} />
        <Route path='/Solicitartelevisores' element={<Solitelevisores />} />
        <Route path='/Pedidos_ele' element={<Pedidos_ele />} />
        <Route path='/' element={<Login/>}/> 
        <Route path='/Inicio' element={<Home />}/>
        
        <Route path='/Admin' element={<Admin />} />
        <Route path="/PedidoElementos" element={<Pedidos_ele />} />
        <Route path='/Pedidoescritorio' element={<Pedidos_escritorio />} />
        <Route path='/Desplegable' element={<Desplegable />} />
        <Route path='/Informacion_equiposs' element={<Información_equipos />} />
        <Route path='/HistorialTec' element={<HistorialTec/>}/>
          <Route path='/Historial_TicketsTec' element={<Historial_ptec/>}/>
          <Route path='/Historial_TicketsTec2' element={<Historial_ptec2/>}/>
        <Route />


      </Routes>
    </BrowserRouter>

  );
}

export default App;
