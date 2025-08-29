import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ModalTec1.css'

function ModalFormulario({ show, onHide, onFinalizar }) {
  return (
    <Modal show={show} onHide={onHide} centered className='principe'>
      <Modal.Header className='cabeza' closeButton>
        <h1 className='titulito'>Prestamos equipos</h1>
      </Modal.Header>
      <Modal.Body className='cuerpito'>
        <div className='cont_mod_tec1'>
          <div className='Cont_label_tec'>
          <label className='origin'>Fecha:</label>
          <input type="date" className="tecito " />
          </div>
          <div className='Cont_label_tec'>
          <label className='origin'>Nombre de usuario:</label>
          <input type="text" className="tecito " />
          </div>
          <div className='Cont_label_tec'>
          <label className='origin'>Ambiente:</label>
          <input type="text" className="tecito " />
          </div>
          <div className='Cont_label_tec'>
          <label className='origin'>Cantidad de equipos:</label>
          <input type="number" className="tecito " />
          </div>
          <div className='Cont_label_tec'>
          <label className='origin'>Categoria:</label>
          <input type="text" className="tecito " />
          </div>
           <div className='Cont_label_tec'>
          <label className='origin'>Observaciones:</label>
          <input type="text" className="tecito " />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className='piecito'>
        <Button id='buttonModalTec' variant="success" onClick={onFinalizar}>Finalizado</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalFormulario;
