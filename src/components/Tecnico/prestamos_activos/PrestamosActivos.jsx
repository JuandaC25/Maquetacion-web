

import React, { useState, useEffect } from 'react';
import Footer from '../../Footer/Footer';
import Button from 'react-bootstrap/Button';
import HeaderPrestamosActivos from './header_prestamos_activos.jsx';
import '../informacion_de_equipos/Info_equipos_tec.css';

function PrestamosActivos() {
  const categorias = ['Portátiles', 'Televisores', 'Equipos de escritorio', 'Accesorios', 'Espacios'];
  const [prestamos, setPrestamos] = useState([]);
  const [elementos, setElementos] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [busquedaMarca, setBusquedaMarca] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    fetch('http://localhost:8081/api/prestamos/activos')
      .then(res => res.json())
      .then(data => setPrestamos(data))
      .catch(err => console.error('Error al obtener préstamos activos:', err));

    fetch('http://localhost:8081/api/elementos')
      .then(res => res.json())
      .then(data => setElementos(data))
      .catch(err => console.error('Error al obtener elementos:', err));
  }, []);

  useEffect(() => setPaginaActual(1), [categoriaFiltro, busquedaMarca, fechaInicio, fechaFin]);

  const prestamosArray = Array.isArray(prestamos) ? prestamos : [];
  const prestamosConCategoria = prestamosArray.map(p => {
    const elemento = elementos.find(e => e.id_elemen === p.id_eleme);
    return { ...p, categoria: elemento ? elemento.tip_catg : 'Sin categoría', nom_elem: elemento ? elemento.nom_elemento : '' };
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

  const renderTarjetasEnFilas = () => {
    const filas = [];
    for (let i = 0; i < itemsPagina.length; i += 4) {
      const fila = itemsPagina.slice(i, i + 4);
      filas.push(
        <div className="recipiente" key={i}>
          {fila.map(prest => (
            <div className="cuadra1" key={prest.id_prest}>
              <div className="cuadra2">
                <div className="card-tipo">{prest.categoria}</div>
                <div className="card-modelo">{prest.nom_elem}</div>
                <div className="card-usuario">Usuario: {prest.nom_usu}</div>
                <div className="card-fecha">Fecha entrega: {new Date(prest.fecha_entreg).toLocaleString()}</div>
                {/* Aquí puedes agregar más campos si lo deseas */}
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
      <HeaderPrestamosActivos />
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
      <Footer />
    </>
  );
}

export default PrestamosActivos;
