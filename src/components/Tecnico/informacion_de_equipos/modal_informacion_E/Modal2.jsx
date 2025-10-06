import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './Modal2.css';
import Otromodal from '../OTRO.MODAL/Otro_modal';

function Modal2({ show, onHide, ticket, elementos }) {
  const [mostrarOtromodal, setMostrarOtromodal] = useState(false);

  const abrirOtromodal = () => setMostrarOtromodal(true);
  const cerrarOtromodal = () => setMostrarOtromodal(false);

  // 🔹 Traer información del elemento usando los datos ya cargados
  const elementoRelacionado = ticket
    ? elementos.find(el => el.id_elemen === ticket.id_eleme)
    : null;

  const categoriaElemento = elementoRelacionado ? elementoRelacionado.tip_catg : 'Sin categoría';
  const numSerieElemento = elementoRelacionado ? elementoRelacionado.num_seri : 'No registrada';

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header className='modal-header-verde' closeButton>
          <h2 className='modal-titulo'>Detalle del Ticket</h2>
        </Modal.Header>
        <Modal.Body>
          {ticket ? (
            <div className='modal-grid'>
              <div className='modal-item'>
                <label className='modal-label'>ID Ticket</label>
                <input type="text" value={ticket.id_tickets} readOnly className="modal-input" />
              </div>
              <div className='modal-item'>
                <label className='modal-label'>Fecha inicio</label>
                <input type="text" value={ticket.fecha_in ? new Date(ticket.fecha_in).toLocaleString() : 'No registrada'} readOnly className="modal-input" />
              </div>
              <div className='modal-item'>
                <label className='modal-label'>Fecha fin</label>
                <input type="text" value={ticket.fecha_in ? new Date(ticket.fecha_fin).toLocaleString() : 'No registrada'} readOnly className="modal-input" />
              </div>
              <div className='modal-item'>
                <label className='modal-label'>Ambiente</label>
                <input type="text" value={ticket.ambient || 'No registrado'} readOnly className="modal-input" />
              </div>
              <div className='modal-item'>
                <label className='modal-label'>Elemento</label>
                <input type="text" value={ticket.nom_elem || 'Desconocido'} readOnly className="modal-input" />
              </div>
              <div className='modal-item'>
                <label className='modal-label'>Categoría del elemento</label>
                <input type="text" value={categoriaElemento} readOnly className="modal-input" />
              </div>
              <div className='modal-item'>
                <label className='modal-label'>Número de serie</label>
                <input type="text" value={numSerieElemento} readOnly className="modal-input" />
              </div>
              <div className='modal-item'>
                <label className='modal-label'>Problema reportado</label>
                <input type="text" value={ticket.nom_problm || 'No registrado'} readOnly className="modal-input" />
              </div>
              <div className='modal-item-full'>
                <label className='modal-label'>Observaciones</label>
                <textarea value={ticket.Obser || 'Sin observaciones'} readOnly className="modal-textarea" />
              </div>
            </div>
          ) : (
            <p>Cargando información del ticket...</p>
          )}
        </Modal.Body>
        <Modal.Footer className='modal-footer'>
          <Button className='modal-btn' variant="success" onClick={abrirOtromodal}>
            Reportar
          </Button>
          <Button className='modal-btn' variant="success" onClick={onHide}>
            Cerrar ticket
          </Button>
        </Modal.Footer>
      </Modal>

      <Otromodal
        show={mostrarOtromodal}
        onHide={cerrarOtromodal}
      />
    </>
  );
}

export default Modal2;
