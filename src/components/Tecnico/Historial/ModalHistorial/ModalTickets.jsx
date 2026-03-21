import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ModalTickets.css';

function ModalTickets({ show, onHide, ticket, elementos, tipo, trasabilidad }) {
  // DEBUG: Mostrar trasabilidadTicket en consola
  React.useEffect(() => {
    if (tipo === "Tickets") {
      const t = ticket && trasabilidad.find(t => t.id_ticet === ticket.id_tickets);
      if (t) {
        const obs = t.obser ?? t.obse ?? t.observacion ?? t.ob ?? null;
        console.log('DEBUG trasabilidadTicket:', t);
        console.log('Claves:', Object.keys(t));
        console.log('Valor obser (fallback):', obs);
      } else {
        console.log('DEBUG trasabilidadTicket: null');
      }
    }
  }, [ticket, trasabilidad, tipo]);

  // Buscar el elemento relacionado para préstamos y tickets
  let elementoRelacionado = null;
  if (ticket) {
    if (tipo === "Tickets") {
      elementoRelacionado = elementos.find(el => el.id_elemen === ticket.id_eleme);
    } else if (tipo === "Préstamos") {
      elementoRelacionado = elementos.find(el => el.id_elemen === ticket.id_elem);
    }
  }

  const categoriaElemento = tipo === "Espacios"
    ? "Espacio"
    : (elementoRelacionado
        ? (elementoRelacionado.tip_catg || elementoRelacionado.nom_cat)
        : (ticket.nom_cat || 'Sin categoría'));

  const subcategoriaElemento = elementoRelacionado
    ? (elementoRelacionado.nom_subcat || elementoRelacionado.subcat || 'Sin subcategoría')
    : (ticket.nom_subcat || ticket.subcat || 'Sin subcategoría');

  const numSerieElemento = tipo === "Espacios"
    ? ticket?.id_espa || 'N/A'
    : (elementoRelacionado ? elementoRelacionado.num_seri : 'No registrada');

  // Encontrar trazabilidad relacionada al ticket.
  // Preferir la entrada que tenga observación (buscar en varias claves). Si no hay, usar la primera entrada disponible.
  let trasabilidadTicket = null;
  if (ticket && tipo === "Tickets") {
    const todas = trasabilidad.filter(t => t.id_ticet === ticket.id_tickets);
    if (todas && todas.length > 0) {
      trasabilidadTicket = todas.find(t => (t.obser ?? t.obse ?? t.observacion ?? t.ob));
      if (!trasabilidadTicket) trasabilidadTicket = todas[0];
    } else {
      trasabilidadTicket = null;
    }
  }

  // Normalizar observación desde la trasabilidad seleccionada (varias claves posibles)
  const trasabilidadObservation = trasabilidadTicket
    ? (trasabilidadTicket.obser ?? trasabilidadTicket.obse ?? trasabilidadTicket.observacion ?? trasabilidadTicket.ob ?? null)
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
              {tipo === "Tickets" && (
                <>
                  <div className="modal-item-blanco">
                    <span>Fecha inicio:</span>
                    <p>{ticket.fecha_in ? new Date(ticket.fecha_in).toLocaleString() : 'No registrada'}</p>
                  </div>
                  <div className="modal-item-blanco">
                    <span>Fecha fin:</span>
                    <p>{ticket.fecha_fin ? new Date(ticket.fecha_fin).toLocaleString() : 'No registrada'}</p>
                  </div>
                  <div className="modal-item-blanco">
                    <span>ID Ticket:</span>
                    <p>{ticket.id_tickets}</p>
                  </div>
                  <div className="modal-item-blanco">
                    <span>Nombre elemento:</span>
                    <p>{ticket.nom_elem || (elementoRelacionado && elementoRelacionado.nom_elem) || 'Desconocido'}</p>
                  </div>
                  <div className="modal-item-full-blanco">
                    <span>Categoría:</span>
                    <p>{categoriaElemento}</p>
                  </div>
                  <div className="modal-item-full-blanco">
                    <span>Observación:</span>
                    <p>{trasabilidadObservation ? trasabilidadObservation : 'Sin observación'}</p>
                  </div>
                </>
              )}
              {tipo === "Préstamos" && (
                <>
                  <div className="modal-item-blanco">
                    <span>ID de Préstamo:</span>
                    <p>{ticket.id_prest}</p>
                  </div>
                  <div className="modal-item-blanco">
                    <span>Fecha inicio:</span>
                    <p>{ticket.fecha_entreg ? new Date(ticket.fecha_entreg).toLocaleString() : 'No registrada'}</p>
                  </div>
                  <div className="modal-item-blanco">
                    <span>Fecha de fin:</span>
                    <p>{ticket.fecha_repc ? new Date(ticket.fecha_repc).toLocaleString() : 'No registrada'}</p>
                  </div>
                  <div className="modal-item-blanco">
                    <span>Ambiente:</span>
                    <p>{ticket.ambient || ticket.ambiente || 'No registrado'}</p>
                  </div>
                  <div className="modal-item-blanco">
                    <span>Usuario:</span>
                    <p>{ticket.nom_usu || 'Desconocido'}</p>
                  </div>
                  <div className="modal-item-blanco">
                    <span>Elementos:</span>
                    <p>{ticket.nom_elem || 'Desconocido'}</p>
                  </div>
                  <div className="modal-item-full-blanco">
                    <span>Categoría:</span>
                    <p>{categoriaElemento}</p>
                  </div>
                  {/* Subcategoría eliminada por solicitud */}
                </>
              )}
              {tipo === "Espacios" && (
                <>
                  <div className="modal-item-blanco"><span>Usuario:</span><p>{ticket.nom_usu || 'Desconocido'}</p></div>
                  <div className="modal-item-blanco"><span>Espacio:</span><p>{ticket.nom_espa || ticket.nom_espacio || 'Desconocido'}</p></div>
                  <div className="modal-item-blanco"><span>Fecha inicio:</span><p>{ticket.fecha_ini ? new Date(ticket.fecha_ini).toLocaleString() : 'No registrada'}</p></div>
                  <div className="modal-item-blanco"><span>Fecha fin:</span><p>{ticket.fecha_fn ? new Date(ticket.fecha_fn).toLocaleString() : 'No registrada'}</p></div>
                </>
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
