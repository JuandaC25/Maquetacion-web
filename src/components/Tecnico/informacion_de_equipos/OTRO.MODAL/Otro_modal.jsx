import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './Otro_modal.css';

 
function Otromodal({ show, onHide}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
             
            </Modal.Header>
            <Modal.Body>
              <div className='contmad'>
                <h1 className='indexI'>TECNICO</h1>
                <h4 >10/12/2024</h4>
               <div type="text" className='textico'><h9>Datos de la revision</h9></div> 
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='ultimob'variant="success" onClick={onHide}>enviar reporte</Button>
            </Modal.Footer>
    </Modal>
  );
}

export default Otromodal;
