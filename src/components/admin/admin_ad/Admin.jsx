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
import { getToken } from '../../../api/AuthApi';
import ReportarEquipo from '../../Home/ReportarEquipo/ReportarEquipo.jsx';
import { obtenerCategoria } from '../../../api/CategoriaApi.js';
import { obtenerSubcategorias } from '../../../api/SubcategotiaApi.js';
import ElementosService from '../../../api/ElementosApi.js';

const Listaxd = ({ onVerClick, onCrearClick, onOpenAllHistorial, refreshTrigger }) => {
  // --- MODAL HISTORIAL DE TICKETS ---
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [historialTicket, setHistorialTicket] = useState([]);
  const [historialEdit, setHistorialEdit] = useState({});
  const [historialLoading, setHistorialLoading] = useState(false);
  const [historialError, setHistorialError] = useState(null);
  const [historialTicketId, setHistorialTicketId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  // Descargar historial en PDF (individual) - formato vertical, etiqueta en su propia línea
  const handleDownloadPDF = async () => {
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const margin = 40;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = 60;

      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('Historial Técnico - Ticket', pageWidth / 2, y, { align: 'center' });
      y += 20;
      doc.setDrawColor(40);
      doc.setLineWidth(0.6);
      doc.line(margin, y, pageWidth - margin, y);
      y += 18;

      // Tomar ticket actual si está disponible
      let ticket = (historialTicket && historialTicket[0] && historialTicket[0]._ticketObj) || currentTicket || {};
      const ticketId = (ticket.id_tickets ?? ticket.id) || historialTicketId || '';
      // intentar obtener versión más actual del ticket si existe
      if (ticketId) {
        try {
          const all = await obtenerTickets();
          if (Array.isArray(all)) {
            const found = all.find(t => String(t.id_tickets ?? t.id) === String(ticketId));
            if (found) ticket = { ...ticket, ...found };
          }
        } catch (err) {
          console.warn('No se pudo obtener ticket actualizado:', err);
        }
      }

      const elemento = ticket.nom_elem ?? ticket.nom_eleme ?? ticket.elemento ?? '';
      const categoria = ticket.categoria ?? ticket.nom_cat ?? '';
      const subcategoria = ticket.subcategoria ?? ticket.nom_subcateg ?? '';
      const fechaApertura = ticket.fecha_in ?? ticket.fecha_creacion ?? ticket.fech ?? ticket.fecha ?? '';
      const fechaFin = ticket.fecha_fin ?? ticket.fecha_fn ?? ticket.fecha_fin ?? '';
      const instructorObservacion = ticket.observacion || ticket.observa || ticket.obser || ticket.descripcion || '';
      const rawEstado = ticket.id_est_tick ?? ticket.estado ?? null;
      const estadoLabel = (() => {
        const n = rawEstado == null ? null : Number(rawEstado);
        if (!n) return (rawEstado && String(rawEstado)) || 'Desconocido';
        return n === 1 ? 'Activo' : n === 2 ? 'Pendiente' : n === 3 ? 'Terminado' : n === 4 ? 'Inactivo' : String(rawEstado);
      })();

      const infoLines = [
        ['ID', ticketId || '—'],
        ['Elemento', elemento || '—'],
        ['Categoría', categoria || '—'],
        ['Subcategoría', subcategoria || '—'],
        ['Estado', estadoLabel || '—'],
        ['Fecha apertura', fechaApertura || '—'],
        ['Fecha fin', fechaFin || '—'],
        ['Observación (Instructor)', instructorObservacion || '—']
      ];

      for (let i = 0; i < infoLines.length; i++) {
        const label = String(infoLines[i][0] || '');
        const value = String(infoLines[i][1] || '—');
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`${label}`, margin, y);
        y += 14;
        doc.setFont(undefined, 'normal');
        const wrapped = doc.splitTextToSize(value, pageWidth - margin * 2 - 10);
        doc.text(wrapped, margin + 6, y);
        y += wrapped.length * 12 + 10;
        if (y > pageHeight - 80) {
          doc.addPage();
          y = 60;
        }
      }

      // Obtener trazabilidad completa y renderizar
      let allHist = [];
      try {
        if (ticketId) {
          const remote = await obtenerHistorialPorTicket(ticketId);
          allHist = Array.isArray(remote) ? remote : [];
        }
      } catch (err) {
        console.warn('No se pudo obtener trazabilidad completa:', err);
      }

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Trazabilidad', margin, y);
      y += 16;

      if (!allHist || allHist.length === 0) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text('No se encontraron entradas de trazabilidad para este ticket.', margin, y);
      } else {
        const entries = [...allHist].filter(e => {
          const observRaw = (e.obser ?? e.obse ?? e.descripcion ?? '').toString().trim();
          const reporter = typeof e.nom_us_reporta !== 'undefined' && e.nom_us_reporta !== null;
          if (!observRaw && reporter) return false;
          return true;
        }).sort((a, b) => new Date(a.fech || a.fecha || 0) - new Date(b.fech || b.fecha || 0));

        for (let i = 0; i < entries.length; i++) {
          const h = entries[i];
          const fecha = h.fech ?? h.fecha ?? '';
          const usuario = h.nom_us ?? h.nom_usu ?? (h.usuario && h.usuario.nombre) ?? '';
          const observ = (h.obser ?? h.obse ?? h.descripcion ?? '').toString().trim();

          doc.setFont(undefined, 'bold');
          doc.setFontSize(11);
          const headerLabel = usuario ? `${fecha} — ${usuario}` : `${fecha}`;
          doc.text(headerLabel, margin, y);
          y += 14;

          doc.setFont(undefined, 'normal');
          const obsText = observ || (usuario ? 'Sin observaciones' : '');
          if (obsText) {
            const split = doc.splitTextToSize(obsText, pageWidth - margin * 2 - 6);
            doc.text(split, margin, y);
            y += split.length * 12 + 10;
          }

          doc.setDrawColor(220);
          doc.setLineWidth(0.4);
          doc.line(margin, y - 6, pageWidth - margin, y - 6);
          y += 8;

          if (y > pageHeight - 80) {
            doc.addPage();
            y = 60;
          }
        }
      }

      const now = new Date().toISOString().replace(/[:.]/g, '-');
      doc.save(`historial_ticket_${ticketId || historialTicketId || now}.pdf`);
    } catch (err) {
      console.error('Error generando PDF individual:', err);
      alert('Error al generar el PDF: ' + (err.message || err));
    }
  };

  const handleOpenHistorialModal = async (ticket) => {
    setShowHistorialModal(true);
    setCurrentTicket(ticket || null);
    setHistorialLoading(true);
    setHistorialError(null);
    setHistorialTicketId(ticket.id || ticket.id_tickets);
    try {
      const data = await obtenerHistorialPorTicket(ticket.id || ticket.id_tickets);
      console.log('Historial recibido para ticket', ticket.id || ticket.id_tickets, data);
      let ultimaTrazabilidad = [];
      if (data && data.length > 0) {
        const sortedData = [...data].sort((a, b) => {
          const fechaA = new Date(a.fech || a.fecha || 0);
          const fechaB = new Date(b.fech || b.fecha || 0);
          return fechaB - fechaA;
        });
        ultimaTrazabilidad = [sortedData[0]];
      }
      
      setHistorialTicket(ultimaTrazabilidad);
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
    setCurrentTicket(null);
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
      try {
        const elementos = await ElementosService.obtenerElementos();
        const enriched = Array.isArray(datosTickets) ? datosTickets.map(t => {
            const elemId = t.id_eleme ?? t.id_elem ?? t.id_elemento ?? t.id_elemenn;
            const nombreElementoTicket = (t.nom_elem || t.nom_eleme || t.elemento || '').toString();
            let elementoRelacionado = Array.isArray(elementos) ? (
              elementos.find(e => e.id_elemen === elemId || e.id_elemen == elemId || e.id === elemId || e.id == elemId)
            ) : null;
            if (!elementoRelacionado && nombreElementoTicket) {
              const ticketNameLow = nombreElementoTicket.toLowerCase();
              elementoRelacionado = elementos.find(e => {
                const en = (e.nom_eleme || e.nom_elemen || e.nom || e.nombre || '').toString().toLowerCase();
                return en === ticketNameLow || en.includes(ticketNameLow) || ticketNameLow.includes(en);
              }) || null;
            }

            const categoriaName = elementoRelacionado ? (elementoRelacionado.tip_catg || elementoRelacionado.nom_cat || '') : (t.nom_cat || '');
            const subcategoriaName = elementoRelacionado ? (elementoRelacionado.sub_catg || elementoRelacionado.nom_subcateg || '') : (t.nom_subcateg || '');

            return {
              ...t,
              elementoRelacionado,
              categoria: categoriaName,
              subcategoria: subcategoriaName
            };
          }) : [];
        setTickets(enriched);
      } catch (err) {
        console.warn('No se pudieron obtener elementos para enriquecer tickets:', err);
        setTickets(Array.isArray(datosTickets) ? datosTickets : []);
      }
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

  useEffect(() => {
    if (refreshTrigger) {
      cargarTickets();
    }
  }, [refreshTrigger]);

  const cargarCategoriasYSubcategorias = async () => {
    try {
      const [datosCateg, datosSubcateg, elementos] = await Promise.all([
        obtenerCategoria(),
        obtenerSubcategorias(),
        ElementosService.obtenerElementos().catch(() => [])
      ]);

      const apiCategorias = Array.isArray(datosCateg) ? datosCateg : [];
      const apiSubcategorias = Array.isArray(datosSubcateg) ? datosSubcateg : [];
      const elementosArr = Array.isArray(elementos) ? elementos : [];
      const categoriasFromElements = [];
      const subcategoriasFromElements = [];
      elementosArr.forEach(e => {
        const catName = e.tip_catg || e.nom_cat || e.categoria || '';
        const subName = e.sub_catg || e.nom_subcateg || e.subcategoria || '';
        if (catName && !categoriasFromElements.find(c => c.nom_cat === catName)) {
          categoriasFromElements.push({ id_cat: null, nom_cat: catName });
        }
        if (subName) {
          subcategoriasFromElements.push({ id: null, nom_subcateg: subName, nom_cat: catName || null });
        }
      });
      const mergedCategorias = [...apiCategorias];
      categoriasFromElements.forEach(c => {
        if (!mergedCategorias.find(mc => mc.nom_cat === c.nom_cat)) mergedCategorias.push(c);
      });

      const mergedSubcategorias = [...apiSubcategorias];
      subcategoriasFromElements.forEach(s => {
        if (!mergedSubcategorias.find(ms => ms.nom_subcateg === s.nom_subcateg)) mergedSubcategorias.push(s);
      });

      setCategorias(mergedCategorias);
      setSubcategorias(mergedSubcategorias);
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
    if (selectedStatusFilter !== "Todos los Estados") {
      const estadoTicket = Number(ticket?.id_est_tick || ticket?.estado);
      if (selectedStatusFilter === "Activo" && estadoTicket !== 1) return false;
      if (selectedStatusFilter === "Pendiente" && estadoTicket !== 2) return false;
      if (selectedStatusFilter === "Terminado" && estadoTicket !== 3) return false;
      if (selectedStatusFilter === "Inactivo" && estadoTicket !== 4) return false;
    }
    if (selectedCategoryFilter && selectedCategoryFilter !== "Todas las Categorías") {
      const ticketCat = ticket.categoria || ticket.elementoRelacionado?.tip_catg || ticket.nom_cat || '';
      if (!ticketCat || ticketCat !== selectedCategoryFilter) return false;
    }
    if (selectedSubcategoryFilter && selectedSubcategoryFilter !== "Todas las Subcategorías") {
      const ticketSub = ticket.subcategoria || ticket.elementoRelacionado?.sub_catg || ticket.nom_subcateg || '';
      if (!ticketSub || ticketSub !== selectedSubcategoryFilter) return false;
    }

    return true;
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
        const subNom = sub.nom_subcateg || sub.sub_catg || '';
        const subNomCat = sub.nom_cat || sub.sub_catg || sub.nom_cat || '';
        if (sub.nom_cat) return sub.nom_cat === selectedCategoryFilter;
        if (sub.id_cat) {
          const categoria = categorias.find(cat => cat.id_cat === sub.id_cat);
          return categoria && categoria.nom_cat === selectedCategoryFilter;
        }
        return false;
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
                    onClick={() => handleStatusFilter("Terminado")}
                    className="dropdown-item-xd148"
                  >
                    ✅ Terminado
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
                  return estado === 1 ? 'activo' : estado === 2 ? 'pendiente' : estado === 3 ? 'terminado' : estado === 4 ? 'inactivo' : 'pendiente';
                })()}`}>
                  {(() => {
                    const estado = Number(t?.id_est_tick || t?.estado);
                    return estado === 1 ? '🟢 Activo' : estado === 2 ? '🟡 Pendiente' : estado === 3 ? '✅ Terminado' : estado === 4 ? '🔴 Inactivo' : 'Pendiente';
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
                
                // Quién respondió (técnico)
                const tecnico = h.nom_us ?? h.nom_usu ?? (h.usuario && h.usuario.nombre) ?? '';
                const cedulaTecnico = h.num_doc ?? (h.usuario && h.usuario.num_doc) ?? '';
                
                // Quién reportó
                const usuarioReporta = h.nom_us_reporta ?? '';
                const cedulaReporta = h.num_doc_reporta ?? '';
                
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
                      <div className="meta-item" style={{ gridColumn: '1 / -1' }}>
                        <div className="meta-label">Reportado por / Respondido por</div>
                        <div className="meta-value" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                          <div>
                            <strong>Reportó:</strong> {usuarioReporta || 'N/A'}
                          </div>
                          <div style={{ borderLeft: '1px solid #ddd', paddingLeft: '20px' }}>
                            <strong>Respondió (Técnico):</strong> {tecnico}
                          </div>
                        </div>
                      </div>
                      
                      <div className="meta-item">
                        <div className="meta-label">Elemento</div>
                        <div className="meta-value">{elemento}</div>
                      </div>
                    </div>

                    <div className="report-body">
                      <div className="report-section-label">Respuesta del Técnico</div>
                      <div className="report-observacion">{observ || 'Sin respuesta registrada'}</div>
                    </div>

                    {editMode && (
                      <div className="historial-edit">
                        <Form.Control 
                          as="textarea" 
                          rows={4} 
                          value={historialEdit[id]?.obser ?? observ} 
                          onChange={e => handleEditHistorialChange(id, 'obser', e.target.value)} 
                        />
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
  const [showDFModal, setShowDFModal] = useState(false);
  const [dfLoading, setDfLoading] = useState(false);
  const [allTicketsDF, setAllTicketsDF] = useState([]);
  const [allIndividualPdfs, setAllIndividualPdfs] = useState([]); // { ticketId, filename, url }
  const [generatingIndividualPdfs, setGeneratingIndividualPdfs] = useState(false);
  const [showIndividualPdfsModal, setShowIndividualPdfsModal] = useState(false);
  const [editandoEstado, setEditandoEstado] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [editandoProblema, setEditandoProblema] = useState(false);
  const [nuevoProblema, setNuevoProblema] = useState('');
  const [problemas, setProblemas] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  useEffect(() => {
    if (showModal) {
      // Cargar problemas solo si se abre el modal
      import('../../../api/ProblemasApi').then(({ obtenerProblemas }) => {
        obtenerProblemas()
          .then((res) => {
            const normalized = Array.isArray(res) ? res.map(p => ({
              id: p.id ?? p.ID ?? p.id_problema,
              descripcion: p.descr_problem ?? p.descripcion ?? p.desc_problema ?? p.desc ?? p.desc_problema ?? p.descr ?? ''
            })) : [];
            setProblemas(normalized);
          })
          .catch(() => setProblemas([]));
      });
    }
  }, [showModal]);

  const handleVerClick = (detalles) => {
    console.log('🔍 Datos del ticket completos:', detalles);
    console.log('📋 Campo Obser (mayúscula):', detalles?.Obser);
    console.log('📋 Campo obser (minúscula):', detalles?.obser);
    console.log('🖼️ Campo imageness (raw):', detalles?.imageness || detalles?.imagenes || detalles?.imagen);
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
      // Recargar tickets sin recargar toda la página
      setRefreshTrigger(prev => prev + 1);
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

  const handleDownloadAllPdf = async () => {
    setDownloadAllLoading(true);
    try {
      const token = getToken();
      if (!token) {
        alert('No estás autenticado. Por favor inicia sesión y vuelve a intentarlo.');
        return;
      }

      const ticketsList = await obtenerTickets();
      const ticketsArr = Array.isArray(ticketsList) ? ticketsList : [];
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const margin = 40;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      // Título principal
      let y = 60;
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('Reporte Completo - Tickets y Trazabilidad', pageWidth / 2, y, { align: 'center' });
      y += 20;
      doc.setDrawColor(40);
      doc.setLineWidth(0.6);
      doc.line(margin, y, pageWidth - margin, y);
      y += 18;

      for (let ti = 0; ti < ticketsArr.length; ti++) {
        const t = ticketsArr[ti];
        if (ti > 0) {
          doc.addPage();
          y = 60;
        }

        const ticketId = t.id_tickets ?? t.id ?? '';
        const elemento = t.nom_elem ?? t.nom_eleme ?? t.elementoRelacionado?.nom_eleme ?? t.elemento ?? '';
        const categoria = t.categoria ?? t.nom_cat ?? t.elementoRelacionado?.tip_catg ?? '';
        const subcategoria = t.subcategoria ?? t.nom_subcateg ?? t.elementoRelacionado?.sub_catg ?? '';
        const fechaApertura = t.fecha_in ?? t.fecha_creacion ?? t.fech ?? t.fecha ?? '';
        const fechaFin = t.fecha_fin ?? t.fecha_fn ?? t.fecha_fin ?? '';
        const descripcion = t.observacion ?? t.observa ?? t.descripcion ?? t.descr_problem ?? t.asunto ?? t.titulo ?? '';
        const rawEstado = t.id_est_tick ?? t.estado ?? null;
        const estadoLabel = (() => {
          const n = rawEstado == null ? null : Number(rawEstado);
          if (!n) return (rawEstado && String(rawEstado)) || 'Desconocido';
          return n === 1 ? 'Activo' : n === 2 ? 'Pendiente' : n === 3 ? 'Terminado' : n === 4 ? 'Inactivo' : String(rawEstado);
        })();
        const instructorObservacion = t.observacion || t.observa || t.obser || descripcion || '';

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`Ticket: ${ticketId || ('#' + (ti + 1))}`, margin, y);
        y += 18;

        const infoLines = [
          ['Elemento', elemento || '—'],
          ['Categoría', categoria || '—'],
          ['Subcategoría', subcategoria || '—'],
          ['Estado', estadoLabel || '—'],
          ['Fecha apertura', fechaApertura || '—'],
          ['Fecha fin', fechaFin || '—'],
          ['Observación (Instructor)', instructorObservacion || '—']
        ];

        for (let j = 0; j < infoLines.length; j++) {
          const label = String(infoLines[j][0] || '');
          const value = String(infoLines[j][1] || '—');
                  doc.setFontSize(11);
                  doc.setFont(undefined, 'bold');
                  doc.text(`${label}`, margin, y);
                  y += 14;
                  doc.setFont(undefined, 'normal');
          const wrapped = doc.splitTextToSize(value, pageWidth - margin * 2 - 10);
          doc.text(wrapped, margin + 6, y);
          y += wrapped.length * 12 + 8;
          if (y > pageHeight - 80) {
            doc.addPage();
            y = 60;
          }
        }

        let entries = [];
        try {
          const remote = await obtenerHistorialPorTicket(ticketId);
          entries = Array.isArray(remote) ? remote : [];
        } catch (err) {
          console.warn('No se pudo obtener trazabilidad para ticket', ticketId, err);
          entries = [];
        }

        doc.setFontSize(13);
        doc.setFont(undefined, 'bold');
        doc.text('Trazabilidad', margin, y);
        y += 16;

        if (!entries || entries.length === 0) {
          doc.setFontSize(11);
          doc.setFont(undefined, 'normal');
          doc.text('No se encontraron entradas de trazabilidad para este ticket.', margin, y);
          y += 14;
        } else {
          const filtered = entries.filter(e => {
            const observRaw = (e.obser ?? e.obse ?? e.descripcion ?? '').toString().trim();
            const reporter = typeof e.nom_us_reporta !== 'undefined' && e.nom_us_reporta !== null;
            if (!observRaw && reporter) return false;
            return true;
          }).sort((a, b) => new Date(a.fech || a.fecha || 0) - new Date(b.fech || b.fecha || 0));

          for (let k = 0; k < filtered.length; k++) {
            const h = filtered[k];
            const fecha = h.fech ?? h.fecha ?? '';
            const usuario = h.nom_us ?? h.nom_usu ?? (h.usuario && h.usuario.nombre) ?? h.tecnico ?? '';
            const observ = (h.obser ?? h.obse ?? h.descripcion ?? '').toString().trim();

            doc.setFont(undefined, 'bold');
            const headerLabel = usuario ? `${fecha} — ${usuario}` : `${fecha}`;
            doc.setFontSize(11);
            doc.text(headerLabel, margin, y);
            y += 14;

            doc.setFont(undefined, 'normal');
            const obsText = observ || (usuario ? 'Sin observaciones' : '');
            if (obsText) {
              const split = doc.splitTextToSize(obsText, pageWidth - margin * 2 - 6);
              doc.text(split, margin, y);
              y += split.length * 12 + 10;
            }

            doc.setDrawColor(220);
            doc.setLineWidth(0.4);
            doc.line(margin, y - 6, pageWidth - margin, y - 6);
            y += 8;

            if (y > pageHeight - 80) {
              doc.addPage();
              y = 60;
            }
          }
        }
      }

      const now = new Date().toISOString().replace(/[:.]/g, '-');
      doc.save(`reporte_tickets_trazabilidad_completo_${now}.pdf`);
    } catch (err) {
      console.error('Error generando PDF:', err);
      if (err && err.message && err.message.indexOf('403') !== -1) {
        alert('Acceso denegado (403). Tu sesión puede no tener permisos o el token expiró. Intenta iniciar sesión nuevamente o contacta al administrador.');
      } else {
        alert('Error al generar el PDF: ' + (err.message || err));
      }
    } finally {
      setDownloadAllLoading(false);
      setShowAllHistorialModal(false);
    }
  };

  // Construir 'dataframe' (array de filas) combinando ticket + trazabilidad
  const buildTicketsDataFrame = async () => {
    setDfLoading(true);
    try {
      const ticketsList = await obtenerTickets();
      const ticketsArr = Array.isArray(ticketsList) ? ticketsList : [];
      const rows = [];

      for (let i = 0; i < ticketsArr.length; i++) {
        const t = ticketsArr[i];
        const ticketId = t.id_tickets ?? t.id ?? '';
        const elemento = t.nom_elem ?? t.nom_eleme ?? t.elemento ?? '';
        const categoria = t.categoria ?? t.nom_cat ?? '';
        const subcategoria = t.subcategoria ?? t.nom_subcateg ?? '';
        const fechaApertura = t.fecha_in ?? t.fecha_creacion ?? t.fech ?? t.fecha ?? '';
        const fechaFin = t.fecha_fin ?? t.fecha_fn ?? t.fecha_fin ?? '';
        const descripcion = t.observacion ?? t.observa ?? t.descripcion ?? '';
        const rawEstado = t.id_est_tick ?? t.estado ?? null;
        const estadoLabel = (() => {
          const n = rawEstado == null ? null : Number(rawEstado);
          if (!n) return (rawEstado && String(rawEstado)) || 'Desconocido';
          return n === 1 ? 'Activo' : n === 2 ? 'Pendiente' : n === 3 ? 'Terminado' : n === 4 ? 'Inactivo' : String(rawEstado);
        })();

        // Obtener trazabilidad para este ticket
        let entries = [];
        try {
          const remote = await obtenerHistorialPorTicket(ticketId);
          entries = Array.isArray(remote) ? remote : [];
        } catch (err) {
          entries = [];
        }

        if (!entries || entries.length === 0) {
          rows.push({
            ticketId,
            elemento,
            categoria,
            subcategoria,
            estado: estadoLabel,
            fechaApertura,
            fechaFin,
            descripcion,
            trace_id: '',
            trace_fecha: '',
            trace_usuario: '',
            trace_observacion: ''
          });
        } else {
          for (let k = 0; k < entries.length; k++) {
            const h = entries[k];
            const traceId = h.id_trsa ?? h.id ?? '';
            const traceFecha = h.fech ?? h.fecha ?? '';
            const traceUsuario = h.nom_us ?? h.nom_usu ?? (h.usuario && h.usuario.nombre) ?? '';
            const traceObserv = (h.obser ?? h.obse ?? h.descripcion ?? '').toString().trim();

            rows.push({
              ticketId,
              elemento,
              categoria,
              subcategoria,
              estado: estadoLabel,
              fechaApertura,
              fechaFin,
              descripcion,
              trace_id: traceId,
              trace_fecha: traceFecha,
              trace_usuario: traceUsuario,
              trace_observacion: traceObserv
            });
          }
        }
      }

      setAllTicketsDF(rows);
      return rows;
    } finally {
      setDfLoading(false);
    }
  };

  const downloadCsvFromArray = (arr, filename = 'tickets_trazabilidad.csv') => {
    if (!Array.isArray(arr) || arr.length === 0) {
      alert('No hay datos disponibles para descargar.');
      return;
    }
    const keys = Object.keys(arr[0]);
    const csvLines = [keys.join(',')];
    for (const r of arr) {
      const vals = keys.map(k => {
        const v = r[k] == null ? '' : String(r[k]);
        // Escape quotes
        return '"' + v.replace(/"/g, '""') + '"';
      });
      csvLines.push(vals.join(','));
    }
    const csv = csvLines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Generar PDF (blob URL) para un ticket individual sin modificar su contenido
  const generatePdfForTicket = async (t) => {
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const margin = 40;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = 60;

      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('Historial Técnico - Ticket', pageWidth / 2, y, { align: 'center' });
      y += 20;
      doc.setDrawColor(40);
      doc.setLineWidth(0.6);
      doc.line(margin, y, pageWidth - margin, y);
      y += 18;

      const ticketId = t.id_tickets ?? t.id ?? '';
      const elemento = t.nom_elem ?? t.nom_eleme ?? t.elemento ?? '';
      const categoria = t.categoria ?? t.nom_cat ?? '';
      const subcategoria = t.subcategoria ?? t.nom_subcateg ?? '';
      const fechaApertura = t.fecha_in ?? t.fecha_creacion ?? t.fech ?? t.fecha ?? '';
      const fechaFin = t.fecha_fin ?? t.fecha_fn ?? t.fecha_fin ?? '';
      const instructorObservacion = t.observacion || t.observa || t.obser || t.descripcion || '';
      const rawEstado = t.id_est_tick ?? t.estado ?? null;
      const estadoLabel = (() => {
        const n = rawEstado == null ? null : Number(rawEstado);
        if (!n) return (rawEstado && String(rawEstado)) || 'Desconocido';
        return n === 1 ? 'Activo' : n === 2 ? 'Pendiente' : n === 3 ? 'Terminado' : n === 4 ? 'Inactivo' : String(rawEstado);
      })();

      const infoLines = [
        ['ID', ticketId || '—'],
        ['Elemento', elemento || '—'],
        ['Categoría', categoria || '—'],
        ['Subcategoría', subcategoria || '—'],
        ['Estado', estadoLabel || '—'],
        ['Fecha apertura', fechaApertura || '—'],
        ['Fecha fin', fechaFin || '—'],
        ['Observación (Instructor)', instructorObservacion || '—']
      ];

      for (let i = 0; i < infoLines.length; i++) {
        const label = String(infoLines[i][0] || '');
        const value = String(infoLines[i][1] || '—');
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`${label}`, margin, y);
        y += 14;
        doc.setFont(undefined, 'normal');
        const wrapped = doc.splitTextToSize(value, pageWidth - margin * 2 - 10);
        doc.text(wrapped, margin + 6, y);
        y += wrapped.length * 12 + 10;
        if (y > pageHeight - 80) {
          doc.addPage();
          y = 60;
        }
      }

      // obtener trazabilidad
      let allHist = [];
      try {
        if (ticketId) {
          const remote = await obtenerHistorialPorTicket(ticketId);
          allHist = Array.isArray(remote) ? remote : [];
        }
      } catch (err) {
        allHist = [];
      }

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Trazabilidad', margin, y);
      y += 16;

      if (!allHist || allHist.length === 0) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text('No se encontraron entradas de trazabilidad para este ticket.', margin, y);
      } else {
        const entries = [...allHist].filter(e => {
          const observRaw = (e.obser ?? e.obse ?? e.descripcion ?? '').toString().trim();
          const reporter = typeof e.nom_us_reporta !== 'undefined' && e.nom_us_reporta !== null;
          if (!observRaw && reporter) return false;
          return true;
        }).sort((a, b) => new Date(a.fech || a.fecha || 0) - new Date(b.fech || b.fecha || 0));

        for (let i = 0; i < entries.length; i++) {
          const h = entries[i];
          const fecha = h.fech ?? h.fecha ?? '';
          const usuario = h.nom_us ?? h.nom_usu ?? (h.usuario && h.usuario.nombre) ?? '';
          const observ = (h.obser ?? h.obse ?? h.descripcion ?? '').toString().trim();

          doc.setFont(undefined, 'bold');
          doc.setFontSize(11);
          const headerLabel = usuario ? `${fecha} — ${usuario}` : `${fecha}`;
          doc.text(headerLabel, margin, y);
          y += 14;

          doc.setFont(undefined, 'normal');
          const obsText = observ || (usuario ? 'Sin observaciones' : '');
          if (obsText) {
            const split = doc.splitTextToSize(obsText, pageWidth - margin * 2 - 6);
            doc.text(split, margin, y);
            y += split.length * 12 + 10;
          }

          doc.setDrawColor(220);
          doc.setLineWidth(0.4);
          doc.line(margin, y - 6, pageWidth - margin, y - 6);
          y += 8;

          if (y > pageHeight - 80) {
            doc.addPage();
            y = 60;
          }
        }
      }

      const filename = `historial_ticket_${ticketId || new Date().toISOString().replace(/[:.]/g, '-')}.pdf`;
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      return { filename, url };
    } catch (err) {
      console.error('Error generando PDF para ticket', t, err);
      throw err;
    }
  };

  const handleGenerateAllIndividualPdfs = async () => {
    setGeneratingIndividualPdfs(true);
    try {
      const ticketsList = await obtenerTickets();
      const ticketsArr = Array.isArray(ticketsList) ? ticketsList : [];
      const out = [];
      for (let i = 0; i < ticketsArr.length; i++) {
        const t = ticketsArr[i];
        try {
          const res = await generatePdfForTicket(t);
          out.push({ ticketId: t.id_tickets ?? t.id ?? (`${i+1}`), filename: res.filename, url: res.url });
        } catch (err) {
          console.warn('No se pudo generar PDF para ticket', t.id_tickets ?? t.id, err);
        }
      }
      setAllIndividualPdfs(out);
      setShowIndividualPdfsModal(true);
    } finally {
      setGeneratingIndividualPdfs(false);
    }
  };

  const clearIndividualPdfs = () => {
    if (Array.isArray(allIndividualPdfs)) {
      allIndividualPdfs.forEach(p => { try { URL.revokeObjectURL(p.url); } catch(e){} });
    }
    setAllIndividualPdfs([]);
    setShowIndividualPdfsModal(false);
  };

  return (
    <div className="page-with-footer-1227">
      <HeaderAd />
      <Listaxd onVerClick={handleVerClick} onCrearClick={handleOpenCrearModal} onOpenAllHistorial={handleDownloadAllPdf} refreshTrigger={refreshTrigger} />
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
            <label className="form-label-1224">Observaciones:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                as="textarea"
                rows={3}
                value={
                  modalDetalles?.obser || 
                  modalDetalles?.Obser || 
                  'No disponible'
                } 
                readOnly 
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
          <div className="form-row-1223">
            <label className="form-label-1224">Imagen:</label>
            <div className="form-control-wrap-1225" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              {(() => {
                const raw = modalDetalles?.imageness || modalDetalles?.imagenes || modalDetalles?.imagen || null;
                if (!raw) return (<div style={{ color: '#777' }}>No disponible</div>);

                let urls = [];
                try {
                  if (Array.isArray(raw)) urls = raw;
                  else if (typeof raw === 'string') {
                    const s = raw.trim();
                    // JSON array stored as string
                    if ((s.startsWith('[') && s.endsWith(']')) || (s.startsWith('{') && s.endsWith('}')) ) {
                      const parsed = JSON.parse(s);
                      if (Array.isArray(parsed)) urls = parsed;
                      else if (typeof parsed === 'string') urls = [parsed];
                      else urls = [];
                    } else {
                      // single URL or base64
                      urls = [s];
                    }
                  }
                } catch (e) {
                  urls = [raw];
                }

                if (!urls || urls.length === 0) return (<div style={{ color: '#777' }}>No disponible</div>);

                const normalize = (u) => {
                  if (!u) return null;
                  if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
                  if (u.startsWith('/uploads/')) {
                    const isViteDev = window.location.hostname === 'localhost' && window.location.port === '5173';
                    const backendOrigin = isViteDev ? 'http://localhost:8081' : window.location.origin;
                    return backendOrigin + u;
                  }
                  return u;
                };

                return urls.map((u, idx) => {
                  const src = normalize(u);
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <img
                        src={src}
                        alt={`imagen-ticket-${idx}`}
                        style={{ maxWidth: 220, maxHeight: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid #e6e6e6' }}
                        onError={async (e) => {
                          console.warn('[IMG] Error cargando imagen (frontend):', src, e);
                          try {
                            const token = getToken();
                            if (token && src) {
                              const headers = {};
                              headers['Authorization'] = /^Bearer\s+/i.test(token) ? token : `Bearer ${token}`;
                              const resp = await fetch(src, { headers });
                              if (resp.ok) {
                                const blob = await resp.blob();
                                e.currentTarget.src = URL.createObjectURL(blob);
                                return;
                              }
                              console.warn('[IMG] fetch auth falló con status:', resp.status);
                            }
                          } catch (fetchErr) {
                            console.warn('[IMG] Error intentando cargar imagen con auth:', fetchErr);
                          }
                          e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="100%" height="100%" fill="#f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="16">Imagen no disponible</text></svg>';
                        }}
                      />
                      <div style={{ marginTop: 6 }}>
                        <a href={src} target="_blank" rel="noreferrer">Abrir</a>
                        {urls.length > 1 && <span style={{ color: '#666', marginLeft: 8 }}>Imagen {idx + 1}</span>}
                      </div>
                    </div>
                  );
                });
              })()}
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
                  <option value="3">Terminado</option>
                  <option value="4">Inactivo</option>
                </Form.Select>
              ) : (
                <Form.Control 
                  type="text" 
                  value={(() => {
                    const estado = Number(modalDetalles?.id_est_tick || modalDetalles?.estado);
                    return estado === 1 ? '🟢 Activo' : estado === 2 ? '🟡 Pendiente' : estado === 3 ? '✅ Terminado' : estado === 4 ? '🔴 Inactivo' : 'No disponible';
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
              setShowCrearModal(false);
              setRefreshTrigger(prev => prev + 1);
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
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <Button size="sm" variant="outline-primary" onClick={async () => {
                // Mostrar tabla DF
                await buildTicketsDataFrame();
                setShowDFModal(true);
              }}>Ver tabla (DF)</Button>
              <Button size="sm" variant="outline-success" onClick={handleDownloadAllPdf} disabled={downloadAllLoading}>Descargar PDF</Button>
              <Button size="sm" variant="outline-dark" onClick={handleGenerateAllIndividualPdfs} disabled={generatingIndividualPdfs}>
                {generatingIndividualPdfs ? 'Generando PDFs...' : 'Generar PDFs individuales'}
              </Button>
            </div>
            {downloadAllLoading && (
              <div className="text-center">
                <Spinner animation="border" /> <div className="mt-2">Generando PDF...</div>
              </div>
            )}
        </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAllHistorialModal(false)} disabled={downloadAllLoading}>Cerrar</Button>
          </Modal.Footer>
      </Modal>

        {/* Modal para mostrar la tabla (DataFrame) */}
        <Modal show={showDFModal} onHide={() => setShowDFModal(false)} size="xl" centered>
          <Modal.Header closeButton>
            <Modal.Title>Tabla: Tickets y Trazabilidad</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
            {dfLoading ? (
              <div className="text-center"><Spinner animation="border" /> Cargando...</div>
            ) : allTicketsDF && allTicketsDF.length > 0 ? (
              <div>
                <div style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
                  <Button size="sm" variant="success" onClick={() => downloadCsvFromArray(allTicketsDF)}>Descargar CSV</Button>
                  <Button size="sm" variant="outline-secondary" onClick={() => { setAllTicketsDF([]); setShowDFModal(false); }}>Cerrar</Button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table table-sm table-striped" style={{ width: '100%', fontSize: 12 }}>
                    <thead>
                      <tr>
                        {Object.keys(allTicketsDF[0]).map(k => <th key={k}>{k}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {allTicketsDF.map((r, idx) => (
                        <tr key={idx}>
                          {Object.keys(allTicketsDF[0]).map(k => <td key={k}>{r[k]}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>No hay datos. Pulsa "Ver tabla (DF)" para generarla.</div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDFModal(false)}>Cerrar</Button>
          </Modal.Footer>
        </Modal>

      {/* Modal para listar PDFs individuales generados */}
      <Modal show={showIndividualPdfsModal} onHide={() => clearIndividualPdfs()} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>PDFs individuales generados</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
          {allIndividualPdfs && allIndividualPdfs.length > 0 ? (
            <div>
              <p>Se generaron {allIndividualPdfs.length} PDFs. Descarga individualmente desde la lista:</p>
              <ul>
                {allIndividualPdfs.map((p, idx) => (
                  <li key={idx} style={{ marginBottom: 8 }}>
                    <strong>Ticket:</strong> {p.ticketId} — <a href={p.url} download={p.filename}>Descargar {p.filename}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>No se han generado PDFs todavía. Haz clic en "Generar PDFs individuales".</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => clearIndividualPdfs()}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
};

export default Admin;