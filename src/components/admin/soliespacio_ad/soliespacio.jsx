  // Efecto para reactivar espacios automáticamente si la hora de fin ya pasó
  useEffect(() => {
    const reactivarEspacios = async () => {
      const now = new Date();
      let reactivado = false;
      for (const esp of espacios) {
        if (esp.estadoespacio === 2 && esp.fecha_fn) {
          const fin = new Date(esp.fecha_fn);
          if (!isNaN(fin.getTime()) && fin < now) {
            await actualizarEspacio(esp.id, { ...esp, estadoespacio: 1 });
            reactivado = true;
          }
        }
      }
      if (reactivado) {
        await cargarEspacios();
      }
    };
    if (espacios && espacios.length > 0) {
      reactivarEspacios();
    }
    // eslint-disable-next-line
  }, [espacios.length]);
import React, { useState, useEffect } from 'react';
import { Alert, Spinner, Dropdown, Modal, Form, Button, Carousel } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import './soliespacio.css';
import '../../Home/Espacios/Solicitud_espacios.css';
import Footer from '../../Footer/Footer.jsx';
import HeaderSoliespacio from '../header_soliespacio/header_soliespacio.jsx';
import { obtenersolicitudes, crearSolicitud, eliminarSolicitud, actualizarSolicitud } from '../../../api/solicitudesApi.js';
import { obtenerUsuarioPorId } from '../../../api/UsuariosApi.js';
import CrearEspacio from '../../Home/Espacios/Crear_espacio/Crear_espacio.jsx';
import { listarEspacios, actualizarEspacio, eliminarEspacio, subirImagenesEspacio } from '../../../api/EspaciosApi.js';

