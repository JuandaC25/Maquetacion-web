import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { Button, Alert, Dropdown, Modal, Form, Pagination } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./solielemento.css";
import Footer from '../../Footer/Footer.jsx';
import HeaderAd from '../header_solielemento/header_solielemento.jsx';
import { obtenersolicitudes, obtenerSolicitudesPorid, actualizarSolicitud } from '../../../api/solicitudesApi';
import ElementosService from '../../../api/ElementosApi';
import { obtenerCategoria } from '../../../api/CategoriaApi';
import { obtenerSubcategorias } from '../../../api/SubcategotiaApi';

const formatDateTime = (value) => {
  if (!value) return '';
  try {
    const d = (value instanceof Date) ? value : new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
  } catch (e) {
    return value;
  }
};

const toLocalInput = (d) => {
  try {
    const date = (d instanceof Date) ? d : new Date(d);
    const tzOffset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - tzOffset * 60000);
    return local.toISOString().slice(0,16);
  } catch (e) {
    return '';
  }
};

const Ticketxd = ({ estado, onVerClick, detalles }) => {
  return (
    <div className="margen-1601">
      <div className="card-1602">
        <div className="infos-1603">
          <div className="image-1604"></div>
          <div className="info-1605">
            <div>
              <p className="name-1606">
                {detalles?.usuario || 'Usuario no disponible'}
              </p>
              <p className="function-1607">
                {detalles?.elemento || 'Elemento no disponible'}
              </p>
            </div>
            <div className="stats-1608">
              <p className="flex-1609 flex-col-1610">
                Ambiente
                <span className="state-value-1611">
                  {detalles?.ambiente || 'N/A'}
                </span>
              </p>
              <p className="flex-1609">
                Estado
                <span className="state-value-1611" style={{ 
                  color: estado === 'pendiente' ? '#ff6b6b' : 
                         estado === 'en proceso' ? '#4ecdc4' : '#45b7d1'
                }}>
                  {estado}
                </span>
              </p>
            </div>
          </div>
        </div>
        <button
          className="request-1612"
          type="button"
          onClick={onVerClick}
        aria-label="Ver solicitud"
          title="Ver detalles de la solicitud"
        >
          Ver
        </button>
      </div>
    </div>
  );
};

  const Listaxd = ({ onVerClick, refreshKey }) => {
    const [elementoSeleccionado, setElementoSeleccionado] = useState('Todos');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      let mounted = true;
      setLoading(true);
      obtenersolicitudes()
        .then((data) => {
          if (!mounted) return;
          const arr = Array.isArray(data) ? data : [];
          const elementos = arr.map(s => {
            const detalles = s.detalles ? s.detalles : {
              fecha1: s.fecha1 || s.fecha_ini || '',
              fecha2: s.fecha2 || s.fecha_fn || '',
              elemento: s.elemento || s.nom_elem || (s.id_elemen && (Array.isArray(s.id_elemen) ? s.id_elemen.join(', ') : s.id_elemen)) || 'Solicitud',
              elementoserie: s.elementoserie || s.elemento_serie || s.num_serie || s.num_seri || '',
              accesorios: s.accesorios || s.accessorios || '',
              accesoriosserie: s.accesoriosserie || s.accesorios_serie || '',
              cantidad: s.cantidad || s.cant || s.cantid || s.cantidad_solicitada || s.qty || s.cantidad_elem || s.cantidad_soli || s.accesorios || '',
              categoria: s.categoria || s.categoria_nombre || s.categoriaNombre || (s.categoriaObj && (s.categoriaObj.nombre || s.categoriaObj.name)) || s.categ || '',
              subcategoria: s.subcategoria || s.subcategoria_nombre || s.subcategoriaNombre || s.subcat || (s.subcategoriaObj && (s.subcategoriaObj.nombre || s.subcategoriaObj.name)) || '',
              usuario: s.usuario || s.nombre_usuario || s.nom_usu || s.nom_usuario || '',
              tecnico: s.tecnico || '',
              ambiente: s.ambiente || s.ambient || '',
              estado: s.estado || s.estadosoli || s.est_soli || '',
              id_prestamo: s.id_prestamo || s.id_prest || null,
              fecha_entrega_prestamo: s.fecha_entrega_prestamo || s.fecha_entreg || s.fecha_entrega || null,
              fecha_recepcion_prestamo: s.fecha_recepcion_prestamo || s.fecha_repc || s.fecha_recepcion || null,
              tipo_prestamo: s.tipo_prestamo || s.tipo_pres || '',
              estado_prestamo: s.estado_prestamo || s.estado_pres || null,
              id_elem_prestamo: s.id_elem_prestamo || s.id_elem || s.id_elem_prest || '',
              nom_elem_prestamo: s.nom_elem_prestamo || s.nom_elem || s.nom_elem_prest || ''
            };
            const id_solicitud = s.id_soli || s.id || s._id || s.identifier || null;
            return { ...s, id_solicitud, detalles: { ...detalles, id_solicitud } };
          });
          setTickets(elementos);
        })
        .catch(err => {
          console.error('Error al obtener solicitudes:', err);
          setError(err.message || 'Error al cargar solicitudes');
        })
        .finally(() => { if (mounted) setLoading(false); });
      return () => { mounted = false; };
    }, [refreshKey]);

    const ticketsFiltrados = elementoSeleccionado === 'Todos'
      ? tickets
      : tickets.filter(ticket => {
          const nombre = (ticket.elemento || ticket.detalles?.elemento || '').toString();
          return nombre.toLowerCase() === elementoSeleccionado.toLowerCase();
        });

    const handleSelectElemento = (elemento) => { setElementoSeleccionado(elemento); };

    if (loading) return (<div className="lista-tickets-1613">Cargando solicitudes...</div>);
    if (error) return (<div className="lista-tickets-1613">Error: {error}</div>);

    return (
      <div className="lista-tickets-1613">
        <Alert variant="success" className="alert-1614">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <Dropdown>
                <Dropdown.Toggle 
                  variant="success" 
                  id="dropdown-basic-1615"
                  className="dropdown-toggle-xd146"
                >
                  Elemento
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-xd147">
                  <Dropdown.Item onClick={() => handleSelectElemento('Todos')} className="dropdown-item-xd148">Todos</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSelectElemento('Portatil')} className="dropdown-item-xd148">Portátiles</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSelectElemento('Equipo de escritorio')} className="dropdown-item-xd148">Equipos de escritorio</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSelectElemento('Televisor')} className="dropdown-item-xd148">Televisores</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Alert>

        {ticketsFiltrados.length === 0 ? (
          <div className="elemento-empty-placeholder-1640">
            <div className="elemento-empty-inner-1641">
              <p className="elemento-empty-title">No hay elementos para visualizar</p>
              <p className="elemento-empty-text">No se encontraron solicitudes de elementos para el filtro seleccionado.</p>
            </div>
          </div>
        ) : (
          <div className="cards-container-1616">
            {ticketsFiltrados.map((t, i) => {
            const detalles = t.detalles ? t.detalles : {
              fecha1: t.fecha1,
              fecha2: t.fecha2,
              elemento: t.elemento,
              elementoserie: t.elementoserie,
              accesorios: t.accesorios,
              accesoriosserie: t.accesoriosserie,
              usuario: t.usuario,
              tecnico: t.tecnico,
              ambiente: t.ambiente,
              estado: t.estado
            };
            const estado = t.estado || detalles.estado || '';
            return (
              <Ticketxd key={t.id_solicitud ?? t.id ?? t._id ?? i} estado={estado} detalles={detalles} onVerClick={() => onVerClick({ ...detalles, id_solicitud: t.id_solicitud ?? t.id ?? t._id ?? i })} />
            );
            })}
          </div>
        )}
      </div>
    );
  };

