import React, { useState, useEffect } from 'react';
import { Alert, Spinner, Dropdown, Modal, Form, Button, Carousel } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import './soliespacio.css';
import '../../Home/Espacios/Solicitud_espacios.css';
import Footer from '../../Footer/Footer.jsx';
import HeaderSoliespacio from '../headers/AdminHeader.jsx';
import { obtenersolicitudes, crearSolicitud, eliminarSolicitud, actualizarSolicitud } from '../../../api/solicitudesApi.js';
import { obtenerUsuarioPorId } from '../../../api/UsuariosApi.js';
import CrearEspacio from '../../Home/Espacios/Crear_espacio/Crear_espacio.jsx';
import { listarEspacios, actualizarEspacio, eliminarEspacio, subirImagenesEspacio } from '../../../api/EspaciosApi.js';

const Soliespacio = () => {
  const isSpaceRequest = (s) => {
    if (!s) return false;
    return Boolean(s.id_espa || s.id_espa || s.id_esp || s.nom_espa || s.nom_espa || s.id_espa || s.id_espacio);
  };

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEstadoFilter, setSelectedEstadoFilter] = useState("Todos los Estados");
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


  // Permitir abrir el modal siempre, pero validar fechas al reservar
  const handleOpenReservaDesdeCard = (espacio) => {
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

  const getFechaMinima = () => {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
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
      const makeDateFromReserva = (fieldValue, altHour) => {
        if (!fieldValue) return null;
        try {
          if (String(fieldValue).includes('T')) {
            const asIs = new Date(fieldValue);
            if (!isNaN(asIs.getTime())) return asIs;
            const withSec = fieldValue.length === 16 ? `${fieldValue}:00` : fieldValue;
            const asWithSec = new Date(withSec);
            if (!isNaN(asWithSec.getTime())) return asWithSec;
            return null;
          }
          const hora = altHour || '00:00';
          const combined = `${fieldValue}T${hora}:00`;
          const d = new Date(combined);
          return isNaN(d.getTime()) ? null : d;
        } catch (e) {
          return null;
        }
      };

      const fechaInicio = makeDateFromReserva(reservaForm.fecha_ini, reservaForm.hora_ini);
      const fechaFin = makeDateFromReserva(reservaForm.fecha_fn, reservaForm.hora_fn);
      if (!fechaInicio || !fechaFin || isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
        setError('Fechas u horas inválidas. Por favor completa fecha y hora correctamente.');
        setSavingEsp(false);
        return;
      }

      if (fechaInicio.getTime() >= fechaFin.getTime()) {
        setError('La fecha/hora de inicio debe ser anterior a la de fin.');
        setSavingEsp(false);
        return;
      }
      // Validar que no haya cruce de fechas con reservas existentes para este espacio
      const reservasEspacio = solicitudes.filter(s => (s.id_espa === espacioApartar.id || s.id_esp === espacioApartar.id));
      const hayCruce = reservasEspacio.some(s => {
        const ini = new Date(s.fecha_ini);
        const fin = new Date(s.fecha_fn);
        // Si la reserva existente termina antes de que empiece la nueva, o empieza después de que termina la nueva, no hay cruce
        if (isNaN(ini.getTime()) || isNaN(fin.getTime())) return false;
        return (fechaInicio < fin && fechaFin > ini);
      });
      if (hayCruce) {
        setError('Ya existe una reserva para este espacio en el rango de fechas/horas seleccionado.');
        setSavingEsp(false);
        return;
      }
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
          if (isNaN(d.getTime())) return null;
          const pad = (n) => String(n).padStart(2, '0');
          return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        } catch {
          return null;
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
      setSolicitudes(Array.isArray(data) ? (data.filter(isSpaceRequest)) : []);
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

  const AVAILABLE_ESTADOS = [
    { id: 1, label: 'Pendiente' },
    { id: 2, label: 'Aprobado' },
    { id: 3, label: 'Rechazado' },
    { id: 4, label: 'Cancelado' },
    { id: 5, label: 'Finalizado' }
  ];

  const getEstadoBadge = (estado) => {
    if (estado == null) return { text: 'Desconocido', variant: 'secondary' };
    const asNumber = Number(estado);
    if (!isNaN(asNumber)) {
      const estadosNum = {
        1: { text: 'Pendiente', variant: 'warning' },
        2: { text: 'Aprobado', variant: 'success' },
        3: { text: 'Rechazado', variant: 'danger' },
        4: { text: 'Cancelado', variant: 'info' },
        5: { text: 'Finalizado', variant: 'secondary' }
      };
      return estadosNum[asNumber] || { text: String(estado), variant: 'secondary' };
    }
    const texto = String(estado).toLowerCase();
    const mapText = {
      'pendiente': { text: 'Pendiente', variant: 'warning' },
      'aprobado': { text: 'Aprobado', variant: 'success' },
      'rechazado': { text: 'Rechazado', variant: 'danger' },
      'cancelado': { text: 'Cancelado', variant: 'info' },
      'finalizado': { text: 'Finalizado', variant: 'secondary' }
    };
    return mapText[texto] || { text: texto, variant: 'secondary' };
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

  const getImageForSpace = (nomEspa) => {
    if (!nomEspa) return '/imagenes/imagenes_espacios/espacio1.jpeg';
    const key = nomEspa.toString().toLowerCase();
    if (key.includes('polideportivo')) return '/imagenes/Polideportivo.jpg';
    if (key.includes('auditorio')) return '/imagenes/imagenes_espacios/Auditorio1.jpeg';
    if (key.includes('espacio1') || key.includes('espacio')) return '/imagenes/imagenes_espacios/espacio1.jpeg';
    return '/imagenes/imagenes_espacios/espacio1.jpeg';
  };

  const getImageForSolicitud = (solicitud) => {
    try {
      const id = solicitud?.id_espa || solicitud?.id_esp || solicitud?.id || null;
      if (id != null && espacios && espacios.length > 0) {
        const encontrado = espacios.find(e => String(e.id) === String(id) || Number(e.id) === Number(id));
        if (encontrado) {
          const imgs = parseImagenes(encontrado.imagenes || encontrado.imagenesRaw || encontrado.imagenes);
          if (Array.isArray(imgs) && imgs.length > 0) return toFullUrl(imgs[0]);
        }
      }
      return getImageForSpace(solicitud?.nom_espa);
    } catch (e) {
      return '/imagenes/imagenes_espacios/espacio1.jpeg';
    }
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

  // Declarar solicitudesFiltradas antes del return
  const solicitudesFiltradas = solicitudes.filter(solicitud => {
    if (selectedEstadoFilter === "Todos los Estados") {
      return true;
    }

    // Convertir el estado de la solicitud a texto
    let estadoTexto = '';
    const estadoValue = solicitud.estadosoli ?? solicitud.est_soli;
    
    if (typeof estadoValue === 'number') {
      // Si es número
      switch (Number(estadoValue)) {
        case 1: estadoTexto = 'Pendiente'; break;
        case 2: estadoTexto = 'Aprobado'; break;
        case 3: estadoTexto = 'Rechazado'; break;
        case 4: estadoTexto = 'Cancelado'; break;
        case 5: estadoTexto = 'Finalizado'; break;
        default: estadoTexto = 'Desconocido';
      }
    } else if (typeof estadoValue === 'string') {
      // Si es string, mapear valores comunes
      const estadoMap = {
        'PENDIENTE': 'Pendiente',
        'APROBADO': 'Aprobado',
        'RECHAZADO': 'Rechazado',
        'EN USO': 'Cancelado',
        'CANCELADO': 'Cancelado',
        'FINALIZADO': 'Finalizado',
        '1': 'Pendiente',
        '2': 'Aprobado',
        '3': 'Rechazado',
        '4': 'Cancelado',
        '5': 'Finalizado'
      };
      estadoTexto = estadoMap[String(estadoValue).toUpperCase()] || 'Desconocido';
    } else {
      estadoTexto = 'Desconocido';
    }

    // Comparar con el filtro seleccionado
    return estadoTexto === selectedEstadoFilter;
  });

  return (
    <div className="inventory-app-container-xd25">
      <HeaderSoliespacio title="Solicitudes de espacios" />

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
              <select 
                value={selectedEstadoFilter}
                onChange={(e) => handleEstadoFilter(e.target.value)}
                className="estado-filter-select-xd31"
              >
                <option value="Todos los Estados">Todos los Estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
                <option value="Cancelado">Cancelado</option>
                <option value="Finalizado">Finalizado</option>
              </select>
              <span style={{ marginLeft: '15px', fontSize: '0.9rem', opacity: 0.7 }}>
                ({solicitudesFiltradas.length} solicitudes)
              </span>
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

                                    {/* Modal Editar Reserva */}
                                    <Modal show={showModal} onHide={handleCloseModal} centered size="lg" backdrop={false}>
                                      <div style={{ borderRadius: 10, overflow: 'hidden' }}>
                                        <div style={{ background: '#219653', color: 'white', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                          <h2 style={{ fontWeight: 700, fontSize: 30, margin: 0 }}>
                                            Editar Reserva de Espacio
                                          </h2>
                                          <Button variant="link" onClick={handleCloseModal} style={{ color: 'white', fontSize: 28, fontWeight: 700, textDecoration: 'none', lineHeight: 1, padding: 0, border: 'none', background: 'none' }}>×</Button>
                                        </div>
                                        <div style={{ padding: 32, background: 'white' }}>
                                          <Form onSubmit={handleSubmitSolicitud}>
                                            <Form.Group className="mb-3">
                                              <Form.Label>Espacio *</Form.Label>
                                              <Form.Control as="select" name="id_esp" value={nuevaSolicitud.id_esp} onChange={handleInputChange} required>
                                                <option value="">Seleccione un espacio</option>
                                                {espacios.map(e => (
                                                  <option key={e.id} value={e.id}>{e.nom_espa}</option>
                                                ))}
                                              </Form.Control>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                              <Form.Label>Usuario (ID)</Form.Label>
                                              <Form.Control type="text" name="id_usu" value={nuevaSolicitud.nom_usu || ''} readOnly />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                              <Form.Label>Fecha y Hora de Inicio *</Form.Label>
                                              <Form.Control type="datetime-local" name="fecha_ini" value={nuevaSolicitud.fecha_ini} onChange={handleInputChange} required />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                              <Form.Label>Fecha y Hora de Fin *</Form.Label>
                                              <Form.Control type="datetime-local" name="fecha_fn" value={nuevaSolicitud.fecha_fn} onChange={handleInputChange} required />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                              <Form.Label>Estado</Form.Label>
                                              <Form.Control type="text" value={modalIsTerminado ? 'TERMINADO' : (nuevaSolicitud.estadosoli === 1 ? 'PENDIENTE' : nuevaSolicitud.estadosoli === 2 ? 'APROBADO' : nuevaSolicitud.estadosoli === 3 ? 'RECHAZADO' : nuevaSolicitud.estadosoli === 4 ? 'EN USO' : 'FINALIZADO')} readOnly />
                                            </Form.Group>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                              <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                                              <Button variant="success" type="submit">Actualizar Reserva</Button>
                                            </div>
                                          </Form>
                                        </div>
                                      </div>
                                    </Modal>
                              <Modal show={showApartarModal} onHide={() => { setShowApartarModal(false); setEspacioApartar(null); }} centered size="md" backdrop={false} dialogClassName="modern-modal-dialog-1627">
                                <Modal.Header className="modern-modal-header-1628" closeButton>
                                  <Modal.Title className="modern-modal-title-1629">Reservar {espacioApartar?.nom_espa || ''}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="modern-modal-body-1630">
                                  <Form onSubmit={handleConfirmApartar}>
                                    <Form.Group className="mb-3">
                                      <Form.Label>Fecha y Hora de Inicio</Form.Label>
                                      <div className="row g-2">
                                        <div className="col-md-6">
                                          <Form.Control
                                            type="date"
                                            name="fecha_ini"
                                            value={reservaForm.fecha_ini}
                                            onChange={handleReservaFormChange}
                                            min={getFechaMinima()}
                                            required
                                          />
                                        </div>
                                        <div className="col-md-6">
                                          <Form.Control
                                            type="time"
                                            name="hora_ini"
                                            value={reservaForm.hora_ini}
                                            onChange={handleReservaFormChange}
                                            required
                                          />
                                        </div>
                                      </div>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                      <Form.Label>Fecha y Hora de Fin</Form.Label>
                                      <div className="row g-2">
                                        <div className="col-md-6">
                                          <Form.Control
                                            type="date"
                                            name="fecha_fn"
                                            value={reservaForm.fecha_fn}
                                            onChange={handleReservaFormChange}
                                            min={reservaForm.fecha_ini || getFechaMinima()}
                                            required
                                          />
                                        </div>
                                        <div className="col-md-6">
                                          <Form.Control
                                            type="time"
                                            name="hora_fn"
                                            value={reservaForm.hora_fn}
                                            onChange={handleReservaFormChange}
                                            required
                                          />
                                        </div>
                                      </div>
                                    </Form.Group>
                                    {/* Eliminados campos de ambiente y número de ficha, solo fechas y horas */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                      <Button variant="secondary" onClick={() => { setShowApartarModal(false); setEspacioApartar(null); }} className="modal-action-button-1635 cancel-action-1636">Cancelar</Button>
                                      <Button variant="success" type="submit" disabled={savingEsp} className="modal-action-button-1635">{savingEsp ? 'Reservando...' : 'Confirmar Reserva'}</Button>
                                    </div>
                                  </Form>
                                </Modal.Body>
                                <Modal.Footer className="modern-modal-footer-1634" />
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
                      src={getImageForSolicitud(solicitud)}
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
                    </div>
                  </div>

      {/* Modal Editar Reserva */}
      <Modal show={editingId !== null} onHide={handleCloseModal} centered size="lg" backdrop="static">
        <div style={{ borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(90deg, #219653 0%, #43b97f 100%)', color: 'white', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontWeight: 700, fontSize: 28, margin: 0 }}>Editar Reserva de Espacio</h2>
            <Button variant="link" onClick={handleCloseModal} style={{ color: 'white', fontSize: 28, fontWeight: 700, textDecoration: 'none', lineHeight: 1, padding: 0, border: 'none', background: 'none' }}>×</Button>
          </div>
          <div style={{ padding: 32, background: 'white' }}>
            <Form onSubmit={handleSubmitSolicitud}>
              <Form.Group className="mb-3">
                <Form.Label>Espacio *</Form.Label>
                <Form.Control as="select" name="id_esp" value={nuevaSolicitud.id_esp} onChange={handleInputChange} required>
                  <option value="">Seleccione un espacio</option>
                  {espacios.map(e => (
                    <option key={e.id} value={e.id}>{e.nom_espa}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Usuario (ID)</Form.Label>
                <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: 4 }}>{nuevaSolicitud.nom_usu || ''}</div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha y Hora de Inicio *</Form.Label>
                <Form.Control type="datetime-local" name="fecha_ini" value={nuevaSolicitud.fecha_ini} onChange={handleInputChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha y Hora de Fin *</Form.Label>
                <Form.Control type="datetime-local" name="fecha_fn" value={nuevaSolicitud.fecha_fn} onChange={handleInputChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select name="estadosoli" value={nuevaSolicitud.estadosoli} onChange={handleInputChange} required>
                  <option value={1}>Pendiente</option>
                  <option value={2}>Aprobado</option>
                  <option value={3}>Rechazado</option>
                  <option value={4}>Cancelado</option>
                  <option value={5}>Finalizado</option>
                </Form.Select>
              </Form.Group>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                <Button variant="success" type="submit">Actualizar Reserva</Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
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


      {/* Modal Editar Espacio */}
      <Modal show={!!editEspacio} onHide={() => setEditEspacio(null)} centered size="lg" backdrop={false}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Espacio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editEspacio && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del espacio</Form.Label>
                <Form.Control type="text" value={editEspacio.nom_espa} onChange={e => setEditEspacio(prev => ({ ...prev, nom_espa: e.target.value }))} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control as="textarea" rows={3} value={editEspacio.descripcion} onChange={e => setEditEspacio(prev => ({ ...prev, descripcion: e.target.value }))} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select value={editEspacio.estadoespacio} onChange={e => setEditEspacio(prev => ({ ...prev, estadoespacio: e.target.value }))}>
                  <option value={1}>Activado</option>
                  <option value={0}>Desactivado</option>
                </Form.Select>
              </Form.Group>
              {/* Aquí podrías agregar edición de imágenes si lo necesitas */}
              <Form.Group className="mb-3">
                <Form.Label>Imágenes actuales</Form.Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {editEspacio.imagenesRaw && editEspacio.imagenesRaw.length > 0 ? (
                    editEspacio.imagenesRaw.map((img, idx) => (
                      (editEspacio.removedRawIdxs && editEspacio.removedRawIdxs.has(idx)) ? null : (
                        <div key={idx} style={{ position: 'relative' }}>
                          <img src={img.startsWith('http') ? img : `http://localhost:8081${img}`} alt={`Imagen ${idx + 1}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                          <Button variant="danger" size="sm" style={{ position: 'absolute', top: 0, right: 0, borderRadius: '50%'}} onClick={() => handleEliminarImagenExistente(idx)} title="Eliminar imagen">×</Button>
                        </div>
                      )
                    ))
                  ) : (
                    <span>No hay imágenes subidas.</span>
                  )}
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Agregar nuevas imágenes</Form.Label>
                <Form.Control type="file" multiple accept="image/*" onChange={handleAgregarImagenesEdit} />
                {editEspacio.nuevasImagenesBase64 && editEspacio.nuevasImagenesBase64.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                    {editEspacio.nuevasImagenesBase64.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img src={img} alt={`Nueva ${idx + 1}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                        <Button variant="danger" size="sm" style={{ position: 'absolute', top: 0, right: 0, borderRadius: '50%'}} onClick={() => handleEliminarImagenNueva(idx)} title="Eliminar nueva imagen">×</Button>
                      </div>
                    ))}
                  </div>
                )}
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: 'space-between' }}>
          <Button 
            variant="danger" 
            onClick={() => {
              if (editEspacio && editEspacio.id) {
                handleDeleteEsp(editEspacio.id);
              }
              setEditEspacio(null);
            }}
            title="Eliminar este espacio"
          >
            🗑️ Eliminar Espacio
          </Button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setEditEspacio(null)}>Cancelar</Button>
            <Button variant="success" onClick={handleSaveEsp} disabled={savingEsp}>{savingEsp ? 'Guardando...' : 'Guardar Cambios'}</Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Modal Crear Nuevo Espacio, solo para el botón de nuevo espacio */}
      <Modal show={showModal && editingId === null} onHide={handleCloseModal} centered size="lg" backdrop={false}>
        <div style={{ padding: 0, background: '#f9fafd', borderRadius: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px 32px 0 32px' }}>
            <Button variant="light" onClick={handleCloseModal} style={{ fontSize: 28, fontWeight: 700, color: '#888', border: 'none', background: 'none', lineHeight: 1, padding: 0 }}>
              ×
            </Button>
          </div>
          <div style={{ padding: '0 32px 32px 32px' }}>
            <CrearEspacio onCreated={(created) => {
              try {
                cargarEspacios();
              } catch (e) { console.warn('Error recargando espacios después de crear', e); }
              setShowModal(false);
              try {
                const nombre = (created && (created.nom_espa || created.nombre || created.nom)) || null;
                if (nombre) setSelectedEspacioFilter(nombre.toString());
              } catch (e) { }
            }} />
          </div>
        </div>
      </Modal>





      <Footer />
    </div>
  );
};

export default Soliespacio;
