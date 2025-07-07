import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function ConfirmacionModal({ show, onHide, onConfirm }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar acción</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>¿Estás seguro de que quieres cerrar ticket?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={onConfirm}>Aceptar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmacionModal;
