import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ModalTicketsActivos.css';
import { actualizarTicket } from '../../../api/ticket';
import ModalReportar from './ModalReportar';

function ModalTicketsActivos({ show, onHide, ticket, elementos, onTicketUpdated }) {
  const [indiceImagen, setIndiceImagen] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [mostrarModalReportar, setMostrarModalReportar] = useState(false);

  const elementoRelacionado = ticket
    ? elementos.find(el => el.id_elemen === ticket.id_eleme)
    : null;

  const categoriaElemento = elementoRelacionado ? elementoRelacionado.tip_catg : 'Sin categoría';
  const numSerieElemento = elementoRelacionado ? elementoRelacionado.num_seri : 'No registrada';

  // Extraer imágenes del atributo imageness
  const obtenerImagenes = () => {
    if (!ticket || !ticket.imageness) return [];
    try {
      if (typeof ticket.imageness === 'string' && ticket.imageness.startsWith('[')) {
        return JSON.parse(ticket.imageness);
      }
      return Array.isArray(ticket.imageness) ? ticket.imageness : [ticket.imageness];
    } catch (e) {
      console.warn('Error al parsear imageness:', e);
      return [];
    }
  };

  const imagenes = obtenerImagenes();

  const marcarComoResuelto = () => {
    setMostrarModalReportar(true);
  };

  const handleModalReportarSuccess = () => {
    if (onTicketUpdated) {
      onTicketUpdated();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header className='modal-header-verde' closeButton>
        <h2 className='modal-titulo'>Detalle del Ticket Activo</h2>
      </Modal.Header>
      <Modal.Body>
        {ticket ? (
          <div className='modal-grid'>
            <div className='modal-item'>
              <label className='modal-label'>ID Ticket</label>
              <input type="text" value={ticket.id_tickets || ticket.id || ''} readOnly className="modal-input" />
            </div>
            <div className='modal-item'>
              <label className='modal-label'>Fecha inicio</label>
              <input type="text" value={ticket.fecha_in ? new Date(ticket.fecha_in).toLocaleString() : 'No registrada'} readOnly className="modal-input" />
            </div>
            <div className='modal-item'>
              <label className='modal-label'>Fecha fin</label>
              <input type="text" value={ticket.fecha_fin ? new Date(ticket.fecha_fin).toLocaleString() : 'No registrada'} readOnly className="modal-input" />
            </div>
            <div className='modal-item'>
              <label className='modal-label'>Ambiente</label>
              <input type="text" value={ticket.ambiente || ticket.ambient || 'No registrado'} readOnly className="modal-input" />
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
            {imagenes.length > 0 ? (
              <div className='modal-item-full'>
                <label className='modal-label'>Imágenes del Ticket</label>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '10px',
                  border: '1px solid #ddd',
                  padding: '10px',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <img 
                    src={
                      imagenes[indiceImagen].startsWith('data:') 
                        ? imagenes[indiceImagen]
                        : imagenes[indiceImagen].startsWith('http')
                        ? imagenes[indiceImagen]
                        : `http://localhost:8081${imagenes[indiceImagen]}`
                    }
                    alt={`Ticket ${indiceImagen + 1}`}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '300px',
                      objectFit: 'contain',
                      borderRadius: '5px'
                    }}
                    onError={(e) => {
                      if (e.target.getAttribute('data-fallback') !== 'true') {
                        e.target.src = '/imagenes/ticket.png';
                        e.target.setAttribute('data-fallback', 'true');
                      } else {
                        const container = e.target.parentElement;
                        container.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 300px; color: #999; fontSize: '1rem';">No hay imagen</div>`;
                      }
                    }}
                  />
                  {imagenes.length > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                      <Button 
                        size="sm" 
                        variant="outline-success"
                        onClick={() => setIndiceImagen((prev) => (prev - 1 + imagenes.length) % imagenes.length)}
                        disabled={imagenes.length <= 1}
                      >
                        ← Anterior
                      </Button>
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>
                        Imagen {indiceImagen + 1} de {imagenes.length}
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline-success"
                        onClick={() => setIndiceImagen((prev) => (prev + 1) % imagenes.length)}
                        disabled={imagenes.length <= 1}
                      >
                        Siguiente →
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='modal-item-full'>
                <label className='modal-label'>Imágenes del Ticket</label>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '150px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9',
                  color: '#999',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  No hay imágenes disponibles
                </div>
              </div>
            )}
            <div className='modal-item-full'>
              <label className='modal-label'>Observaciones</label>
              <textarea
                value={
                  (ticket && (ticket.obser || ticket.obse || ticket.observaciones || ticket.observacion))
                    ? (ticket.obser || ticket.obse || ticket.observaciones || ticket.observacion)
                    : 'Sin observaciones'
                }
                readOnly
                className="modal-textarea"
              />
            </div>
          </div>
        ) : (
          <p>Cargando información del ticket...</p>
        )}
      </Modal.Body>
      <Modal.Footer className='modal-footer'>
        <Button className='modal-btn' variant="success" onClick={marcarComoResuelto} disabled={cargando}>
          {cargando ? 'Reportando...' : 'Reportar'}
        </Button>
        <Button className='modal-btn' variant="success" onClick={onHide} disabled={cargando}>
          Cancelar
        </Button>
      </Modal.Footer>

      <ModalReportar 
        show={mostrarModalReportar} 
        onHide={() => setMostrarModalReportar(false)} 
        ticket={ticket} 
        onSuccess={handleModalReportarSuccess}
      />
    </Modal>
  );
}

export default ModalTicketsActivos;
