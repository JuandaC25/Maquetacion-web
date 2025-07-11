import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './Modal2.css';
import Otromodal from '../OTRO.MODAL/Otro_modal';

function Modal2({ show, onHide }) {
  const [mostrarOtromodal, setMostrarOtromodal] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const abrirOtromodal = () => setMostrarOtromodal(true);
  const cerrarOtromodal = () => setMostrarOtromodal(false);
  const abrirConfirmacion = () => setMostrarConfirmacion(true);

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header className='verdecito' closeButton><h2 className='titulito'>Tickets equipos</h2></Modal.Header>
        <Modal.Body>
          <div className='contmod'>
            <label className='index'>Fecha de reporte</label>
            <input type="date" className="sombrita" />
          </div>
          <div className='contmod'>
            <label className='index'>Nombre de usuario</label>
            <input type="text" className="sombrita" />
          </div>
          <div className='contmod'>
            <label className='index'>Ambiente</label>
            <input type="text" className="sombrita" />
          </div>
          <div className='contmod'>
            <label className='index'>Modelo de pc</label>
            <input type="text" className="sombrita" />
          </div>
          <div className='contmod'>
            <label className='index'>Número de serie</label>
            <input type="number" className="sombrita" />
          </div>
          <div className='contmod'>
            <label className='index'>Observaciones</label>
            <input type="text" className="sombrita" />
          </div>
          
        </Modal.Body>
        <Modal.Footer className='dedito'>
          <Button className='ultimob' variant="success" onClick={abrirOtromodal}>
            Reportar
          </Button>
          <Button className='ultimob' variant="success" onClick={onHide}>
            Cerrar ticket
          </Button>
        </Modal.Footer>
      </Modal>

      {}
      <Otromodal
        show={mostrarOtromodal}
        onHide={cerrarOtromodal}
        onFinalizar={abrirConfirmacion}
      />
    </>
  );
}

export default Modal2;
