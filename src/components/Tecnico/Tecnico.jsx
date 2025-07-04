import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import './stile_tec.css';
import Footer from '../Footer/Footer';
import HeaderTec from './HeaderTec';
import Button from 'react-bootstrap/Button';

import ModalFormulario from './ModalFormulario';
import ConfirmacionModal from './ConfirmacionModal';

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
      <HeaderTec />

      <div id="container_blanco">
        <ListGroup>
          {[...Array(10)].map((_, index) => (
            <ListGroup.Item id="Conte" key={index}>
              <div id="part"><h4>Cantidad/Equipo/Ambiente</h4></div>
              <Button variant="link" onClick={abrirFormulario}>ver</Button>
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

      {/* Modal de confirmación */}
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
