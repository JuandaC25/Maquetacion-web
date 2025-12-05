

import React, { useState, useEffect } from 'react';
import Footer from '../../Footer/Footer';
import Header_soli_equi_tec from '../header_solicitudes_equ_tec/Header_soli_equi_tec.jsx';
import '../informacion_de_equipos/Info_equipos_tec.css';
import { authorizedFetch } from '../../../api/http';
import ModalPrestamo from './Modal_Prestamos/ModalPrestamo';

function PrestamosActivos() {
  const categorias = ['Portátiles', 'Televisores', 'Equipos de escritorio', 'Accesorios', 'Espacios'];
  const [prestamos, setPrestamos] = useState([]);
  const [elementos, setElementos] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [busquedaMarca, setBusquedaMarca] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);

  useEffect(() => {
    cargarPrestamos();
    cargarElementos();
  }, []);

  const cargarPrestamos = async () => {
    try {
      const response = await authorizedFetch('/api/prestamos/activos');
      const data = await response.json();
      const prestamosFiltrados = Array.isArray(data) ? data : [];
      setPrestamos(prestamosFiltrados);
      console.log("Préstamos cargados:", prestamosFiltrados);
    } catch (err) {
      console.error('Error al obtener préstamos activos:', err);
      setPrestamos([]);
    }
  };

  const cargarElementos = async () => {
    try {
      const response = await authorizedFetch('/api/elementos');
      const data = await response.json();
      setElementos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener elementos:', err);
      setElementos([]);
    }
  };

  useEffect(() => setPaginaActual(1), [categoriaFiltro, busquedaMarca, fechaInicio, fechaFin]);

  const prestamosArray = Array.isArray(prestamos) ? prestamos : [];
  const prestamosConCategoria = prestamosArray.map(p => {
    return { 
      ...p, 
      categoria: p.nom_cat || p.tipo_pres || 'Sin categoría',
      nom_elem: p.nom_elem || ''
    };
  });

  const prestamosFiltrados = prestamosConCategoria.filter(eq => {
    const cumpleCategoria = categoriaFiltro ? eq.categoria?.toLowerCase().includes(categoriaFiltro.toLowerCase()) : true;
    const cumpleMarca = busquedaMarca ? eq.nom_elem?.toLowerCase().includes(busquedaMarca.toLowerCase()) : true;
    const cumpleFecha =
      (!fechaInicio || new Date(eq.fecha_entreg) >= new Date(fechaInicio)) &&
      (!fechaFin || new Date(eq.fecha_entreg) <= new Date(fechaFin));
    return cumpleCategoria && cumpleMarca && cumpleFecha;
  });

  const itemsPorPagina = 8;
  const totalPaginas = Math.max(1, Math.ceil(prestamosFiltrados.length / itemsPorPagina));
  const itemsPagina = prestamosFiltrados.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  const irPagina = n => setPaginaActual(Math.min(Math.max(1, n), totalPaginas));

  const abrirModal = (prestamo) => {
    console.log("🔹 Abriendo modal con préstamo:", prestamo);
    setPrestamoSeleccionado(prestamo);
    setShowModal(true);
  };

  const cerrarModal = () => {
    console.log("❌ Cerrando modal");
    setShowModal(false);
    setPrestamoSeleccionado(null);
  };

  const alActualizar = async (idPrestamo) => {
    await cargarPrestamos();
  };

  const renderTarjetasEnFilas = () => {
    const filas = [];
    for (let i = 0; i < itemsPagina.length; i += 4) {
      const fila = itemsPagina.slice(i, i + 4);
      filas.push(
        <div className="recipiente" key={i}>
          {fila.map(prest => (
            <div className="cuadra1" key={prest.id_prest} style={{ cursor: 'pointer' }}>
              <div className="cuadra2">
                <div className="card-tipo">{prest.categoria}</div>
                <div className="card-modelo">{prest.nom_elem}</div>
                <div className="card-usuario">Usuario: {prest.nom_usu}</div>
                <div className="card-fecha">Fecha entrega: {new Date(prest.fecha_entreg).toLocaleString()}</div>
                <button 
                  onClick={() => abrirModal(prest)}
                  className="btn-abrir-prestamo"
                  style={{
                    margin: 'auto auto 0 auto',
                    padding: '2px 3px',
                    backgroundColor: 'rgb(9, 180, 26)',
                    color: 'white',
                    border: '3px solid rgb(9, 180, 26)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s',
                    lineHeight: '1',
                    width: '50%',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(6, 140, 20)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(9, 180, 26)'}
                >
                  Abrir
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return filas;
  };

  return (
    <>
      <Header_soli_equi_tec title="Préstamos Activos" />
      <main className="contenedor-principal-peq">
        <div className="barra-filtros">
          <select value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)}>
            <option value="">Todos</option>
            {categorias.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
          </select>

          <input
            type="text"
            placeholder="Buscar por marca..."
            value={busquedaMarca}
            onChange={e => setBusquedaMarca(e.target.value)}
          />

          <div className="rango-fechas">
            <label>Desde:</label>
            <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
            <label>Hasta:</label>
            <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
          </div>
        </div>

        {itemsPagina.length > 0 ? (
          renderTarjetasEnFilas()
        ) : (
          <p style={{ textAlign: 'center', marginTop: '20px', color: 'gray' }}>No hay préstamos activos.</p>
        )}

        <nav className="paginacion-peq" aria-label="Paginación">
          <button onClick={() => irPagina(paginaActual - 1)} disabled={paginaActual === 1}>← Anterior</button>
          <div className="numeros">
            {Array.from({ length: totalPaginas }).map((_, i) => (
              <button key={i} className={paginaActual === i + 1 ? 'activo' : ''} onClick={() => irPagina(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>
          <button onClick={() => irPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>Siguiente →</button>
        </nav>
      </main>

      <ModalPrestamo
        show={showModal}
        onHide={cerrarModal}
        prestamo={prestamoSeleccionado}
        onActualizado={alActualizar}
      />

      <Footer />
    </>
  );
}

export default PrestamosActivos;
