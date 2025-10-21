import React, { useState } from 'react';
import './ModalTec1.css';
import ConfirmacionModal from '../../Modal_Confriamcion/ConfirmacionModal';

function ModalFormulario({ show, onHide, prest, onActualizado }) {
  const [loading, setLoading] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  if (!show || !prest) return null;

  const formatDate = (fecha) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };


  const abrirConfirmacion = () => setMostrarConfirmacion(true);
  const cerrarConfirmacion = () => setMostrarConfirmacion(false);


  const confirmarFinalizacion = async () => {
    cerrarConfirmacion();
    setLoading(true);

    try {
      console.log("🔹 Datos de la solicitud recibidos:", prest);

      const updateResponse = await fetch(`http://localhost:8081/api/solicitudes/${prest.id_soli}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_soli: prest.id_soli, id_est_soli: 1 }),
      });

      if (!updateResponse.ok) throw new Error('Error al actualizar el estado de la solicitud');
      console.log("✅ Solicitud actualizada correctamente");

      const idsElem = prest.id_elem
        ? (typeof prest.id_elem === 'string'
            ? prest.id_elem.split(',').map(Number)
            : [prest.id_elem])
        : [];
        // Buscar el campo correcto para idEsp
        const idEsp = prest.id_espac || prest.id_esp || prest.idEsp || null;
        const postResponse = await fetch('http://localhost:8081/api/prestamos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fechaEntreg: prest.fecha_ini,
            fechaRepc: prest.fecha_fn,
            tipoPres: "Elemento",
            estado: 1,
            idUsuario: prest.id_usu,
            idsElem: prest.id_elem
              ? (typeof prest.id_elem === 'string'
                  ? prest.id_elem.split(',').map(Number)
                  : [prest.id_elem])
              : [],
            idEsp
          }),
        });

        if (!postResponse.ok) {
          const errorData = await postResponse.json().catch(() => ({}));
          console.error("❌ Detalle del error backend:", errorData);
          alert("Error al registrar el préstamo:\n" + (errorData.mensaje || errorData.errores1 || errorData.errores2 || JSON.stringify(errorData)));
          throw new Error('Error al registrar el préstamo');
        }

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
            style={{ minWidth: '110px', marginRight: '18px' }}
          >
            {loading ? 'Guardando...' : 'Tomar'}
          </button>
          <button
            id="buttonModalTec"
            onClick={onHide}
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
        mensaje="¿Quieres realizar este préstamo?"
      />
    </>
  );
}

export default ModalFormulario;
