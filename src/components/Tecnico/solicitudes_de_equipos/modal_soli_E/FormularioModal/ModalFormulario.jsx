import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ModalTec1.css'

function ModalFormulario({ show, onHide, onFinalizar }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <div className='cont_mod_tec1'>
          <div className='Cont_label_tec'>
          <label className='origin'>Nombre de usuario:</label>
          <input type="text" className="form-control " />
          </div>
          <div className='Cont_label_tec'>
          <label className='origin'>Ambiente:</label>
          <input type="text" className="form-control " />
          </div>
          <div className='Cont_label_tec'>
          <label className='origin'>Cantidad de equipos:</label>
          <input type="number" className="form-control " />
          </div>
          <div className='Cont_label_tec'>
          <label className='origin'>Clase de equipos:</label>
          <input type="text" className="form-control " />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button id='buttonModalTec' variant="success" onClick={onFinalizar}>Finalizado</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalFormulario;
