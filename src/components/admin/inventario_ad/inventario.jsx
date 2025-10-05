import React, { useState, useRef, useEffect } from "react";
import { Button, Alert, Dropdown, Modal, Form, InputGroup, Spinner } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import "./inventario.css";
import Footer from "../../Footer/Footer.jsx";
import HeaderInv from "../header_inv/header_inv.jsx";
import ElementosService from "../../../api/ElementosApi.js";

const EquipoItem = ({ elemento, onVerClick }) => (
  <div className="modern-equipment-card-xd01">
    <div className="card-top-section-xd02">
      <span className="equipment-category-xd06">{elemento.categoria}</span>
      <div className="icon-display-xd03">
        {elemento.categoria === "Portátil" ? (
          <img
            src={"/imagenes/portatil.png"}
            alt="Portátil"
            className="equipment-image-xd-img"
            style={{ width: "120px", height: "120px", objectFit: "contain" }}
          />
        ) : elemento.categoria === "Equipo de Escritorio" ? (
          <img
            src={"/imagenes/EscritorioMesa.png"}
            alt="Escritorio"
            className="equipment-image-xd-img"
            style={{ width: "120px", height: "120px", objectFit: "contain" }}
          />
        ) : elemento.categoria === "Televisor" ? (
          <img
            src={"/imagenes/Televisorr-solicitud.png"}
            alt="Televisor"
            className="equipment-image-xd-img"
            style={{ width: "120px", height: "120px", objectFit: "contain" }}
          />
        ) : (
          <span role="img" aria-label="equipo">💻</span>
        )}
      </div>
    </div>
    <div className="card-bottom-section-xd04">
      <h5 className="equipment-title-xd05">{elemento.nombre}</h5>
      <p className="equipment-serie-xd07">Serie: {elemento.serie}</p>
    </div>
    <button className="view-details-button-xd08" onClick={() => onVerClick(elemento)}>
      Ver Detalles
    </button>
  </div>
);

const ListaEquipos = ({ elementos, onVerClick, loading }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p>Cargando equipos...</p>
      </div>
    );
  }

  return (
    <div className="equipment-list-grid-xd09">
      {elementos.length > 0 ? (
        elementos.map((el, index) => (
          <EquipoItem key={index} elemento={el} onVerClick={onVerClick} />
        ))
      ) : (
        <p className="empty-list-message-xd10">No se encontraron equipos.</p>
      )}
    </div>
  );
};

