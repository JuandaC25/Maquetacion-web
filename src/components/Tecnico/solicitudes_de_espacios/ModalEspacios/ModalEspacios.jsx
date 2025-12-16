import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { authorizedFetch } from '../../../../api/http';
import './ModalEspacios.css';

function ModalEspacios({ show, onHide, espacio }) {
  const [loading, setLoading] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarConfirmacionRechazo, setMostrarConfirmacionRechazo] = useState(false);
  const [mostrarConfirmacionFinalizacion, setMostrarConfirmacionFinalizacion] = useState(false);
  const [accion, setAccion] = useState(null); // 'aprobar', 'rechazar' o 'finalizar'

  console.log('ModalEspacios - show:', show, 'espacio:', espacio);

  if (!show || !espacio) return null;

  const formatDate = (fecha) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const abrirConfirmacionAprobacion = () => {
    setAccion('aprobar');
    setMostrarConfirmacion(true);
  };

  const abrirConfirmacionRechazo = () => {
    setAccion('rechazar');
    setMostrarConfirmacionRechazo(true);
  };

  const cerrarConfirmacion = () => {
    setMostrarConfirmacion(false);
    setAccion(null);
  };

  const cerrarConfirmacionRechazo = () => {
    setMostrarConfirmacionRechazo(false);
    setAccion(null);
  };

  const abrirConfirmacionFinalizacion = () => {
    setAccion('finalizar');
    setMostrarConfirmacionFinalizacion(true);
  };

  const cerrarConfirmacionFinalizacion = () => {
    setMostrarConfirmacionFinalizacion(false);
    setAccion(null);
  };

  const confirmarAprobacion = async () => {
    cerrarConfirmacion();
    setLoading(true);

    try {
      console.log("🔹 Aprobando solicitud de espacio:", espacio.id_soli);

      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      const id_tecnico = usuario.id;
      const nombre_tecnico = usuario.nombre || usuario.name || 'Técnico';

      const payload = {
        id_soli: espacio.id_soli,
        id_est_soli: 2, // Aprobado
        id_tecnico: id_tecnico,
        nombre_tecnico: nombre_tecnico
      };
      console.log("📤 Payload enviado al backend:", JSON.stringify(payload));

      const updateResponse = await authorizedFetch(`/api/solicitudes/${espacio.id_soli}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!updateResponse.ok) throw new Error('Error al actualizar el estado de la solicitud');
      console.log("✅ Solicitud de espacio aprobada correctamente");
      alert("Solicitud de espacio aprobada exitosamente");

      onHide();
    } catch (error) {
      console.error("❌ Error al aprobar:", error);
      alert("Ocurrió un error al aprobar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const confirmarRechazo = async () => {
    cerrarConfirmacionRechazo();
    setLoading(true);

    try {
      console.log("🔹 Rechazando solicitud de espacio:", espacio.id_soli);

      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      const nombre_tecnico = usuario.nombre || usuario.name || 'Técnico';

      const updateResponse = await authorizedFetch(`/api/solicitudes/${espacio.id_soli}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_soli: espacio.id_soli,
          id_est_soli: 3, // Rechazado
          nombre_tecnico: nombre_tecnico
        }),
      });

      if (!updateResponse.ok) throw new Error('Error al rechazar la solicitud');
      console.log("✅ Solicitud de espacio rechazada correctamente");
      alert("Solicitud de espacio rechazada");

      onHide();
    } catch (error) {
      console.error("❌ Error al rechazar:", error);
      alert("Ocurrió un error al rechazar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const confirmarFinalizacion = async () => {
    cerrarConfirmacionFinalizacion();
    setLoading(true);

    try {
      console.log("🔹 Finalizando solicitud de espacio:", espacio.id_soli);

      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      const id_tecnico = usuario.id;
      const nombre_tecnico = usuario.nombre || usuario.name || 'Técnico';

      const payload = {
        id_soli: espacio.id_soli,
        id_est_soli: 5, // Finalizado
        id_tecnico: id_tecnico,
        nombre_tecnico: nombre_tecnico
      };
      console.log("📤 Payload enviado al backend:", JSON.stringify(payload));

      const updateResponse = await authorizedFetch(`/api/solicitudes/${espacio.id_soli}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!updateResponse.ok) throw new Error('Error al finalizar la solicitud');
      console.log("✅ Solicitud de espacio finalizada correctamente");
      alert("Solicitud de espacio finalizada exitosamente");

      onHide();
    } catch (error) {
      console.error("❌ Error al finalizar:", error);
      alert("Ocurrió un error al finalizar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal Principal */}
      <Modal show={show} onHide={onHide} centered className="modal-espacios">
        <Modal.Header className="modal-header-verde" closeButton>
          <Modal.Title>Detalle de Solicitud de Espacio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="detalle-info">
            <div className="info-row">
              <label className="info-label">👤 Usuario</label>
              <span className="info-value">{espacio.nom_usu || 'N/A'}</span>
            </div>
            <div className="info-row">
              <label className="info-label">📅 Fecha de Inicio</label>
              <span className="info-value">{formatDate(espacio.fecha_ini)}</span>
            </div>
            <div className="info-row">
              <label className="info-label">📅 Fecha de Fin</label>
              <span className="info-value">{formatDate(espacio.fecha_fn)}</span>
            </div>
            <div className="info-row">
              <label className="info-label">🏢 Espacio Solicitado</label>
              <span className="info-value">{espacio.nom_espa || 'N/A'}</span>
            </div>
            {/* Ambiente eliminado por solicitud */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {espacio.est_soli === 'Pendiente' ? (
            <>
              <Button 
                style={{ 
                  backgroundColor: 'white', 
                  borderColor: '#3fbb34',
                  color: '#3fbb34',
                  borderWidth: '2px',
                  fontWeight: '600'
                }}
                onClick={abrirConfirmacionRechazo} 
                disabled={loading}
              >
                Rechazar
              </Button>
              <Button 
                style={{ 
                  backgroundColor: 'white', 
                  borderColor: '#3fbb34',
                  color: '#3fbb34',
                  borderWidth: '2px',
                  fontWeight: '600'
                }}
                onClick={abrirConfirmacionAprobacion} 
                disabled={loading}
              >
                Aprobar
              </Button>
            </>
          ) : espacio.est_soli === 'Aprobado' ? (
            <Button 
              style={{ 
                backgroundColor: 'white', 
                borderColor: '#3fbb34',
                color: '#3fbb34',
                borderWidth: '2px',
                fontWeight: '600'
              }}
              onClick={abrirConfirmacionFinalizacion} 
              disabled={loading}
            >
              Finalizar
            </Button>
          ) : (
            <Button variant="secondary" onClick={onHide}>
              Cerrar
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmación Aprobación */}
      <Modal show={mostrarConfirmacion} onHide={cerrarConfirmacion} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Aprobación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea aprobar esta solicitud de espacio?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarConfirmacion}>
            Cancelar
          </Button>
          <Button 
            style={{ backgroundColor: '#3fbb34', borderColor: '#3fbb34' }}
            onClick={confirmarAprobacion} 
            disabled={loading}
          >
            {loading ? 'Aprobando...' : 'Confirmar'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmación Rechazo */}
      <Modal show={mostrarConfirmacionRechazo} onHide={cerrarConfirmacionRechazo} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Rechazo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea rechazar esta solicitud de espacio?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarConfirmacionRechazo}>
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmarRechazo} 
            disabled={loading}
          >
            {loading ? 'Rechazando...' : 'Confirmar'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmación Finalización */}
      <Modal show={mostrarConfirmacionFinalizacion} onHide={cerrarConfirmacionFinalizacion} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Finalización</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea finalizar esta solicitud de espacio?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarConfirmacionFinalizacion}>
            Cancelar
          </Button>
          <Button 
            style={{ backgroundColor: '#3fbb34', borderColor: '#3fbb34' }}
            onClick={confirmarFinalizacion} 
            disabled={loading}
          >
            {loading ? 'Finalizando...' : 'Confirmar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalEspacios;
