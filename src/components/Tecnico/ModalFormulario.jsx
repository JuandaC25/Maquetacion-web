import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function ModalFormulario({ show, onHide, onFinalizar }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Formulario de Equipos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label>Nombre de usuario:</label>
        <input type="text" className="form-control mb-2" />
        <label>Ambiente:</label>
        <input type="text" className="form-control mb-2" />
        <label>Cantidad de equipos:</label>
        <input type="number" className="form-control mb-2" />
        <label>Clase de equipos:</label>
        <input type="text" className="form-control mb-2" />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={onFinalizar}>Finalizado</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalFormulario;