const Solielemento = () => {
  const { roles } = useAuth();
  const isAdmin = Array.isArray(roles) && roles.includes('ADMINISTRADOR');
  const [listRefreshKey, setListRefreshKey] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [nowMin, setNowMin] = useState('');
  const [endOfDay, setEndOfDay] = useState('');
  const [modalDetalles, setModalDetalles] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableDetails, setEditableDetails] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [saving, setSaving] = useState(false);

  const ESTADOS = [
    { id: 1, label: 'Pendiente' },
    { id: 2, label: 'Aprobado' },
    { id: 3, label: 'Rechazado' },
    { id: 4, label: 'En uso' },
    { id: 5, label: 'Finalizado' },
  ];

  const getEstadoId = (val) => {
    if (val == null) return '';
    if (typeof val === 'number') return val;
    const n = Number(val);
    if (!isNaN(n)) return n;
    const lowered = String(val).toLowerCase();
    const found = ESTADOS.find(e => e.label.toLowerCase() === lowered);
    return found ? found.id : '';
  };

  const getEstadoLabel = (val) => {
    if (val == null) return '';
    if (typeof val === 'number') {
      const f = ESTADOS.find(e => e.id === Number(val));
      return f ? f.label : String(val);
    }
    const n = Number(val);
    if (!isNaN(n)) {
      const f = ESTADOS.find(e => e.id === n);
      return f ? f.label : String(val);
    }
    return String(val);
  };

  const handleVerClick = async (detalles) => {
    try {
      const id = detalles?.id_solicitud || detalles?.id || detalles?._id || null;
      if (id) {
        const solicitudFull = await obtenerSolicitudesPorid(id);
        const idsCsv = solicitudFull?.id_elem || (solicitudFull?.id_elem?.toString && solicitudFull.id_elem.toString()) || '';
        const ids = idsCsv ? idsCsv.toString().split(',').map(x => x.trim()).filter(Boolean) : [];
        const elementosInfo = await Promise.all(ids.map(i => ElementosService.obtenerPorId(i).catch(() => null)));
        // Normalizar nombres/series de elementos consultados. Intentar varias claves posibles.
        const elementNames = elementosInfo.map(e => (
          e?.nom_elemento || e?.nom_elem || e?.nombre || e?.nombreElemento || e?.nombre_elemento || e?.nombre_elem || ''
        )).filter(Boolean);
        const elementSeries = elementosInfo.map(e => (
          e?.num_seri || e?.num_serie || e?.numero_serie || e?.serie || e?.serial || ''
        )).filter(Boolean);
        const estadoStr = solicitudFull?.est_soli || solicitudFull?.estado || (typeof solicitudFull?.estadosolicitud !== 'undefined' ? (
          (function(n){ switch(Number(n)){case 1:return 'Pendiente';case 2:return 'Aprobado';case 3:return 'Rechazado';case 4:return 'En uso';case 5:return 'Finalizado';default: return ''}})(solicitudFull.estadosolicitud)
        ) : '');
        let fallbackNames = [];
        if (elementNames.length === 0) {
          const candidate = solicitudFull?.elemento || solicitudFull?.nom_elem || solicitudFull?.nom_elemento || solicitudFull?.nombre || solicitudFull?.nom_elem_prestamo || solicitudFull?.nom_elem_prest || '';
          if (candidate) fallbackNames = [candidate];
        }

        const normalized = {
          ...solicitudFull,
          usuario: solicitudFull?.nom_usu || solicitudFull?.usuario || solicitudFull?.nombre_usuario || '',
          ambiente: solicitudFull?.ambient || solicitudFull?.ambiente || '',
          estado: estadoStr,
          fecha1: solicitudFull?.fecha_ini || solicitudFull?.fecha_inicio || solicitudFull?.fecha1 || '',
          fecha2: solicitudFull?.fecha_fn || solicitudFull?.fecha_fin || solicitudFull?.fecha2 || '',
          elementNames: (elementNames.length ? elementNames.join(', ') : fallbackNames.join(', ')),
          elementSeries: elementSeries.join(', '),
          elementoserie: elementSeries.join(', '),
          elementosInfo,
        };

        normalized.id_solicitud = solicitudFull?.id_soli || solicitudFull?.id || solicitudFull?._id || id;

        const base = { ...normalized };
        try {
          const matchedCat = (await Promise.resolve(categorias)).find?.(c => (c.nom_cat || c.nom_categoria || c.nombre || '').toString().toLowerCase() === (normalized?.nom_cat || normalized?.categoria || '').toString().toLowerCase());
          if (matchedCat) base.id_cat = matchedCat.id ?? matchedCat.id_cat ?? matchedCat.id_categoria;
          const matchedSub = (await Promise.resolve(subcategorias)).find?.(sc => (sc.nom_subcateg || sc.nom_subcat || sc.nombre || '').toString().toLowerCase() === (normalized?.nom_subcat || normalized?.subcategoria || '').toString().toLowerCase());
          if (matchedSub) base.id_subcat = matchedSub.id ?? matchedSub.id_subcat ?? matchedSub.id_categoria;
        } catch (e) {
        }

        setModalDetalles(normalized);
        setEditableDetails(base);
        setIsEditing(false);
      } else {
        setModalDetalles(detalles);
        setEditableDetails(detalles);
        setIsEditing(false);
      }
      setShowModal(true);
    } catch (err) {
      console.error('Error al obtener detalles de la solicitud:', err);
      setModalDetalles(detalles);
      setIsEditing(false);
      setEditableDetails(null);
      setShowModal(true);
    }

  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalDetalles(null);
    setIsEditing(false);
    setEditableDetails(null);
  };


  useEffect(() => {
    if (!showModal) return;
    let mounted = true;
    const load = async () => {
      // establecer límites de fecha/hora: ahora (local) como mínimo y fin del día como máximo
      try {
        const toLocalInput = (d) => {
          const date = (d instanceof Date) ? d : new Date(d);
          const tzOffset = date.getTimezoneOffset();
          const local = new Date(date.getTime() - tzOffset * 60000);
          return local.toISOString().slice(0,16);
        };
        const now = new Date();
        const end = new Date();
        end.setHours(23,59,59,0);
        if (mounted) {
          setNowMin(toLocalInput(now));
          setEndOfDay(toLocalInput(end));
        }
      } catch (e) {
        console.error('Error al calcular límites de fecha local', e);
      }
      setLoadingCats(true);
      try {
        const cats = await obtenerCategoria();
        const subcats = await obtenerSubcategorias();
        if (!mounted) return;
        setCategorias(Array.isArray(cats) ? cats : []);
        setSubcategorias(Array.isArray(subcats) ? subcats : []);
      } catch (e) {
        console.error('Error cargando categorías/subcategorías', e);
      } finally {
        if (mounted) setLoadingCats(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [showModal]);

  const startEditing = () => {
    const base = { ...modalDetalles };
    try {
      const matchedCat = categorias.find(c => (c.nom_cat || c.nom_categoria || c.nombre || '').toString().toLowerCase() === (modalDetalles?.nom_cat || modalDetalles?.categoria || '').toString().toLowerCase());
      if (matchedCat) base.id_cat = matchedCat.id ?? matchedCat.id_cat ?? matchedCat.id_categoria;
      const matchedSub = subcategorias.find(sc => (sc.nom_subcateg || sc.nom_subcat || sc.nombre || '').toString().toLowerCase() === (modalDetalles?.nom_subcat || modalDetalles?.subcategoria || '').toString().toLowerCase());
      if (matchedSub) base.id_subcat = matchedSub.id ?? matchedSub.id_subcat ?? matchedSub.id_categoria;
    } catch (e) {
    }
    setEditableDetails(base);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditableDetails(null);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditableDetails(prev => {
      let v = value;
      const next = { ...(prev || {}), [field]: v };
      // En edición de fecha inicio: no permitir valores anteriores a nowMin
      if (field === 'fecha1' && nowMin) {
        try {
          const minD = new Date(nowMin);
          const newD = new Date(v);
          if (newD < minD) {
            v = nowMin;
            next[field] = v;
          }
        } catch (e) { /* ignore parse errors */ }
        // si fecha2 existe y queda antes de la nueva fecha1, ajustarla
        if (next.fecha2) {
          try {
            const d1 = new Date(v);
            const d2 = new Date(next.fecha2);
            if (d2 < d1) next.fecha2 = v;
          } catch (e) {}
        }
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!editableDetails) return;
    const id = editableDetails?.id_solicitud || editableDetails?.id || editableDetails?._id || modalDetalles?.id_solicitud || modalDetalles?.id;
    if (!id) {
      alert('No se encontró ID de la solicitud para actualizar');
      return;
    }
    setSaving(true);
    try {
      // Validaciones de fecha: mismo día (hoy) y no en el pasado
      try {
        const fecha1Val = editableDetails?.fecha1 || modalDetalles?.fecha1 || '';
        const fecha2Val = editableDetails?.fecha2 || modalDetalles?.fecha2 || '';
        const todayStr = toLocalInput(new Date()).slice(0,10);
        const nowDate = nowMin ? new Date(nowMin) : new Date();
        const endDate = endOfDay ? new Date(endOfDay) : (() => { const d = new Date(); d.setHours(23,59,59,0); return d; })();

        if (!fecha1Val || !fecha2Val) {
          alert('Debe ingresar fecha y hora de inicio y fin (mismo día).');
          setSaving(false);
          return;
        }

        const f1Date = new Date(fecha1Val);
        const f2Date = new Date(fecha2Val);

        if (fecha1Val.slice(0,10) !== todayStr || fecha2Val.slice(0,10) !== todayStr) {
          alert('Las fechas deben ser del mismo día (hoy).');
          setSaving(false);
          return;
        }

        if (f1Date < nowDate) {
          alert('La fecha/hora de inicio no puede ser anterior al momento actual.');
          setSaving(false);
          return;
        }

        if (f2Date < f1Date) {
          alert('La fecha de fin debe ser igual o posterior a la fecha de inicio.');
          setSaving(false);
          return;
        }

        if (f2Date > endDate) {
          alert('La fecha/hora debe quedar en el mismo día (hasta 23:59).');
          setSaving(false);
          return;
        }
      } catch (e) {
        console.error('Error validando fechas', e);
      }

      const cantidadVal = (typeof editableDetails.cantidad !== 'undefined' && editableDetails.cantidad !== null) ? Number(editableDetails.cantidad) : (modalDetalles?.cantidad ? Number(modalDetalles.cantidad) : null);
      if (cantidadVal && cantidadVal > 2) {
        alert('La cantidad máxima permitida es 2 equipos.');
        setSaving(false);
        return;
      }

      const estadoVal = getEstadoId(typeof editableDetails.estado !== 'undefined' && editableDetails.estado !== null ? editableDetails.estado : modalDetalles?.estado);

      const payload = {
        id_cat: editableDetails.id_cat || editableDetails.id_categoria || null,
        id_subcat: editableDetails.id_subcat || editableDetails.id_subcategoria || null,
        fecha_ini: editableDetails.fecha1 || editableDetails.fecha_ini || modalDetalles?.fecha1 || null,
        fecha_fn: editableDetails.fecha2 || editableDetails.fecha_fn || modalDetalles?.fecha2 || null,
        ambient: editableDetails.ambiente || modalDetalles?.ambiente || null,
        cantid: (cantidadVal !== null && cantidadVal !== undefined) ? cantidadVal : null,
        id_est_soli: estadoVal || null,
      };

      await actualizarSolicitud(id, payload);
      setModalDetalles(prev => ({ ...(prev || {}), ...(editableDetails || {}), estado: estadoVal || prev?.estado }));
      setIsEditing(false);
      setEditableDetails(null);
      // trigger list refresh so the card shows updated estado/cantidad/ambiente
      try { setListRefreshKey(k => k + 1); } catch (e) { /* ignore if not available */ }
      alert('Solicitud actualizada correctamente');
    } catch (err) {
      console.error('Error actualizando solicitud', err);
      alert('Error al guardar: ' + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-with-footer-1639">
      <HeaderAd />
      <Listaxd onVerClick={handleVerClick} refreshKey={listRefreshKey} />
      <div className="pagination-1617">
        <div className="pagination-inner-1618">
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
          <span className="selection-1619"></span>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal} centered dialogClassName="modern-modal-dialog-1627">
        <Modal.Header closeButton className="modern-modal-header-1628">
          <Modal.Title className="modern-modal-title-1629">Detalles de la solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modern-modal-body-1630">
          <div className="modal-content-flex">
          <div className="detail-item-1631">
            <label className="detail-label-1632">Elemento:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={(modalDetalles?.elementNames ?? modalDetalles?.nom_elem ?? modalDetalles?.elemento ?? '')} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Categoría:</label>
            <div className="detail-value-display-1633">
              {isEditing && !isAdmin ? (
                <Form.Select value={editableDetails?.id_cat || editableDetails?.id_categoria || ''} onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : null;
                  handleChange('id_cat', val);
                }}>
                  <option value="">-- Seleccione --</option>
                  {categorias.map(c => (
                    <option key={c.id ?? c.id_cat ?? c.id_categoria} value={c.id ?? c.id_cat ?? c.id_categoria}>{c.nom_cat || c.nom_categoria || c.nombre || c.nom_cat}</option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control type="text" value={modalDetalles?.nom_cat || modalDetalles?.categoria || modalDetalles?.categoria_nombre || ''} readOnly />
              )}
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Subcategoría:</label>
            <div className="detail-value-display-1633">
              {isEditing && !isAdmin ? (
                <Form.Select value={editableDetails?.id_subcat || editableDetails?.id_subcategoria || ''} onChange={(e) => handleChange('id_subcat', e.target.value ? Number(e.target.value) : null)}>
                  <option value="">-- Seleccione --</option>
                  {subcategorias
                    .filter(sc => {
                      const selectedCat = editableDetails?.id_cat || modalDetalles?.id_cat || modalDetalles?.id_categoria || modalDetalles?.id_cat;
                      const scIdCat = sc.id_cat ?? sc.id_categoria ?? sc.id_cat;
                      if (!selectedCat) return true;
                      return Number(scIdCat) === Number(selectedCat);
                    })
                    .map(sc => (
                      <option key={sc.id ?? sc.id_subcat ?? sc.id_categoria} value={sc.id ?? sc.id_subcat ?? sc.id_categoria}>{sc.nom_subcateg || sc.nom_subcat || sc.nombre || sc.nom_subcateg}</option>
                    ))}
                </Form.Select>
              ) : (
                <Form.Control type="text" value={modalDetalles?.nom_subcat || modalDetalles?.subcategoria || modalDetalles?.subcategoria_nombre || ''} readOnly />
              )}
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Fecha y hora de inicio:</label>
            <div className="detail-value-display-1633">
              {isEditing ? (
                <Form.Control
                  type="datetime-local"
                  value={(editableDetails?.fecha1 ? toLocalInput(editableDetails.fecha1) : (modalDetalles?.fecha1 ? toLocalInput(modalDetalles.fecha1) : ''))}
                  onChange={(e) => handleChange('fecha1', e.target.value)}
                  min={nowMin || undefined}
                  max={endOfDay || undefined}
                />
              ) : (
                <Form.Control type="text" value={formatDateTime(modalDetalles?.fecha1 || modalDetalles?.fecha_ini || modalDetalles?.fecha_ini_soli || '')} readOnly />
              )}
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Fecha y hora de fin:</label>
            <div className="detail-value-display-1633">
              {isEditing ? (
                <Form.Control
                  type="datetime-local"
                  value={(editableDetails?.fecha2 ? toLocalInput(editableDetails.fecha2) : (modalDetalles?.fecha2 ? toLocalInput(modalDetalles.fecha2) : ''))}
                  onChange={(e) => handleChange('fecha2', e.target.value)}
                  min={(editableDetails?.fecha1 ? toLocalInput(editableDetails.fecha1) : nowMin) || undefined}
                  max={endOfDay || undefined}
                />
              ) : (
                <Form.Control type="text" value={formatDateTime(modalDetalles?.fecha2 || modalDetalles?.fecha_fn || modalDetalles?.fecha_fin_soli || '')} readOnly />
              )}
            </div>
          </div>


          <div className="detail-item-1631">
            <label className="detail-label-1632">Número de serie del elemento:</label>
            <div className="detail-value-display-1633">
                  <Form.Control type="text" value={(modalDetalles?.elementSeries ?? modalDetalles?.elementoserie ?? modalDetalles?.num_serie ?? modalDetalles?.num_seri ?? '')} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Cantidad:</label>
            <div className="detail-value-display-1633">
              {isEditing ? (
                <Form.Control type="number" min={1} max={2} value={(editableDetails?.cantidad ?? modalDetalles?.cantidad ?? modalDetalles?.cantid ?? modalDetalles?.accesorios ?? modalDetalles?.cantidad_solicitada ?? '')} onChange={(e) => handleChange('cantidad', e.target.value ? Number(e.target.value) : '')} />
              ) : (
                <Form.Control type="number" value={(modalDetalles?.cantidad ?? modalDetalles?.cantid ?? modalDetalles?.accesorios ?? modalDetalles?.cantidad_solicitada ?? '')} readOnly />
              )}
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Nombre del Usuario:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={(modalDetalles?.usuario ?? modalDetalles?.nom_usu ?? '')} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Ambiente:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={(isEditing ? (editableDetails?.ambiente ?? '') : (modalDetalles?.ambiente ?? ''))} onChange={(e) => isEditing && handleChange('ambiente', e.target.value)} readOnly={!isEditing} />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Estado:</label>
            <div className="detail-value-display-1633">
              {isEditing ? (
                <Form.Select value={editableDetails?.estado ?? modalDetalles?.estado ?? ''} onChange={(e) => handleChange('estado', e.target.value)}>
                  <option value="">-- Seleccione estado --</option>
                  {ESTADOS.map(st => (
                    <option key={st.id} value={st.id}>{st.label}</option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control type="text" value={getEstadoLabel(modalDetalles?.estado) || ''} readOnly />
              )}
            </div>
          </div>
          {modalDetalles?.id_prestamo || modalDetalles?.id_prestamo === 0 ? (
            <>
              <hr />
              <div className="detail-item-1631">
                <label className="detail-label-1632">ID Préstamo:</label>
                <div className="detail-value-display-1633">
                  <Form.Control type="text" value={modalDetalles?.id_prestamo || ''} readOnly />
                </div>
              </div>

              <div className="detail-item-1631">
                <label className="detail-label-1632">Fecha entrega (préstamo):</label>
                  <div className="detail-value-display-1633">
                    <Form.Control type="text" value={formatDateTime(modalDetalles?.fecha_entrega_prestamo || modalDetalles?.fecha_entreg || modalDetalles?.fecha_entrega || '')} readOnly />
                  </div>
              </div>

              <div className="detail-item-1631">
                <label className="detail-label-1632">Fecha recepción (préstamo):</label>
                <div className="detail-value-display-1633">
                  <Form.Control type="text" value={formatDateTime(modalDetalles?.fecha_recepcion_prestamo || modalDetalles?.fecha_repc || modalDetalles?.fecha_recepcion || '')} readOnly />
                </div>
              </div>
              <div className="detail-item-1631">
                <label className="detail-label-1632">Tipo de préstamo:</label>
                <div className="detail-value-display-1633">
                  <Form.Control type="text" value={modalDetalles?.tipo_prestamo || ''} readOnly />
                </div>
              </div>

              <div className="detail-item-1631">
                <label className="detail-label-1632">Elementos prestados:</label>
                <div className="detail-value-display-1633">
                  <Form.Control type="text" value={modalDetalles?.elementNames || modalDetalles?.nom_elem_prestamo || modalDetalles?.id_elem_prestamo || ''} readOnly />
                </div>
              </div>
            </>
          ) : null}
          </div>
        </Modal.Body>
        <Modal.Footer className="modern-modal-footer-1634">
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={cancelEditing} className="modal-action-button-1635 cancel-action-1636">
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={saving} className="modal-action-button-1635">
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={handleCloseModal} className="modal-action-button-1635 cancel-action-1636">
                Cerrar
              </Button>
              <Button variant="outline-primary" onClick={startEditing} className="modal-action-button-1635" style={{ marginLeft: 8 }}>
                Editar
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      <Footer />
    </div>
  );
};

export default Solielemento;