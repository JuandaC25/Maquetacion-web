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
    estadosoli: 1,
    ids_elem: ''
  });
  const [guardando, setGuardando] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const handleOpenModal = () => {
    setEditingId(null);
    setNuevaSolicitud({ id_esp: '', id_usu: '', ambient: '', num_fich: '', fecha_ini: '', fecha_fn: '', estadosoli: 1, ids_elem: '' });
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setNuevaSolicitud({ id_esp: '', id_usu: '', ambient: '', num_fich: '', fecha_ini: '', fecha_fn: '', estadosoli: 1, ids_elem: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaSolicitud(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitSolicitud = async (e) => {
    e.preventDefault();
    try {
      setGuardando(true);
      const toIsoLocalNoTZ = (v) => {
        if (!v) return null;
        try {
          const d = new Date(v);
          if (isNaN(d.getTime())) return v;
          const pad = (n) => String(n).padStart(2, '0');
          return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        } catch {
          return v;
        }
      };

      if (editingId) {
        const payload = {};
        if (nuevaSolicitud.estadosoli != null) payload.id_est_soli = Number(nuevaSolicitud.estadosoli);
        if (payload.id_est_soli != null && !AVAILABLE_ESTADOS.some(x => x.id === payload.id_est_soli)) {
          setError('Estado seleccionado no existe en la base de datos. Valores permitidos: ' + AVAILABLE_ESTADOS.map(x => x.id + ':' + x.label).join(', '));
          setGuardando(false);
          return;
        }
        if (nuevaSolicitud.fecha_ini) payload.fecha_ini = toIsoLocalNoTZ(nuevaSolicitud.fecha_ini);
        if (nuevaSolicitud.fecha_fn) payload.fecha_fn = toIsoLocalNoTZ(nuevaSolicitud.fecha_fn);
        if (nuevaSolicitud.ambient != null) payload.ambient = nuevaSolicitud.ambient;
        if (nuevaSolicitud.num_fich != null) payload.num_fich = nuevaSolicitud.num_fich;
        if (nuevaSolicitud.id_esp != null && nuevaSolicitud.id_esp !== '') payload.id_esp = Number(nuevaSolicitud.id_esp);
        if (nuevaSolicitud.id_usu != null && nuevaSolicitud.id_usu !== '') payload.id_usu = Number(nuevaSolicitud.id_usu);
        if (nuevaSolicitud.ids_elem) {
          const parsed = nuevaSolicitud.ids_elem.split(',').map(s => s.trim()).filter(Boolean).map(s => Number(s));
          payload.ids_elem = parsed;
        }
  console.log('[DEBUG] PUT payload (editar):', payload, 'editingId=', editingId);
  const resp = await actualizarSolicitud(editingId, payload);
        const actualizado = resp?.data || resp;
        setSolicitudes(prev => prev.map(s => ((s.id_soli === editingId || s.id === editingId) ? actualizado : s)));
        setEditingId(null);
        handleCloseModal();
      } else {
        const dto = {
          fecha_ini: toIsoLocalNoTZ(nuevaSolicitud.fecha_ini),
          fecha_fn: toIsoLocalNoTZ(nuevaSolicitud.fecha_fn),
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
      }
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
  const estadoTxt = (solicitud.est_soli || (solicitud.estadosoli != null ? String(solicitud.estadosoli) : 'DESCONOCIDO')).toString();
  const coincideEstado = selectedEstadoFilter === "Todos los Estados" || estadoTxt.toUpperCase() === String(selectedEstadoFilter).toUpperCase();
  const coincideEspacio = selectedEspacioFilter === "Todos los Espacios" || ( (solicitud.nom_espa || 'N/A').toString().toUpperCase() === String(selectedEspacioFilter).toUpperCase() );
    return coincideEstado && coincideEspacio;
  });

  const getEstadoBadge = (estado) => {
    if (estado == null) return { text: 'DESCONOCIDO', variant: 'secondary' };
    const asNumber = Number(estado);
    if (!isNaN(asNumber)) {
      const estadosNum = {
        1: { text: 'PENDIENTE', variant: 'warning' },
        2: { text: 'APROBADO', variant: 'success' },
        3: { text: 'RECHAZADO', variant: 'danger' },
        4: { text: 'EN USO', variant: 'info' },
        5: { text: 'FINALIZADO', variant: 'secondary' }
      };
      return estadosNum[asNumber] || { text: String(estado).toUpperCase(), variant: 'secondary' };
    }
    const texto = String(estado).toUpperCase();
    const mapText = {
      'PENDIENTE': { text: 'PENDIENTE', variant: 'warning' },
      'APROBADO': { text: 'APROBADO', variant: 'success' },
      'RECHAZADO': { text: 'RECHAZADO', variant: 'danger' },
      'EN USO': { text: 'EN USO', variant: 'info' },
      'FINALIZADO': { text: 'FINALIZADO', variant: 'secondary' },
      'ACTIVO': { text: 'ACTIVO', variant: 'success' },
      'INACTIVO': { text: 'INACTIVO', variant: 'secondary' }
    };
    return mapText[texto] || { text: texto, variant: 'secondary' };
  };

  const AVAILABLE_ESTADOS = [
    { id: 1, label: 'PENDIENTE' },
    { id: 2, label: 'APROBADO' },
    { id: 3, label: 'RECHAZADO' },
    { id: 4, label: 'EN USO' },
    { id: 5, label: 'FINALIZADO' }
  ];


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

  const getImageForSpace = (nomEspa) => {
    if (!nomEspa) return '/imagenes/imagenes_espacios/espacio1.jpeg';
    const key = nomEspa.toString().toLowerCase();
    if (key.includes('polideportivo')) return '/imagenes/Polideportivo.jpg';
    if (key.includes('auditorio')) return '/imagenes/imagenes_espacios/Auditorio1.jpeg';
    if (key.includes('espacio1') || key.includes('espacio')) return '/imagenes/imagenes_espacios/espacio1.jpeg';
    return '/imagenes/imagenes_espacios/espacio1.jpeg';
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta solicitud?')) return;
    try {
      await eliminarSolicitud(id);
      setSolicitudes(prev => prev.filter(s => (s.id_soli || s.id) !== id));
    } catch (err) {
      console.error('Error eliminando:', err);
      setError('Error al eliminar la solicitud: ' + (err?.message || err));
    }
  };

  const handleEditar = (solicitud) => {
    const id = solicitud.id_soli || solicitud.id;
    setEditingId(id);
    const toInputLocal = (fecha) => {
      if (!fecha) return '';
      try {
        const d = new Date(fecha);
        if (isNaN(d.getTime())) return '';
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      } catch {
        return '';
      }
    };
    setNuevaSolicitud({
      id_esp: solicitud.id_espa ?? solicitud.id_esp ?? '',
      id_usu: solicitud.id_usu ?? '',
      ambient: solicitud.ambient ?? '',
      num_fich: solicitud.num_fich ?? '',
      fecha_ini: toInputLocal(solicitud.fecha_ini),
      fecha_fn: toInputLocal(solicitud.fecha_fn),
      estadosoli: solicitud.estadosoli ?? (solicitud.est_soli ? (
        solicitud.est_soli.toUpperCase() === 'PENDIENTE' ? 1 :
        solicitud.est_soli.toUpperCase() === 'APROBADO' ? 2 :
        solicitud.est_soli.toUpperCase() === 'RECHAZADO' ? 3 :
        solicitud.est_soli.toUpperCase() === 'EN USO' ? 4 :
        solicitud.est_soli.toUpperCase() === 'FINALIZADO' ? 5 :
        ''
      ) : 1),
      ids_elem: solicitud.id_elem || ''
    });
    setShowModal(true);
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    const numericEstado = Number(nuevoEstado);
    if (!AVAILABLE_ESTADOS.some(x => x.id === numericEstado)) {
      setError('No es posible cambiar al estado seleccionado: id no existe en la base de datos. Valores permitidos: ' + AVAILABLE_ESTADOS.map(x => x.id + ':' + x.label).join(', '));
      return;
    }
    const sid = id;
    try {
      setUpdatingIds(prev => new Set(prev).add(sid));
      const payload = { id_est_soli: numericEstado };
      console.log('[DEBUG] PUT payload (cambiar estado):', payload, 'id=', id);
      const resp = await actualizarSolicitud(id, payload);
      const actualizada = resp?.data || resp;
      setSolicitudes(prev => prev.map(s => (s.id_soli === sid || s.id === sid ? actualizada : s)));
    } catch (err) {
      console.error('Error actualizando estado:', err);
      setError('Error al actualizar estado: ' + (err?.message || err));
    } finally {
      setUpdatingIds(prev => {
        const copy = new Set(prev);
        copy.delete(sid);
        return copy;
      });
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
              const estadoInfo = getEstadoBadge(solicitud.est_soli || solicitud.estadosoli);
              const estadoNum = (solicitud.estadosoli != null) ? Number(solicitud.estadosoli) : (
                (solicitud.est_soli && {
                  'PENDIENTE': 1,
                  'APROBADO': 2,
                  'RECHAZADO': 3,
                  'EN USO': 4,
                  'FINALIZADO': 5,
                  'ACTIVO': 2,
                  'INACTIVO': 5
                }[solicitud.est_soli.toUpperCase()]) || null
              );
              return (
                <div key={solicitud.id_soli || solicitud.id} className="modern-equipment-card-xd01">
                  <div className="card-top-section-xd02" style={{ position: 'relative', padding: 0 }}>
                    <img
                      src={getImageForSpace(solicitud.nom_espa)}
                      alt={solicitud.nom_espa || 'Espacio'}
                      style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                    />
                    <span className="equipment-category-xd06" style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      backgroundColor: estadoInfo.variant === 'warning' ? '#ffc107' :
                                      estadoInfo.variant === 'success' ? '#28a745' :
                                      estadoInfo.variant === 'danger' ? '#dc3545' :
                                      estadoInfo.variant === 'info' ? '#17a2b8' : '#6c757d',
                      color: '#fff',
                      padding: '6px 10px',
                      borderRadius: 6,
                      fontWeight: 700
                    }}>
                      {estadoInfo.text}
                    </span>
                    <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: '8px', zIndex: 5 }}>
                      {estadoNum !== 2 && (() => {
                        const sid = solicitud.id_soli || solicitud.id;
                        const isUpdating = updatingIds.has(sid);
                        return (
                          <button
                            key={"aprob-top-" + sid}
                            className="card-top-action"
                            onClick={() => handleCambiarEstado(sid, 2)}
                            disabled={isUpdating}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 8px', fontSize: '0.85rem' }}
                          >
                            {isUpdating ? <Spinner animation="border" size="sm" /> : 'Aprobar'}
                          </button>
                        );
                      })()}
                      {estadoNum !== 3 && (() => {
                        const sid = solicitud.id_soli || solicitud.id;
                        const isUpdating = updatingIds.has(sid);
                        return (
                          <button
                            key={"rech-top-" + sid}
                            className="card-top-action card-top-action--danger"
                            onClick={() => handleCambiarEstado(sid, 3)}
                            disabled={isUpdating}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 8px', fontSize: '0.85rem' }}
                          >
                            {isUpdating ? <Spinner animation="border" size="sm" /> : 'Rechazar'}
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="card-bottom-section-xd04">
                    <h5 className="equipment-title-xd05">
                      {solicitud.nom_espa || 'Espacio N/A'}
                    </h5>
                    <p className="equipment-serie-xd07">
                      <strong>Usuario:</strong> {solicitud.nom_usu || 'N/A'}
                    </p>
                    <p className="equipment-serie-xd07">
                      <strong>Ambiente:</strong> {solicitud.ambient || 'N/A'}
                    </p>
                    <p className="equipment-serie-xd07">
                      <strong>Ficha:</strong> {solicitud.num_fich || 'N/A'}
                    </p>
                    {solicitud.nom_elem && (
                      <p className="equipment-serie-xd07">
                        <strong>Elementos:</strong> {solicitud.nom_elem}
                      </p>
                    )}
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
                    <button className="view-details-button-xd08" onClick={() => handleEditar(solicitud)}>
                      Editar
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
          <Modal.Title>{editingId ? 'Editar Reserva de Espacio' : 'Añadir Nueva Reserva de Espacio'}</Modal.Title>
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
              <Form.Label>IDs de elementos (separados por coma)</Form.Label>
              <Form.Control
                type="text"
                name="ids_elem"
                value={nuevaSolicitud.ids_elem}
                onChange={handleInputChange}
                placeholder="Ej: 12,34,56"
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
                {AVAILABLE_ESTADOS.map(e => (
                  <option key={e.id} value={e.id}>{e.label}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="success" type="submit" disabled={guardando}>
                {guardando ? 'Guardando...' : (editingId ? 'Actualizar Reserva' : 'Guardar Reserva')}
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
