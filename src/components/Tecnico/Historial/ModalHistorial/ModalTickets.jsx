import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ModalTickets.css';

function ModalTickets({ show, onHide, ticket, elementos, tipo, trasabilidad }) {

  const elementoRelacionado = ticket
    ? elementos.find(
        el => el.id_elemen === (tipo === "Tickets" ? ticket.id_eleme : (tipo === "Préstamos" ? ticket.id_elem : null))
      )
    : null;

  const categoriaElemento = tipo === "Espacios" 
    ? "Espacio" 
    : (elementoRelacionado ? elementoRelacionado.tip_catg : 'Sin categoría');
  
  const numSerieElemento = tipo === "Espacios" 
    ? ticket?.id_espa || 'N/A'
    : (elementoRelacionado ? elementoRelacionado.num_seri : 'No registrada');

  // Encontrar trasabilidad relacionada al ticket
  const trasabilidadTicket = ticket && tipo === "Tickets"
    ? trasabilidad.find(t => t.id_ticet === ticket.id_tickets)
    : null;

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
                <p>{tipo === "Tickets" ? ticket.id_tickets : (tipo === "Préstamos" ? ticket.id_prest : ticket.id_soli)}</p>
              </div>
              <div className="modal-item-blanco">
                <span>Fecha inicio:</span>
                <p>{tipo === "Tickets" 
                  ? (ticket.fecha_in ? new Date(ticket.fecha_in).toLocaleString() : 'No registrada') 
                  : (tipo === "Préstamos" 
                    ? (ticket.fecha_entreg ? new Date(ticket.fecha_entreg).toLocaleString() : 'No registrada')
                    : (ticket.fecha_ini ? new Date(ticket.fecha_ini).toLocaleString() : 'No registrada'))}</p>
              </div>
              <div className="modal-item-blanco">
                <span>Fecha fin:</span>
                <p>{tipo === "Tickets" 
                  ? (ticket.fecha_fin ? new Date(ticket.fecha_fin).toLocaleString() : 'No registrada') 
                  : (tipo === "Préstamos"
                    ? (ticket.fecha_repc ? new Date(ticket.fecha_repc).toLocaleString() : 'No registrada')
                    : (ticket.fecha_fn ? new Date(ticket.fecha_fn).toLocaleString() : 'No registrada'))}</p>
              </div>
              <div className="modal-item-blanco">
                <span>Ambiente:</span>
                <p>{ticket.ambient || ticket.ambiente || 'No registrado'}</p>
              </div>
              <div className="modal-item-blanco">
                <span>Elemento/Espacio:</span>
                <p>{tipo === "Espacios" ? (ticket.nom_espa || 'Desconocido') : (ticket.nom_elem || 'Desconocido')}</p>
              </div>
              <div className="modal-item-blanco">
                <span>Categoría:</span>
                <p>{categoriaElemento}</p>
              </div>
              <div className="modal-item-blanco">
                <span>Número de serie/ID:</span>
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
              {tipo === "Espacios" && (
                <>
                  <div className="modal-item-blanco"><span>Usuario:</span><p>{ticket.nom_usu || 'Desconocido'}</p></div>
                  <div className="modal-item-blanco"><span>Estado:</span><p>{ticket.est_soli || 'No registrado'}</p></div>
                  <div className="modal-item-blanco"><span>Cantidad:</span><p>{ticket.cantid || 'No registrado'}</p></div>
                </>
              )}
              {tipo === "Tickets" && trasabilidadTicket && (
                <div className="modal-item-full-blanco">
                  <span>Observaciones:</span>
                  <p>{trasabilidadTicket.obse || 'Sin observaciones'}</p>
                </div>
              )}
            </div>
          ) : (
            <p style={{ textAlign: 'center', margin: '20px 0' }}>Cargando información...</p>
          )}
        </Modal.Body>

        <Modal.Footer className="modal-footer-verde">
          <Button variant="success" className="btn-verde" onClick={onHide}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalTickets;
