import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ModalTickets.css';
import Otromodal from '../../informacion_de_equipos/OTRO.MODAL/Otro_modal';

function ModalTickets({ show, onHide, ticket, elementos, tipo }) {
  const [mostrarOtromodal, setMostrarOtromodal] = useState(false);

  const abrirOtromodal = () => setMostrarOtromodal(true);
  const cerrarOtromodal = () => setMostrarOtromodal(false);

  const elementoRelacionado = ticket
    ? elementos.find(
        el => el.id_elemen === (tipo === "Tickets" ? ticket.id_eleme : ticket.id_elem)
      )
    : null;

  const categoriaElemento = elementoRelacionado ? elementoRelacionado.tip_catg : 'Sin categoría';
  const numSerieElemento = elementoRelacionado ? elementoRelacionado.num_seri : 'No registrada';

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        centered
        size="lg"
        className="modal-tickets"
      >
        <Modal.Header closeButton className="modal-header-verde">
          <h2 className="modal-titulo-verde">Detalle {tipo}</h2>
        </Modal.Header>

        <Modal.Body className="modal-body-blanco">
          {ticket ? (
            <div className="modal-grid-blanco">
              <div className="modal-item-blanco">
                <span>ID {tipo}:</span>
                <p>{tipo === "Tickets" ? ticket.id_tickets : ticket.id_prest}</p>
              </div>
              <div className="modal-item-blanco">
                <span>Fecha inicio:</span>
                <p>{tipo === "Tickets" ? (ticket.fecha_in ? new Date(ticket.fecha_in).toLocaleString() : 'No registrada') : (ticket.fecha_entreg ? new Date(ticket.fecha_entreg).toLocaleString() : 'No registrada')}</p>
              </div>
              <div className="modal-item-blanco">
                <span>Fecha fin:</span>
                <p>{tipo === "Tickets" ? (ticket.fecha_fin ? new Date(ticket.fecha_fin).toLocaleString() : 'No registrada') : (ticket.fecha_repc ? new Date(ticket.fecha_repc).toLocaleString() : 'No registrada')}</p>
              </div>
              <div className="modal-item-blanco">
                <span>Ambiente:</span>
                <p>{ticket.ambient || 'No registrado'}</p>
              </div>
              <div className="modal-item-blanco">
                <span>Elemento:</span>
                <p>{ticket.nom_elem || 'Desconocido'}</p>
              </div>
              <div className="modal-item-blanco">
                <span>Categoría:</span>
                <p>{categoriaElemento}</p>
              </div>
              <div className="modal-item-blanco">
                <span>Número de serie:</span>
                <p>{numSerieElemento}</p>
              </div>
              {tipo === "Tickets" && (
                <div className="modal-item-blanco">
                  <span>Problema reportado:</span>
                  <p>{ticket.nom_problm || 'No registrado'}</p>
                </div>
              )}
              {tipo === "Préstamos" && (
                <>
                  <div className="modal-item-blanco"><span>Usuario:</span><p>{ticket.nom_usu || 'Desconocido'}</p></div>
                  <div className="modal-item-blanco"><span>Espacio:</span><p>{ticket.nom_espac || 'No registrado'}</p></div>
                  <div className="modal-item-blanco"><span>Accesorio:</span><p>{ticket.nom_aces || 'No registrado'}</p></div>
                </>
              )}
              <div className="modal-item-full-blanco">
                <span>Observaciones:</span>
                <p>{ticket.Obser || 'Sin observaciones'}</p>
              </div>
            </div>
          ) : (
            <p style={{ textAlign: 'center', margin: '20px 0' }}>Cargando información...</p>
          )}
        </Modal.Body>

        <Modal.Footer className="modal-footer-verde">
          <Button variant="success" className="btn-verde" onClick={abrirOtromodal}>Reportar</Button>
          <Button variant="success" className="btn-verde" onClick={onHide}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      <Otromodal show={mostrarOtromodal} onHide={cerrarOtromodal} />
    </>
  );
}

export default ModalTickets;
