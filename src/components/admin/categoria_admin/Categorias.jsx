import React, { useState, useEffect } from 'react';
import { Button, Alert, Modal, Form, Spinner, Tab, Tabs } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './Categorias.css';
import Footer from '../../Footer/Footer.jsx';
import HeaderCategorias from '../header_categorias/header_categorias.jsx';
import { 
  obtenerCategoria, 
  crearCategoria, 
  eliminarCategoria 
} from '../../../api/CategoriaApi.js';
import { 
  obtenersolicitudes, 
  crearSubcategoria, 
  eliminarSubcategoria 
} from '../../../api/SubcategotiaApi.js';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('categorias');

  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nom_cat: '' });
  const [guardandoCategoria, setGuardandoCategoria] = useState(false);

  const [showModalSubcategoria, setShowModalSubcategoria] = useState(false);
  const [nuevaSubcategoria, setNuevaSubcategoria] = useState({ 
    nom_subcateg: '', 
    id_cat: '' 
  });
  const [guardandoSubcategoria, setGuardandoSubcategoria] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [categoriasData, subcategoriasData] = await Promise.all([
        obtenerCategoria(),
        obtenersolicitudes()
      ]);
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
      setSubcategorias(Array.isArray(subcategoriasData) ? subcategoriasData : []);
    } catch (err) {
      setError('Error al cargar los datos: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenModalCategoria = () => {
    setNuevaCategoria({ nom_cat: '' });
    setShowModalCategoria(true);
  };

  const handleCloseModalCategoria = () => {
    setShowModalCategoria(false);
    setNuevaCategoria({ nom_cat: '' });
  };

  const handleChangeCategoriaInput = (e) => {
    setNuevaCategoria({ nom_cat: e.target.value });
  };

  const handleSubmitCategoria = async () => {
    if (!nuevaCategoria.nom_cat.trim()) {
      alert('Por favor, ingresa un nombre para la categoría');
      return;
    }

    try {
      setGuardandoCategoria(true);
      await crearCategoria(nuevaCategoria);
      await cargarDatos();
      handleCloseModalCategoria();
      alert('Categoría creada exitosamente');
    } catch (err) {
      alert('Error al crear la categoría: ' + err.message);
    } finally {
      setGuardandoCategoria(false);
    }
  };

  const handleEliminarCategoria = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de eliminar esta categoría? Esto también eliminará sus subcategorías asociadas.');
    if (!confirmacion) return;

    try {
      await eliminarCategoria(id);
      await cargarDatos();
      alert('Categoría eliminada exitosamente');
    } catch (err) {
      alert('Error al eliminar la categoría: ' + err.message);
    }
  };

  // Funciones para Subcategorías
  const handleOpenModalSubcategoria = () => {
    setNuevaSubcategoria({ nom_subcateg: '', id_cat: '' });
    setShowModalSubcategoria(true);
  };

  const handleCloseModalSubcategoria = () => {
    setShowModalSubcategoria(false);
    setNuevaSubcategoria({ nom_subcateg: '', id_cat: '' });
  };

  const handleChangeSubcategoriaInput = (e) => {
    const { name, value } = e.target;
    setNuevaSubcategoria(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitSubcategoria = async () => {
    if (!nuevaSubcategoria.nom_subcateg.trim() || !nuevaSubcategoria.id_cat) {
      alert('Por favor, completa todos los campos');
      return;
    }

    try {
      setGuardandoSubcategoria(true);
      const dataToSend = {
        nom_subcateg: nuevaSubcategoria.nom_subcateg,
        id_cat: parseInt(nuevaSubcategoria.id_cat)
      };
      await crearSubcategoria(dataToSend);
      await cargarDatos();
      handleCloseModalSubcategoria();
      alert('Subcategoría creada exitosamente');
    } catch (err) {
      alert('Error al crear la subcategoría: ' + err.message);
    } finally {
      setGuardandoSubcategoria(false);
    }
  };

  const handleEliminarSubcategoria = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de eliminar esta subcategoría?');
    if (!confirmacion) return;

    try {
      await eliminarSubcategoria(id);
      await cargarDatos();
      alert('Subcategoría eliminada exitosamente');
    } catch (err) {
      alert('Error al eliminar la subcategoría: ' + err.message);
    }
  };

  const obtenerNombreCategoria = (idCateg) => {
    const categoria = categorias.find(cat => cat.id_cat === idCateg);
    return categoria ? categoria.nom_cat : 'Sin categoría';
  };

  if (loading) {
    return (
      <div className="categorias-container-cat01">
        <HeaderCategorias />
        <div className="loading-wrapper-cat02">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p>Cargando datos...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="categorias-container-cat01">
      <HeaderCategorias />
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="error-alert-cat03">
          {error}
        </Alert>
      )}

      <div className="main-content-cat04">
        <div className="hero-section-cat05">
          <div className="hero-content-cat06">
            <div className="hero-badge-cat07">
              <i className="bi bi-stars"></i>
              <span>Sistema de Gestión</span>
            </div>
            <h1 className="hero-title-cat08">Categorías y Subcategorías</h1>
            <p className="hero-subtitle-cat09">Organiza y administra la estructura de tu inventario de manera eficiente</p>
            <div className="hero-stats-cat10">
              <div className="stat-item-cat11">
                <i className="bi bi-tag-fill"></i>
                <div>
                  <span className="stat-number-cat12">{categorias.length}</span>
                  <span className="stat-label-cat13">Categorías</span>
                </div>
              </div>
              <div className="stat-divider-cat14"></div>
              <div className="stat-item-cat11">
                <i className="bi bi-tags-fill"></i>
                <div>
                  <span className="stat-number-cat12">{subcategorias.length}</span>
                  <span className="stat-label-cat13">Subcategorías</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="custom-tabs-cat09"
        >
          {/* TAB DE CATEGORÍAS */}
          <Tab eventKey="categorias" title="Categorías">
            <div className="tab-content-cat10">
              <div className="actions-bar-cat11">
                <div className="actions-left-cat15">
                  <h2 className="section-title-cat16">
                    <i className="bi bi-grid-3x3-gap-fill"></i>
                    Mis Categorías
                  </h2>
                  <p className="section-subtitle-cat17">Gestiona las categorías principales de tu sistema</p>
                </div>
                <Button className="add-button-cat12" onClick={handleOpenModalCategoria}>
                  <FaPlus /> Nueva Categoría
                </Button>
              </div>

              <div className="cards-grid-cat14">
                {categorias.length === 0 ? (
                  <div className="empty-state-cat15">
                    <i className="bi bi-folder-x empty-icon-cat16"></i>
                    <h5>No hay categorías registradas</h5>
                    <p>Comienza agregando una nueva categoría</p>
                  </div>
                ) : (
                  categorias.map((categoria) => (
                    <div key={categoria.id_cat} className="category-card-cat17">
                      <div className="card-icon-wrapper-cat18">
                        <div className="card-icon-bg-cat19">
                          <i className="bi bi-tag-fill card-icon-cat20"></i>
                        </div>
                      </div>
                      <div className="card-content-cat21">
                        <div className="card-header-info-cat22">
                          <h3 className="card-title-cat23">{categoria.nom_cat}</h3>
                          <span className="card-badge-cat24">ID: {categoria.id_cat}</span>
                        </div>
                        <div className="card-actions-cat25">
                          <Button 
                            variant="danger" 
                            size="sm" 
                            className="delete-btn-cat26"
                            onClick={() => handleEliminarCategoria(categoria.id_cat)}
                          >
                            <FaTrash /> Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Tab>

          {/* TAB DE SUBCATEGORÍAS */}
          <Tab eventKey="subcategorias" title="Subcategorías">
            <div className="tab-content-cat10">
              <div className="actions-bar-cat11">
                <div className="actions-left-cat15">
                  <h2 className="section-title-cat16">
                    <i className="bi bi-diagram-3-fill"></i>
                    Mis Subcategorías
                  </h2>
                  <p className="section-subtitle-cat17">Organiza subcategorías dentro de cada categoría</p>
                </div>
                <Button className="add-button-cat12" onClick={handleOpenModalSubcategoria}>
                  <FaPlus /> Nueva Subcategoría
                </Button>
              </div>

              <div className="cards-grid-cat14">
                {subcategorias.length === 0 ? (
                  <div className="empty-state-cat15">
                    <i className="bi bi-folder-x empty-icon-cat16"></i>
                    <h5>No hay subcategorías registradas</h5>
                    <p>Comienza agregando una nueva subcategoría</p>
                  </div>
                ) : (
                  subcategorias.map((subcategoria) => (
                    <div key={subcategoria.id} className="category-card-cat17 subcategory-card-cat27">
                      <div className="card-icon-wrapper-cat18">
                        <div className="card-icon-bg-cat19 subcategory-icon-cat28">
                          <i className="bi bi-tags-fill card-icon-cat20"></i>
                        </div>
                      </div>
                      <div className="card-content-cat21">
                        <div className="card-header-info-cat22">
                          <h3 className="card-title-cat23">{subcategoria.nom_subcateg}</h3>
                          <span className="card-badge-cat24">ID: {subcategoria.id}</span>
                        </div>
                        <div className="card-parent-cat29">
                          <i className="bi bi-arrow-return-right"></i>
                          <span>{obtenerNombreCategoria(subcategoria.id_cat)}</span>
                        </div>
                        <div className="card-actions-cat25">
                          <Button 
                            variant="danger" 
                            size="sm" 
                            className="delete-btn-cat26"
                            onClick={() => handleEliminarSubcategoria(subcategoria.id)}
                          >
                            <FaTrash /> Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>

      {/* Modal para crear Categoría */}
      <Modal show={showModalCategoria} onHide={handleCloseModalCategoria} centered>
        <Modal.Header closeButton className="modal-header-cat28">
          <Modal.Title>Crear Nueva Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-cat29">
          <Form.Group>
            <Form.Label className="form-label-cat30">Nombre de la Categoría</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Electrónica, Muebles, etc."
              value={nuevaCategoria.nom_cat}
              onChange={handleChangeCategoriaInput}
              className="form-input-cat31"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="modal-footer-cat32">
          <Button variant="secondary" onClick={handleCloseModalCategoria}>
            Cancelar
          </Button>
          <Button 
            variant="success" 
            onClick={handleSubmitCategoria}
            disabled={guardandoCategoria}
          >
            {guardandoCategoria ? <Spinner animation="border" size="sm" /> : 'Crear Categoría'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para crear Subcategoría */}
      <Modal show={showModalSubcategoria} onHide={handleCloseModalSubcategoria} centered>
        <Modal.Header closeButton className="modal-header-cat28">
          <Modal.Title>Crear Nueva Subcategoría</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-cat29">
          <Form.Group className="mb-3">
            <Form.Label className="form-label-cat30">Nombre de la Subcategoría</Form.Label>
            <Form.Control
              type="text"
              name="nom_subcateg"
              placeholder="Ej: Laptops, Monitores, etc."
              value={nuevaSubcategoria.nom_subcateg}
              onChange={handleChangeSubcategoriaInput}
              className="form-input-cat31"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="form-label-cat30">Categoría Padre</Form.Label>
            <Form.Select
              name="id_cat"
              value={nuevaSubcategoria.id_cat}
              onChange={handleChangeSubcategoriaInput}
              className="form-input-cat31"
            >
              <option value="">Selecciona una categoría...</option>
              {categorias.map((cat) => (
                <option key={cat.id_cat} value={cat.id_cat}>
                  {cat.nom_cat}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="modal-footer-cat32">
          <Button variant="secondary" onClick={handleCloseModalSubcategoria}>
            Cancelar
          </Button>
          <Button 
            variant="success" 
            onClick={handleSubmitSubcategoria}
            disabled={guardandoSubcategoria}
          >
            {guardandoSubcategoria ? <Spinner animation="border" size="sm" /> : 'Crear Subcategoría'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
};

export default Categorias;
