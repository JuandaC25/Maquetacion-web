import React, { useState, useRef, useEffect } from "react";
import { Button, Alert, Dropdown, Modal, Form, InputGroup, Spinner } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import "./inventario.css";
import Footer from "../../Footer/Footer.jsx";
import HeaderInv from "../header_inv/header_inv.jsx";
import ElementosService from "../../../api/ElementosApi.js";
import { 
  obtenerAccesorios, 
  crearAccesorio, 
  eliminarAccesorio,
  obtenerAccesorioPorId 
} from "../../../api/AccesoriosApi.js";

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
        ) : elemento.categoria === "Accesorio" ? (
          <img
            src={"/imagenes/accesorios.png"}
            alt="Accesorio"
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
      {elemento.marca && <p className="equipment-marca-xd07">Marca: {elemento.marca}</p>}
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
        <p>Cargando equipos y accesorios...</p>
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
        <p className="empty-list-message-xd10">No se encontraron equipos ni accesorios.</p>
      )}
    </div>
  );
};

const DetallesEquipoModal = ({ show, onHide, detalles, onEliminar, eliminando }) => {
  if (!detalles) return null;

  const esAccesorio = detalles.tipo === 'accesorio';

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="modern-modal-dialog-xd11">
      <Modal.Header closeButton className="modern-modal-header-xd12">
        <Modal.Title className="modern-modal-title-xd13">
          Detalles del {esAccesorio ? "Accesorio" : "Equipo"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modern-modal-body-xd14">
        <div className="detail-item-xd15">
          <label className="detail-label-xd16">Nombre:</label>
          <div className="detail-value-display-xd17">
            <Form.Control type="text" value={detalles.nombre} readOnly className="modern-form-control-xd18" />
          </div>
        </div>
        
        {esAccesorio ? (
          <>
            <div className="detail-item-xd15">
              <label className="detail-label-xd16">Marca:</label>
              <div className="detail-value-display-xd17">
                <Form.Control type="text" value={detalles.marca} readOnly className="modern-form-control-xd18" />
              </div>
            </div>
            <div className="detail-item-xd15">
              <label className="detail-label-xd16">Número de serie:</label>
              <div className="detail-value-display-xd17">
                <Form.Control type="text" value={detalles.serie} readOnly className="modern-form-control-xd18" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="detail-item-xd15">
              <label className="detail-label-xd16">Categoría:</label>
              <div className="detail-value-display-xd17">
                <Form.Control type="text" value={detalles.categoria} readOnly className="modern-form-control-xd18" />
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
                <Form.Control as="textarea" rows={3} value={detalles.observaciones || "N/A"} readOnly className="modern-form-control-xd18" />
              </div>
            </div>
            <div className="detail-item-xd15">
              <label className="detail-label-xd16">Componentes:</label>
              <div className="detail-value-display-xd17">
                <Form.Control as="textarea" rows={3} value={detalles.componentes || "N/A"} readOnly className="modern-form-control-xd18" />
              </div>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="modern-modal-footer-xd19">
        <Button 
          variant="danger" 
          onClick={() => onEliminar(detalles.id, esAccesorio)} 
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

const NuevoAccesorioModal = ({ show, onHide, nuevoAccesorio, onChange, onSubmit, guardando }) => (
  <Modal show={show} onHide={onHide} centered dialogClassName="modern-modal-dialog-xd11">
    <Modal.Header closeButton className="modern-modal-header-xd12">
      <Modal.Title className="modern-modal-title-xd13">Añadir Nuevo Accesorio</Modal.Title>
    </Modal.Header>
    <Modal.Body className="modern-modal-body-xd14">
      <div className="detail-item-xd15">
        <label className="detail-label-xd16">Nombre del accesorio:</label>
        <div className="detail-value-display-xd17">
          <Form.Control
            type="text"
            id="nombre"
            value={nuevoAccesorio.nombre}
            onChange={onChange}
            placeholder="Ej. Mouse inalámbrico, Cargador, Teclado"
            className="modern-form-control-xd18"
          />
        </div>
      </div>
      <div className="detail-item-xd15">
        <label className="detail-label-xd16">Marca:</label>
        <div className="detail-value-display-xd17">
          <Form.Control
            type="text"
            id="marca"
            value={nuevoAccesorio.marca}
            onChange={onChange}
            placeholder="Ej. Logitech, Dell, HP"
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
            value={nuevoAccesorio.serie}
            onChange={onChange}
            placeholder="Ej. ABC123XYZ789"
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
        {guardando ? <Spinner animation="border" size="sm" /> : "Añadir Accesorio"}
      </Button>
    </Modal.Footer>
  </Modal>
);

const Admin = () => {
  const [elementosInventario, setElementosInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [guardandoAccesorio, setGuardandoAccesorio] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState(null);

  const allowedCategories = ["Portátil", "Equipo de Escritorio", "Televisor", "Accesorio"];
  
  const [showDetalles, setShowDetalles] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [showNuevo, setShowNuevo] = useState(false);
  const [showNuevoAccesorio, setShowNuevoAccesorio] = useState(false);
  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: "", 
    categoria: "", 
    serie: "", 
    observaciones: "",
    componentes: ""
  });
  const [nuevoAccesorio, setNuevoAccesorio] = useState({
    nombre: "",
    marca: "",
    serie: ""
  });
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("Todas las Categorías");
  const [searchTerm, setSearchTerm] = useState("");

  const bottomRef = useRef(null);

  const obtenerIdCategoria = (categoria) => {
    const categorias = {
      "Portátil": 1,
      "Equipo de Escritorio": 2,
      "Televisor": 3
    };
    return categorias[categoria] || 1;
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [elementos, accesorios] = await Promise.all([
        ElementosService.obtenerElementos(),
        obtenerAccesorios()
      ]);
      
      const elementosNormalizados = elementos.map(el => ({
        id: el.id_elemen,
        nombre: el.nom_eleme,
        categoria: el.tip_catg || "Sin categoría",
        serie: el.num_seri?.toString() || "",
        observaciones: el.obse,
        componentes: el.componen,
        tipo: 'elemento'
      }));
      
      const accesoriosNormalizados = accesorios.map(acc => ({
        id: acc.id_accesorio,
        nombre: acc.nom_acces,
        marca: acc.marc,
        serie: acc.num_ser?.toString() || "",
        categoria: "Accesorio",
        tipo: 'accesorio'
      }));
      
      const todosLosItems = [...elementosNormalizados, ...accesoriosNormalizados];
      setElementosInventario(todosLosItems);
      
    } catch (error) {
      setError('Error al cargar los datos del inventario: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openDetalles = async (item) => {
    try {
      let detallesCompletos;
      
      if (item.tipo === 'accesorio') {
        detallesCompletos = await obtenerAccesorioPorId(item.id);
        detallesCompletos = {
          ...detallesCompletos,
          id: detallesCompletos.id_accesorio,
          nombre: detallesCompletos.nom_acces,
          marca: detallesCompletos.marc,
          serie: detallesCompletos.num_ser?.toString() || "",
          categoria: "Accesorio",
          tipo: 'accesorio'
        };
      } else {
        detallesCompletos = await ElementosService.obtenerPorId(item.id);
        detallesCompletos = {
          ...detallesCompletos,
          id: detallesCompletos.id_elemen,
          nombre: detallesCompletos.nom_eleme,
          categoria: detallesCompletos.tip_catg,
          serie: detallesCompletos.num_seri?.toString() || "",
          observaciones: detallesCompletos.obse,
          componentes: detallesCompletos.componen,
          tipo: 'elemento'
        };
      }
      
      setEquipoSeleccionado(detallesCompletos);
      setShowDetalles(true);
    } catch (error) {
      setError('Error al cargar los detalles: ' + error.message);
    }
  };

  const closeDetalles = () => {
    setShowDetalles(false);
    setEquipoSeleccionado(null);
  };

  const eliminarItem = async (id, esAccesorio = false) => {
    const tipo = esAccesorio ? "accesorio" : "equipo";
    const isConfirmed = window.confirm(`¿Estás seguro de que quieres eliminar este ${tipo}?`);
    if (!isConfirmed) return;

    try {
      setEliminando(true);
      
      if (esAccesorio) {
        await eliminarAccesorio(id);
      } else {
        await ElementosService.eliminarElemento(id);
      }
      
      setElementosInventario(prev => prev.filter(item => item.id !== id));
      closeDetalles();
      
      alert(`${esAccesorio ? 'Accesorio' : 'Equipo'} eliminado correctamente`);
      
    } catch (error) {
      setError(`Error al eliminar el ${tipo}: ` + error.message);
    } finally {
      setEliminando(false);
    }
  };

  const openNuevo = () => setShowNuevo(true);
  const openNuevoAccesorio = () => setShowNuevoAccesorio(true);
  
  const closeNuevo = () => {
    setShowNuevo(false);
    setNuevoEquipo({ 
      nombre: "", 
      categoria: "", 
      serie: "", 
      observaciones: "",
      componentes: "" 
    });
  };

  const closeNuevoAccesorio = () => {
    setShowNuevoAccesorio(false);
    setNuevoAccesorio({
      nombre: "",
      marca: "",
      serie: ""
    });
  };

  const handleNuevoChange = (e) => {
    const { id, value } = e.target;
    setNuevoEquipo((prev) => ({ ...prev, [id]: value }));
  };

  const handleNuevoAccesorioChange = (e) => {
    const { id, value } = e.target;
    setNuevoAccesorio((prev) => ({ ...prev, [id]: value }));
  };

  const submitNuevo = async () => {
    if (!nuevoEquipo.nombre || !nuevoEquipo.categoria || !nuevoEquipo.serie) {
      alert("Por favor, completa los campos obligatorios: Nombre, Categoría y Número de serie.");
      return;
    }

    try {
      setGuardando(true);
      
      const elementoParaBackend = {
        nom_eleme: nuevoEquipo.nombre,
        num_seri: parseInt(nuevoEquipo.serie),
        obse: nuevoEquipo.observaciones || "",
        componen: nuevoEquipo.componentes || "",
        est_elem: 1,
        id_categoria: obtenerIdCategoria(nuevoEquipo.categoria)
      };
      
      const elementoCreado = await ElementosService.crearElemento(elementoParaBackend);
      
      const elementoNormalizado = {
        id: elementoCreado.id_elemen,
        nombre: elementoCreado.nom_eleme,
        categoria: nuevoEquipo.categoria,
        serie: nuevoEquipo.serie,
        observaciones: nuevoEquipo.observaciones,
        componentes: nuevoEquipo.componentes,
        tipo: 'elemento'
      };
      
      setElementosInventario(prev => [...prev, elementoNormalizado]);
      closeNuevo();
      alert('Equipo añadido correctamente');
      
    } catch (error) {
      if (error.message.includes('el elemento ya existe') || error.message.includes('Conflicto')) {
        alert('Error: Ya existe un equipo con ese número de serie');
      } else {
        alert('Error al crear el equipo: ' + error.message);
      }
    } finally {
      setGuardando(false);
    }
  };

  const submitNuevoAccesorio = async () => {
    if (!nuevoAccesorio.nombre || !nuevoAccesorio.marca || !nuevoAccesorio.serie) {
      alert("Por favor, completa los campos obligatorios: Nombre del accesorio, Marca y Número de serie.");
      return;
    }

    try {
      setGuardandoAccesorio(true);
      
      const accesorioParaBackend = {
        nom_acces: nuevoAccesorio.nombre,
        marc: nuevoAccesorio.marca,
        num_ser: parseInt(nuevoAccesorio.serie)
      };
      
      const accesorioCreado = await crearAccesorio(accesorioParaBackend);
      
      const accesorioNormalizado = {
        id: accesorioCreado.id_accesorio,
        nombre: accesorioCreado.nom_acces,
        marca: accesorioCreado.marc,
        serie: accesorioCreado.num_ser?.toString() || "",
        categoria: "Accesorio",
        tipo: 'accesorio'
      };
      
      setElementosInventario(prev => [...prev, accesorioNormalizado]);
      closeNuevoAccesorio();
      alert('Accesorio añadido correctamente');
      
    } catch (error) {
      if (error.message.includes('Conflicto')) {
        alert('Error: Ya existe un accesorio con ese número de serie');
      } else {
        alert('Error al crear el accesorio: ' + error.message);
      }
    } finally {
      setGuardandoAccesorio(false);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategoryFilter(category);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const elementosFiltrados = elementosInventario.filter(elemento => {
    const coincideCategoria = selectedCategoryFilter === "Todas las Categorías" || 
                             elemento.categoria === selectedCategoryFilter;
    const coincideBusqueda = searchTerm === "" || 
                           elemento.serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           elemento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (elemento.marca && elemento.marca.toLowerCase().includes(searchTerm.toLowerCase()));
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
            <h1 className="inventory-main-title-xd29">Inventario de Equipos y Accesorios</h1>
            <div className="filters-row-xd30">
              <Dropdown className="category-filter-dropdown-xd31">
                <Dropdown.Toggle 
                  variant="success" 
                  id="dropdown-category-xd31"
                  className="dropdown-toggle-xd146"
                >
                  {selectedCategoryFilter} <span className="dropdown-arrow-xd32">▼</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-xd147 category-dropdown-menu-xd33">
                  <Dropdown.Item 
                    onClick={() => handleCategoryFilter("Todas las Categorías")}
                    className="dropdown-item-xd148"
                  >
                    Todas las Categorías
                  </Dropdown.Item>
                  {allowedCategories.map((category) => (
                    <Dropdown.Item 
                      key={category} 
                      onClick={() => handleCategoryFilter(category)}
                      className="dropdown-item-xd148"
                    >
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
                  placeholder="Buscar por número de serie, nombre o marca..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </InputGroup>
            </div>
          </div>
          <div className="header-buttons-section">
            <Button className="add-new-equipment-button-xd35" onClick={openNuevo}>
              <span role="img" aria-label="añadir">➕</span> Añadir Equipo
            </Button>
            <Button className="add-new-equipment-button-xd35 add-accessory-button" onClick={openNuevoAccesorio}>
              <span role="img" aria-label="añadir">🎧</span> Añadir Accesorio
            </Button>
          </div>
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
        onEliminar={eliminarItem}
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

      <NuevoAccesorioModal 
        show={showNuevoAccesorio} 
        onHide={closeNuevoAccesorio} 
        nuevoAccesorio={nuevoAccesorio} 
        onChange={handleNuevoAccesorioChange} 
        onSubmit={submitNuevoAccesorio}
        guardando={guardandoAccesorio}
      />
      
      <Footer />
    </div>
  );
};

export default Admin;