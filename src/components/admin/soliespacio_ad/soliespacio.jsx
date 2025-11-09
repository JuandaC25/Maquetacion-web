import React, { useState, useEffect } from 'react';
import { Alert, Spinner, Dropdown, Modal, Form, Button } from 'react-bootstrap';
import './soliespacio.css';
import Footer from '../../Footer/Footer.jsx';
import HeaderSoliespacio from '../header_soliespacio/header_soliespacio.jsx';
import { obtenersolicitudes, crearSolicitud, eliminarSolicitud, actualizarSolicitud } from '../../../api/solicitudesApi.js';

const Soliespacio = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEstadoFilter, setSelectedEstadoFilter] = useState("Todos los Estados");
  const [selectedEspacioFilter, setSelectedEspacioFilter] = useState("Todos los Espacios");
  const [showModal, setShowModal] = useState(false);
  const [nuevaSolicitud, setNuevaSolicitud] = useState({
    id_esp: '',
    id_usu: '',
    ambient: '',
    num_fich: '',
    fecha_ini: '',
    fecha_fn: '',
    estadosoli: 1
  });
  const [guardando, setGuardando] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNuevaSolicitud({ id_esp: '', id_usu: '', ambient: '', num_fich: '', fecha_ini: '', fecha_fn: '', estadosoli: 1 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaSolicitud(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitSolicitud = async (e) => {
    e.preventDefault();
    try {
      setGuardando(true);
      const toIso = (v) => {
        if (!v) return null;
        try {
          const d = new Date(v);
          if (isNaN(d.getTime())) return v; 
          return d.toISOString();
        } catch {
          return v;
        }
      };

      const dto = {
        fecha_ini: toIso(nuevaSolicitud.fecha_ini),
        fecha_fn: toIso(nuevaSolicitud.fecha_fn),
        ambient: nuevaSolicitud.ambient,
        estadosoli: Number(nuevaSolicitud.estadosoli),
        id_usu: Number(nuevaSolicitud.id_usu) || null,
        num_fich: nuevaSolicitud.num_fich,
        id_esp: Number(nuevaSolicitud.id_esp) || null
      };
      const creado = await crearSolicitud(dto);
      const nuevaData = creado?.data || creado;
      setSolicitudes(prev => [nuevaData, ...prev]);
      handleCloseModal();
    } catch (err) {
      console.error(err);
      setError('Error al guardar la solicitud: ' + (err?.message || err));
    } finally {
      setGuardando(false);
    }
  };


  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenersolicitudes();
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar las solicitudes de espacios: ' + err.message);
      console.error('[ERROR] Error al cargar solicitudes:', err);
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoFilter = (estado) => {
    setSelectedEstadoFilter(estado);
  };

  const handleEspacioFilter = (espacio) => {
    setSelectedEspacioFilter(espacio);
  };

  const solicitudesFiltradas = solicitudes.filter(solicitud => {
    const coincideEstado = selectedEstadoFilter === "Todos los Estados" ||
                          getEstadoBadge(solicitud.estadosoli).text === selectedEstadoFilter;
    const coincideEspacio = selectedEspacioFilter === "Todos los Espacios" ||
                           (solicitud.espacio?.nombre || 'N/A') === selectedEspacioFilter;
    return coincideEstado && coincideEspacio;
  });

  const getEstadoBadge = (estado) => {
    const estados = {
      1: { text: 'PENDIENTE', variant: 'warning' },
      2: { text: 'APROBADO', variant: 'success' },
      3: { text: 'RECHAZADO', variant: 'danger' },
    4: { text: 'EN USO', variant: 'info' },
      5: { text: 'FINALIZADO', variant: 'secondary' }
    };
    return estados[estado] || { text: 'DESCONOCIDO', variant: 'secondary' };
  };


  const formatFecha = (fecha) => {
    if (!fecha) return 'N/A';
    try {
      return new Date(fecha).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta solicitud?')) return;
    try {
      await eliminarSolicitud(id);
      setSolicitudes(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error eliminando:', err);
      setError('Error al eliminar la solicitud: ' + (err?.message || err));
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      setLoading(true);
      const payload = { estadosoli: Number(nuevoEstado) };
      const resp = await actualizarSolicitud(id, payload);
      const actualizada = resp?.data || resp;
      setSolicitudes(prev => prev.map(s => (s.id === id ? actualizada : s)));
    } catch (err) {
      console.error('Error actualizando estado:', err);
      setError('Error al actualizar estado: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-app-container-xd25">
      <HeaderSoliespacio />
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} style={{ margin: '20px' }}>
          {error}
        </Alert>
      )}

      <Alert variant="info" className="inventory-header-bar-xd26">
        <div className="header-bar-content-xd27">
          <div className="header-left-section-xd28">
            <h1 className="inventory-main-title-xd29">Solicitudes de Espacios</h1>
            
            <div className="filters-row-xd30" style={{ marginTop: '15px' }}>
              <Dropdown className="category-filter-dropdown-xd31">
                <Dropdown.Toggle 
                  variant="success" 
                  id="dropdown-espacio"
                  className="dropdown-toggle-xd146"
                >
                  {selectedEspacioFilter} <span className="dropdown-arrow-xd32">▼</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-xd147 category-dropdown-menu-xd33">
                  <Dropdown.Item 
                    onClick={() => handleEspacioFilter("Todos los Espacios")}
                    className="dropdown-item-xd148"
                  >
                    Todos los Espacios
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => handleEspacioFilter("Polideportivo")}
                    className="dropdown-item-xd148"
                  >
                    Polideportivo
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => handleEspacioFilter("Auditorio")}
                    className="dropdown-item-xd148"
                  >
                    Auditorio
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown className="category-filter-dropdown-xd31">
                <Dropdown.Toggle 
                  variant="success" 
                  id="dropdown-estado"
                  className="dropdown-toggle-xd146"
                >
                  {selectedEstadoFilter} <span className="dropdown-arrow-xd32">▼</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-xd147 category-dropdown-menu-xd33">
                  <Dropdown.Item 
                    onClick={() => handleEstadoFilter("Todos los Estados")}
                    className="dropdown-item-xd148"
                  >
                    Todos los Estados
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => handleEstadoFilter("PENDIENTE")}
                    className="dropdown-item-xd148"
                  >
                    PENDIENTE
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => handleEstadoFilter("APROBADO")}
                    className="dropdown-item-xd148"
                  >
                    APROBADO
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => handleEstadoFilter("RECHAZADO")}
                    className="dropdown-item-xd148"
                  >
                    RECHAZADO
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => handleEstadoFilter("EN USO")}
                    className="dropdown-item-xd148"
                  >
                    EN USO
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => handleEstadoFilter("FINALIZADO")}
                    className="dropdown-item-xd148"
                  >
                    FINALIZADO
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          
          <div className="header-right-section-xd34">
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'flex-end' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>
                Los usuarios crean reservas desde la sección Home → Espacios
              </p>
              <Button variant="success" size="sm" onClick={handleOpenModal}>
                Nueva Reserva
              </Button>
            </div>
          </div>
        </div>
      </Alert>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p style={{ marginTop: '20px' }}>Cargando solicitudes...</p>
        </div>
      ) : (
        <div className="equipment-list-grid-xd09">
          {solicitudesFiltradas.length > 0 ? (
            solicitudesFiltradas.map((solicitud) => {
              const estadoInfo = getEstadoBadge(solicitud.estadosoli);
              return (
                <div key={solicitud.id} className="modern-equipment-card-xd01">
                  <div className="card-top-section-xd02">
                    <span className="equipment-category-xd06" style={{
                      backgroundColor: estadoInfo.variant === 'warning' ? '#ffc107' :
                                      estadoInfo.variant === 'success' ? '#28a745' :
                                      estadoInfo.variant === 'danger' ? '#dc3545' :
                                      estadoInfo.variant === 'info' ? '#17a2b8' : '#6c757d'
                    }}>
                      {estadoInfo.text}
                    </span>
                  </div>
                  <div className="card-bottom-section-xd04">
                    <h5 className="equipment-title-xd05">
                      {solicitud.espacio?.nombre || 'Espacio N/A'}
                    </h5>
                    <p className="equipment-serie-xd07">
                      <strong>Usuario:</strong> {solicitud.usuario?.nombre || 'N/A'}
                    </p>
                    <p className="equipment-serie-xd07">
                      <strong>Ambiente:</strong> {solicitud.ambient || 'N/A'}
                    </p>
                    <p className="equipment-serie-xd07">
                      <strong>Ficha:</strong> {solicitud.num_fich || 'N/A'}
                    </p>
                    <p className="equipment-serie-xd07">
                      <strong>Inicio:</strong> {formatFecha(solicitud.fecha_ini)}
                    </p>
                    <p className="equipment-serie-xd07">
                      <strong>Fin:</strong> {formatFecha(solicitud.fecha_fn)}
                    </p>
                  </div>
                  <button className="view-details-button-xd08">
                    Ver Detalles
                  </button>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'center' }}>
                    {solicitud.estadosoli !== 2 && (
                      <button className="view-details-button-xd08" onClick={() => handleCambiarEstado(solicitud.id, 2)}>
                        Aprobar
                      </button>
                    )}
                    {solicitud.estadosoli !== 3 && (
                      <button className="view-details-button-xd08" onClick={() => handleCambiarEstado(solicitud.id, 3)}>
                        Rechazar
                      </button>
                    )}
                    <button className="view-details-button-xd08" onClick={() => handleEliminar(solicitud.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: '#666' }}>
              <p>No hay solicitudes de espacios registradas</p>
            </div>
          )}
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Añadir Nueva Reserva de Espacio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitSolicitud}>
            <Form.Group className="mb-3">
              <Form.Label>Espacio *</Form.Label>
              <Form.Select
                name="id_esp"
                value={nuevaSolicitud.id_esp}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un espacio</option>
                <option value="1">Polideportivo</option>
                <option value="2">Auditorio</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ID del Usuario *</Form.Label>
              <Form.Control
                type="number"
                name="id_usu"
                value={nuevaSolicitud.id_usu}
                onChange={handleInputChange}
                placeholder="Ingrese el ID del usuario"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ambiente *</Form.Label>
              <Form.Control
                type="text"
                name="ambient"
                value={nuevaSolicitud.ambient}
                onChange={handleInputChange}
                placeholder="Ej: Ambiente301"
                maxLength={30}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Número de Ficha *</Form.Label>
              <Form.Control
                type="text"
                name="num_fich"
                value={nuevaSolicitud.num_fich}
                onChange={handleInputChange}
                placeholder="Ej: 2560014"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha y Hora de Inicio *</Form.Label>
              <Form.Control
                type="datetime-local"
                name="fecha_ini"
                value={nuevaSolicitud.fecha_ini}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha y Hora de Fin *</Form.Label>
              <Form.Control
                type="datetime-local"
                name="fecha_fn"
                value={nuevaSolicitud.fecha_fn}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estadosoli"
                value={nuevaSolicitud.estadosoli}
                onChange={handleInputChange}
              >
                <option value="1">PENDIENTE</option>
                <option value="2">APROBADO</option>
                <option value="3">RECHAZADO</option>
                <option value="4">EN USO</option>
                <option value="5">FINALIZADO</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="success" type="submit" disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar Reserva'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Footer />
    </div>
  );
};

export default Soliespacio;
