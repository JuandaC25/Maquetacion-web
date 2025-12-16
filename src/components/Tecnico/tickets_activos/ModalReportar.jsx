import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ModalTicketsActivos.css';
import { actualizarTicket } from '../../../api/ticket';
import { crearTrasabilidad } from '../../../api/TransabilidadApi';
import { useAuth } from '../../../auth/AuthContext';

function ModalReportar({ show, onHide, ticket, onSuccess }) {
  const [observacion, setObservacion] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [tipoAccion, setTipoAccion] = useState(null); // 'terminar' o 'inactivar'
  const { user: usuarioActual } = useAuth();

  const abrirConfirmacion = (estado, tipo) => {
    setEstadoSeleccionado(estado);
    setTipoAccion(tipo);
    setMostrarConfirmacion(true);
  };

  const cambiarEstado = async () => {
    try {
      setCargando(true);
      const ticketId = ticket.id_tickets || ticket.id;
      
      console.log(`Cambiar ticket ${ticketId} a estado ${estadoSeleccionado}`);
      // Preparar payload: si el estado es TERMINAR(3) o INACTIVAR(4), añadir fecha_fin
      const formatLocalDateTime = (d) => new Date(d).toISOString().split('.')[0];
      const payload = { id_est_tick: estadoSeleccionado };
      if (estadoSeleccionado === 3 || estadoSeleccionado === 4) {
        payload.fecha_fin = formatLocalDateTime(new Date());
      }

      // Cambiar estado del ticket
      await actualizarTicket(ticketId, payload);
      
      // Crear registro de trasabilidad con la observación
      try {
        const dataTrasa = {
          fech: new Date().toISOString().split('T')[0], // Fecha actual
          obse: observacion,
          id_usu: usuarioActual?.id || usuarioActual?.id_usu || 1, 
          id_ticet: ticketId,
          id_elemen: ticket.id_eleme || ticket.id_elemento, // ID del elemento
        };
        
        console.log('Creando trasabilidad:', dataTrasa);
        await crearTrasabilidad(dataTrasa);
        console.log('Trasabilidad creada exitosamente');
      } catch (trasaError) {
        console.warn('Error al crear trasabilidad (no bloqueante):', trasaError);
        // No bloqueamos el flujo si hay error en trasabilidad
      }
      
      console.log('Ticket actualizado exitosamente');
      setObservacion('');
      setMostrarConfirmacion(false);
      onSuccess();
      onHide();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar el estado. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const handleCancelar = () => {
    setObservacion('');
    onHide();
  };

  const mensajeConfirmacion = tipoAccion === 'terminar' 
    ? '¿Deseas marcar este ticket como TERMINADO?' 
    : '¿Deseas marcar este ticket como INACTIVO?';

  return (
    <>
      <Modal show={show} onHide={handleCancelar} centered>
        <Modal.Header className='modal-header-verde' closeButton>
          <h2 className='modal-titulo'>Reportar Ticket</h2>
        </Modal.Header>
        <Modal.Body>
          <div className='modal-item-full'>
            <label className='modal-label'>Observaciones (Opcional)</label>
            <textarea
              className="modal-textarea"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="Escribe tus observaciones aquí..."
              rows="6"
            />
          </div>
        </Modal.Body>
        <Modal.Footer className='modal-footer'>
          <Button 
            className='modal-btn' 
            variant="success" 
            onClick={() => abrirConfirmacion(3, 'terminar')} 
            disabled={cargando || observacion.trim() === ''}
          >
            Terminar
          </Button>
          <Button 
            className='modal-btn' 
            variant="success" 
            onClick={() => abrirConfirmacion(4, 'inactivar')} 
            disabled={cargando || observacion.trim() === ''}
          >
            Inactivar
          </Button>
          <Button 
            className='modal-btn' 
            variant="success" 
            onClick={handleCancelar} 
            disabled={cargando}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmación */}
      <Modal show={mostrarConfirmacion} onHide={() => setMostrarConfirmacion(false)} centered>
        <Modal.Header className='modal-header-verde' closeButton>
          <h2 className='modal-titulo'>Confirmación</h2>
        </Modal.Header>
        <Modal.Body style={{ textAlign: 'center', padding: '30px' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#333', marginBottom: '20px' }}>
            {mensajeConfirmacion}
          </p>
        </Modal.Body>
        <Modal.Footer className='modal-footer'>
          <Button 
            className='modal-btn' 
            variant="success" 
            onClick={cambiarEstado} 
            disabled={cargando}
          >
            {cargando ? 'Procesando...' : 'Sí'}
          </Button>
          <Button 
            className='modal-btn' 
            variant="success" 
            onClick={() => setMostrarConfirmacion(false)} 
            disabled={cargando}
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalReportar;
