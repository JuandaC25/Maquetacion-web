import React, { useState, useEffect } from 'react';
import '../solicitudes_de_equipos/Soli_Equi_Tec.css';
import Footer from '../../Footer/Footer';
import Button from 'react-bootstrap/Button';
import ModalEspacios from './ModalEspacios/ModalEspacios';
import HeaderTecnicoUnificado from '../HeaderTecnicoUnificado';
import { authorizedFetch } from '../../../api/http';

export default function SoliEspaciosTec() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [busquedaEspacio, setBusquedaEspacio] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [estadoFiltro, setEstadoFiltro] = useState('');

  const [mostrarModal, setMostrarModal] = useState(false);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resSolicitudes = await authorizedFetch('/api/solicitudes');
        if (!resSolicitudes.ok) throw new Error(`Error ${resSolicitudes.status}`);
        const dataSolicitudes = await resSolicitudes.json();
        console.log('Solicitudes recibidas:', dataSolicitudes);

        // Normalizar campo de estado que puede venir como `est_soli`, `estadosoli` o `id_est_soli`
        const estadoNombreFromId = id => {
          const map = {1: 'Pendiente', 2: 'Aprobado', 3: 'Rechazado', 4: 'Cancelado', 5: 'En uso', 6: 'Finalizado'};
          return map[Number(id)] || '';
        };
        const getEstadoName = raw => {
          if (raw === null || typeof raw === 'undefined') return '';
          if (typeof raw === 'number' || (!isNaN(Number(raw)) && String(raw).trim() !== '')) {
            return estadoNombreFromId(raw);
          }
          return String(raw).trim();
        };

        // Mapear solicitudes para añadir `est_soli` legible (cadena)
        const normalizadas = Array.isArray(dataSolicitudes)
          ? dataSolicitudes.map(s => {
              const rawEstado = s.est_soli ?? s.estadosoli ?? s.id_est_soli ?? s.estadosoli;
              return { ...s, est_soli: getEstadoName(rawEstado) };
            })
          : [];

        const espacios = normalizadas.filter(sol => sol.id_espa !== null && sol.id_espa !== undefined && (sol.est_soli === 'Pendiente' || sol.est_soli === 'Aprobado'));

        setSolicitudes(espacios);
        
        setSolicitudes(espacios);
      } catch (err) {
        console.error('Error al obtener solicitudes de espacios:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => setPaginaActual(1), [busquedaEspacio, fechaInicio, fechaFin, estadoFiltro]);

  // Asegura que solicitudes sea siempre un array
  const solicitudesArray = Array.isArray(solicitudes) ? solicitudes : [];

  const espaciosFiltrados = solicitudesArray.filter(esp => {
    const cumpleBusqueda = busquedaEspacio 
      ? (esp.nom_espa?.toLowerCase().includes(busquedaEspacio.toLowerCase()) ||
         esp.nom_usu?.toLowerCase().includes(busquedaEspacio.toLowerCase()))
      : true;
    
    // comparar estadoFiltro soportando nombres e ids
    let cumpleEstado = true;
    if (estadoFiltro) {
      const raw = esp.est_soli;
      const filtroLower = String(estadoFiltro).trim().toLowerCase();
      if (typeof raw === 'number' || (!isNaN(Number(raw)) && String(raw).trim() !== '')) {
        const id = Number(raw);
        const map = {1: 'pendiente', 2: 'aprobado', 3: 'rechazado', 4: 'en uso', 5: 'finalizado'};
        cumpleEstado = map[id] === filtroLower;
      } else {
        cumpleEstado = String(raw || '').trim().toLowerCase() === filtroLower;
      }
    }
    
    const cumpleFecha =
      (!fechaInicio || new Date(esp.fecha_ini) >= new Date(fechaInicio)) &&
      (!fechaFin || new Date(esp.fecha_ini) <= new Date(fechaFin));
    
    return cumpleBusqueda && cumpleEstado && cumpleFecha;
  });

  const itemsPorPagina = 8;
  const totalPaginas = Math.max(1, Math.ceil(espaciosFiltrados.length / itemsPorPagina));
  const itemsPagina = espaciosFiltrados.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  const irPagina = n => setPaginaActual(Math.min(Math.max(1, n), totalPaginas));

  const abrirModal = espacio => {
    console.log('abrirModal - espacio:', espacio);
    setEspacioSeleccionado(espacio);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setEspacioSeleccionado(null);
    setMostrarModal(false);
  };

  const renderTarjetasEnFilas = () => {
    const filas = [];
    for (let i = 0; i < itemsPagina.length; i += 4) {
      const fila = itemsPagina.slice(i, i + 4);
      filas.push(
        <div className="recipiente" key={i}>
          {fila.map(espacio => (
            <div className="cuadra1" key={espacio.id_soli}>
              <div className="cuadra2">
                <div className="card-tipo">Espacio</div>
                <div className="card-modelo">{espacio.nom_espa}</div>
                <div className="card-usuario">Usuario: {espacio.nom_usu}</div>
                <div className="card-fecha">Fecha: {new Date(espacio.fecha_ini).toLocaleString()}</div>
                <div style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  backgroundColor: espacio.est_soli === 'Pendiente' ? '#fff3cd' : '#e8f5e9',
                  marginBottom: '8px'
                }}>
                  <span style={{ 
                    fontSize: '12px', 
                    color: espacio.est_soli === 'Pendiente' ? '#856404' : '#3fbb34',
                    fontWeight: '600'
                  }}>
                    Estado: {espacio.est_soli}
                  </span>
                </div>
                <div className="card-accion">
                  <Button className="botun" size="sm" onClick={() => abrirModal(espacio)}>
                    Ver
                  </Button>
                </div>
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
      <HeaderTecnicoUnificado title="Solicitudes de Espacios" />

      <main className="contenedor-principal-peq">
        <div className="barra-filtros">
          <select value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobado">Aprobado</option>
          </select>

          <input
            type="text"
            placeholder="Buscar por espacio o usuario..."
            value={busquedaEspacio}
            onChange={e => setBusquedaEspacio(e.target.value)}
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
          <p style={{ textAlign: 'center', marginTop: '20px', color: 'gray' }}>No hay solicitudes de espacios disponibles.</p>
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

      <ModalEspacios
        show={mostrarModal}
        onHide={cerrarModal}
        espacio={espacioSeleccionado}
      />

      <Footer />
    </>
  );
}
