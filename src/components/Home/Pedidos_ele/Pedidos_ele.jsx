import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'; 
import Modal from 'react-bootstrap/Modal'; 
import { obtenerAccesorios } from '../../../api/AccesoriosApi'; 
import './Pedidos_ele.css'; 
import Header_ad from '.././Pedidos_ele/Header_ele/Header_elemen.jsx';
import Footer from '../../Footer/Footer.jsx';
import RealizarSolicitudModal from '../Pedidos_port/Modal_solicitud.jsx';

const id_usuario = 1;

const obtenerImagenPorTipo = (nombre) => {
  const nombreNormalizado = (nombre || '').toLowerCase();
  if (nombreNormalizado.includes('teclado')) return 'imagenes/Imagenes_accesorios/Teclado_ejemplo.png'; 
  if (nombreNormalizado.includes('mouse')) return 'imagenes/Imagenes_accesorios/Mouse_ejemplo.png'; 
  if (nombreNormalizado.includes('cable')) return 'imagenes/Imagenes_accesorios/Cable_de_internet.png'; 
  return 'images/imagenes_acce/accesorio_generico.png'; 
};

const ELEMENTOS_POR_PAGINA = 6; 

function ListadoAccesorios() {
// Estados de datos y paginación
const [accesorios, setAccesorios] = useState([]);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState(null);
const [terminoBusqueda, setTerminoBusqueda] = useState(''); 
const [paginaActual, setPaginaActual] = useState(1);
const [accesoriosSeleccionados, setAccesoriosSeleccionados] = useState([]);
const [mostrarModalAccesorios, setMostrarModalAccesorios] = useState(false);
const [mostrarModalSolicitud, setMostrarModalSolicitud] = useState(false);
const handleCerrarModalAccesorios = () => setMostrarModalAccesorios(false);
const handleAbrirModalAccesorios = () => setMostrarModalAccesorios(true);
const handleAbrirModalSolicitud = () => {
  if (accesoriosSeleccionados.length > 0) {
    handleCerrarModalAccesorios(); 
    setMostrarModalSolicitud(true); 
  } else {
    alert('Debes seleccionar al menos un accesorio para realizar la solicitud.');
  }
};
const handleCerrarModalSolicitud = () => setMostrarModalSolicitud(false);

const handleSolicitudEnviada = () => {
  setAccesoriosSeleccionados([]);
  handleCerrarModalSolicitud(); 
};

const handleAnadir = (accesorio) => {
  // Evitar que el usuario agregue el mismo acce dos veces
  const accesorioNormalizado = {
    id: accesorio.id_accesorio || accesorio.serial,
    nombre: accesorio.nom_acces || accesorio.nombre,
    ...accesorio
  };
  
  const yaExiste = accesoriosSeleccionados.some(item => (item.id || item.id_accesorio || item.serial) === accesorioNormalizado.id);
  
  if (!yaExiste) {
    setAccesoriosSeleccionados([...accesoriosSeleccionados, accesorioNormalizado]);
  }
};

  //eliminar acce del modal y de la soli
const handleQuitar = (idParaQuitar) => {
  setAccesoriosSeleccionados(accesoriosSeleccionados.filter(item => 
    (item.id_accesorio || item.serial || item.id) !== idParaQuitar
  ));
};


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
  setPaginaActual(1); 
};

const accesoriosFiltrados = accesorios.filter(accesorio => {
  const busqueda = terminoBusqueda.toLowerCase();
  const nombre = accesorio.nom_acces?.toLowerCase() || accesorio.nombre?.toLowerCase() || '';
  return nombre.includes(busqueda);
});

//espacio para la paginacion, que se agregue una si se cumple el Elemetnos por pagina de 6
const totalPaginas = Math.ceil(accesoriosFiltrados.length / ELEMENTOS_POR_PAGINA);
const indiceInicio = (paginaActual - 1) * ELEMENTOS_POR_PAGINA;
const indiceFin = indiceInicio + ELEMENTOS_POR_PAGINA;
const accesoriosPaginados = accesoriosFiltrados.slice(indiceInicio, indiceFin);
const cambiarPagina = (numeroPagina) => {
if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
  setPaginaActual(numeroPagina);
}
};

const renderPaginacion = () => {
if (totalPaginas <= 1) return null; 
const numerosPagina = [];
for (let i = 1; i <= totalPaginas; i++) {
numerosPagina.push(
<button
  key={i}
  className={`boton_pagina ${i === paginaActual ? 'activo' : ''}`}
  onClick={() => cambiarPagina(i)}
>
  {i}
</button>
);
}

return (
<div className="contenedor_paginacion">
  <button className="boton_pagina" onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>
    {"<"}
  </button>
  {numerosPagina}
  <button className="boton_pagina" onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>{">"}
  </button>
</div>
);
};


