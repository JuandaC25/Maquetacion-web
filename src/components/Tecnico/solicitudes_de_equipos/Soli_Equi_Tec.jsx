import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import './Soli_Equi_Tec.css';
import Footer from '../../Footer/Footer';
import Button from 'react-bootstrap/Button';
import ModalFormulario from './modal_soli_E/FormularioModal/ModalFormulario';
import ConfirmacionModal from './modal_soli_E/ConfrirmacionModal/ConfirmacionModal';
import Header_solicitud_tec from '../header_solicitudes_equ_tec/Header_soli_equi_tec.jsx';
import { FaDesktop } from 'react-icons/fa';
function Tecnico() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const abrirFormulario = () => setMostrarFormulario(true);
  const cerrarFormulario = () => setMostrarFormulario(false);

  const abrirConfirmacion = () => setMostrarConfirmacion(true);
  const cerrarConfirmacion = () => setMostrarConfirmacion(false);

  const aceptarConfirmacion = () => {
    setMostrarConfirmacion(false);
    setMostrarFormulario(false);
    alert("Solicitud cerrada correctamente");
};

return (
    <>
    
      <Header_solicitud_tec/>
      <div>
        <div className='linea'>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#001</h3>
            <div className='icono'>

            </div>
            <h7>Instrutor:</h7>
            <h7>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
            
          </div>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#002</h3>
            <div className='icono'>

            </div>
            <h7>Instrutor:</h7>
            <h7>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#003</h3>
            <div className='icono'>

            </div>
            <h7>Instrutor:</h7>
            <h7>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#004</h3>
            <div className='icono'>

            </div>
            <h7>Instrutor:</h7>
            <h7>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#005</h3>
            <div className='icono'>

            </div>
            <h7>Instrutor:</h7>
            <h7>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
        </div>
        <div className='linea'>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#001</h3>
            <div className='icono'>

            </div>
            <h7>Instrutor:</h7>
            <h7>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>









            
          </div>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#002</h3>
            <div className='icono'>


            </div>
            <h7>Instrutor:</h7>
            <h7>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#003</h3>
            <div className='icono'>

            </div>
            <h7>Instrutor:</h7>
            <h7>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#004</h3>
            <div className='icono'>

            </div>
            <h7>Instrutor:</h7>
            <h7>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#005</h3>
            <div className='icono'>

            </div>
            <h7>Instrutor:</h7>
            <h7>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
        </div>
      </div>
      {}
      <ModalFormulario
        show={mostrarFormulario}
        onHide={cerrarFormulario}
        onFinalizar={abrirConfirmacion}
      />
      <ConfirmacionModal
        show={mostrarConfirmacion}
        onHide={cerrarConfirmacion}
        onConfirm={aceptarConfirmacion}
      />
      <Footer />
    </>
  );
}

export default Tecnico;
