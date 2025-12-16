import React, { useState } from 'react';
import './ModalTec1.css';
import ConfirmacionModal from '../../Modal_Confriamcion/ConfirmacionModal';
import ModalAsignarElemento from './ModalAsignarElemento';
import { authorizedFetch } from '../../../../../api/http';

function ModalFormulario({ show, onHide, prest, onActualizado }) {
  const [loading, setLoading] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarConfirmacionRechazo, setMostrarConfirmacionRechazo] = useState(false);
  const [mostrarModalAsignar, setMostrarModalAsignar] = useState(false);

  if (!show || !prest) return null;

  console.log('ModalFormulario - Solicitud abierta:', prest.nom_elem, 'Categoría:', prest.nom_cat, 'Subcategoría:', prest.nom_subcat);

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


  const abrirConfirmacion = () => {
    console.log('Click en Aprobar - abriendo modal de asignar');
    setMostrarModalAsignar(true);
  };
  const cerrarModalAsignar = () => {
    console.log('Cerrando modal de asignar');
    setMostrarModalAsignar(false);
  };
  
  const cerrarConfirmacion = () => setMostrarConfirmacion(false);
  
  const abrirConfirmacionRechazo = () => setMostrarConfirmacionRechazo(true);
  const cerrarConfirmacionRechazo = () => setMostrarConfirmacionRechazo(false);

  const confirmarConElementoAsignado = async (elementosSeleccionados) => {
    cerrarModalAsignar();
    // Guardar los elementos seleccionados como array de objetos {id, cantidad}
    prest.elementos_asignados = elementosSeleccionados;
    console.log('Elementos asignados:', elementosSeleccionados);
    setMostrarConfirmacion(true);
  };


  const confirmarFinalizacion = async () => {
    cerrarConfirmacion();
    setLoading(true);

    try {
      console.log("🔹 Finalizando solicitud:", prest.id_soli);
      console.log("🔹 Elementos asignados:", prest.elementos_asignados);
      
      // Obtener el usuario actual desde localStorage
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      const id_tecnico = usuario.id;
      const nombre_tecnico = usuario.nombre || usuario.name || 'Técnico';
      
      // Construir array de IDs de elementos
      const idsElem = [];
      if (prest.elementos_asignados && Array.isArray(prest.elementos_asignados)) {
        prest.elementos_asignados.forEach(item => {
          // Agregar el ID de elemento 'cantidad' veces
          for (let i = 0; i < item.cantidad; i++) {
            idsElem.push(item.id);
          }
        });
      }
      
      console.log("🔹 IDs de elementos a enviar:", idsElem);
      
      const payload = { 
        id_soli: prest.id_soli, 
        id_est_soli: 2,
        ids_elem: idsElem,  // ← AGREGAR ELEMENTOS
        id_tecnico: id_tecnico,  // ← AGREGAR ID TÉCNICO
        nombre_tecnico: nombre_tecnico  // ← AGREGAR NOMBRE TÉCNICO
      };
      console.log("📤 Payload enviado al backend:", JSON.stringify(payload));

      const updateResponse = await authorizedFetch(`/api/solicitudes/${prest.id_soli}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!updateResponse.ok) throw new Error('Error al actualizar el estado de la solicitud');
      console.log("✅ Solicitud aprobada correctamente");
      alert("Solicitud aprobada exitosamente");

      onActualizado && onActualizado(prest.id_soli);
      onHide();
    } catch (error) {
      console.error("❌ Error al finalizar:", error);
      alert("Ocurrió un error al aprobar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const confirmarRechazo = async () => {
    cerrarConfirmacionRechazo();
    setLoading(true);

    try {
      console.log("🔹 Rechazando solicitud:", prest.id_soli);

      const updateResponse = await authorizedFetch(`/api/solicitudes/${prest.id_soli}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_soli: prest.id_soli, id_est_soli: 3 }),
      });

      if (!updateResponse.ok) throw new Error('Error al rechazar la solicitud');
      console.log("✅ Solicitud rechazada correctamente");

      alert("Solicitud rechazada");

      onActualizado && onActualizado(prest.id_soli);
      onHide();
    } catch (error) {
      console.error("❌ Error al rechazar:", error);
      alert("Ocurrió un error al rechazar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onHide}></div>
      <div className="principe">
        <div className="cabeza">
          <h1 className="titulito">Detalle de solicitud</h1>
          <button className="close-btn" onClick={onHide}>×</button>
        </div>

        <div className="cuerpito">
          <div className="cont_mod_tec1">
            <div className="Cont_label_tec">
              <label className="origin">Nombre usuario:</label>
              <input type="text" className="tecito" disabled value={prest.nom_usu ?? ''} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Fecha de inicio:</label>
              <input type="text" className="tecito" disabled value={formatDate(prest.fecha_ini)} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Fecha de fin:</label>
              <input type="text" className="tecito" disabled value={formatDate(prest.fecha_fn)} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Ambiente:</label>
              <input type="text" className="tecito" disabled value={prest.ambient ?? ''} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Número de ficha:</label>
              <input type="text" className="tecito" disabled value={prest.num_fich ?? ''} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Categoría:</label>
              <input type="text" className="tecito" disabled value={prest.nom_cat ?? ''} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Subcategoría:</label>
              <input type="text" className="tecito" disabled value={prest.nom_subcat ?? ''} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Cantidad solicitada:</label>
              <input type="text" className="tecito" disabled value={prest.cantid ?? ''} />
            </div>
          </div>
        </div>

        <div className="piecito">
          <button
            id="buttonModalTec"
            onClick={abrirConfirmacion}
            disabled={loading}
            style={{ minWidth: '110px', marginRight: '18px' }}
          >
            {loading ? 'Guardando...' : 'Aprobar'}
          </button>
          <button
            id="buttonModalTec"
            onClick={abrirConfirmacionRechazo}
            disabled={loading}
            style={{ minWidth: '110px' }}
          >
            Rechazar
          </button>
        </div>
      </div>

      <ConfirmacionModal
        show={mostrarConfirmacion}
        onHide={cerrarConfirmacion}
        onConfirm={confirmarFinalizacion}
        mensaje="¿Quieres aprobar este préstamo?"
      />

      <ConfirmacionModal
        show={mostrarConfirmacionRechazo}
        onHide={cerrarConfirmacionRechazo}
        onConfirm={confirmarRechazo}
        mensaje="¿Quieres rechazar esta solicitud?"
      />

      <ModalAsignarElemento
        show={mostrarModalAsignar}
        onHide={cerrarModalAsignar}
        prest={prest}
        onConfirm={confirmarConElementoAsignado}
      />
    </>
  );
}

export default ModalFormulario;
