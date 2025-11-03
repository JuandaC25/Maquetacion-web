import React, { useState, useRef, useEffect } from "react";
import { Button, Alert, Dropdown, Modal, Form, InputGroup, Spinner } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import "./inventario.css";
import "../adcrear_ad/adcrear_ad.css";
import Footer from "../../Footer/Footer.jsx";
import HeaderInv from "../header_inv/header_inv.jsx";
import ElementosService from "../../../api/ElementosApi.js";
import { 
  obtenerAccesorios
} from "../../../api/AccesoriosApi.js";
import { obtenerCategoria } from "../../../api/CategoriaApi.js";
import { obtenersolicitudes } from "../../../api/SubcategotiaApi.js";

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

const DetallesEquipoModal = ({ show, onHide, detalles, onEliminar, eliminando, onActualizarEstado }) => {
  if (!detalles) return null;

  const esAccesorio = detalles.tipo === 'accesorio';
  const [editMode, setEditMode] = React.useState(false);
  const [editedEstado, setEditedEstado] = React.useState(() => {
    const estNum = (detalles && (detalles.est !== undefined ? detalles.est : (detalles.est_elem ?? detalles.est_elemn ?? detalles.estadosoelement ?? 1)));
    return estNum === 1 ? 'activo' : 'inactivo';
  });

  React.useEffect(() => {
    if (detalles) {
      const estNum = (detalles.est !== undefined ? detalles.est : (detalles.est_elem ?? detalles.est_elemn ?? detalles.estadosoelement ?? 1));
      setEditedEstado(estNum === 1 ? 'activo' : 'inactivo');
      setEditMode(false);
    }
  }, [detalles]);

  const handleSaveEstado = async () => {
    try {
  const payload = { id_elem: detalles.id, est: editedEstado === 'activo' ? 1 : 0 };
      if (onActualizarEstado) {
        await onActualizarEstado(detalles.id, payload);
      } else {
        await ElementosService.actualizarElemento(detalles.id, payload);
      }
      alert('Estado del elemento actualizado');
      setEditMode(false);
      onHide();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert('Error al actualizar estado: ' + (err.message || err));
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="modern-modal-dialog-xd11">
      <Modal.Header closeButton className="modern-modal-header-xd12">
        <Modal.Title className="modern-modal-title-xd13">
          {editMode ? 'Editar Elemento' : `Detalles del ${esAccesorio ? 'Accesorio' : 'Equipo'}`}
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
              <label className="detail-label-xd16">Subcategoría:</label>
              <div className="detail-value-display-xd17">
                <Form.Control type="text" value={detalles.subcategoria || "N/A"} readOnly className="modern-form-control-xd18" />
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
        <div className="detail-item-xd115">
          <label className="detail-label-xd116">Estado:</label>
          <div className="detail-value-display-xd117">
            {editMode ? (
              <Form.Control
                as="select"
                value={editedEstado}
                onChange={(e) => setEditedEstado(e.target.value)}
                className={`modern-form-control-xd118 ${editedEstado === 'activo' ? 'text-success' : 'text-danger'}`}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </Form.Control>
            ) : (
              <Form.Control
                type="text"
                value={(detalles.est !== undefined ? detalles.est : (detalles.est_elem ?? detalles.est_elemn ?? detalles.estadosoelement ?? detalles.est ?? 1)) === 1 ? 'Activo' : 'Inactivo'}
                readOnly
                className={`modern-form-control-xd118 ${(detalles.est !== undefined ? detalles.est : (detalles.est_elem ?? detalles.est_elemn ?? detalles.estadosoelement ?? detalles.est ?? 1)) === 1 ? 'text-success' : 'text-danger'}`}
              />
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="modern-modal-footer-xd19">
        {editMode ? (
          <>
            <Button variant="secondary" onClick={() => setEditMode(false)} className="modal-action-button-xd20 cancel-action-xd23">
              Cancelar
            </Button>
            <Button variant="success" onClick={handleSaveEstado} className="modal-action-button-xd20 add-action-xd24">
              Guardar Cambios
            </Button>
          </>
        ) : (
          <>
            <Button variant="primary" onClick={() => setEditMode(true)} className="modal-action-button-xd20">
              Editar
            </Button>
            <Button variant="secondary" onClick={onHide} className="modal-action-button-xd20 close-action-xd22">
              Cerrar
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

const NuevoEquipoModal = ({ show, onHide, nuevoEquipo, onChange, onSubmit, guardando, subcategorias, categorias }) => (
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
        <label className="detail-label-xd16">Subcategoría:</label>
        <div className="detail-value-display-xd17">
          <Form.Select
            id="id_subcateg"
            value={nuevoEquipo.id_subcateg || ""}
            onChange={onChange}
            className="modern-form-control-xd18"
          >
            <option value="">Seleccionar subcategoría...</option>
            {subcategorias.map((subcat) => {
              const categoria = categorias.find(cat => cat.id_cat === subcat.id_cat);
              return (
                <option key={subcat.id} value={subcat.id}>
                  {subcat.nom_subcateg} ({categoria ? categoria.nom_cat : 'Sin categoría'})
                </option>
              );
            })}
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
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [guardandoAccesorio, setGuardandoAccesorio] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState(null);

  const [showDetalles, setShowDetalles] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [showNuevo, setShowNuevo] = useState(false);
  const [showNuevoAccesorio, setShowNuevoAccesorio] = useState(false);
  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: "", 
    id_subcateg: "", 
    serie: "", 
    observaciones: "",
    componentes: ""
  });
  const [nuevoAccesorio, setNuevoAccesorio] = useState({
    nombre: "",
    marca: "",
    serie: ""
  });
  const [excelFile, setExcelFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("Todas las Categorías");
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState("Todas las Subcategorías");
  const [searchTerm, setSearchTerm] = useState("");

  const bottomRef = useRef(null);

  const obtenerIdCategoria = (categoria) => {
    const categorias = {
      "Portátil": 1,
      "Equipo de Escritorio": 2,
      "Televisor": 3,
      "Accesorio": 4
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
      
      const resultados = await Promise.allSettled([
        ElementosService.obtenerElementos(),
        obtenerAccesorios(),
        obtenerCategoria(),
        obtenersolicitudes()
      ]);

      const elementosResult = resultados[0];
      const accesoriosResult = resultados[1];
      const categoriasResult = resultados[2];
      const subcategoriasResult = resultados[3];

      if (elementosResult.status !== 'fulfilled') {
        throw elementosResult.reason || new Error('Error al obtener elementos');
      }

      const elementos = elementosResult.value;
      const accesorios = accesoriosResult.status === 'fulfilled' ? accesoriosResult.value : [];
      const cats = categoriasResult.status === 'fulfilled' ? categoriasResult.value : [];
      const subcats = subcategoriasResult.status === 'fulfilled' ? subcategoriasResult.value : [];

      setCategorias(Array.isArray(cats) ? cats : []);
      setSubcategorias(Array.isArray(subcats) ? subcats : []);

      const elementosNormalizados = elementos.map(el => ({
        id: el.id_elemen,
        nombre: el.nom_eleme,
        categoria: el.tip_catg || "Sin categoría",
        serie: el.num_seri?.toString() || "",
        observaciones: el.obse,
        componentes: el.componen,
        id_subcateg: el.id_subcateg,
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
        detallesCompletos = await ElementosService.obtenerPorId(item.id);
        detallesCompletos = {
          ...detallesCompletos,
          id: detallesCompletos.id_elemen,
          nombre: detallesCompletos.nom_eleme,
          marca: detallesCompletos.marc,
          serie: detallesCompletos.num_ser?.toString() || "",
          categoria: detallesCompletos.tip_catg || "Accesorio",
          est: detallesCompletos.est !== undefined ? detallesCompletos.est : (detallesCompletos.est_elem ?? detallesCompletos.est_elemn ?? detallesCompletos.estadosoelement ?? 1),
          tipo: 'accesorio'
        };
      } else {
        detallesCompletos = await ElementosService.obtenerPorId(item.id);
        
        const idSubcat = detallesCompletos.id_subcat || detallesCompletos.id_subcateg;
        const subcategoria = subcategorias.find(s => s.id === idSubcat);
        const categoriaPadre = subcategoria ? categorias.find(c => c.id_cat === subcategoria.id_cat) : null;
        
        detallesCompletos = {
          ...detallesCompletos,
          id: detallesCompletos.id_elemen,
          nombre: detallesCompletos.nom_eleme,
          subcategoria: subcategoria ? subcategoria.nom_subcateg : "Sin subcategoría",
          categoria: categoriaPadre ? categoriaPadre.nom_cat : "Sin categoría",
          serie: detallesCompletos.num_seri?.toString() || "",
          observaciones: detallesCompletos.obse,
          componentes: detallesCompletos.componen,
          est: detallesCompletos.est !== undefined ? detallesCompletos.est : (detallesCompletos.est_elem ?? detallesCompletos.est_elemn ?? detallesCompletos.estadosoelement ?? 1),
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
        await ElementosService.eliminarElemento(id);
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
      id_subcateg: "", 
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

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setUploadFile(f || null);
  };

  const handleUploadFile = async () => {
    if (!uploadFile) { alert('Selecciona un archivo .xlsx primero'); return; }
    try {
      setUploading(true);
      setUploadResult(null);
      const formData = new FormData();
      formData.append('file', uploadFile);
      const res = await ElementosService.uploadExcel(formData);
      setUploadResult(res);
      await cargarTodo();
      alert('Carga completada. Revisar resultados.');
    } catch (err) {
      console.error(err);
      alert('Error al subir el archivo: ' + (err.message || err));
    } finally {
      setUploading(false);
      setUploadFile(null);
    }
  };

  const submitNuevo = async () => {
    if (!nuevoEquipo.nombre || !nuevoEquipo.id_subcateg || !nuevoEquipo.serie) {
      alert("Por favor, completa los campos obligatorios: Nombre, Subcategoría y Número de serie.");
      return;
    }

    try {
      setGuardando(true);
      
      const subcategoriaSeleccionada = subcategorias.find(s => s.id === parseInt(nuevoEquipo.id_subcateg));

      const categoriaPadre = subcategoriaSeleccionada ? 
        categorias.find(c => c.id_cat === subcategoriaSeleccionada.id_cat) : null;
      
      const elementoParaBackend = {
        nom_eleme: nuevoEquipo.nombre,
        num_seri: nuevoEquipo.serie,
        obse: nuevoEquipo.observaciones || "",
        componen: nuevoEquipo.componentes || "",
        est: 1,
        id_categ: categoriaPadre ? categoriaPadre.id_cat : null,
        id_subcat: parseInt(nuevoEquipo.id_subcateg)
      };
      
      
      const elementoCreado = await ElementosService.crearElemento(elementoParaBackend);
      
      const elementoNormalizado = {
        id: elementoCreado.id_elemen,
        nombre: elementoCreado.nom_eleme,
        categoria: subcategoriaSeleccionada ? subcategoriaSeleccionada.nom_subcateg : "Sin categoría",
        serie: nuevoEquipo.serie,
        observaciones: nuevoEquipo.observaciones,
        componentes: nuevoEquipo.componentes,
        id_subcateg: parseInt(nuevoEquipo.id_subcateg),
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
        nom_eleme: nuevoAccesorio.nombre,
        marc: nuevoAccesorio.marca,
        num_seri: nuevoAccesorio.serie,
        est: 1,
        obse: "",
        componen: "",
        id_categ: obtenerIdCategoria("Accesorio")
      };

      const accesorioCreado = await ElementosService.crearElemento(accesorioParaBackend);

      const accesorioNormalizado = {
        id: accesorioCreado.id_elemen,
        nombre: accesorioCreado.nom_eleme,
        marca: accesorioCreado.marc,
        serie: accesorioCreado.num_seri?.toString() || "",
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
    setSelectedSubcategoryFilter("Todas las Subcategorías");
  };

  const handleSubcategoryFilter = (subcategory) => {
    setSelectedSubcategoryFilter(subcategory);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const subcategoriasFiltradas = selectedCategoryFilter === "Todas las Categorías" 
    ? subcategorias 
    : subcategorias.filter(sub => {
        const categoria = categorias.find(cat => cat.id_cat === sub.id_cat);
        return categoria && categoria.nom_cat === selectedCategoryFilter;
      });

  const elementosFiltrados = elementosInventario.filter(elemento => {
    const coincideCategoria = selectedCategoryFilter === "Todas las Categorías" || 
                             elemento.categoria === selectedCategoryFilter;
    
    const coincideSubcategoria = selectedSubcategoryFilter === "Todas las Subcategorías" ||
                                elemento.subcategoria === selectedSubcategoryFilter;
    
    const coincideBusqueda = searchTerm === "" || 
                           elemento.serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           elemento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (elemento.marca && elemento.marca.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return coincideCategoria && coincideSubcategoria && coincideBusqueda;
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
                  {categorias.map((categoria) => (
                    <Dropdown.Item 
                      key={categoria.id_cat} 
                      onClick={() => handleCategoryFilter(categoria.nom_cat)}
                      className="dropdown-item-xd148"
                    >
                      {categoria.nom_cat}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown className="category-filter-dropdown-xd31">
                <Dropdown.Toggle 
                  variant="success" 
                  id="dropdown-subcategory-xd31"
                  className="dropdown-toggle-xd146"
                >
                  {selectedSubcategoryFilter} <span className="dropdown-arrow-xd32">▼</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-xd147 category-dropdown-menu-xd33">
                  <Dropdown.Item 
                    onClick={() => handleSubcategoryFilter("Todas las Subcategorías")}
                    className="dropdown-item-xd148"
                  >
                    Todas las Subcategorías
                  </Dropdown.Item>
                  {subcategoriasFiltradas.map((subcategoria) => (
                    <Dropdown.Item 
                      key={subcategoria.id} 
                      onClick={() => handleSubcategoryFilter(subcategoria.nom_subcateg)}
                      className="dropdown-item-xd148"
                    >
                      {subcategoria.nom_subcateg}
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
            <Button variant="outline-primary" onClick={() => setShowUploadModal(true)} className="modal-action-button-xd120" style={{ marginLeft: 8 }}>
              Importar elementos (.xlsx)
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
        onActualizarEstado={async (id, payload) => { await ElementosService.actualizarElemento(id, payload); await cargarTodo(); }}
      />
      <Modal show={showUploadModal} onHide={() => { setShowUploadModal(false); setUploadFile(null); setDragActive(false); }} centered dialogClassName="modern-modal-dialog-xd111">
        <Modal.Header closeButton className="modern-modal-header-xd112">
          <Modal.Title className="modern-modal-title-xd113">Importar elementos (.xlsx)</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modern-modal-body-xd114">
          <div
            className={`upload-modal-dropzone-xd150 ${dragActive ? 'drag-active-xd151' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const files = e.dataTransfer && e.dataTransfer.files;
              if (files && files.length > 0) {
                setUploadFile(files[0]);
              }
            }}
          >
            <div className="upload-modal-content-xd152">
              <p className="mb-2">Arrastra aquí tu archivo .xlsx o</p>
              <Button variant="outline-primary" onClick={() => fileInputRef.current && fileInputRef.current.click()} className="modal-action-button-xd120">Seleccionar archivo</Button>
              <input
                ref={fileInputRef}
                id="excel-file-input"
                type="file"
                accept=".xlsx"
                onChange={(e) => { handleFileChange(e); setShowUploadModal(true); }}
                style={{ display: 'none' }}
              />
              {uploadFile && (
                <div className="selected-file-info-xd153 mt-3">
                  <strong>Archivo seleccionado:</strong>
                  <div className="selected-file-name-xd154">{uploadFile.name}</div>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="modern-modal-footer-xd119">
          <Button variant="secondary" onClick={() => { setShowUploadModal(false); setUploadFile(null); }} className="modal-action-button-xd120 cancel-action-xd123">
            Cancelar
          </Button>
          <Button
            variant="outline-secondary"
            onClick={async () => {
              try {
                setDownloadingTemplate(true);
                const blob = await ElementosService.downloadTemplate();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'plantilla_elementos.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              } catch (err) {
                console.error(err);
                alert('Error al descargar la plantilla: ' + (err.message || err));
              } finally {
                setDownloadingTemplate(false);
              }
            }}
            disabled={downloadingTemplate}
            className="modal-action-button-xd120 template-action-xd125"
          >
            {downloadingTemplate ? 'Descargando...' : 'Descargar plantilla'}
          </Button>
          <Button variant="success" onClick={async () => { await handleUploadFile(); setShowUploadModal(false); }} className="modal-action-button-xd120 add-action-xd124" disabled={!uploadFile || uploading}>
            {uploading ? 'Subiendo...' : 'Subir archivo'}
          </Button>
        </Modal.Footer>
      </Modal>
      {uploadResult && (
        <Alert variant="info" onClose={() => setUploadResult(null)} dismissible>
          <div><strong>Resultado de la carga:</strong></div>
          <div>Total filas procesadas: {uploadResult.resultado?.total ?? uploadResult.total ?? 'N/A'}</div>
          <div>Guardados: {uploadResult.resultado?.guardados ?? uploadResult.guardados ?? 'N/A'}</div>
          {uploadResult.resultado?.errores && uploadResult.resultado.errores.length > 0 && (
            <div>
              <strong>Errores:</strong>
              <ul>
                {uploadResult.resultado.errores.map((e, i) => (<li key={i}>{e}</li>))}
              </ul>
            </div>
          )}
        </Alert>
      )}
      
      <NuevoEquipoModal 
        show={showNuevo} 
        onHide={closeNuevo} 
        nuevoEquipo={nuevoEquipo} 
        onChange={handleNuevoChange} 
        onSubmit={submitNuevo}
        guardando={guardando}
        subcategorias={subcategorias}
        categorias={categorias}
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