import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { obtenerHistorialPorTicket, editarHistorial } from '../../../api/TransabilidadApi';
import { Button, Alert, Dropdown, Modal, Form, Spinner } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./admin.css";
import Footer from '../../Footer/Footer.jsx';
import HeaderAd from '../header_admin/header_ad.jsx'; 
import { Ticket } from 'react-bootstrap-icons';
import { obtenerTickets, actualizarTicket } from '../../../api/ticket.js';
import ReportarEquipo from '../../Home/ReportarEquipo/ReportarEquipo.jsx';
import { obtenerCategoria } from '../../../api/CategoriaApi.js';
import { obtenersolicitudes } from '../../../api/solicitudesApi.js';

const Listaxd = ({ onVerClick, onCrearClick, onOpenAllHistorial }) => {
  // --- MODAL HISTORIAL DE TICKETS ---
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [historialTicket, setHistorialTicket] = useState([]);
  const [historialEdit, setHistorialEdit] = useState({});
  const [historialLoading, setHistorialLoading] = useState(false);
  const [historialError, setHistorialError] = useState(null);
  const [historialTicketId, setHistorialTicketId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  // Descargar historial en PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Historial de trazabilidad', 10, 15);
    if (historialTicket && historialTicket.length > 0) {
      let y = 30;
      historialTicket.forEach((h, idx) => {
        const id = h.id_trsa ?? h.id ?? '';
        const fecha = h.fech ?? h.fecha ?? '';
        const observ = h.obser ?? h.obse ?? h.descripcion ?? '';
        const elemento = h.nom_elemen ?? h.nom_elem ?? h.elemento ?? '';
        const ticketNum = h.id_ticet ?? h.id_tickets ?? historialTicketId ?? '';
        const usuario = h.nom_us ?? h.nom_usu ?? (h.usuario && h.usuario.nombre) ?? '';
        doc.setFontSize(12);
        doc.text(`ID: ${id}`, 10, y);
        doc.text(`Fecha: ${fecha}`, 10, y + 7);
        doc.text(`Ticket: ${ticketNum}`, 10, y + 14);
        doc.text(`Usuario: ${usuario}`, 10, y + 21);
        doc.text(`Elemento: ${elemento}`, 10, y + 28);
        doc.text(`Observación: ${observ}`, 10, y + 35);
        y += 48;
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
      });
    } else {
      doc.setFontSize(12);
      doc.text('No hay entradas de trazabilidad para este ticket.', 10, 30);
    }
    doc.save(`trasabilidad_ticket_${historialTicketId || ''}.pdf`);
  };

  const handleOpenHistorialModal = async (ticket) => {
    setShowHistorialModal(true);
    setHistorialLoading(true);
    setHistorialError(null);
    setHistorialTicketId(ticket.id || ticket.id_tickets);
    try {
      const data = await obtenerHistorialPorTicket(ticket.id || ticket.id_tickets);
      console.log('Historial recibido para ticket', ticket.id || ticket.id_tickets, data);
      setHistorialTicket(data);
      setHistorialEdit({});
    } catch (err) {
      setHistorialError(err.message);
    } finally {
      setHistorialLoading(false);
    }
  };

  const handleCloseHistorialModal = () => {
    setShowHistorialModal(false);
    setHistorialTicket([]);
    setHistorialEdit({});
    setHistorialTicketId(null);
  };

  const handleEditHistorialChange = (id, field, value) => {
    setHistorialEdit((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSaveHistorial = async (id) => {
    try {
      setHistorialLoading(true);
      const data = historialEdit[id];
      await editarHistorial(id, data);
      // Refrescar historial
      const updated = await obtenerHistorialPorTicket(historialTicketId);
      setHistorialTicket(updated);
      setHistorialEdit((prev) => ({ ...prev, [id]: undefined }));
    } catch (err) {
      setHistorialError(err.message);
    } finally {
      setHistorialLoading(false);
    }
  };
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
      console.log('🎫 Tickets cargados:', datosTickets);
      if (datosTickets && datosTickets.length > 0) {
        console.log('📊 Primer ticket ejemplo:', datosTickets[0]);
        console.log('📊 Estados de todos los tickets:', datosTickets.map(t => ({
          id: t.id_tickets,
          estado: t.estado,
          id_est_tick: t.id_est_tick
        })));
      }
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

  // PAGINACIÓN: 3 columnas x 4 filas = 12 tarjetas por página
  const CARDS_PER_ROW = 3;
  const ROWS_PER_PAGE = 4;
  const CARDS_PER_PAGE = CARDS_PER_ROW * ROWS_PER_PAGE;
  const [currentPage, setCurrentPage] = useState(1);

  const ticketsArray = Array.isArray(tickets) ? tickets : [];

  const ticketsFiltrados = ticketsArray.filter(ticket => {
    if (selectedStatusFilter === "Todos los Estados") return true;
    const estadoTicket = Number(ticket?.id_est_tick || ticket?.estado);
    if (selectedStatusFilter === "Activo" && estadoTicket === 1) return true;
    if (selectedStatusFilter === "Pendiente" && estadoTicket === 2) return true;
    if (selectedStatusFilter === "Inactivo" && estadoTicket === 3) return true;
    return false;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryFilter, selectedSubcategoryFilter, selectedStatusFilter, tickets]);

  const totalPages = Math.ceil(ticketsFiltrados.length / CARDS_PER_PAGE);
  const paginatedTickets = ticketsFiltrados.slice((currentPage - 1) * CARDS_PER_PAGE, currentPage * CARDS_PER_PAGE);
  
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

  const startIdx = (currentPage - 1) * CARDS_PER_PAGE;

  return (
    <div className="container-1201">
      <Alert className="alert-1202" style={{ background: '#fff', border: 'none', boxShadow: 'none', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="flex-1203">
            <div className="flex-inner-1204">
              <strong className="strong-1205">TICKET</strong>
              {/* ...Filtros existentes... */}
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
          </div>
          <div className="header-buttons-section">
            <div style={{ 
              display: 'inline-block', 
              marginRight: 8,
              marginLeft: 0,
              height: '40px' 
            }}>
              <button 
                onClick={onCrearClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#28a745',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.6rem 1.2rem',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9375rem',
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  outline: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  msAppearance: 'none',
                  appearance: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  height: '40px',
                  boxSizing: 'border-box',
                  lineHeight: '1.5',
                  textAlign: 'center',
                  textTransform: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#218838';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#28a745';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(1px)';
                  e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }}
              >
                <span style={{ 
                  fontSize: '16px',
                  lineHeight: '1',
                  color: '#9C27B0',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '22px',
                  height: '22px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  marginRight: '10px',
                  position: 'relative',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                  paddingBottom: '1px'
                }}>+</span>
                <span style={{ 
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  top: '1px'
                }}>Añadir Ticket</span>
              </button>
            </div>
            <div style={{ display: 'inline-block', marginLeft: 8 }}>
              <button 
                type="button"
                onClick={() => onOpenAllHistorial && onOpenAllHistorial()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#28a745',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.6rem 1.2rem',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9375rem',
                  height: '40px',
                  boxSizing: 'border-box'
                }}
              >
                Historial de tickets
              </button>
            </div>
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
        <div className="grid-1208" style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${CARDS_PER_ROW}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS_PER_PAGE}, auto)`,
          gap: '24px',
        }}>
          {paginatedTickets.map((t, i) => (
            <div className="card-ticket-1209" key={t?.id || i}>
              <div className="header-card-1210"></div>
              <div className="info-card-1211">
                <p className="title-card-1212">{t?.ticket || `Ticket ${startIdx + i + 1}`}</p>
                <p className="elemento-card-1213">{t?.nom_elem || t?.elemento || 'Sin elemento'}</p>
                <span className={`status-card-1214 ${(() => {
                  const estado = Number(t?.id_est_tick || t?.estado);
                  return estado === 1 ? 'activo' : estado === 2 ? 'pendiente' : estado === 3 ? 'inactivo' : 'pendiente';
                })()}`}>
                  {(() => {
                    const estado = Number(t?.id_est_tick || t?.estado);
                    return estado === 1 ? '🟢 Activo' : estado === 2 ? '🟡 Pendiente' : estado === 3 ? '🔴 Inactivo' : 'Pendiente';
                  })()}
                </span>
              </div>
              <div className="footer-card-1215" style={{ display: 'flex', gap: '10px', justifyContent: 'center', padding: '1rem 1rem 0.5rem 1rem', background: 'rgba(9,180,26,0.082)', borderBottomLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}>
                <button 
                  type="button" 
                  className="action-card-1216"
                  style={{ background: '#12bb1a', color: '#fff', fontWeight: 700, minWidth: 100 }}
                  onClick={() => onVerClick(t?.detalles || t)}
                >
                  VER
                </button>
                <button
                  type="button"
                  className="action-card-1216"
                  style={{ background: '#1976d2', color: '#fff', fontWeight: 700, minWidth: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  onClick={() => handleOpenHistorialModal(t)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style={{marginRight: 4}}><path d="M8 3.5a.5.5 0 0 1 .5.5v3.293l2.146 2.147a.5.5 0 0 1-.708.708l-2.25-2.25A.5.5 0 0 1 7.5 7V4a.5.5 0 0 1 .5-.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1A7 7 0 1 1 8 1a7 7 0 0 1 0 14z"/></svg>
                  Historial de tickets
                </button>
              </div>
              {/* Modal is rendered once at the root, not inside the map */}
            </div>
          ))}
        </div>
      )}
      {/* MODAL HISTORIAL DE TICKETS - Rendered once at the root */}
      <Modal show={showHistorialModal} onHide={handleCloseHistorialModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Historial de tickets</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-1222 modal-body">
          {historialLoading ? (
            <div className="text-center py-4">Cargando historial...</div>
          ) : historialError ? (
            <Alert variant="danger">{historialError}</Alert>
          ) : historialTicket && historialTicket.length > 0 ? (
            <div className="historial-list" style={{ maxHeight: 400, overflowY: 'auto' }}>
              {historialTicket.map((h) => {
                const id = h.id_trsa ?? h.id ?? '';
                const fecha = h.fech ?? h.fecha ?? '';
                const observ = h.obser ?? h.obse ?? h.descripcion ?? '';
                const elemento = h.nom_elemen ?? h.nom_elem ?? h.elemento ?? '';
                const ticketNum = h.id_ticet ?? h.id_tickets ?? historialTicketId ?? '';
                const usuario = h.nom_us ?? h.nom_usu ?? (h.usuario && h.usuario.nombre) ?? '';
                return (
                  <div key={id || Math.random()} className="historial-card report-card">
                    <div className="report-header">
                      <div className="report-title">Trazabilidad — Entrada #{id}</div>
                      <div className="report-sub">Ticket: <span className="mono">{ticketNum}</span></div>
                    </div>

                    <div className="report-meta">
                      <div className="meta-item">
                        <div className="meta-label">Fecha</div>
                        <div className="meta-value">{fecha}</div>
                      </div>
                      <div className="meta-item">
                        <div className="meta-label">Usuario</div>
                        <div className="meta-value">{usuario}</div>
                      </div>
                      <div className="meta-item">
                        <div className="meta-label">Elemento</div>
                        <div className="meta-value">{elemento}</div>
                      </div>
                      <div className="meta-item">
                        <div className="meta-label">ID interno</div>
                        <div className="meta-value mono">{id}</div>
                      </div>
                    </div>

                    <div className="report-body">
                      <div className="report-section-label">Observación</div>
                      <div className="report-observacion">{observ}</div>
                    </div>

                    {editMode && (
                      <div className="historial-edit">
                        <Form.Control as="textarea" rows={4} value={historialEdit[id]?.observ ?? observ} onChange={e => handleEditHistorialChange(id, 'obser', e.target.value)} />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button size="sm" variant="success" className="mt-2" onClick={() => handleSaveHistorial(id)} disabled={historialLoading}>Guardar</Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div>No hay historial para este ticket.</div>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer-1226">
          <Button variant="secondary" onClick={handleCloseHistorialModal}>Cerrar</Button>
          <Button variant={editMode ? "outline-warning" : "warning"} onClick={() => setEditMode((v) => !v)} disabled={historialLoading || !historialTicket || historialTicket.length === 0} style={{ marginLeft: 8 }}>
            {editMode ? "Cancelar edición" : "Editar"}
          </Button>
          <Button variant="info" onClick={handleDownloadPDF} style={{ marginLeft: 8 }} disabled={historialLoading}>
            Descargar PDF
          </Button>
        </Modal.Footer>
      </Modal>
      {/* PAGINACIÓN idéntica a adcrear.jsx (barra verde animada, fondo claro) */}
      {totalPages > 1 && (
        <div className="pagination-1215-xd136">
          <div
            className="pagination-inner-1216-xd137"
            style={{
              '--container_width': `${Math.max(totalPages, 3) * 60}px`,
              width: 'var(--container_width)'
            }}
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <label key={i + 1}>
                <input
                  value={i + 1}
                  name="value-radio"
                  id={`value-${i + 1}`}
                  type="radio"
                  checked={currentPage === i + 1}
                  onChange={() => setCurrentPage(i + 1)}
                />
                <span>{i + 1}</span>
              </label>
            ))}
            <span
              className="selection-1217-xd138"
              style={{
                display: 'inline-block',
                width: `calc(var(--container_width) / ${totalPages})`,
                transform: `translateX(calc(var(--container_width) * ${(currentPage - 1)} / ${totalPages}))`
              }}
            ></span>
          </div>
        </div>
      )}
    </div>
  );
};

const Admin = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalDetalles, setModalDetalles] = useState(null);
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showAllHistorialModal, setShowAllHistorialModal] = useState(false);
  const [downloadAllLoading, setDownloadAllLoading] = useState(false);
  const [editandoEstado, setEditandoEstado] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [editandoProblema, setEditandoProblema] = useState(false);
  const [nuevoProblema, setNuevoProblema] = useState('');
  const [problemas, setProblemas] = useState([]);
  useEffect(() => {
    if (showModal) {
      // Cargar problemas solo si se abre el modal
      import('../../../api/ProblemasApi').then(({ obtenerProblemas }) => {
        obtenerProblemas().then(setProblemas).catch(() => setProblemas([]));
      });
    }
  }, [showModal]);

  const handleVerClick = (detalles) => {
    setModalDetalles(detalles || {});
    setShowModal(true);
    setEditandoProblema(false);
    setNuevoProblema(String(detalles?.id_problem || detalles?.problem_id || ''));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalDetalles(null);
    setEditandoEstado(false);
    setNuevoEstado('');
  };

  const handleEditarEstado = () => {
    setEditandoEstado(true);
    const estadoActual = modalDetalles?.id_est_tick || modalDetalles?.estado || '';
    console.log('🔧 Editando estado. Estado actual:', estadoActual, 'Datos completos:', modalDetalles);
    setNuevoEstado(String(estadoActual));
    setEditandoProblema(false);
  };

  const handleGuardarEstado = async () => {
    const ticketId = modalDetalles?.id_tickets || modalDetalles?.id;
    if (!ticketId) {
      alert('❌ No se encontró el ID del ticket');
      console.error('Datos del modal:', modalDetalles);
      return;
    }
    if (!nuevoEstado) {
      alert('❌ Por favor seleccione un estado');
      return;
    }
    if (editandoProblema && !nuevoProblema) {
      alert('❌ Selecciona un problema');
      return;
    }
    setGuardando(true);
    try {
      const estadoNumero = parseInt(nuevoEstado);
      const problemaId = editandoProblema ? parseInt(nuevoProblema) : (modalDetalles?.id_problem || modalDetalles?.problem_id);
      const payload = {
        id_est_tick: estadoNumero
      };
      if (editandoProblema) {
        payload.id_problem = problemaId;
      }
      console.log('💾 Guardando estado/problema:', { id: ticketId, ...payload });
      const resultado = await actualizarTicket(ticketId, payload);
      console.log('✅ Resultado:', resultado);
      alert('✓ Ticket actualizado exitosamente');
      setEditandoEstado(false);
      setEditandoProblema(false);
      handleCloseModal();
      window.location.href = window.location.href;
    } catch (error) {
      console.error('❌ Error completo:', error);
      alert('❌ Error al actualizar el ticket: ' + error.message);
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
      <Listaxd onVerClick={handleVerClick} onCrearClick={handleOpenCrearModal} onOpenAllHistorial={() => setShowAllHistorialModal(true)} />
      <Modal show={showModal} onHide={handleCloseModal} className="modal-1220" centered>
        <Modal.Header closeButton className="modal-header-1221">
          <Modal.Title>Detalles del Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-1222">
          <div className="form-row-1223">
            <label className="form-label-1224">Número del Ticket:</label>
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
              {editandoProblema ? (
                <Form.Select value={nuevoProblema} onChange={e => setNuevoProblema(e.target.value)}>
                  <option value="">Selecciona un problema</option>
                  {problemas.map(p => (
                    <option key={p.id} value={p.id}>{p.descripcion}</option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control 
                  type="text" 
                  value={
                    modalDetalles?.nom_problm || 
                    modalDetalles?.nom_problem || 
                    'No disponible'
                  } 
                  readOnly 
                />
              )}
            </div>
          </div>
          
          
          <div className="form-row-1223">
            <label className="form-label-1224">Usuario:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={
                  modalDetalles?.nom_usu || 
                  modalDetalles?.usuario?.nombre || 
                  'No disponible'
                } 
                readOnly 
              />
            </div>
          </div>
          
          <div className="form-row-1223">
            <label className="form-label-1224">Nombre del Elemento:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={
                  modalDetalles?.nom_elem || 
                  modalDetalles?.nom_elemento || 
                  modalDetalles?.elemento || 
                  modalDetalles?.nombre || 
                  'No disponible'
                } 
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
                  value={(() => {
                    const estado = Number(modalDetalles?.id_est_tick || modalDetalles?.estado);
                    return estado === 1 ? '🟢 Activo' : estado === 2 ? '🟡 Pendiente' : estado === 3 ? '🔴 Inactivo' : 'No disponible';
                  })()} 
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
            <>
              <Button variant="warning" onClick={handleEditarEstado}>
                Editar Estado
              </Button>
              <Button variant="info" onClick={() => setEditandoProblema(true)} style={{ marginLeft: 8 }}>
                Editar Problema
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => { setEditandoEstado(false); setEditandoProblema(false); }} disabled={guardando}>
                Cancelar
              </Button>
              <Button variant="success" onClick={handleGuardarEstado} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar'}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

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

      <Modal show={showAllHistorialModal} onHide={() => setShowAllHistorialModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Descargar historial de tickets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Vas a descargar un único PDF que contendrá las entradas de trazabilidad de todos los tickets. ¿Deseas continuar?</p>
          {downloadAllLoading && (
            <div className="text-center">
              <Spinner animation="border" /> <div className="mt-2">Generando PDF...</div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAllHistorialModal(false)} disabled={downloadAllLoading}>Cancelar</Button>
          <Button variant="success" onClick={async () => {
            setDownloadAllLoading(true);
            try {
              const ticketsList = await obtenerTickets();
              const fetches = (Array.isArray(ticketsList) ? ticketsList : []).map(async (t) => {
                const id = t.id_tickets ?? t.id;
                try {
                  const data = await obtenerHistorialPorTicket(id);
                  return { ticketId: id, ticket: t, entries: Array.isArray(data) ? data : [] };
                } catch (e) {
                  return { ticketId: id, ticket: t, entries: [] };
                }
              });
              const results = await Promise.all(fetches);

              const allEntries = [];
              results.forEach(r => {
                (r.entries || []).forEach(e => {
                  allEntries.push({
                    ...e,
                    _ticketId: r.ticketId,
                    _ticketObj: r.ticket
                  });
                });
              });

              const doc = new jsPDF();
              doc.setFontSize(18);
              const title = 'Reporte de Trazabilidad - Todos los tickets';
              doc.text(title, 10, 15);
              doc.setFontSize(11);
              let y = 30;
              if (allEntries.length === 0) {
                doc.text('No se encontraron entradas de trazabilidad.', 10, y);
              } else {
                allEntries.forEach((h, idx) => {
                  const id = h.id_trsa ?? h.id ?? '';
                  const fecha = h.fech ?? h.fecha ?? '';
                  const observ = h.obser ?? h.obse ?? h.descripcion ?? '';
                  const elemento = h.nom_elemen ?? h.nom_elem ?? h.elemento ?? '';
                  const ticketNum = h._ticketId ?? h.id_ticet ?? h.id_tickets ?? '';
                  const usuario = h.nom_us ?? h.nom_usu ?? (h.usuario && h.usuario.nombre) ?? '';

                  doc.setFontSize(12);
                  doc.text(`Entrada #${id} — Ticket: ${ticketNum}`, 10, y);
                  y += 7;
                  doc.setFontSize(10);
                  doc.text(`Fecha: ${fecha}`, 10, y);
                  y += 6;
                  doc.text(`Usuario: ${usuario}`, 10, y);
                  y += 6;
                  doc.text(`Elemento: ${elemento}`, 10, y);
                  y += 8;
                  // Observación possibly multiline
                  const lines = doc.splitTextToSize(`Observación: ${observ}`, 180);
                  doc.text(lines, 10, y);
                  y += (lines.length * 6) + 8;

                  if (y > 270) { doc.addPage(); y = 20; }
                });
              }
              const now = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
              doc.save(`reporte_trazabilidad_todos_${now}.pdf`);
            } catch (err) {
              console.error('Error generando PDF:', err);
              alert('Error al generar el PDF: ' + err.message);
            } finally {
              setDownloadAllLoading(false);
              setShowAllHistorialModal(false);
            }
          }} disabled={downloadAllLoading}>Descargar PDF</Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
};

export default Admin;