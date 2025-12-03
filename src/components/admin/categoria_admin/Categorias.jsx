import React, { useState, useEffect } from 'react';
import { Button, Alert, Modal, Form, Spinner, Tab, Tabs, Dropdown } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaFilePdf } from 'react-icons/fa';
import './Categorias.css';
import Footer from '../../Footer/Footer.jsx';
import HeaderCategorias from '../header_categorias/header_categorias.jsx';
import { obtenerCategoria, crearCategoria, eliminarCategoria, actualizarEstadoCategoria,} from '../../../api/CategoriaApi.js';
import { obtenerSubcategorias, crearSubcategoria, eliminarSubcategoria,} from '../../../api/SubcategotiaApi.js';
import { actualizarEstadoSubcategoria } from '../../../api/SubcategotiaApi.js';

const Categorias = () => {
      const [searchSubcategoria, setSearchSubcategoria] = useState("");
    const [searchCategoria, setSearchCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('categorias');
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nom_cat: '' });
  const [guardandoCategoria, setGuardandoCategoria] = useState(false);
  const [togglingCategoriaId, setTogglingCategoriaId] = useState(null);

  const [showModalSubcategoria, setShowModalSubcategoria] = useState(false);
  const [nuevaSubcategoria, setNuevaSubcategoria] = useState({ 
    nom_subcateg: '', 
    id_cat: '' 
  });
  const [guardandoSubcategoria, setGuardandoSubcategoria] = useState(false);
  const [togglingSubcategoriaId, setTogglingSubcategoriaId] = useState(null);
  
  const [filtroEstadoCategoria, setFiltroEstadoCategoria] = useState('Todos los Estados');
  const [filtroEstadoSubcategoria, setFiltroEstadoSubcategoria] = useState('Todos los Estados');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [categoriasData, subcategoriasData] = await Promise.all([
        obtenerCategoria(),
        obtenerSubcategorias()
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

  const handleToggleCategoria = async (categoria) => {
    // Backend expects: 1 = Activo, 2 = Inactivo
    let currentEstado = typeof categoria.estado !== 'undefined' ? categoria.estado : 1;
    // map legacy 0 to 2 (inactivo)
    if (currentEstado === 0) currentEstado = 2;
    const nuevoEstado = currentEstado === 1 ? 2 : 1;
    const accion = nuevoEstado === 1 ? 'activar' : 'desactivar';
    const confirmMsg = `¿Estás seguro de ${accion} la categoría "${categoria.nom_cat}"?`;
    if (!window.confirm(confirmMsg)) return;
    try {
      setTogglingCategoriaId(categoria.id_cat);
      await actualizarEstadoCategoria(categoria.id_cat, nuevoEstado);
      await cargarDatos();
    } catch (err) {
      alert('Error al actualizar el estado de la categoría: ' + err.message);
      console.error(err);
    } finally {
      setTogglingCategoriaId(null);
    }
  };

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

  const handleToggleSubcategoria = async (subcategoria) => {
    // Backend expects: 1 = Activo, 2 = Inactivo
    let currentEstado = typeof subcategoria.estado !== 'undefined' ? subcategoria.estado : 1;
    if (currentEstado === 0) currentEstado = 2;
    const nuevoEstado = currentEstado === 1 ? 2 : 1;
    const accion = nuevoEstado === 1 ? 'activar' : 'desactivar';
    const confirmMsg = `¿Estás seguro de ${accion} la subcategoría "${subcategoria.nom_subcateg}"?`;
    if (!window.confirm(confirmMsg)) return;
    try {
      setTogglingSubcategoriaId(subcategoria.id);
      await actualizarEstadoSubcategoria(subcategoria.id, nuevoEstado);
      await cargarDatos();
    } catch (err) {
      alert('Error al actualizar el estado de la subcategoría: ' + err.message);
      console.error(err);
    } finally {
      setTogglingSubcategoriaId(null);
    }
  };

  const obtenerNombreCategoria = (idCateg) => {
    const categoria = categorias.find(cat => cat.id_cat === idCateg);
    return categoria ? categoria.nom_cat : 'Sin categoría';
  };

  const categoriasFiltradas = categorias.filter(categoria => {
    const estado = categoria.estado !== undefined ? categoria.estado : 1;
    const coincideEstado = filtroEstadoCategoria === 'Todos los Estados' ||
      (filtroEstadoCategoria === 'Activos' && estado === 1) ||
      (filtroEstadoCategoria === 'Inactivos' && estado !== 1);
    const coincideNombre = searchCategoria.trim() === "" || categoria.nom_cat.toLowerCase().includes(searchCategoria.trim().toLowerCase());
    return coincideEstado && coincideNombre;
  });

  const subcategoriasFiltradas = subcategorias.filter(subcategoria => {
    const estado = subcategoria.estado !== undefined ? subcategoria.estado : 1;
    const coincideEstado = filtroEstadoSubcategoria === 'Todos los Estados' ||
      (filtroEstadoSubcategoria === 'Activos' && estado === 1) ||
      (filtroEstadoSubcategoria === 'Inactivos' && estado !== 1);
    const coincideNombre = searchSubcategoria.trim() === "" || subcategoria.nom_subcateg.toLowerCase().includes(searchSubcategoria.trim().toLowerCase());
    return coincideEstado && coincideNombre;
  });

  const generarPDF = () => {
    const fecha = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte de Categorías y Subcategorías</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 40px;
      background: #f5f5f5;
      min-height: 100vh;
    }
    
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #20c997;
    }
    
    h1 {
      color: #198754;
      font-size: 32px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    
    .fecha {
      color: #666;
      font-size: 14px;
      margin-top: 10px;
    }
    
    .stats {
      display: flex;
      justify-content: space-around;
      background: linear-gradient(135deg, #20c997 0%, #198754 100%);
      padding: 20px;
      border-radius: 10px;
      margin: 30px 0;
      color: white;
    }
    
    .stat-item {
      text-align: center;
    }
    
    .stat-number {
      font-size: 36px;
      font-weight: bold;
      display: block;
    }
    
    .stat-label {
      font-size: 14px;
      opacity: 0.9;
      margin-top: 5px;
    }
    
    .categoria {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    
    .categoria-titulo {
      background: linear-gradient(135deg, #20c997 0%, #198754 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
      box-shadow: 0 2px 4px rgba(32,201,151,0.2);
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    
    thead {
      background: #198754;
      color: #ffffff;
    }
    
    th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #e0e0e0;
      color: #333;
    }
    
    tbody tr:hover {
      background-color: #d1f2eb;
    }
    
    tbody tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    
    .no-subcategorias {
      color: #999;
      font-style: italic;
      padding: 20px;
      text-align: center;
      background: #f5f5f5;
      border-radius: 8px;
    }
    
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #20c997 0%, #198754 100%);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 50px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(32,201,151,0.3);
      transition: all 0.3s ease;
      z-index: 1000;
    }
    
    .print-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(25,135,84,0.5);
      background: linear-gradient(135deg, #1ab394 0%, #157347 100%);
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }
    
    .empty-state-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .container {
        box-shadow: none;
        padding: 20px;
      }
      
      .print-button {
        display: none;
      }
      
      .categoria {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <button class="print-button" onclick="window.print()">🖨️ Imprimir / Guardar como PDF</button>
  
  <div class="container">
    <div class="header">
      <h1>📊 Reporte de Categorías y Subcategorías</h1>
      <div class="fecha">Generado el: ${fecha}</div>
    </div>
    
    <div class="stats">
      <div class="stat-item">
        <span class="stat-number">${categorias.length}</span>
        <span class="stat-label">Categorías</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">${subcategorias.length}</span>
        <span class="stat-label">Subcategorías</span>
      </div>
    </div>
`;

    if (categorias.length === 0) {
      htmlContent += `
    <div class="empty-state">
      <div class="empty-state-icon">📁</div>
      <h3>No hay categorías registradas en el sistema</h3>
    </div>
`;
    } else {
      categorias.forEach((categoria, index) => {
        htmlContent += `
    <div class="categoria">
      <div class="categoria-titulo">${index + 1}. ${categoria.nom_cat}</div>
`;

        const subcategoriasDeCategoria = subcategorias.filter(
          sub => sub.id_cat === categoria.id_cat
        );

        if (subcategoriasDeCategoria.length > 0) {
          htmlContent += `
      <table>
        <thead>
          <tr>
            <th style="width: 60px;">#</th>
            <th>Nombre de Subcategoría</th>
            <th style="width: 100px;">ID</th>
          </tr>
        </thead>
        <tbody>
`;

          subcategoriasDeCategoria.forEach((sub, idx) => {
            htmlContent += `
          <tr>
            <td>${idx + 1}</td>
            <td>${sub.nom_subcateg}</td>
            <td>${sub.id}</td>
          </tr>
`;
          });

          htmlContent += `
        </tbody>
      </table>
`;
        } else {
          htmlContent += `
      <div class="no-subcategorias">
        No hay subcategorías registradas en esta categoría
      </div>
`;
        }

        htmlContent += `
    </div>
`;
      });
    }

    htmlContent += `
  </div>
</body>
</html>`;

    // Crear blob y descargar
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporte_Categorias_${new Date().getTime()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert('✅ Archivo descargado. Ábrelo en tu navegador y haz clic en "Imprimir / Guardar como PDF"');
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
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Dropdown className="category-filter-dropdown-xd31">
                    <Dropdown.Toggle 
                      variant="success" 
                      id="dropdown-estado-categoria"
                      className="dropdown-toggle-xd146"
                    >
                      {filtroEstadoCategoria} <span className="dropdown-arrow-xd32">▼</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-xd147 category-dropdown-menu-xd33">
                      <Dropdown.Item 
                        onClick={() => setFiltroEstadoCategoria('Todos los Estados')}
                        className="dropdown-item-xd148"
                      >
                        Todos los Estados
                      </Dropdown.Item>
                      <Dropdown.Item 
                        onClick={() => setFiltroEstadoCategoria('Activos')}
                        className="dropdown-item-xd148"
                      >
                        ✅ Activos
                      </Dropdown.Item>
                      <Dropdown.Item 
                        onClick={() => setFiltroEstadoCategoria('Inactivos')}
                        className="dropdown-item-xd148"
                      >
                        ❌ Inactivos
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchCategoria}
                    onChange={e => setSearchCategoria(e.target.value)}
                    style={{ marginLeft: 12, padding: '6px 12px', borderRadius: 6, border: '1px solid #ccc', minWidth: 180 }}
                  />
                  <Button 
                    className="add-button-cat12" 
                    onClick={generarPDF}
                    variant="success"
                    style={{ backgroundColor: '#00ff00', borderColor: '#00ff00', color: '#000000' }}
                  >
                    <FaFilePdf /> Descargar PDF
                  </Button>
                  <Button className="add-button-cat12" onClick={handleOpenModalCategoria}>
                    <FaPlus /> Nueva Categoría
                  </Button>
                </div>
              </div>

              <div className="cards-grid-cat14">
                {categoriasFiltradas.length === 0 ? (
                  <div className="empty-state-cat15">
                    <i className="bi bi-folder-x empty-icon-cat16"></i>
                    <h5>No hay categorías {filtroEstadoCategoria !== 'Todos los Estados' ? filtroEstadoCategoria.toLowerCase() : 'registradas'}</h5>
                    <p>{filtroEstadoCategoria !== 'Todos los Estados' ? 'Intenta cambiar el filtro' : 'Comienza agregando una nueva categoría'}</p>
                  </div>
                ) : (
                  categoriasFiltradas.map((categoria) => (
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
                          <Button
                            variant={categoria.estado === 1 ? 'warning' : 'success'}
                            size="sm"
                            className="toggle-btn-cat30"
                            onClick={() => handleToggleCategoria(categoria)}
                            disabled={togglingCategoriaId === categoria.id_cat}
                          >
                            {togglingCategoriaId === categoria.id_cat ? '...' : (categoria.estado === 1 ? 'Desactivar' : 'Activar')}
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
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Dropdown className="category-filter-dropdown-xd31">
                    <Dropdown.Toggle 
                      variant="success" 
                      id="dropdown-estado-subcategoria"
                      className="dropdown-toggle-xd146"
                    >
                      {filtroEstadoSubcategoria} <span className="dropdown-arrow-xd32">▼</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-xd147 category-dropdown-menu-xd33">
                      <Dropdown.Item 
                        onClick={() => setFiltroEstadoSubcategoria('Todos los Estados')}
                        className="dropdown-item-xd148"
                      >
                        Todos los Estados
                      </Dropdown.Item>
                      <Dropdown.Item 
                        onClick={() => setFiltroEstadoSubcategoria('Activos')}
                        className="dropdown-item-xd148"
                      >
                        ✅ Activos
                      </Dropdown.Item>
                      <Dropdown.Item 
                        onClick={() => setFiltroEstadoSubcategoria('Inactivos')}
                        className="dropdown-item-xd148"
                      >
                        ❌ Inactivos
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchSubcategoria}
                    onChange={e => setSearchSubcategoria(e.target.value)}
                    style={{ marginLeft: 12, padding: '6px 12px', borderRadius: 6, border: '1px solid #ccc', minWidth: 180 }}
                  />
                  <Button className="add-button-cat12" onClick={handleOpenModalSubcategoria}>
                    <FaPlus /> Nueva Subcategoría
                  </Button>
                </div>
              </div>

              <div className="cards-grid-cat14">
                {subcategoriasFiltradas.length === 0 ? (
                  <div className="empty-state-cat15">
                    <i className="bi bi-folder-x empty-icon-cat16"></i>
                    <h5>No hay subcategorías {filtroEstadoSubcategoria !== 'Todos los Estados' ? filtroEstadoSubcategoria.toLowerCase() : 'registradas'}</h5>
                    <p>{filtroEstadoSubcategoria !== 'Todos los Estados' ? 'Intenta cambiar el filtro' : 'Comienza agregando una nueva subcategoría'}</p>
                  </div>
                ) : (
                  subcategoriasFiltradas.map((subcategoria) => (
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
                          <Button
                            variant={subcategoria.estado === 1 ? 'warning' : 'success'}
                            size="sm"
                            className="toggle-btn-cat30"
                            onClick={() => handleToggleSubcategoria(subcategoria)}
                            disabled={togglingSubcategoriaId === subcategoria.id}
                          >
                            {togglingSubcategoriaId === subcategoria.id ? '...' : (subcategoria.estado === 1 ? 'Desactivar' : 'Activar')}
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
