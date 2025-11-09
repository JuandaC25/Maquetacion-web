import React, { useState, useEffect } from 'react';
import { Button, Alert, Dropdown, Modal, Form, Spinner } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./admin.css";
import Footer from '../../Footer/Footer.jsx';
import HeaderAd from '../header_admin/header_ad.jsx'; 
import { Ticket } from 'react-bootstrap-icons';
import { obtenerTickets, actualizarTicket } from '../../../api/ticket.js';
import ReportarEquipo from '../../Home/ReportarEquipo/ReportarEquipo.jsx';
import { obtenerCategoria } from '../../../api/CategoriaApi.js';
import { obtenersolicitudes } from '../../../api/SubcategotiaApi.js';

const Listaxd = ({ onVerClick, onCrearClick }) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("Todas las Categorías");
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState("Todas las Subcategorías");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("Todos los Estados");
  const [tickets, setTickets] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const datosTickets = await obtenerTickets();
      setTickets(Array.isArray(datosTickets) ? datosTickets : []);
    } catch (err) {
      setError(err.message);
      console.error('[ERROR] Error al cargar tickets:', err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTickets();
    cargarCategoriasYSubcategorias();
  }, []);

  const cargarCategoriasYSubcategorias = async () => {
    try {
      const [datosCateg, datosSubcateg] = await Promise.all([
        obtenerCategoria(),
        obtenersolicitudes()
      ]);
      setCategorias(Array.isArray(datosCateg) ? datosCateg : []);
      setSubcategorias(Array.isArray(datosSubcateg) ? datosSubcateg : []);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const ticketsArray = Array.isArray(tickets) ? tickets : [];
  
  // Filtrar tickets por estado
  const ticketsFiltrados = ticketsArray.filter(ticket => {
    if (selectedStatusFilter === "Todos los Estados") return true;
    
    const estadoTicket = ticket?.estado;
    if (selectedStatusFilter === "Activo" && estadoTicket === 1) return true;
    if (selectedStatusFilter === "Pendiente" && estadoTicket === 2) return true;
    if (selectedStatusFilter === "Inactivo" && estadoTicket === 3) return true;
    
    return false;
  });
  
  const handleCategoryFilter = (category) => {
    setSelectedCategoryFilter(category);
    setSelectedSubcategoryFilter("Todas las Subcategorías");
  };

  const handleSubcategoryFilter = (subcategory) => {
    setSelectedSubcategoryFilter(subcategory);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatusFilter(status);
  };

  const subcategoriasFiltradas = selectedCategoryFilter === "Todas las Categorías" 
    ? subcategorias 
    : subcategorias.filter(sub => {
        const categoria = categorias.find(cat => cat.id_cat === sub.id_cat);
        return categoria && categoria.nom_cat === selectedCategoryFilter;
      });

  if (loading) {
    return (
      <div className="container-1201 d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando tickets...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-1201">
        <Alert variant="danger">
          <strong>Error:</strong> {error}
          <div className="mt-2">
            <Button variant="primary" onClick={cargarTickets}>
              Reintentar
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container-1201">
      <Alert variant="success" className="alert-1202">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="flex-1203">
            <div className="flex-inner-1204">
              <strong className="strong-1205">TICKET</strong>
              
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

              <Dropdown className="category-filter-dropdown-xd31">
                <Dropdown.Toggle 
                  variant="success" 
                  id="dropdown-status-xd31"
                  className="dropdown-toggle-xd146"
                >
                  {selectedStatusFilter} <span className="dropdown-arrow-xd32">▼</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-xd147 category-dropdown-menu-xd33">
                  <Dropdown.Item 
                    onClick={() => handleStatusFilter("Todos los Estados")}
                    className="dropdown-item-xd148"
                  >
                    Todos los Estados
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => handleStatusFilter("Activo")}
                    className="dropdown-item-xd148"
                  >
                    🟢 Activo
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => handleStatusFilter("Pendiente")}
                    className="dropdown-item-xd148"
                  >
                    🟡 Pendiente
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => handleStatusFilter("Inactivo")}
                    className="dropdown-item-xd148"
                  >
                    🔴 Inactivo
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className='contador-ticket-1207'>
              mostrando {ticketsFiltrados.length} tickets
              de {ticketsArray.length} tickets
            </div>
          </div>
          <div className="header-buttons-section">
            <Button className="add-new-equipment-button-xd35" onClick={onCrearClick}>
              <span role="img" aria-label="añadir">➕</span> Añadir Ticket
            </Button>
          </div>
        </div>
      </Alert>
      {ticketsFiltrados.length === 0 && !loading && (
        <div className="text-center py-5">
          <div className="mb-3">
            <Ticket size={48} className="text-muted" />
          </div>
          <h5 className="text-muted">Libre de tickets</h5>
          <p className="text-muted">No hay tickets para mostrar en este momento</p>
        </div>
      )}
      {ticketsFiltrados.length > 0 && (
        <div className="grid-1208">
          {ticketsFiltrados.map((t, i) => (
            <div className="card-ticket-1209" key={t?.id || i}>
              <div className="header-card-1210"></div>
              <div className="info-card-1211">
                <p className="title-card-1212">{t?.ticket || `Ticket ${i + 1}`}</p>
                <p className="elemento-card-1213">{t?.elemento || 'Sin elemento'}</p>
                <span className={`status-card-1214 ${(t?.estado ? String(t.estado).toLowerCase().replace(' ', '-') : 'pendiente')}`}>
                  {t?.estado || 'Pendiente'}
                </span>
              </div>
              <div className="footer-card-1215">
                <button 
                  type="button" 
                  className="action-card-1216"
                  onClick={() => onVerClick(t?.detalles || t)}
                >
                  Ver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="pagination-1217">
        <div className="pagination-inner-1218">
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
          <span className="selection-1219"></span>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalDetalles, setModalDetalles] = useState(null);
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [editandoEstado, setEditandoEstado] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleVerClick = (detalles) => {
    setModalDetalles(detalles || {});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalDetalles(null);
    setEditandoEstado(false);
    setNuevoEstado('');
  };

  const handleEditarEstado = () => {
    setEditandoEstado(true);
    setNuevoEstado(modalDetalles?.estado || '');
  };

  const handleGuardarEstado = async () => {
    const ticketId = modalDetalles?.id_tickets || modalDetalles?.id;
    
    if (!ticketId) {
      alert('❌ No se encontró el ID del ticket');
      console.error('Datos del modal:', modalDetalles);
      return;
    }
    
    setGuardando(true);
    try {
      const estadoNumero = parseInt(nuevoEstado);
      console.log('💾 Guardando estado:', { 
        id: ticketId, 
        estado: estadoNumero,
        id_est_tick: estadoNumero 
      });
      
      // El backend espera estos campos según TicketsUpdateDtos
      const resultado = await actualizarTicket(ticketId, {
        estado: estadoNumero,
        id_est_tick: estadoNumero  // Este es el campo que el backend usa para actualizar
      });
      
      console.log('✅ Resultado:', resultado);
      alert('✓ Estado actualizado exitosamente');
      setEditandoEstado(false);
      handleCloseModal();
      // Forzar recarga completa sin cache
      window.location.href = window.location.href;
    } catch (error) {
      console.error('❌ Error completo:', error);
      alert('❌ Error al actualizar el estado: ' + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleOpenCrearModal = () => {
    setShowCrearModal(true);
  };

  const handleCloseCrearModal = () => {
    setShowCrearModal(false);
  };

  return (
    <div className="page-with-footer-1227">
      <HeaderAd />
      <Listaxd onVerClick={handleVerClick} onCrearClick={handleOpenCrearModal} />
      <Modal show={showModal} onHide={handleCloseModal} className="modal-1220" centered>
        <Modal.Header closeButton className="modal-header-1221">
          <Modal.Title>Detalles del Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-1222">
          <div className="form-row-1223">
            <label className="form-label-1224">ID Ticket:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={modalDetalles?.id_tickets || 'No disponible'} 
                readOnly 
              />
            </div>
          </div>
          
          <div className="form-row-1223">
            <label className="form-label-1224">Fecha de inicio:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={modalDetalles?.fecha_in ? new Date(modalDetalles.fecha_in).toLocaleString() : 'No disponible'} 
                readOnly 
              />
            </div>
          </div>
          
          <div className="form-row-1223">
            <label className="form-label-1224">Fecha de fin:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={modalDetalles?.fecha_fin ? new Date(modalDetalles.fecha_fin).toLocaleString() : 'No disponible'} 
                readOnly 
              />
            </div>
          </div>

          <div className="form-row-1223">
            <label className="form-label-1224">Ambiente:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={modalDetalles?.ambient || 'No disponible'} 
                readOnly 
              />
            </div>
          </div>
          
          <div className="form-row-1223">
            <label className="form-label-1224">Problema:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={modalDetalles?.nom_problem || 'No disponible'} 
                readOnly 
              />
            </div>
          </div>
          
          <div className="form-row-1223">
            <label className="form-label-1224">ID Problema:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={modalDetalles?.problem_id || 'No disponible'} 
                readOnly 
              />
            </div>
          </div>
          
          <div className="form-row-1223">
            <label className="form-label-1224">Usuario:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={modalDetalles?.nom_usu || 'No disponible'} 
                readOnly 
              />
            </div>
          </div>
          
          <div className="form-row-1223">
            <label className="form-label-1224">ID Usuario:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={modalDetalles?.id_usuario || 'No disponible'} 
                readOnly 
              />
            </div>
          </div>
          
          <div className="form-row-1223">
            <label className="form-label-1224">ID Elemento:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={modalDetalles?.id_eleme || 'No disponible'} 
                readOnly 
              />
            </div>
          </div>
          
          <div className="form-row-1223">
            <label className="form-label-1224">Estado:</label>
            <div className="form-control-wrap-1225">
              {editandoEstado ? (
                <Form.Select 
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                >
                  <option value="1">Activo</option>
                  <option value="2">Pendiente</option>
                  <option value="3">Inactivo</option>
                </Form.Select>
              ) : (
                <Form.Control 
                  type="text" 
                  value={
                    modalDetalles?.estado === 1 ? '🟢 Activo' :
                    modalDetalles?.estado === 2 ? '🟡 Pendiente' :
                    modalDetalles?.estado === 3 ? '🔴 Inactivo' :
                    'No disponible'
                  } 
                  readOnly 
                />
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer-1226">
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          {!editandoEstado ? (
            <Button variant="warning" onClick={handleEditarEstado}>
              Editar Estado
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setEditandoEstado(false)} disabled={guardando}>
                Cancelar
              </Button>
              <Button variant="success" onClick={handleGuardarEstado} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar'}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Modal para crear ticket usando componente de instructor */}
      <Modal show={showCrearModal} onHide={() => setShowCrearModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>🚨 Reportar Equipo / Crear Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReportarEquipo />
          <div className="mt-3 text-center">
            <Button variant="success" onClick={() => {
              window.location.reload();
            }}>
              ✓ Cerrar y Actualizar
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Footer />
    </div>
  );
};

export default Admin;