const DetallesEquipoModal = ({ show, onHide, detalles, onEliminar, eliminando }) => {
  if (!detalles) return null;

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="modern-modal-dialog-xd11">
      <Modal.Header closeButton className="modern-modal-header-xd12">
        <Modal.Title className="modern-modal-title-xd13">Detalles del Equipo</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modern-modal-body-xd14">
        <div className="detail-item-xd15">
          <label className="detail-label-xd16">Nombre:</label>
          <div className="detail-value-display-xd17">
            <Form.Control type="text" value={detalles.nombre} readOnly className="modern-form-control-xd18" />
          </div>
        </div>
        <div className="detail-item-xd15">
          <label className="detail-label-xd16">Categoría:</label>
          <div className="detail-value-display-xd17">
            <Form.Control type="text" value={detalles.categoria} readOnly className="modern-form-control-xd18" />
          </div>
        </div>
        <div className="detail-item-xd15">
          <label className="detail-label-xd16">Accesorios:</label>
          <div className="detail-value-display-xd17">
            <Form.Control type="text" value={detalles.accesorios} readOnly className="modern-form-control-xd18" />
          </div>
        </div>
        <div className="detail-item-xd15">
          <label className="detail-label-xd16">Número de serie:</label>
          <div className="detail-value-display-xd17">
            <Form.Control type="text" value={detalles.serie} readOnly className="modern-form-control-xd18" />
          </div>
        </div>
        <div className="detail-item-xd15">
          <label className="detail-label-xd16">Observaciones:</label>
          <div className="detail-value-display-xd17">
            <Form.Control as="textarea" rows={3} value={detalles.observaciones} readOnly className="modern-form-control-xd18" />
          </div>
        </div>
        <div className="detail-item-xd15">
          <label className="detail-label-xd16">Componentes:</label>
          <div className="detail-value-display-xd17">
            <Form.Control as="textarea" rows={3} value={detalles.componentes} readOnly className="modern-form-control-xd18" />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="modern-modal-footer-xd19">
        <Button 
          variant="danger" 
          onClick={() => onEliminar(detalles.id)} 
          disabled={eliminando}
          className="modal-action-button-xd20 delete-action-xd21"
        >
          {eliminando ? <Spinner animation="border" size="sm" /> : "Eliminar"}
        </Button>
        <Button variant="secondary" onClick={onHide} className="modal-action-button-xd20 close-action-xd22">
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const NuevoEquipoModal = ({ show, onHide, nuevoEquipo, onChange, onSubmit, guardando }) => (
  <Modal show={show} onHide={onHide} centered dialogClassName="modern-modal-dialog-xd11">
    <Modal.Header closeButton className="modern-modal-header-xd12">
      <Modal.Title className="modern-modal-title-xd13">Añadir Nuevo Equipo</Modal.Title>
    </Modal.Header>
    <Modal.Body className="modern-modal-body-xd14">
      <div className="detail-item-xd15">
        <label className="detail-label-xd16">Nombre del elemento:</label>
        <div className="detail-value-display-xd17">
          <Form.Control
            type="text"
            id="nombre"
            value={nuevoEquipo.nombre}
            onChange={onChange}
            placeholder="Ej. Laptop Dell XPS 15"
            className="modern-form-control-xd18"
          />
        </div>
      </div>
      <div className="detail-item-xd15">
        <label className="detail-label-xd16">Categoría:</label>
        <div className="detail-value-display-xd17">
          <Form.Select
            id="categoria"
            value={nuevoEquipo.categoria}
            onChange={onChange}
            className="modern-form-control-xd18"
          >
            <option value="">Seleccionar...</option>
            <option>Portátil</option>
            <option>Equipo de Escritorio</option>
            <option>Televisor</option>
          </Form.Select>
        </div>
      </div>
      <div className="detail-item-xd15">
        <label className="detail-label-xd16">Accesorios:</label>
        <div className="detail-value-display-xd17">
          <Form.Control
            type="text"
            id="accesorios"
            value={nuevoEquipo.accesorios}
            onChange={onChange}
            placeholder="Ej. Cargador, Mouse inalámbrico"
            className="modern-form-control-xd18"
          />
        </div>
      </div>
      <div className="detail-item-xd15">
        <label className="detail-label-xd16">Número de serie:</label>
        <div className="detail-value-display-xd17">
          <Form.Control
            type="text"
            id="serie"
            value={nuevoEquipo.serie}
            onChange={onChange}
            placeholder="Ej. ABC123XYZ789"
            className="modern-form-control-xd18"
          />
        </div>
      </div>
      <div className="detail-item-xd15">
        <label className="detail-label-xd16">Observaciones:</label>
        <div className="detail-value-display-xd17">
          <Form.Control
            as="textarea"
            rows={3}
            id="observaciones"
            value={nuevoEquipo.observaciones}
            onChange={onChange}
            placeholder="Cualquier nota adicional sobre el equipo..."
            className="modern-form-control-xd18"
          />
        </div>
      </div>
      <div className="detail-item-xd15">
        <label className="detail-label-xd16">Componentes:</label>
        <div className="detail-value-display-xd17">
          <Form.Control
            as="textarea"
            rows={3}
            id="componentes"
            value={nuevoEquipo.componentes}
            onChange={onChange}
            placeholder="Características del equipo, especificaciones técnicas..."
            className="modern-form-control-xd18"
          />
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer className="modern-modal-footer-xd19">
      <Button variant="secondary" onClick={onHide} className="modal-action-button-xd20 cancel-action-xd23">
        Cancelar
      </Button>
      <Button 
        variant="success" 
        onClick={onSubmit} 
        disabled={guardando}
        className="modal-action-button-xd20 add-action-xd24"
      >
        {guardando ? <Spinner animation="border" size="sm" /> : "Añadir Equipo"}
      </Button>
    </Modal.Footer>
  </Modal>
);

const Admin = () => {
  const [elementosInventario, setElementosInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState(null);

  const allowedCategories = ["Portátil", "Equipo de Escritorio", "Televisor"];
  
  const [showDetalles, setShowDetalles] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [showNuevo, setShowNuevo] = useState(false);
  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: "",
    categoria: "", 
    accesorios: "", 
    serie: "", 
    observaciones: "",
    componentes: ""
  });
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("Todas las Categorías");
  const [searchTerm, setSearchTerm] = useState("");

  const bottomRef = useRef(null);

  // Cargar elementos al iniciar
  useEffect(() => {
    cargarElementos();
  }, []);

  const cargarElementos = async () => {
    try {
      setLoading(true);
      setError(null);
      const elementos = await ElementosService.obtenerElementos();
      setElementosInventario(elementos);
    } catch (error) {
      console.error('Error al cargar elementos:', error);
      setError('Error al cargar los elementos del inventario');
    } finally {
      setLoading(false);
    }
  };

  const openDetalles = async (equipo) => {
    try {
      // Obtener detalles completos del elemento por ID
      const detallesCompletos = await ElementosService.obtenerPorId(equipo.id);
      setEquipoSeleccionado(detallesCompletos);
      setShowDetalles(true);
    } catch (error) {
      console.error('Error al obtener detalles:', error);
      setError('Error al cargar los detalles del equipo');
    }
  };

  const closeDetalles = () => {
    setShowDetalles(false);
    setEquipoSeleccionado(null);
  };

  const eliminarEquipo = async (id) => {
    const isConfirmed = window.confirm(`¿Estás seguro de que quieres eliminar este equipo?`);
    if (!isConfirmed) return;

    try {
      setEliminando(true);
      await ElementosService.eliminarElemento(id);
      
      // Actualizar la lista local
      setElementosInventario(prev => prev.filter(e => e.id !== id));
      closeDetalles();
      
      // Mostrar mensaje de éxito
      alert('Equipo eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar equipo:', error);
      setError('Error al eliminar el equipo');
    } finally {
      setEliminando(false);
    }
  };

  const openNuevo = () => setShowNuevo(true);
  
  const closeNuevo = () => {
    setShowNuevo(false);
    setNuevoEquipo({ 
      nombre: "", 
      categoria: "", 
      accesorios: "", 
      serie: "", 
      observaciones: "",
      componentes: "" 
    });
  };

  const handleNuevoChange = (e) => {
    const { id, value } = e.target;
    setNuevoEquipo((prev) => ({ ...prev, [id]: value }));
  };

  const submitNuevo = async () => {
    // Validaciones
    if (!nuevoEquipo.nombre || !nuevoEquipo.categoria || !nuevoEquipo.serie) {
      alert("Por favor, completa los campos obligatorios: Nombre, Categoría y Número de serie.");
      return;
    }

    try {
      setGuardando(true);
      
      // Crear el elemento en la API
      const elementoCreado = await ElementosService.crearElemento(nuevoEquipo);
      
      // Actualizar la lista local
      setElementosInventario(prev => [...prev, elementoCreado]);
      
      closeNuevo();
      
      // Mostrar mensaje de éxito
      alert('Equipo añadido correctamente');
      
    } catch (error) {
      console.error('Error al crear equipo:', error);
      
      // Mostrar mensaje de error específico
      if (error.message.includes('el elemento ya existe')) {
        alert('Error: Ya existe un equipo con ese número de serie');
      } else {
        alert('Error al crear el equipo: ' + error.message);
      }
    } finally {
      setGuardando(false);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategoryFilter(category);
    setSearchTerm(""); 
    
    // En una implementación real, aquí harías una llamada a la API
    // Por ahora filtramos localmente
    let filteredElements = elementosInventario;
    
    if (category !== "Todas las Categorías") {
      filteredElements = filteredElements.filter(item => item.categoria === category);
    }
    
    // En una implementación completa, aquí llamarías a la API con los filtros
    setElementosInventario(filteredElements);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // En una implementación real, aquí harías una llamada a la API
    // Por ahora filtramos localmente
    let filteredElements = elementosInventario;

    if (selectedCategoryFilter !== "Todas las Categorías") {
      filteredElements = filteredElements.filter(item => item.categoria === selectedCategoryFilter);
    }

    filteredElements = filteredElements.filter(item => 
      item.serie.toLowerCase().includes(term.toLowerCase())
    );
    
    setElementosInventario(filteredElements);
  };

  // Filtrar elementos basado en categoría y búsqueda
  const elementosFiltrados = elementosInventario.filter(elemento => {
    const coincideCategoria = selectedCategoryFilter === "Todas las Categorías" || 
                             elemento.categoria === selectedCategoryFilter;
    const coincideBusqueda = searchTerm === "" || 
                           elemento.serie.toLowerCase().includes(searchTerm.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [elementosInventario]);

  return (
    <div className="inventory-app-container-xd25">
      <HeaderInv />
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Alert variant="info" className="inventory-header-bar-xd26">
        <div className="header-bar-content-xd27">
          <div className="header-left-section-xd28">
            <h1 className="inventory-main-title-xd29">Inventario de Equipos</h1>
            <div className="filters-row-xd30">
              <Dropdown className="category-filter-dropdown-xd31">
                <Dropdown.Toggle variant="light" id="dropdown-category">
                  {selectedCategoryFilter} <span className="dropdown-arrow-xd32">▼</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="category-dropdown-menu-xd33">
                  <Dropdown.Item onClick={() => handleCategoryFilter("Todas las Categorías")}>Todas las Categorías</Dropdown.Item>
                  {allowedCategories.map((category) => (
                    <Dropdown.Item key={category} onClick={() => handleCategoryFilter(category)}>
                      {category}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              
              <InputGroup className="search-bar-xd34">
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar por número de serie..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </InputGroup>
            </div>
          </div>
          <Button className="add-new-equipment-button-xd35" onClick={openNuevo}>
            <span role="img" aria-label="añadir">➕</span> Añadir Equipo
          </Button>
        </div>
      </Alert>
      
      <ListaEquipos 
        elementos={elementosFiltrados} 
        onVerClick={openDetalles} 
        loading={loading}
      />
      
      <div ref={bottomRef} />
      
      <div className="pagination-1215-xd36">
        <div className="pagination-inner-1216-xd37">
          <label>
            <input value="1" name="value-radio" id="value-1" type="radio" defaultChecked />
            <span>1</span>
          </label>
          <label>
            <input value="2" name="value-radio" id="value-2" type="radio" />
            <span>2</span>
          </label>
          <label>
            <input value="3" name="value-radio" id="value-3" type="radio" />
            <span>3</span>
          </label>
          <span className="selection-1217-xd38"></span>
        </div>
      </div>

      <DetallesEquipoModal 
        show={showDetalles} 
        onHide={closeDetalles} 
        detalles={equipoSeleccionado} 
        onEliminar={eliminarEquipo}
        eliminando={eliminando}
      />
      
      <NuevoEquipoModal 
        show={showNuevo} 
        onHide={closeNuevo} 
        nuevoEquipo={nuevoEquipo} 
        onChange={handleNuevoChange} 
        onSubmit={submitNuevo}
        guardando={guardando}
      />
      
      <Footer />
    </div>
  );
};

export default Admin;