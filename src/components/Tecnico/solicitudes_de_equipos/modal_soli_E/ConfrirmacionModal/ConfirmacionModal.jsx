import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ConfirmacionModal.css'

function ConfirmacionModal({ show, onHide, onConfirm }) {
  return (
    <Modal  show={show} onHide={onHide} centered >
      <div className='reycito'>
      <Modal.Header closeButton className='cabezitas'>
      </Modal.Header >
      <Modal.Body className='blancox'>
        <h4 className='setcito'>¿Estás seguro de que quieres cerrar esta solicitud?</h4>
      </Modal.Body>
      <Modal.Footer className='unita'>
        <Button id='prim' variant="primary" onClick={onHide}>Cancelar</Button>
        <Button id='prim2' variant="primary " onClick={onConfirm}>Aceptar</Button>
      </Modal.Footer>
      </div>
    </Modal>
  );
}

export default ConfirmacionModal;
