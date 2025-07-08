import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import './Soli_Equi_Tec.css';
import Footer from '../../Footer/Footer';
import Button from 'react-bootstrap/Button';
import ModalFormulario from './modal_soli_E/FormularioModal/ModalFormulario';
import ConfirmacionModal from './modal_soli_E/ConfrirmacionModal/ConfirmacionModal';

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
    alert("Ticket cerrado correctamente");
};

return (
    <>
      
      <div className='container_blanco'>
        <ListGroup>
          {[...Array(8)].map((_, index) => (
            <ListGroup.Item id='Conte' key={index}>
              <div className='part'>
                <h4>Cantidad/Equipo/Ambiente</h4>
              </div>
              <div>
                <Button className='buttonSoli' variant="link" onClick={abrirFormulario}>ver</Button>
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
