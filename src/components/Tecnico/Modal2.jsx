import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './stile_tec.css';

function Modal2({ show, onHide, onFinalizar }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
             
            </Modal.Header>
            <Modal.Body>
              <label>Fecha de reporte</label>
              <input type="text" className="form-control mb-2" />
              <label>Modelo de pc</label>
              <input type="text" className="form-control mb-2" />
              <label>Numero de serie </label>
              <input type="number" className="form-control mb-2" />
              <label>Ambiente</label>
              <input type="text" className="form-control mb-2" />
            </Modal.Body>
            <Modal.Footer>
              <Button className='ultimob' variant="success" onClick={onFinalizar}>Reportar</Button >
              <Button className='ultimob'variant="success" onClick={onFinalizar}>Cerrar ticket</Button>
            </Modal.Footer>
    </Modal>
  );
}

export default Modal2;