const Soliespacio = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEstadoFilter, setSelectedEstadoFilter] = useState("Todos los Estados");
  const [selectedEspacioFilter, setSelectedEspacioFilter] = useState("Todos los Espacios");
  const [showModal, setShowModal] = useState(false);
  const [nuevaSolicitud, setNuevaSolicitud] = useState({
    id_esp: '',
    ambient: '',
    num_fich: '',
    fecha_ini: '',
    fecha_fn: '',
    estadosoli: 1,
    nom_usu: ''
  });
  const [guardando, setGuardando] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState(null);
  const [modalIsTerminado, setModalIsTerminado] = useState(false);
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const [espacios, setEspacios] = useState([]);
  const [loadingEsp, setLoadingEsp] = useState(true);
  const [editEspacio, setEditEspacio] = useState(null);
  const [savingEsp, setSavingEsp] = useState(false);
  const [showApartarModal, setShowApartarModal] = useState(false);
  const [espacioApartar, setEspacioApartar] = useState(null);
  const [reservaForm, setReservaForm] = useState({
    fecha_ini: '',
    hora_ini: '',
    fecha_fn: '',
    hora_fn: '',
    ambient: '',
    num_ficha: '',
    estadosoli: 1,
    id_usu: 1
  });

  const handleOpenModal = () => {
    setEditingId(null);
    setNuevaSolicitud({ id_esp: '', ambient: '', num_fich: '', fecha_ini: '', fecha_fn: '', estadosoli: 1, nom_usu: '' });
    setModalIsTerminado(false);
    setLookupError(null);
    setShowModal(true);
  };

  const cargarEspacios = async () => {
    try {
      setLoadingEsp(true);
      const data = await listarEspacios();
      setEspacios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar espacios:', err);
    } finally {
      setLoadingEsp(false);
    }
  };

  const parseImagenes = (imagenesRaw) => {
    try {
      const arr = imagenesRaw ? JSON.parse(imagenesRaw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  const toFullUrl = (u) => {
    if (!u) return '/imagenes/imagenes_espacios/default.jpg';
    return u.startsWith('http') ? u : `http://localhost:8081${u}`;
  };

  const handleEditEsp = (esp) => {
    const imgsRaw = parseImagenes(esp.imagenes);
    setEditEspacio({
      id: esp.id,
      nom_espa: esp.nom_espa || '',
      descripcion: esp.descripcion || '',
      estadoespacio: Number(esp.estadoespacio) || 1,
      imagenesRaw: Array.isArray(imgsRaw) ? imgsRaw : [],
      nuevasImagenesBase64: [],
      removedRawIdxs: new Set()
    });
  };

  const convertirImagenABase64 = (archivo) => {
    return new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.readAsDataURL(archivo);
      lector.onload = () => resolve(lector.result);
      lector.onerror = (error) => reject(error);
    });
  };

  const handleAgregarImagenesEdit = async (e) => {
    const archivos = Array.from(e.target.files || []);
    if (archivos.length === 0) return;
    const bases = await Promise.all(archivos.map(convertirImagenABase64));
    setEditEspacio(prev => ({
      ...prev,
      nuevasImagenesBase64: [...(prev?.nuevasImagenesBase64 || []), ...bases]
    }));
  };

  const handleEliminarImagenExistente = (idx) => {
    setEditEspacio(prev => {
      const next = { ...prev };
      const setR = new Set(next.removedRawIdxs || []);
      setR.add(idx);
      next.removedRawIdxs = setR;
      return next;
    });
  };

  const handleEliminarImagenNueva = (idx) => {
    setEditEspacio(prev => ({
      ...prev,
      nuevasImagenesBase64: (prev?.nuevasImagenesBase64 || []).filter((_, i) => i !== idx)
    }));
  };

  const handleSaveEsp = async (e) => {
    e.preventDefault();
    try {
      setSavingEsp(true);
      let finalUrls = (editEspacio.imagenesRaw || []).filter((_, i) => !(editEspacio.removedRawIdxs || new Set()).has(i));
      if (editEspacio.nuevasImagenesBase64 && editEspacio.nuevasImagenesBase64.length > 0) {
        const uploadRes = await subirImagenesEspacio(editEspacio.nuevasImagenesBase64);
        const urls = uploadRes?.urls || [];
        finalUrls = [...finalUrls, ...urls];
      }
      await actualizarEspacio(editEspacio.id, {
        nom_espa: editEspacio.nom_espa,
        descripcion: editEspacio.descripcion,
        estadoespacio: Number(editEspacio.estadoespacio),
        imagenes: JSON.stringify(finalUrls)
      });
      setEditEspacio(null);
      await cargarEspacios();
    } catch (err) {
      setError('Error al actualizar el espacio: ' + (err?.message || err));
    } finally {
      setSavingEsp(false);
    }
  };

  const handleDeleteEsp = async (id) => {
    if (!window.confirm('¿Eliminar este espacio?')) return;
    try {
      await eliminarEspacio(id);
      await cargarEspacios();
    } catch (err) {
      setError('Error al eliminar el espacio: ' + (err?.message || err));
    }
  };


  const handleOpenReservaDesdeCard = (espacio) => {
    // Solo permitir abrir el modal si el espacio está activo
    if (espacio.estadoespacio !== 1) return;
    setEspacioApartar(espacio);
    setReservaForm({
      fecha_ini: '',
      hora_ini: '',
      fecha_fn: '',
      hora_fn: '',
      ambient: '',
      num_ficha: '',
      estadosoli: 1,
      id_usu: 1
    });
    setShowApartarModal(true);
  };

  const handleReservaFormChange = (e) => {
    const { name, value } = e.target;
    setReservaForm(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmApartar = async (e) => {
    e.preventDefault();
    if (!espacioApartar) return;
    try {
      setSavingEsp(true);
      const pad = (n) => String(n).padStart(2, '0');
      const formatLocal = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      const fechaInicio = new Date(`${reservaForm.fecha_ini}T${reservaForm.hora_ini}:00`);
      const fechaFin = new Date(`${reservaForm.fecha_fn}T${reservaForm.hora_fn}:00`);
      const dto = {
        fecha_ini: formatLocal(fechaInicio),
        fecha_fn: formatLocal(fechaFin),
        ambient: reservaForm.ambient,
        estadosoli: reservaForm.estadosoli,
        id_usu: reservaForm.id_usu,
        num_fich: reservaForm.num_ficha,
        id_esp: espacioApartar.id
      };
      await crearSolicitud(dto);
      // Cambiar el estado del espacio a inactivo (2)
      await actualizarEspacio(espacioApartar.id, { ...espacioApartar, estadoespacio: 2 });
      setShowApartarModal(false);
      setEspacioApartar(null);
      setReservaForm({
        fecha_ini: '',
        hora_ini: '',
        fecha_fn: '',
        hora_fn: '',
        ambient: '',
        num_ficha: '',
        estadosoli: 1,
        id_usu: 1
      });
      await cargarSolicitudes();
      await cargarEspacios();
    } catch (err) {
      setError('Error al apartar el espacio: ' + (err?.message || err));
    } finally {
      setSavingEsp(false);
    }
  };




  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setNuevaSolicitud({ id_esp: '', id_usu: '', ambient: '', num_fich: '', fecha_ini: '', fecha_fn: '', estadosoli: 1, nom_usu: '' });
    setModalIsTerminado(false);
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
          num_fich: nuevaSolicitud.num_fich,
          id_esp: Number(nuevaSolicitud.id_esp) || null
        };
        const { id_usu, ...solicitudSinIdUsu } = dto; // Exclude id_usu
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
    cargarEspacios();
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
    const effectiveEstadoText = (() => {
      try {
        const fn = solicitud.fecha_fn ? new Date(solicitud.fecha_fn) : null;
        if (fn && !isNaN(fn.getTime()) && fn.getTime() < Date.now()) return 'TERMINADO';
      } catch { }
      const estadoTxt = (solicitud.est_soli || (solicitud.estadosoli != null ? String(solicitud.estadosoli) : 'DESCONOCIDO')).toString();
      return estadoTxt.toUpperCase();
    })();
    const sel = String(selectedEstadoFilter || '').toUpperCase();
    const coincideEstado = selectedEstadoFilter === "Todos los Estados" ||
      effectiveEstadoText.toUpperCase() === sel ||
      (sel === 'FINALIZADO' && effectiveEstadoText.toUpperCase() === 'TERMINADO') ||
      (sel === 'TERMINADO' && effectiveEstadoText.toUpperCase() === 'FINALIZADO');
    const coincideEspacio = selectedEspacioFilter === "Todos los Espacios" || ((solicitud.nom_espa || 'N/A').toString().toUpperCase() === String(selectedEspacioFilter).toUpperCase());
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
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
      nom_usu: solicitud.nom_usu ?? ''
    });
    let terminado = false;
    try {
      const fnDate = solicitud.fecha_fn ? new Date(solicitud.fecha_fn) : null;
      if (fnDate && !isNaN(fnDate.getTime()) && fnDate.getTime() < Date.now()) terminado = true;
    } catch { }
    setModalIsTerminado(terminado);
    setShowModal(true);
  };

  const lookupUserById = async (maybeId) => {
    const id = Number(maybeId || nuevaSolicitud.id_usu);
    if (!id || isNaN(id)) {
      setLookupError('ID de usuario inválido');
      setNuevaSolicitud(prev => ({ ...prev, nom_usu: '' }));
      return;
    }
    try {
      setLookupError(null);
      setLookupLoading(true);
      const u = await obtenerUsuarioPorId(id);
      const user = u?.data || u;
      if (!user) throw new Error('Usuario no encontrado');
      const first = user.nom_usu || user.nombre || user.firstName || user.fullName || '';
      const last = user.ape_usu || user.apellido || user.lastName || '';
      const email = user.correo || user.email || '';
      const label = [first, last].filter(Boolean).join(' ') || (email ? email : `Usuario ${id}`);
      setNuevaSolicitud(prev => ({ ...prev, id_usu: id, nom_usu: label }));
    } catch (err) {
      console.error('lookup user error', err);
      setLookupError('Usuario no encontrado');
      setNuevaSolicitud(prev => ({ ...prev, nom_usu: '' }));
    } finally {
      setLookupLoading(false);
    }
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
              <Button className="add-new-equipment-button-xd135" onClick={handleOpenModal}>
                <span role="img" aria-label="añadir">➕</span> Nuevo Espacio
              </Button>
            </div>
          </div>
        </div>
      </Alert>

      <div style={{ padding: '0 20px 20px' }}>
        {loadingEsp ? (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <Spinner animation="border" />
          </div>
        ) : (
          <div className="ACMC-Cua">
            {espacios.length === 0 ? (
              <div className="text-center mt-3">
                <Alert variant="info">No hay espacios disponibles</Alert>
              </div>
            ) : (
              espacios.map((espacio, index) => {
                const imagenes = parseImagenes(espacio.imagenes);
                const finalImgs = (imagenes.length > 0 ? imagenes : ['/imagenes/imagenes_espacios/default.jpg']).map(toFullUrl);
                const cardClass = index % 2 === 0 ? 'Cuadroparaespacio' : 'Cuadroparaauditorio';
                return (
                  <Card key={espacio.id} className={cardClass}>
                    <Carousel className="carrusel-espacios" interval={3000}>
                      {finalImgs.map((img, i) => (
                        <Carousel.Item key={i}>
                          <img src={img} alt={`${espacio.nom_espa} - ${i + 1}`} className="ImagenPolideportivo" style={{ width: '100%', height: '490px', objectFit: 'cover' }} />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                    <div className="product-details">
                      <h1 className="solicitud-titulo001">{espacio.nom_espa}</h1>
                      <p>{espacio.descripcion}</p>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                        <button
                          className="button-Espacio"
                          onClick={() => handleOpenReservaDesdeCard(espacio)}
                          disabled={espacio.estadoespacio !== 1}
                          style={espacio.estadoespacio !== 1 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >
                          <div className="front">
                            <span>Apartar espacio</span>
                          </div>
                        </button>
                              {/* Modal Apartar Espacio */}
                              <Modal show={showApartarModal} onHide={() => { setShowApartarModal(false); setEspacioApartar(null); }} centered size="md" backdrop="static">
                                <div style={{ borderRadius: 10, overflow: 'hidden' }}>
                                  <div style={{ background: '#219653', color: 'white', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <h2 style={{ fontWeight: 700, fontSize: 30, margin: 0 }}>
                                      Reservar {espacioApartar?.nom_espa || ''}
                                    </h2>
                                    <Button variant="link" onClick={() => { setShowApartarModal(false); setEspacioApartar(null); }} style={{ color: 'white', fontSize: 28, fontWeight: 700, textDecoration: 'none', lineHeight: 1, padding: 0, border: 'none', background: 'none' }}>×</Button>
                                  </div>
                                  <div style={{ padding: 32, background: 'white' }}>
                                    <Form onSubmit={handleConfirmApartar}>
                                      <Form.Group className="mb-3">
                                        <Form.Label>Fecha y Hora de Inicio</Form.Label>
                                        <div className="row g-2">
                                          <div className="col-md-6">
                                            <Form.Control type="date" name="fecha_ini" value={reservaForm.fecha_ini} onChange={handleReservaFormChange} required />
                                          </div>
                                          <div className="col-md-6">
                                            <Form.Control type="time" name="hora_ini" value={reservaForm.hora_ini} onChange={handleReservaFormChange} required />
                                          </div>
                                        </div>
                                      </Form.Group>
                                      <Form.Group className="mb-3">
                                        <Form.Label>Fecha y Hora de Fin</Form.Label>
                                        <div className="row g-2">
                                          <div className="col-md-6">
                                            <Form.Control type="date" name="fecha_fn" value={reservaForm.fecha_fn} onChange={handleReservaFormChange} required />
                                          </div>
                                          <div className="col-md-6">
                                            <Form.Control type="time" name="hora_fn" value={reservaForm.hora_fn} onChange={handleReservaFormChange} required />
                                          </div>
                                        </div>
                                      </Form.Group>
                                      <Form.Group className="mb-3">
                                        <Form.Label>Ambiente</Form.Label>
                                        <Form.Control type="text" name="ambient" placeholder="Ej: Ambiente301" value={reservaForm.ambient} onChange={handleReservaFormChange} required />
                                      </Form.Group>
                                      <Form.Group className="mb-3">
                                        <Form.Label>Número de ficha</Form.Label>
                                        <Form.Control type="text" name="num_ficha" placeholder="Ej: 2560014" value={reservaForm.num_ficha} onChange={handleReservaFormChange} required />
                                      </Form.Group>
                                      <div className="text-center mt-3">
                                        <Button
                                          style={{ minWidth: 220, fontWeight: 600, fontSize: 20, background: '#219653', border: 'none', borderRadius: 8, padding: '12px 0' }}
                                          type="submit"
                                          disabled={savingEsp}
                                        >
                                          {savingEsp ? 'Reservando...' : 'Confirmar Reserva'}
                                        </Button>
                                      </div>
                                    </Form>
                                  </div>
                                </div>
                              </Modal>
                        <button className="button-Espacio" onClick={() => handleEditEsp(espacio)}>
                          <div className="front">
                            <span>Administrar</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>



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
              const now = Date.now();
              let isTerminado = false;
              try {
                const fn = solicitud.fecha_fn ? new Date(solicitud.fecha_fn) : null;
                if (fn && !isNaN(fn.getTime()) && fn.getTime() < now) isTerminado = true;
              } catch { }

              const rawEstado = solicitud.est_soli || solicitud.estadosoli;
              const estadoInfo = isTerminado ? { text: 'TERMINADO', variant: 'secondary' } : getEstadoBadge(rawEstado);
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
                      {(!isTerminado && estadoNum !== 2) && (() => {
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
                      {(!isTerminado && estadoNum !== 3) && (() => {
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
                    <p className="equipment-serie-xd07">
                      <strong>Estado:</strong> {estadoInfo.text}
                    </p>
                  </div>
                  <button className="view-details-button-xd08">
                    Ver Detalles
                  </button>
                  <div className="solicitud-action-group">
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button className="view-details-button-xd08" onClick={() => handleEditar(solicitud)}>
                        Editar
                      </button>

                      {/* activate/inactivate button removed (estado field deprecated) */}
                    </div>
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

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg" backdrop="static">
        <div style={{ padding: 0, background: '#f9fafd', borderRadius: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px 32px 0 32px' }}>
            <Button variant="light" onClick={handleCloseModal} style={{ fontSize: 28, fontWeight: 700, color: '#888', border: 'none', background: 'none', lineHeight: 1, padding: 0 }}>
              ×
            </Button>
          </div>
          <div style={{ padding: '0 32px 32px 32px' }}>
            <CrearEspacio />
          </div>
        </div>
      </Modal>

      <Modal show={!!editEspacio} onHide={() => setEditEspacio(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Espacio</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveEsp}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={editEspacio?.nom_espa || ''}
                onChange={(e) => setEditEspacio(prev => ({ ...prev, nom_espa: e.target.value }))}
                maxLength={25}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={editEspacio?.descripcion || ''}
                onChange={(e) => setEditEspacio(prev => ({ ...prev, descripcion: e.target.value }))}
                maxLength={900}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={editEspacio?.estadoespacio || 1}
                onChange={(e) => setEditEspacio(prev => ({ ...prev, estadoespacio: Number(e.target.value) }))}
              >
                <option value={1}>Activo</option>
                <option value={2}>Inactivo</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Imágenes</Form.Label>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Button variant="outline-primary" as="label">
                  Agregar imágenes
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAgregarImagenesEdit}
                    style={{ display: 'none' }}
                  />
                </Button>
              </div>
              {editEspacio && (editEspacio.imagenesRaw?.length > 0) && (
                <div className="mb-3">
                  <div className="d-flex flex-wrap gap-2">
                    {editEspacio.imagenesRaw.map((u, i) => {
                      const removed = (editEspacio.removedRawIdxs || new Set()).has(i);
                      if (removed) return null;
                      const src = toFullUrl(u);
                      return (
                        <div key={i} style={{ width: 120 }}>
                          <img src={src} alt={`img-${i}`} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6 }} />
                          <Button variant="danger" size="sm" className="w-100 mt-1" onClick={() => handleEliminarImagenExistente(i)}>Eliminar</Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {editEspacio && (editEspacio.nuevasImagenesBase64?.length > 0) && (
                <div>
                  <div className="d-flex flex-wrap gap-2">
                    {editEspacio.nuevasImagenesBase64.map((b64, i) => (
                      <div key={i} style={{ width: 120 }}>
                        <img src={b64} alt={`new-${i}`} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6 }} />
                        <Button variant="outline-danger" size="sm" className="w-100 mt-1" onClick={() => handleEliminarImagenNueva(i)}>Quitar</Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={async () => { await handleDeleteEsp(editEspacio.id); setEditEspacio(null); }}>Eliminar</Button>
            <Button variant="secondary" onClick={() => setEditEspacio(null)}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={savingEsp}>{savingEsp ? 'Guardando...' : 'Guardar cambios'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>



      <Footer />
    </div>
  );
};

export default Soliespacio;
