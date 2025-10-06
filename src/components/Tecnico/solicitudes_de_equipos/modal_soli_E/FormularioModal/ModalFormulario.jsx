import React, { useState } from 'react';
import './ModalTec1.css';
import ConfirmacionModal from '../../Modal_Confriamcion/ConfirmacionModal';

function ModalFormulario({ show, onHide, prest, onActualizado }) {
  const [loading, setLoading] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  if (!show || !prest) return null;

  // ✅ Función para formatear fechas (mantiene tu formato original)
  const formatDate = (fecha) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // ✅ Abre y cierra el modal de confirmación
  const abrirConfirmacion = () => setMostrarConfirmacion(true);
  const cerrarConfirmacion = () => setMostrarConfirmacion(false);

  // ✅ Función principal: cambia estado y crea préstamo
  const confirmarFinalizacion = async () => {
    cerrarConfirmacion();
    setLoading(true);

    try {
      console.log("🔹 Datos de la solicitud recibidos:", prest);

      // 1️⃣ Cambiar estado de la solicitud a 1 (sin eliminarla)
      const updateResponse = await fetch(`http://localhost:8081/api/solicitudes/${prest.id_soli}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...prest, estado: 1 }),
      });

      if (!updateResponse.ok) throw new Error('Error al actualizar el estado de la solicitud');
      console.log("✅ Solicitud actualizada correctamente");

      // 2️⃣ Crear el registro de préstamo en el backend
      const postResponse = await fetch('http://localhost:8081/api/prestamos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha_entreg: prest.fecha_ini,
          fecha_repc: prest.fecha_fn,
          tipo_pres: "Elemento",
          id_usuario: prest.id_usu,
          id_elem: prest.id_elem,
          id_acces: prest.id_acces,
          id_esp: prest.id_espac
        }),
      });

      if (!postResponse.ok) throw new Error('Error al registrar el préstamo');

      console.log("✅ Préstamo creado correctamente");
      alert("Solicitud finalizada y registrada como préstamo");

      onActualizado && onActualizado(prest.id_soli);
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
      <div className="modal-overlay" onClick={onHide}></div>
      <div className="principe">
        <div className="cabeza">
          <h1 className="titulito">Detalle de solicitud</h1>
          <button className="close-btn" onClick={onHide}>×</button>
        </div>

        <div className="cuerpito">
          <div className="cont_mod_tec1">
            <div className="Cont_label_tec">
              <label className="origin">ID de solicitud:</label>
              <input type="text" className="tecito" disabled value={prest.id_soli ?? ''} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Nombre usuario:</label>
              <input type="text" className="tecito" disabled value={prest.nom_usu ?? ''} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Fecha de inicio:</label>
              <input type="date" className="tecito" disabled value={formatDate(prest.fecha_ini)} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Fecha de fin:</label>
              <input type="date" className="tecito" disabled value={formatDate(prest.fecha_fn)} />
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
              <label className="origin">Nombre elemento:</label>
              <input type="text" className="tecito" disabled value={prest.nom_elem ?? ''} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Nombre accesorio:</label>
              <input type="text" className="tecito" disabled value={prest.nom_acces ?? ''} />
            </div>
          </div>
        </div>

        <div className="piecito">
          <button
            id="buttonModalTec"
            onClick={abrirConfirmacion}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Finalizar'}
          </button>
        </div>
      </div>

      <ConfirmacionModal
        show={mostrarConfirmacion}
        onHide={cerrarConfirmacion}
        onConfirm={confirmarFinalizacion}
        mensaje="¿Deseas marcar esta solicitud como finalizada?"
      />
    </>
  );
}

export default ModalFormulario;
