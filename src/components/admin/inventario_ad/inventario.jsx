import React, { useState, useRef, useEffect } from "react";
import { Button, Alert, Dropdown, Modal, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import "./inventario.css";
import Footer from "../../Footer/Footer.jsx";
import HeaderInv from "../header_inv/header_inv.jsx";

const EquipoItem = ({ elemento, onVerClick }) => (
  <div className="modern-equipment-card">
    <div className="card-content">
      <div className="icon-display">
        <span role="img" aria-label="computadora">💻</span>
      </div>
      <div className="equipment-info">
        <span className="equipment-title">{elemento.nombre}</span>
        <span className="equipment-category">{elemento.categoria}</span>
        <span className="equipment-serie">{elemento.serie}</span>
      </div>
      <button className="view-details-button" onClick={() => onVerClick(elemento)}>
        Ver Detalles
      </button>
    </div>
  </div>
);

const ListaEquipos = ({ elementos, onVerClick }) => (
  <div className="equipment-list-grid">
    {elementos.length > 0 ? (
      elementos.map((el, index) => (
        <EquipoItem key={index} elemento={el} onVerClick={onVerClick} />
      ))
    ) : (
      <p className="empty-list-message">No se encontraron equipos con ese número de serie.</p>
    )}
  </div>
);

const DetallesEquipoModal = ({ show, onHide, detalles, onEliminar }) => {
  if (!detalles) return null;

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="modern-modal-dialog">
      <Modal.Header closeButton className="modern-modal-header">
        <Modal.Title className="modern-modal-title">Detalles del Equipo</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modern-modal-body">
        <div className="detail-item">
          <label className="detail-label">Nombre:</label>
          <div className="detail-value-display">
            <Form.Control type="text" value={detalles.nombre} readOnly className="modern-form-control" />
          </div>
        </div>
        <div className="detail-item">
          <label className="detail-label">Categoría:</label>
          <div className="detail-value-display">
            <Form.Control type="text" value={detalles.categoria} readOnly className="modern-form-control" />
          </div>
        </div>
        <div className="detail-item">
          <label className="detail-label">Accesorios:</label>
          <div className="detail-value-display">
            <Form.Control type="text" value={detalles.accesorios} readOnly className="modern-form-control" />
          </div>
        </div>
        <div className="detail-item">
          <label className="detail-label">Número de serie:</label>
          <div className="detail-value-display">
            <Form.Control type="text" value={detalles.serie} readOnly className="modern-form-control" />
          </div>
        </div>
        <div className="detail-item">
          <label className="detail-label">Observaciones:</label>
          <div className="detail-value-display">
            <Form.Control as="textarea" rows={3} value={detalles.observaciones} readOnly className="modern-form-control" />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="modern-modal-footer">
        <Button variant="danger" onClick={() => onEliminar(detalles.nombre)} className="modal-action-button delete-action">
          Eliminar
        </Button>
        <Button variant="secondary" onClick={onHide} className="modal-action-button close-action">
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const NuevoEquipoModal = ({ show, onHide, nuevoEquipo, onChange, onSubmit }) => (
  <Modal show={show} onHide={onHide} centered dialogClassName="modern-modal-dialog">
    <Modal.Header closeButton className="modern-modal-header">
      <Modal.Title className="modern-modal-title">Añadir Nuevo Equipo</Modal.Title>
    </Modal.Header>
    <Modal.Body className="modern-modal-body">
      <div className="detail-item">
        <label className="detail-label">Nombre del elemento:</label>
        <div className="detail-value-display">
          <Form.Control
            type="text"
            id="nombre"
            value={nuevoEquipo.nombre}
            onChange={onChange}
            placeholder="Ej. Laptop Dell XPS 15"
            className="modern-form-control"
          />
        </div>
      </div>
      <div className="detail-item">
        <label className="detail-label">Categoría:</label>
        <div className="detail-value-display">
          <Form.Select
            id="categoria"
            value={nuevoEquipo.categoria}
            onChange={onChange}
            className="modern-form-control"
          >
            <option value="">Seleccionar...</option>
            <option>Portátil</option>
            <option>Equipo de Escritorio</option>
            <option>Televisor</option>
          </Form.Select>
        </div>
      </div>
      <div className="detail-item">
        <label className="detail-label">Accesorios:</label>
        <div className="detail-value-display">
          <Form.Control
            type="text"
            id="accesorios"
            value={nuevoEquipo.accesorios}
            onChange={onChange}
            placeholder="Ej. Cargador, Mouse inalámbrico"
            className="modern-form-control"
          />
        </div>
      </div>
      <div className="detail-item">
        <label className="detail-label">Número de serie:</label>
        <div className="detail-value-display">
          <Form.Control
            type="text"
            id="serie"
            value={nuevoEquipo.serie}
            onChange={onChange}
            placeholder="Ej. ABC123XYZ789"
            className="modern-form-control"
          />
        </div>
      </div>
      <div className="detail-item">
        <label className="detail-label">Observaciones:</label>
        <div className="detail-value-display">
          <Form.Control
            as="textarea"
            rows={3}
            id="observaciones"
            value={nuevoEquipo.observaciones}
            onChange={onChange}
            placeholder="Cualquier nota adicional sobre el equipo..."
            className="modern-form-control"
          />
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer className="modern-modal-footer">
      <Button variant="secondary" onClick={onHide} className="modal-action-button cancel-action">
        Cancelar
      </Button>
      <Button variant="success" onClick={onSubmit} className="modal-action-button add-action">
        Añadir Equipo
      </Button>
    </Modal.Footer>
  </Modal>
);

const Admin = () => {
  const [allElementosInventario] = useState([
    {
      nombre: "Laptop Dell Latitude 7420",
      categoria: "Portátil",
      accesorios: "Cargador, Mouse inalámbrico Logitech MX Master 3",
      serie: "DLT7420-ABCD-1234",
      observaciones: "Asignado al departamento de IT. Batería con 85% de capacidad."
    },
    {
      nombre: "PC de Escritorio HP EliteDesk 800 G6",
      categoria: "Equipo de Escritorio",
      accesorios: "Teclado, Mouse, Monitor HP E24 G4",
      serie: "HPE800G6-EFGH-5678",
      observaciones: "Ubicado en la oficina 305. Procesador Intel i7."
    },
    {
      nombre: "Televisor Samsung Smart TV 55 Pulgadas",
      categoria: "Televisor",
      accesorios: "Control remoto, Cable de poder",
      serie: "SAMSG55-TV-001",
      observaciones: "Ubicado en la sala de reuniones principal."
    },
    {
      nombre: "Impresora Multifuncional Epson EcoTank L3150",
      categoria: "Equipo de Escritorio", 
      accesorios: "Cable de poder, Cable USB",
      serie: "ETL3150-IJKL-9012",
      observaciones: "Color, con sistema de tanque de tinta. Ideal para alto volumen."
    },
    {
      nombre: "Monitor LG UltraWide 29UM69G-B",
      categoria: "Televisor", 
      accesorios: "Cable HDMI, Cable de poder",
      serie: "LG29UM-MNOP-3456",
      observaciones: "Monitor de 29 pulgadas, ideal para diseño gráfico."
    },
    {
      nombre: "Proyector Epson PowerLite 1780W",
      categoria: "Portátil", 
      accesorios: "Control remoto, Cable HDMI, Estuche de transporte",
      serie: "EP1780W-QRST-7890",
      observaciones: "Portátil, para presentaciones en salas de reuniones pequeñas."
    },
    {
      nombre: "Servidor Dell PowerEdge R640",
      categoria: "Equipo de Escritorio", 
      accesorios: "Cables de red, Rieles para rack",
      serie: "DPR640-UVWX-1122",
      observaciones: "Ubicado en el centro de datos. 64GB RAM, 2TB SSD."
    },
    {
      nombre: "Teléfono IP Cisco SPA504G",
      categoria: "Portátil",
      accesorios: "Cable Ethernet, Base de soporte",
      serie: "CSISPA504G-YZAB-3344",
      observaciones: "Teléfono de oficina con 4 líneas programables."
    },
    {
      nombre: "Disco Duro Externo Seagate Expansion 4TB",
      categoria: "Portátil",
      accesorios: "Cable USB 3.0",
      serie: "SGEXP4TB-CDEF-5566",
      observaciones: "Utilizado para copias de seguridad de datos críticos."
    }
  ]);

  const allowedCategories = ["Portátil", "Equipo de Escritorio", "Televisor"];
  const [elementosInventario, setElementosInventario] = useState(allElementosInventario);

  const [showDetalles, setShowDetalles] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [showNuevo, setShowNuevo] = useState(false);
  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: "", categoria: "", accesorios: "", serie: "", observaciones: ""
  });
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("Todas las Categorías");
  const [searchTerm, setSearchTerm] = useState("");

  const bottomRef = useRef(null);

  const openDetalles = (equipo) => {
    setEquipoSeleccionado(equipo);
    setShowDetalles(true);
  };

  const closeDetalles = () => {
    setShowDetalles(false);
    setEquipoSeleccionado(null);
  };

  const eliminarEquipo = (nombre) => {
    const isConfirmed = window.confirm(`¿Estás seguro de que quieres eliminar el equipo "${nombre}"?`);
    if (isConfirmed) {
      const updatedElements = allElementosInventario.filter((e) => e.nombre !== nombre);
      setElementosInventario(updatedElements);
      closeDetalles();
    }
  };

  const openNuevo = () => setShowNuevo(true);
  const closeNuevo = () => {
    setShowNuevo(false);
    setNuevoEquipo({ nombre: "", categoria: "", accesorios: "", serie: "", observaciones: "" });
  };

  const handleNuevoChange = (e) => {
    const { id, value } = e.target;
    setNuevoEquipo((prev) => ({ ...prev, [id]: value }));
  };

  const submitNuevo = () => {
    if (!nuevoEquipo.nombre || !nuevoEquipo.categoria || !nuevoEquipo.serie) {
      alert("Por favor, completa los campos obligatorios.");
      return;
    }
    const updatedElements = [...allElementosInventario, nuevoEquipo];
    setElementosInventario(updatedElements);
    closeNuevo();
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategoryFilter(category);
    setSearchTerm(""); // Limpiar búsqueda al cambiar categoría
    
    let filteredElements = allElementosInventario;
    
    if (category !== "Todas las Categorías") {
      filteredElements = filteredElements.filter(item => item.categoria === category);
    }
    
    setElementosInventario(filteredElements);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term === "") {
      // Si no hay término de búsqueda, mostrar todos los elementos según la categoría seleccionada
      handleCategoryFilter(selectedCategoryFilter);
      return;
    }
    
    let filteredElements = allElementosInventario;
    
    // Aplicar filtro de categoría primero
    if (selectedCategoryFilter !== "Todas las Categorías") {
      filteredElements = filteredElements.filter(item => item.categoria === selectedCategoryFilter);
    }
    
    // Aplicar filtro de búsqueda por número de serie
    filteredElements = filteredElements.filter(item => 
      item.serie.toLowerCase().includes(term.toLowerCase())
    );
    
    setElementosInventario(filteredElements);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [elementosInventario]);

  return (
    <div className="inventory-app-container">
      <HeaderInv />
      <Alert variant="info" className="inventory-header-bar">
        <div className="header-bar-content">
          <div className="header-left-section">
            <h1 className="inventory-main-title">Inventario de Equipos</h1>
            <div className="filters-row">
              <Dropdown className="category-filter-dropdown">
                <Dropdown.Toggle variant="light" id="dropdown-category">
                  {selectedCategoryFilter} <span className="dropdown-arrow">▼</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="category-dropdown-menu">
                  <Dropdown.Item onClick={() => handleCategoryFilter("Todas las Categorías")}>Todas las Categorías</Dropdown.Item>
                  {allowedCategories.map((category) => (
                    <Dropdown.Item key={category} onClick={() => handleCategoryFilter(category)}>
                      {category}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              
              <InputGroup className="search-bar">
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
          <Button className="add-new-equipment-button" onClick={openNuevo}>
            <span role="img" aria-label="añadir">➕</span> Añadir Equipo
          </Button>
        </div>
      </Alert>
      <ListaEquipos elementos={elementosInventario} onVerClick={openDetalles} />
      <div ref={bottomRef} />
      <div className="pagination-1215">
        <div className="pagination-inner-1216">
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
          <span className="selection-1217"></span>
        </div>
      </div>

      <DetallesEquipoModal show={showDetalles} onHide={closeDetalles} detalles={equipoSeleccionado} onEliminar={eliminarEquipo} />
      <NuevoEquipoModal show={showNuevo} onHide={closeNuevo} nuevoEquipo={nuevoEquipo} onChange={handleNuevoChange} onSubmit={submitNuevo} />
      <Footer />
    </div>
  );
};

export default Admin;