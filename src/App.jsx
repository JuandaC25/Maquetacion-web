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
import Soliespacios from './components/Home/Espacios/Solicitud_espacios' ;
import Historial_ped from './components/Home/Histo_pedi/Histo_pedi.jsx' ;
import Soli_port from './components/Home/Pedidos_port/Soli_Port.jsx';
import Solitelevisores from './components/Home/Pedidos_AudioVideo/Solici_audio_video.jsx';
import Pedidos_ele from './components/Home/Pedidos_ele/Pedidos_ele.jsx';  
import './components/App.css';
import Pedidos_escritorio from './components/Home/Pedidos_escritorio/Pedidos_escritorio.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import Informacion_equipos from './components/Home/ReportarEquipo/Informacion_equipos.jsx';
import Desplegable from './components/desplegable/desplegable.jsx';
import HistorialTec from './components/Tecnico/Historial/HistorialTec.jsx';
import Historial_ptec from './components/Tecnico/Historial/Historial_ptec/Historial_ptec.jsx';
import Historial_ptec2 from './components/Tecnico/Historial/Historial_ptec1/Historial_ptec2.jsx';
import Solicitudes from './paginas/Solicitudes/Solicitudes.jsx';
import TicketsActivos from './components/Tecnico/tickets_activos/TicketsActivos.jsx';
import Categorias from './components/admin/categoria_admin/Categorias.jsx';
import PrestamosActivos from './components/Tecnico/prestamos_activos/PrestamosActivos.jsx';
function App() {
  return (

    <BrowserRouter>

      <Routes>
        <Route path='/' element={<Login/>}/> 
        <Route path='/Login' element={<Login/>}/> 
        <Route path='/Tickets-Tecnico' element={
          <ProtectedRoute roles={['TECNICO']} excludeRoles={['ADMINISTRADOR']}>
            <Cuarta />
          </ProtectedRoute>
        } />
        <Route path='/inventario' element={
          <ProtectedRoute roles={['ADMINISTRADOR']} excludeRoles={['TECNICO']}>
            <Inventario />
          </ProtectedRoute>
        } />
        <Route path='/adcrear' element={
          <ProtectedRoute roles={['ADMINISTRADOR']} excludeRoles={['TECNICO']}>
            <AdCrear />
          </ProtectedRoute>
        } />
        <Route path='/solielemento' element={
          <ProtectedRoute roles={['ADMINISTRADOR']} excludeRoles={['TECNICO']}>
            <Solielemento/>
          </ProtectedRoute>
        } />
        <Route path='/soliespacio' element={
          <ProtectedRoute roles={['ADMINISTRADOR']} excludeRoles={['TECNICO']}>
            <Soliespacio/>
          </ProtectedRoute>
        } />
        <Route path='/Prestamos-Tecnico' element={
          <ProtectedRoute roles={['TECNICO']} excludeRoles={['ADMINISTRADOR']}>
            <Tecnico />
          </ProtectedRoute>
        } />
        <Route path='/Informacion_equiposs' element={
          <ProtectedRoute excludeRoles={['ADMINISTRADOR', 'TECNICO']}>
            <Informacion_equipos />
          </ProtectedRoute>
        } />
        <Route path='/Inicio' element={
          <ProtectedRoute excludeRoles={['ADMINISTRADOR', 'TECNICO']}>
            <Home />
          </ProtectedRoute>
        }/>
        <Route path='/espacios' element={
          <ProtectedRoute excludeRoles={['ADMINISTRADOR', 'TECNICO']}>
            <Soliespacios />
          </ProtectedRoute>
        } />
        <Route path='/Solicitar-Portatiles' element={
          <ProtectedRoute excludeRoles={['ADMINISTRADOR', 'TECNICO']}>
            <Soli_port />
          </ProtectedRoute>
        } />
        <Route path='/Historial_pedidos' element={
          <ProtectedRoute excludeRoles={['ADMINISTRADOR', 'TECNICO']}>
            <Historial_ped />
          </ProtectedRoute>
        } />
        <Route path='/Solicitartelevisores' element={
          <ProtectedRoute excludeRoles={['ADMINISTRADOR', 'TECNICO']}>
            <Solitelevisores />
          </ProtectedRoute>
        } />
        <Route path='/Pedidos_ele' element={
          <ProtectedRoute excludeRoles={['ADMINISTRADOR', 'TECNICO']}>
            <Pedidos_ele />
          </ProtectedRoute>
        } />
        <Route path='/Pedidoescritorio' element={
          <ProtectedRoute excludeRoles={['ADMINISTRADOR', 'TECNICO']}>
            <Pedidos_escritorio />
          </ProtectedRoute>
        } />
        <Route path='/Admin' element={
          <ProtectedRoute roles={['ADMINISTRADOR']} excludeRoles={['TECNICO']}>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/PedidoElementos" element={
          <ProtectedRoute excludeRoles={['ADMINISTRADOR', 'TECNICO']}>
            <Pedidos_ele />
          </ProtectedRoute>
        } />
        <Route path='/HistorialTec' element={
          <ProtectedRoute roles={['TECNICO']} excludeRoles={['ADMINISTRADOR']}>
            <HistorialTec/>
          </ProtectedRoute>
        }/>
        <Route path='/TicketsActivos' element={
          <ProtectedRoute roles={['TECNICO']} excludeRoles={['ADMINISTRADOR']}>
            <TicketsActivos/>
          </ProtectedRoute>
        }/>
        <Route path='/PrestamosActivos' element={
          <ProtectedRoute roles={['TECNICO']} excludeRoles={['ADMINISTRADOR']}>
            <PrestamosActivos/>
          </ProtectedRoute>
        }/>
        <Route path='/Categorias' element={
          <ProtectedRoute roles={['ADMINISTRADOR']} excludeRoles={['TECNICO']}>
            <Categorias/>
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
