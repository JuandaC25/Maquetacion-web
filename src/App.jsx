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
import ProtectedRoute from './auth/ProtectedRoute';
import Informacion_equipos from './components/Home/Informacion_equipos/Informacion_equipos.jsx';
import Desplegable from './components/desplegable/desplegable.jsx';
import HistorialTec from './components/Tecnico/Historial/HistorialTec.jsx';
import Historial_ptec from './components/Tecnico/Historial/Historial_ptec/Historial_ptec.jsx';
import Historial_ptec2 from './components/Tecnico/Historial/Historial_ptec1/Historial_ptec2.jsx';
import Solicitudes from './paginas/Solicitudes/Solicitudes.jsx';
import TicketsActivos from './components/Tecnico/tickets_activos/TicketsActivos.jsx';

import PrestamosActivos from './components/Tecnico/prestamos_activos/PrestamosActivos.jsx';
function App() {
  return (

    <BrowserRouter>

      <Routes>
        <Route path='/Login' element={<Login/>}/> 
        <Route path='/Tickets-Tecnico' element={
          <ProtectedRoute roles={['TECNICO','ADMINISTRADOR']}>
            <Cuarta />
          </ProtectedRoute>
        } />
        <Route path='/inventario' element={
          <ProtectedRoute roles={['ADMINISTRADOR']}>
            <Inventario />
          </ProtectedRoute>
        } />
        <Route path='/adcrear' element={
          <ProtectedRoute roles={['ADMINISTRADOR']}>
            <AdCrear />
          </ProtectedRoute>
        } />
        <Route path='/solielemento' element={
          <ProtectedRoute roles={['ADMINISTRADOR']}>
            <Solielemento/>
          </ProtectedRoute>
        } />
        <Route path='/soliespacio' element={
          <ProtectedRoute roles={['ADMINISTRADOR']}>
            <Soliespacio/>
          </ProtectedRoute>
        } />
        <Route path='/Prestamos-Tecnico' element={
          <ProtectedRoute roles={['TECNICO','ADMINISTRADOR']}>
            <Tecnico />
          </ProtectedRoute>
        } />
        <Route path='/espacios' element={
          <ProtectedRoute roles={[]}> {/* Solo accesible si tienes otro rol, nunca para USUARIO, ADMINISTRADOR o TECNICO */}
            <Soliespacios />
          </ProtectedRoute>
        } />
        <Route path='/Solicitar-Portatiles' element={
          <ProtectedRoute roles={[]}> {/* Solo accesible si tienes otro rol, nunca para USUARIO, ADMINISTRADOR o TECNICO */}
            <Soli_port />
          </ProtectedRoute>
        } />
        <Route path='/Historial_pedidos' element={
          <ProtectedRoute roles={[]}> {/* Solo accesible si tienes otro rol, nunca para USUARIO, ADMINISTRADOR o TECNICO */}
            <Historial_ped />
          </ProtectedRoute>
        } />
        <Route path='/Solicitartelevisores' element={
          <ProtectedRoute roles={[]}> {/* Solo accesible si tienes otro rol, nunca para USUARIO, ADMINISTRADOR o TECNICO */}
            <Solitelevisores />
          </ProtectedRoute>
        } />
        <Route path='/Pedidos_ele' element={
          <ProtectedRoute roles={[]}> {/* Solo accesible si tienes otro rol, nunca para USUARIO, ADMINISTRADOR o TECNICO */}
            <Pedidos_ele />
          </ProtectedRoute>
        } />
        <Route path='/' element={<Login/>}/> 
        <Route path='/Inicio' element={
          <ProtectedRoute roles={[]}> {/* Solo accesible si tienes otro rol, nunca para USUARIO, ADMINISTRADOR o TECNICO */}
            <Home />
          </ProtectedRoute>
        }/>
        
        <Route path='/Admin' element={
          <ProtectedRoute roles={['ADMINISTRADOR']}>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/PedidoElementos" element={<Pedidos_ele />} />
        <Route path='/Pedidoescritorio' element={
          <ProtectedRoute roles={[]}> {/* Solo accesible si tienes otro rol, nunca para USUARIO, ADMINISTRADOR o TECNICO */}
            <Pedidos_escritorio />
          </ProtectedRoute>
        } />
        {/* Ruta Desplegable eliminada para TECNICO */}
        <Route path='/Informacion_equiposs' element={
          <ProtectedRoute roles={[]}> {/* Solo accesible si tienes otro rol, nunca para USUARIO, ADMINISTRADOR o TECNICO */}
            <Informacion_equipos />
          </ProtectedRoute>
        } />
        <Route path='/HistorialTec' element={
          <ProtectedRoute roles={['TECNICO']}>
            <HistorialTec/>
          </ProtectedRoute>
        }/>
        {/* Rutas Historial_TicketsTec y Historial_TicketsTec2 eliminadas para TECNICO */}
        <Route path='/TicketsActivos' element={
          <ProtectedRoute roles={['TECNICO']}>
            <TicketsActivos/>
          </ProtectedRoute>
        }/>
        <Route path='/PrestamosActivos' element={
          <ProtectedRoute roles={['TECNICO']}>
            <PrestamosActivos/>
          </ProtectedRoute>
        }/>
        <Route />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
