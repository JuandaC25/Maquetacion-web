

import React, { useState, useEffect } from 'react';
import Footer from '../../Footer/Footer';
import HeaderTecnicoUnificado from '../HeaderTecnicoUnificado';
import '../informacion_de_equipos/Info_equipos_tec.css';
import { authorizedFetch } from '../../../api/http';
import ModalPrestamo from './Modal_Prestamos/ModalPrestamo';

function PrestamosActivos() {
  const [categorias, setCategorias] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [elementos, setElementos] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [allSubcategorias, setAllSubcategorias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [subcategoriaFiltro, setSubcategoriaFiltro] = useState('');
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
      console.log("Primer préstamo estructura:", JSON.stringify(prestamosFiltrados[0], null, 2));

      const resElementos = await authorizedFetch('/api/elementos');
      const dataElementos = await resElementos.json();
      console.log("Elementos cargados:", dataElementos);
      console.log("Primer elemento estructura:", JSON.stringify(dataElementos[0], null, 2));
      setElementos(dataElementos);
      
      // Mapear préstamos para asignar categoría/subcategoría desde el elemento relacionado
      const elementosMap = {};
      (dataElementos || []).forEach(el => { elementosMap[String(el.id_elemen ?? el.id ?? el.id_elemento)] = el; });

      const prestamosConInfo = prestamosFiltrados.map(prest => {
        const elementoId = String(prest.id_eleme ?? prest.id_elemen ?? prest.id_elemento ?? prest.id_eleme);
        const el = elementosMap[elementoId];
        return {
          ...prest,
          categoria: el ? (el.tip_catg || el.nom_cat || el.nombre || '') : (prest.nom_cat || prest.categoria || ''),
          categoriaId: el ? (el.id_categ ?? el.id_cat ?? el.id_categoria ?? null) : (prest.id_categ || prest.id_cat || null),
          subcategoria: el ? (el.sub_catg || el.nom_subcateg || el.nom_subc || '') : (prest.nom_subcateg || prest.subcat || ''),
          subcategoriaId: el ? (el.id_subcat ?? el.id_subcategoria ?? null) : (prest.id_subcat || null)
        };
      });

      setPrestamos(prestamosConInfo);

      // Extraer categorías y subcategorías únicas desde los elementos
      const cats = [];
      const subs = [];
      (dataElementos || []).forEach(el => {
        const catId = el.id_categ ?? el.id_cat ?? el.id_categoria ?? null;
        const catName = el.tip_catg || el.nom_cat || el.nombre || null;
        if (catId && !cats.some(c => String(c.id) === String(catId))) cats.push({ id: catId, nombre: catName });

        const subId = el.id_subcat ?? el.id_subcategoria ?? null;
        const subName = el.sub_catg || el.nom_subcateg || el.nombre || null;
        if (subId && !subs.some(s => String(s.id) === String(subId))) subs.push({ id: subId, nombre: subName, id_cat: catId });
      });
      console.log('Categorías extraídas:', cats);
      console.log('Subcategorías extraídas:', subs);
      setCategorias(cats);
      setSubcategorias(subs);
      setAllSubcategorias(subs);
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
  useEffect(() => setPaginaActual(1), [subcategoriaFiltro]);

  const prestamosArray = Array.isArray(prestamos) ? prestamos : [];
  const prestamosConCategoria = prestamosArray.map(p => {
    return { 
      ...p,
      categoria: p.categoria || p.nom_cat || p.tipo_pres || 'Sin categoría',
      categoriaId: p.categoriaId || p.id_categ || p.id_cat || null,
      subcategoria: p.subcategoria || p.nom_subcateg || '',
      subcategoriaId: p.subcategoriaId || p.id_subcat || null,
      nom_elem: p.nom_elem || ''
    };
  });

  const prestamosFiltrados = prestamosConCategoria.filter(eq => {
    // Filtrar por categoría/subcategoría usando elementos asociados
    let cumpleCategoria = true;
    let cumpleSubcategoria = true;
    if (categoriaFiltro) {
      // Preferir comparar por categoriaId asignada al préstamo
      if (eq.categoriaId) {
        cumpleCategoria = String(eq.categoriaId) === String(categoriaFiltro);
      } else {
        // fallback: buscar por elemento asociado
        const matchingElementIds = (elementos || []).filter(el => String(el.id_categ ?? el.id_cat ?? el.id_categoria) === String(categoriaFiltro)).map(el => String(el.id_elemen ?? el.id));
        if (matchingElementIds.length > 0) {
          cumpleCategoria = matchingElementIds.includes(String(eq.id_eleme ?? eq.id_elemen ?? eq.id_elemento));
        } else {
          cumpleCategoria = eq.categoria ? String(eq.categoria).toLowerCase().includes(String(categoriaFiltro).toLowerCase()) : false;
        }
      }
    }
    if (subcategoriaFiltro) {
      if (eq.subcategoriaId) {
        cumpleSubcategoria = String(eq.subcategoriaId) === String(subcategoriaFiltro);
      } else {
        const matchingElementIdsSub = (elementos || []).filter(el => String(el.id_subcat ?? el.id_subcategoria ?? el.sub_catg) === String(subcategoriaFiltro)).map(el => String(el.id_elemen ?? el.id));
        if (matchingElementIdsSub.length > 0) {
          cumpleSubcategoria = matchingElementIdsSub.includes(String(eq.id_eleme ?? eq.id_elemen ?? eq.id_elemento));
        } else {
          cumpleSubcategoria = eq.subcategoria ? String(eq.subcategoria).toLowerCase().includes(String(subcategoriaFiltro).toLowerCase()) : true;
        }
      }
    }
    const cumpleMarca = busquedaMarca ? eq.nom_elem?.toLowerCase().includes(busquedaMarca.toLowerCase()) : true;
    const cumpleFecha =
      (!fechaInicio || new Date(eq.fecha_entreg) >= new Date(fechaInicio)) &&
      (!fechaFin || new Date(eq.fecha_entreg) <= new Date(fechaFin));
    return cumpleCategoria && cumpleSubcategoria && cumpleMarca && cumpleFecha;
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
      <HeaderTecnicoUnificado title="Préstamos Activos" />
      <main className="contenedor-principal-peq">
        <div className="barra-filtros">
          <select value={categoriaFiltro} onChange={e => { setCategoriaFiltro(e.target.value); setSubcategoriaFiltro(''); }}>
            <option value="">Todas</option>
            {categorias.map((cat) => <option key={String(cat.id)} value={cat.id}>{cat.nombre || cat.nombre}</option>)}
          </select>

          <select value={subcategoriaFiltro} onChange={e => setSubcategoriaFiltro(e.target.value)} style={{ marginLeft: '8px' }}>
            <option value="">Todas subcategorías</option>
            {(subcategorias || []).filter(s => !categoriaFiltro || String(s.id_cat) === String(categoriaFiltro)).map(s => (
              <option key={String(s.id)} value={s.id}>{s.nombre}</option>
            ))}
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
