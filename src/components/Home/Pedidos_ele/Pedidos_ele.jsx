import React, { useState, useEffect } from 'react';
import { obtenerAccesorios } from '../../../api/AccesoriosApi'; 
import './Pedidos_ele.css'; 
import Header_ad from '.././Pedidos_ele/Header_ele/Header_elemen.jsx';
import Footer from '../../Footer/Footer.jsx';

const obtenerImagenPorTipo = (nombre) => {

  //texto a minusculas para el buscado
  const nombreNormalizado = (nombre || '').toLowerCase();
  if (nombreNormalizado.includes('teclado')) {
    return 'imagenes/Imagenes_accesorios/Teclado_ejemplo.png'; 
  }
  if (nombreNormalizado.includes('mouse')) {
    return 'imagenes/Imagenes_accesorios/Mouse_ejemplo.png'; 
  }
  if (nombreNormalizado.includes('cable')) {
    return 'imagenes/Imagenes_accesorios/Cable_de_internet.png'; 
  }
  //por si no coincide con ninguna de las anteriores
  return 'images/imagenes_acce/accesorio_generico.png'; 
};


function ListadoAccesorios() {
const [accesorios, setAccesorios] = useState([]);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState(null);
const [terminoBusqueda, setTerminoBusqueda] = useState(''); 
useEffect(() => {
  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerAccesorios();
      setAccesorios(data || []); 
    } catch (err) {
      console.error("Fallo al cargar accesorios:", err);
      setError(err.message || "Error desconocido al obtener datos.");
    } finally {
      setCargando(false); 
    }
  };
  cargarDatos();
}, []);

const handleBusqueda = (event) => {
  setTerminoBusqueda(event.target.value);
};

const accesoriosFiltrados = accesorios.filter(accesorio => {
  const busqueda = terminoBusqueda.toLowerCase();
  const nombre = accesorio.nom_acces?.toLowerCase() || accesorio.nombre?.toLowerCase() || '';
  return nombre.includes(busqueda);
});


let contenidoPrincipal;
if (cargando) {
  contenidoPrincipal = (
      <div className="mensaje-estado">
          <h2>Cargando accesorios... ⏳</h2>
          <p>Recuperando datos.</p>
      </div>
  );
} else if (error) {
  contenidoPrincipal = (
      <div className="mensaje-estado error">
          <h2>Error al cargar datos 🚫</h2>
          <p>{error}</p>
      </div>
  );
} else if (!accesorios || accesorios.length === 0) {
  contenidoPrincipal = (
      <div className="mensaje-estado">
          <h2>No hay accesorios registrados 🤷‍♂️</h2>
          <p>Agrega el primer accesorio al inventario.</p>
      </div>
  );
} else if (accesoriosFiltrados.length === 0 && terminoBusqueda) {
//msg de la busqueda por si no existe coincidencia
    contenidoPrincipal = (
      <div className="mensaje-estado">
          <h2>No se encontraron resultados para la búsqueda 🔍</h2>
          <p>Intenta con otra palabra.</p>
      </div>
  );
} else {
  contenidoPrincipal = (
    <div className="accesorios-cards-container">
{accesoriosFiltrados.map((accesorio, index) => (
    <div key={accesorio.id_accesorio || index} className="accesorio-card">
        <div className="card-image-placeholder">
      <img 
        src={obtenerImagenPorTipo(accesorio.nom_acces || accesorio.nombre)} 
        alt={accesorio.nom_acces || 'Accesorio'} 
      />
  </div>
  <div className="card-details">
    <h3 className="card-title">
        {accesorio.nom_acces || accesorio.nombre || 'Sin Nombre'}
    </h3>
    <p className="card-info">
        <strong>ID:</strong> {accesorio.id_accesorio}
    </p>
    <p className="card-info">
        <strong>Serial:</strong> {accesorio.num_ser || accesorio.serial || 'N/A'}
    </p>
    <div className="card-actions">
      <button className="edit-btn" onClick={() => alert('Añadir ' + accesorio.id_accesorio)}>
          Añadir
      </button>
      <button className="delete-btn" onClick={() => alert('Eliminar ' + accesorio.id_accesorio)}>
          Eliminar
      </button>
    </div>
      </div>
        </div>
  ))}
    </div>
);
}
//comp principal
return (
<><Header_ad /> 
  <div className='cuer-inve'>
    <div className='Elementos_arriba'>
        <div className="Grupo_buscador">
  <input 
      type="text" 
      className="Cuadro_busc_port" 
      placeholder="Buscar por nombre o serial..."
      value={terminoBusqueda}
      onChange={handleBusqueda}
  />
  <svg className="btn_buscar" aria-hidden="true" viewBox="0 0 24 24">
      <g>
          <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
      </g>
</svg>
</div>
  <div className='Boton_campana'>
    <button className="Boton_campanita">
      <svg viewBox="0 0 448 512" className="Campanita"><path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></svg>
    </button>
  </div>
</div>
  <div className="page-container">
    <h1 className="page-title">Inventario de Accesorios</h1>
      {contenidoPrincipal}
  </div>
  <Footer />
</div>
</>
);
}

export default ListadoAccesorios;