import React, { useState, useEffect } from 'react';
import { Button, Alert, Dropdown, Modal, Form, Pagination } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./solielemento.css";
import Footer from '../../Footer/Footer.jsx';
import HeaderAd from '../header_solielemento/header_solielemento.jsx';
import { obtenersolicitudes, obtenerSolicitudesPorid } from '../../../api/solicitudesApi';
import ElementosService from '../../../api/ElementosApi';

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

  const Listaxd = ({ onVerClick }) => {
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
    }, []);

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
  const [showModal, setShowModal] = useState(false);
  const [modalDetalles, setModalDetalles] = useState(null);

  const handleVerClick = async (detalles) => {
    try {
      const id = detalles?.id_solicitud || detalles?.id || detalles?._id || null;
      if (id) {
        const solicitudFull = await obtenerSolicitudesPorid(id);
        const idsCsv = solicitudFull?.id_elem || (solicitudFull?.id_elem?.toString && solicitudFull.id_elem.toString()) || '';
        const ids = idsCsv ? idsCsv.toString().split(',').map(x => x.trim()).filter(Boolean) : [];
        const elementosInfo = await Promise.all(ids.map(i => ElementosService.obtenerPorId(i).catch(() => null)));
        const elementNames = elementosInfo.map(e => e?.nom_elemento || e?.nom_elem || e?.nombre || '').filter(Boolean);
        const elementSeries = elementosInfo.map(e => e?.num_seri || e?.num_serie || e?.numero_serie || '').filter(Boolean);
        const estadoStr = solicitudFull?.est_soli || solicitudFull?.estado || (typeof solicitudFull?.estadosolicitud !== 'undefined' ? (
          (function(n){ switch(Number(n)){case 1:return 'Pendiente';case 2:return 'Aprobado';case 3:return 'Rechazado';case 4:return 'En uso';case 5:return 'Finalizado';default: return ''}})(solicitudFull.estadosolicitud)
        ) : '');

        const normalized = {
          ...solicitudFull,
          usuario: solicitudFull?.nom_usu || solicitudFull?.usuario || solicitudFull?.nombre_usuario || '',
          ambiente: solicitudFull?.ambient || solicitudFull?.ambiente || '',
          estado: estadoStr,
          fecha1: solicitudFull?.fecha_ini || solicitudFull?.fecha_inicio || solicitudFull?.fecha1 || '',
          fecha2: solicitudFull?.fecha_fn || solicitudFull?.fecha_fin || solicitudFull?.fecha2 || '',
          elementNames: elementNames.join(', '),
          elementSeries: elementSeries.join(', '),
          elementoserie: elementSeries.join(', '),
          elementosInfo,
        };

        setModalDetalles(normalized);
      } else {
        setModalDetalles(detalles);
      }
      setShowModal(true);
    } catch (err) {
      console.error('Error al obtener detalles de la solicitud:', err);
      setModalDetalles(detalles);
      setShowModal(true);
    }

  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalDetalles(null);
  };

  return (
    <div className="page-with-footer-1639">
      <HeaderAd />
      <Listaxd onVerClick={handleVerClick} />
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
          <div className="detail-item-1631">
            <label className="detail-label-1632">Elemento:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={modalDetalles?.elementNames || modalDetalles?.nom_elem || modalDetalles?.elemento || ''} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Categoría:</label>
            <div className="detail-value-display-1633">
              <Form.Control
                type="text"
                value={modalDetalles?.nom_cat || modalDetalles?.categoria || modalDetalles?.categoria_nombre || ''}
                readOnly
              />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Subcategoría:</label>
            <div className="detail-value-display-1633">
              <Form.Control
                type="text"
                value={modalDetalles?.nom_subcat || modalDetalles?.subcategoria || modalDetalles?.subcategoria_nombre || ''}
                readOnly
              />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Fecha y hora de inicio:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={formatDateTime(modalDetalles?.fecha1 || modalDetalles?.fecha_ini || modalDetalles?.fecha_ini_soli || '')} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Fecha y hora de fin:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={formatDateTime(modalDetalles?.fecha2 || modalDetalles?.fecha_fn || modalDetalles?.fecha_fin_soli || '')} readOnly />
            </div>
          </div>


          <div className="detail-item-1631">
            <label className="detail-label-1632">Número de serie del elemento:</label>
            <div className="detail-value-display-1633">
                  <Form.Control type="text" value={modalDetalles?.elementSeries || modalDetalles?.elementoserie || modalDetalles?.num_serie || modalDetalles?.num_seri || ''} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Cantidad:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={modalDetalles?.cantidad || modalDetalles?.cantid || modalDetalles?.accesorios || modalDetalles?.cantidad_solicitada || ''} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Nombre del Usuario:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={modalDetalles?.usuario || modalDetalles?.nom_usu || ''} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Ambiente:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={modalDetalles?.ambiente || ''} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Estado:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={modalDetalles?.estado || ''} readOnly />
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
        </Modal.Body>
        <Modal.Footer className="modern-modal-footer-1634">
          <Button variant="secondary" onClick={handleCloseModal} className="modal-action-button-1635 cancel-action-1636">
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </div>
  );
};

export default Solielemento;