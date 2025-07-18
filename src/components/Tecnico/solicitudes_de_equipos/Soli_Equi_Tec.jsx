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
      <div className='container_blanco'>
        <ListGroup>
          {[...Array(7)].map((_, index) => (
            <ListGroup.Item id='Conte' key={index}>
             <FaDesktop size={30} style={{ marginRight: '10px',marginLeft: '10px' }} />

              <div className='part'>
                <h4 className='centrico'>Cantidad   /  Equipo  /  Ambiente</h4>
              </div>
              <div>
                <Button className='buttonSoli' variant="link" onClick={abrirFormulario}>Abrir</Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
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
