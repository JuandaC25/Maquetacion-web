import React, { useState, useRef, useEffect } from "react";
import { Button, Alert, Dropdown, Modal, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import "./inventario.css";
import Footer from "../../Footer/Footer.jsx";
import HeaderInv from "../header_inv/header_inv.jsx";

const EquipoItem = ({ elemento, onVerClick }) => (
  <div className="modern-equipment-card-xd01">
    <div className="card-top-section-xd02">
      <span className="equipment-category-xd06">{elemento.categoria}</span>
      <div className="icon-display-xd03">
        <span role="img" aria-label="computadora">💻</span>
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

const ListaEquipos = ({ elementos, onVerClick }) => (
  <div className="equipment-list-grid-xd09">
    {elementos.length > 0 ? (
      elementos.map((el, index) => (
        <EquipoItem key={index} elemento={el} onVerClick={onVerClick} />
      ))
    ) : (
      <p className="empty-list-message-xd10">No se encontraron equipos con ese número de serie.</p>
    )}
  </div>
);

const DetallesEquipoModal = ({ show, onHide, detalles, onEliminar }) => {
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
      </Modal.Body>
      <Modal.Footer className="modern-modal-footer-xd19">
        <Button variant="danger" onClick={() => onEliminar(detalles.nombre)} className="modal-action-button-xd20 delete-action-xd21">
          Eliminar
        </Button>
        <Button variant="secondary" onClick={onHide} className="modal-action-button-xd20 close-action-xd22">
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const NuevoEquipoModal = ({ show, onHide, nuevoEquipo, onChange, onSubmit }) => (
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
    </Modal.Body>
    <Modal.Footer className="modern-modal-footer-xd19">
      <Button variant="secondary" onClick={onHide} className="modal-action-button-xd20 cancel-action-xd23">
        Cancelar
      </Button>
      <Button variant="success" onClick={onSubmit} className="modal-action-button-xd20 add-action-xd24">
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
    setSearchTerm(""); 
    
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

      handleCategoryFilter(selectedCategoryFilter);
      return;
    }
    
    let filteredElements = allElementosInventario;

    if (selectedCategoryFilter !== "Todas las Categorías") {
      filteredElements = filteredElements.filter(item => item.categoria === selectedCategoryFilter);
    }

    filteredElements = filteredElements.filter(item => 
      item.serie.toLowerCase().includes(term.toLowerCase())
    );
    
    setElementosInventario(filteredElements);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [elementosInventario]);

  return (
    <div className="inventory-app-container-xd25">
      <HeaderInv />
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
      <ListaEquipos elementos={elementosInventario} onVerClick={openDetalles} />
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

      <DetallesEquipoModal show={showDetalles} onHide={closeDetalles} detalles={equipoSeleccionado} onEliminar={eliminarEquipo} />
      <NuevoEquipoModal show={showNuevo} onHide={closeNuevo} nuevoEquipo={nuevoEquipo} onChange={handleNuevoChange} onSubmit={submitNuevo} />
      <Footer />
    </div>
  );
};

export default Admin;