let contenidoPrincipal;
if (cargando || error || !accesorios || accesorios.length === 0 || accesoriosFiltrados.length === 0 && terminoBusqueda) {
//logica de los msjs de estados
if (cargando) {
contenidoPrincipal = (
  <div className="mensaje_estado"><h2>Cargando accesorios... ⏳</h2><p>Recuperando datos.</p></div>
);
} else if (error) {
contenidoPrincipal = (
  <div className="mensaje_estado error"><h2>Error al cargar datos 🚫</h2><p>{error}</p></div>
);
} else if (!accesorios || accesorios.length === 0) {
contenidoPrincipal = (
  <div className="mensaje_estado"><h2>No hay accesorios registrados 🤷‍♂️</h2></div>
);
} else if (accesoriosFiltrados.length === 0 && terminoBusqueda) {
contenidoPrincipal = (
  <div className="mensaje_estado"><h2>No se encontraron resultados para la búsqueda 🔍</h2><p>Intenta con otra palabra.</p></div>
);
}
} else {
contenidoPrincipal = (
<div className="accesorios_cards_container">
{accesoriosPaginados.map((accesorio, index) => {
const idAccesorio = accesorio.id_accesorio || accesorio.serial;
//comprueba estados del acce para el estado del boton añadir
const estaSeleccionado = accesoriosSeleccionados.some(item => (item.id_accesorio || item.serial) === idAccesorio);
return (
<div key={idAccesorio || index} className="accesorio_card">
<div className="card_image_placeholder">
<img src={obtenerImagenPorTipo(accesorio.nom_acces || accesorio.nombre)} 
alt={accesorio.nom_acces || 'Accesorio'} /> </div>
<div className="card_details">
<h3 className="card_title"> {accesorio.nom_acces || accesorio.nombre || 'Sin Nombre'} </h3>
<p className="card_info"> <strong>ID:</strong> {accesorio.id_accesorio} </p>
<p className="card_info"><strong>Numero de serie:</strong> {accesorio.num_ser || accesorio.serial || 'N/A'} </p>
  <div className="card_actions">
  <button className="edit_btn" onClick={() => handleAnadir(accesorio)}disabled={estaSeleccionado} >{estaSeleccionado ? 'Añadido ✅' : 'Añadir'}
  </button>
  </div>
</div>
</div>
);
})}
</div>
); }

  // comp principal
return (
<>
<Header_ad /> 
<div className='cuer_inve'>
<div className='Elementos_arriba'>
<div className="Grupo_buscador">
  <input type="text" className="Cuadro_busc_port" placeholder="Buscar accesorio por nombre..." value={terminoBusqueda} onChange={handleBusqueda}/>
</div>
<div className='Boton_campana' onClick={handleAbrirModalAccesorios}>
<button className="Boton_campanita">
  <svg viewBox="0 0 448 512" className="Campanita"><path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></svg>
  {/* Contador de elementos para la campana */}
  {accesoriosSeleccionados.length > 0 && (
  <span className="contador_campana">{accesoriosSeleccionados.length}</span>
  )}
</button>
</div>
</div>

<div className="page_container">
<h1 className="page_title">Inventario de Accesorios</h1>
{contenidoPrincipal}
{renderPaginacion()} 
</div>
<Footer />
</div>

{/*Modal para mostrar los equipos seleccionados (CAMPANA) */}
<Modal show={mostrarModalAccesorios} onHide={handleCerrarModalAccesorios}>
<Modal.Header className='modal_header_Acce' closeButton>
<Modal.Title className='modal_title_Acce'>Accesorios Seleccionados ({accesoriosSeleccionados.length})</Modal.Title>
</Modal.Header>
<Modal.Body>
{accesoriosSeleccionados.length === 0 ? (
<p >Aún no has añadido ningún accesorio.</p>) : (
<ul className="lista_seleccionados">
{accesoriosSeleccionados.map(item => {
const idItem = item.id_accesorio || item.serial || item.id;
return (
<li key={idItem}>
  <span>{item.nom_acces || item.nombre || 'Sin Nombre'}</span>
  <Button variant="danger" size="sm" onClick={() => handleQuitar(idItem)}>
  Quitar
  </Button>
  </li>
);
})}
</ul>
)}
</Modal.Body>
<Modal.Footer>
<Button className='btn_cerrar_mdl_ele' variant="secondary" onClick={handleCerrarModalAccesorios}> Cerrar </Button>
<Button 
  className='Btn_add_acce_modal' 
  variant="primary" 
  onClick={handleAbrirModalSolicitud}
  disabled={accesoriosSeleccionados.length === 0}
>
  Confirmar solicitud
</Button>
</Modal.Footer>
</Modal>
<RealizarSolicitudModal
  show={mostrarModalSolicitud}
  handleClose={handleCerrarModalSolicitud}
  equiposSeleccionados={accesoriosSeleccionados}
  onSolicitudEnviada={handleSolicitudEnviada} 
  idUsuario={id_usuario}
/>
</>
);
}

export default ListadoAccesorios;