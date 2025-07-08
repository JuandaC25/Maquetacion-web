import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ConfirmacionModal.css'

function ConfirmacionModal({ show, onHide, onConfirm }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
      
      </Modal.Header>
      <Modal.Body>
        <p>¿Estás seguro de que quieres cerrar esta solicitud?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button className='prim' variant="primary" onClick={onHide}>Cancelar</Button>
        <Button className='prim2' variant="primary " onClick={onConfirm}>Aceptar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmacionModal;
