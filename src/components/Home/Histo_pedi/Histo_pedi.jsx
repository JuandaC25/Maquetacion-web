import { useState, useEffect, useMemo } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Header from '../../common/Header/Header';
import './Histo_pedi.css';
import Stack from 'react-bootstrap/Stack';
import Footer from '../../Footer/Footer.jsx';
import { Pagination, Button, Badge, Tabs, Tab } from 'react-bootstrap'; 
import { 
    obtenersolicitudes, 
    eliminarSolicitud,
    actualizarEstadoSolicitud,
    cancelarSolicitudComoInstructor
} from '../../../api/solicitudesApi.js';
import { obtenerTickets, eliminarTicket } from '../../../api/ticket.js';
import { obtenerSubcategorias } from '../../../api/SubcategotiaApi.js'; 

// --- Funciones de Formato ---

const formatFecha = (fechaString) => {
    if (!fechaString || fechaString === 'N/A') return 'N/A';
    try {
        const datePart = fechaString.split('T')[0];
        const [year, month, day] = datePart.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day); 
        return dateObj.toLocaleDateString('es-ES', { 
            year: 'numeric', month: 'numeric', day: 'numeric' 
        });
    } catch (e) {
        console.error("Error al formatear la fecha:", e);
        return 'Fecha Inválida';
    }
}

const getStatusDetails = (estadoValor) => {
    const estadoTexto = estadoValor?.toString().toLowerCase().trim() || '';

    if (estadoTexto.includes('pendiente')) {
        return { text: 'Pendiente', variant: 'warning' };
    }
    if (estadoTexto.includes('aprobado')) {
        return { text: 'Aprobado', variant: 'success' };
    }
    if (estadoTexto.includes('rechazado')) {
        return { text: 'Rechazado', variant: 'danger' };
    }
    if (estadoTexto.includes('en uso')) {
        return { text: 'En uso', variant: 'primary' };
    }
    if (estadoTexto.includes('finalizado')) {
        return { text: 'Finalizado', variant: 'secondary' };
    }
    if (estadoTexto.includes('cancelado')) {
        return { text: 'Cancelado', variant: 'secondary' }; 
    }

    return { text: 'Desconocido', variant: 'light' };
};

// --- Componente Historial_ped ---

function Historial_ped() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [subcategorias, setSubcategorias] = useState({}); 
    const [subcategoriaOptions, setSubcategoriaOptions] = useState([]);
    const [selectedSubcategoriaId, setSelectedSubcategoriaId] = useState(null);
    const [tipoSolicitudFilter, setTipoSolicitudFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [solicitudesPerPage] = useState(6);
    const [activeTab, setActiveTab] = useState('solicitudes'); 

    const cargarSubcategorias = async () => {
        try {
            const data = await obtenerSubcategorias();
            if (Array.isArray(data)) {
                const subMap = data.reduce((acc, sub) => {
                    if (sub.id !== undefined) acc[sub.id] = sub.nom_subcateg;
                    if (sub.id_subcateg !== undefined) acc[sub.id_subcateg] = sub.nom_subcateg;
                    return acc;
                }, {});
                setSubcategorias(subMap);
                setSubcategoriaOptions(data.map(sub => ({
                    id: String(sub.id),
                    nombre: sub.nom_subcateg
                })));
            }
        } catch (err) {
            console.error("Fallo al obtener subcategorías:", err);
        }
    };

    const cargarSolicitudes = async () => {
        try {
            setIsLoading(true);
            const data = await obtenersolicitudes();
            const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
            let solicitudesDelUsuario = Array.isArray(data)
                ? data.filter(sol => sol.id_usu === usuario.id)
                : [];

            // Cancelar automáticamente si la hora de fin ya pasó y está pendiente
            const now = new Date();
            const token = localStorage.getItem('auth_token');
            const promesasCancelacion = solicitudesDelUsuario.map(async (sol) => {
                if (
                    sol.est_soli &&
                    typeof sol.est_soli === 'string' &&
                    sol.est_soli.trim().toLowerCase() === 'pendiente'
                ) {
                    let fechaFinStr = sol.fecha_fn;
                    let horaFinStr = sol.hora_fn;
                    if ((!horaFinStr || horaFinStr === 'undefined') && typeof fechaFinStr === 'string' && fechaFinStr.includes('T')) {
                        horaFinStr = fechaFinStr.split('T')[1]?.slice(0,5);
                        fechaFinStr = fechaFinStr.split('T')[0];
                    }
                    if (fechaFinStr && horaFinStr) {
                        if (horaFinStr.length > 5) horaFinStr = horaFinStr.slice(0,5);
                        const fechaHoraFin = new Date(`${fechaFinStr}T${horaFinStr}:00`);
                        if (now > fechaHoraFin) {
                            try {
                                await cancelarSolicitudComoInstructor(sol.id_soli, { id_est_soli: 4 }, token);
                            } catch (err) {
                            }
                        }
                    }
                }
            });
            await Promise.all(promesasCancelacion);
            const dataActualizada = await obtenersolicitudes();
            solicitudesDelUsuario = Array.isArray(dataActualizada)
                ? dataActualizada.filter(sol => sol.id_usu === usuario.id)
                : [];
            setSolicitudes(solicitudesDelUsuario);
            setError(null);
        } catch (err) {
            console.error("Fallo al obtener solicitudes:", err);
            setError(err.message || "Error al cargar el historial de pedidos.");
        } finally {
            setIsLoading(false);
        }
    };

    const cargarTickets = async () => {
        try {
            setIsLoading(true);
            const data = await obtenerTickets();
            const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
            const ticketsDelUsuario = Array.isArray(data) 
                ? data.filter(ticket => ticket.id_usuario === usuario.id)
                : [];
            setTickets(ticketsDelUsuario);
            setError(null);
        } catch (err) {
            console.error("Fallo al obtener tickets:", err);
            setError(err.message || "Error al cargar los tickets reportados.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        cargarSubcategorias();
    }, []); 

    useEffect(() => {
        setCurrentPage(1); 
        setSelectedSubcategoriaId(null);
        setTipoSolicitudFilter('all');
        if (activeTab === 'solicitudes') {
            cargarSolicitudes();
        } else {
            cargarTickets();
        }
    }, [activeTab]);
    
    // LÓGICA DE FILTRADO: Filtra las solicitudes basándose en el ID seleccionado y el tipo.
    const filteredSolicitudes = useMemo(() => {
        if (activeTab !== 'solicitudes') {
            return solicitudes;
        }

        let filtered = [...solicitudes];

        // Filtrar por tipo (elementos o espacios)
        if (tipoSolicitudFilter === 'elementos') {
            filtered = filtered.filter(sol => {
                const subcatId = sol.id_subcategoria ?? sol.id_subcatego ?? sol.id_subcate ?? sol.id_subcat ?? sol.id_subcateg;
                return subcatId !== null && subcatId !== undefined;
            });
        } else if (tipoSolicitudFilter === 'espacios') {
            filtered = filtered.filter(sol => {
                const subcatId = sol.id_subcategoria ?? sol.id_subcatego ?? sol.id_subcate ?? sol.id_subcat ?? sol.id_subcateg;
                return subcatId === null || subcatId === undefined;
            });
        }

        if (selectedSubcategoriaId && tipoSolicitudFilter !== 'espacios') {
            const filterId = String(selectedSubcategoriaId);
            filtered = filtered.filter(sol => {
                const solSubcatId = String(
                    sol.id_subcategoria ??
                    sol.id_subcatego ??
                    sol.id_subcate ??
                    sol.id_subcat ??
                    sol.id_subcateg ??
                    'NULL'
                );
                return solSubcatId === filterId;
            });
        }

        return filtered;
    }, [solicitudes, selectedSubcategoriaId, tipoSolicitudFilter, activeTab]);
    
    const currentItems = activeTab === 'solicitudes' ? filteredSolicitudes : tickets;
    const indexOfLastSolicitud = currentPage * solicitudesPerPage;
    const indexOfFirstSolicitud = indexOfLastSolicitud - solicitudesPerPage;
    const currentSolicitudes = currentItems.slice(indexOfFirstSolicitud, indexOfLastSolicitud);
    const handleCancelStatus = async (id_solicitud) => {
        const ESTADO_CANCELADO = 'Cancelado';
        if (!window.confirm(`¿Estás seguro de que deseas cancelar la solicitud ${id_solicitud}? El estado cambiará a "${ESTADO_CANCELADO}".`)) {
            return;
        }

        const token = localStorage.getItem('auth_token');
        try {
            await cancelarSolicitudComoInstructor(id_solicitud, { id_est_soli: 4 }, token);
            setSolicitudes(prevSolicitudes =>
                prevSolicitudes.map(sol => {
                    if (sol.id_soli === id_solicitud) {
                        return { ...sol, est_soli: ESTADO_CANCELADO };
                    }
                    return sol;
                })
            );
            alert(`Solicitud ${id_solicitud} cambiada a ${ESTADO_CANCELADO} correctamente.`);
        } catch (err) {
            console.error("Error al cancelar la solicitud:", err);
            alert(`Error al cancelar la solicitud ${id_solicitud}: ${err.message || 'Error desconocido'}`);
        }
    };
    
    const handleDeleteTicket = async (id_ticket) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar el ticket ${id_ticket}?`)) {
            return;
        }

        try {
            await eliminarTicket(id_ticket);
            setTickets(prev => prev.filter(ticket => ticket.id_tickets !== id_ticket));
            
            if (currentSolicitudes.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
            alert(`Ticket ${id_ticket} eliminado correctamente.`);
            
        } catch (err) {
            console.error("Error al eliminar el ticket:", err);
            alert(`Error al eliminar el ticket ${id_ticket}: ${err.message}`);
        }
    };

    const totalPages = Math.ceil(currentItems.length / solicitudesPerPage);
    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const renderPaginationItems = () => {
        const items = [];
        const maxPagesToShow = 5;
        let startPage, endPage;

        if (totalPages <= maxPagesToShow) {
            startPage = 1;
            endPage = totalPages;
        } else {
            startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            endPage = Math.min(totalPages, currentPage + Math.floor(maxPagesToShow / 2));

            if (endPage - startPage + 1 < maxPagesToShow) {
                if (currentPage < totalPages / 2) {
                    endPage = startPage + maxPagesToShow - 1;
                } else {
                    startPage = endPage - maxPagesToShow + 1;
                }
            }
        }

        if (startPage > 1) {
            items.push(<Pagination.First key="first" onClick={() => paginate(1)} />);
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="start-ellipsis" />);
            }
        }

        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                    {number}
                </Pagination.Item>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<Pagination.Ellipsis key="end-ellipsis" />);
            }
            items.push(<Pagination.Last key="last" onClick={() => paginate(totalPages)} />);
        }
        return items;
    };

    const handleFilterChange = (id) => {
        setSelectedSubcategoriaId(id === 'all' ? null : id);
        setCurrentPage(1);
    };

    const handleTipoFilterChange = (tipo) => {
        setTipoSolicitudFilter(tipo);
        setSelectedSubcategoriaId(null);
        setCurrentPage(1);
    };


    let historialContent;
    if (isLoading) {
        historialContent = <div className="p-3">Cargando historial... ⏳</div>;
    } else if (error) {
        historialContent = <div className="p-3 text-danger">Error: {error}</div>;
    } else if (currentItems.length === 0) {
        historialContent = (
            <div className="p-3">
                {activeTab === 'solicitudes' 
                    ? 'No hay solicitudes que coincidan con el filtro seleccionado.' 
                    : 'No has reportado ningún equipo aún.'}
            </div>
        );
    } else if (currentSolicitudes.length === 0 && currentItems.length > 0) {
        historialContent = <div className="p-3">No hay {activeTab === 'solicitudes' ? 'solicitudes' : 'tickets'} en esta página.</div>;
    } else {
        if (activeTab === 'solicitudes') {
            historialContent = (
                <div className="p-3">
                    {currentSolicitudes.map((sol) => {
                        const status = getStatusDetails(sol.est_soli);
                        const subcatId = (
                            sol.id_subcategoria ??
                            sol.id_subcatego ??
                            sol.id_subcate ??
                            sol.id_subcat ??
                            sol.id_subcateg ??
                            null
                        );
                        const subcategoriaKey = subcatId !== null && subcatId !== undefined ? String(subcatId) : '';
                        const subcategoriaNombre = subcategoriaKey !== ''
                            ? (subcategorias[subcategoriaKey] || 'N/A (ID No Encontrado)')
                            : 'N/A';
                        const esEspacio = subcatId === null || subcatId === undefined;
                        const nombreEspacio = sol.nom_espa || sol.nombre_espacio || 'N/A';
                        const puedeCancelar = sol.est_soli?.toLowerCase().includes('pendiente');
                        return (
                            <div className="item_historial" key={sol.id_soli}>
                                <span className='emoji_historial'>{esEspacio ? '🏢' : '📦'}</span>
                                <Badge 
                                    className='let_histo' 
                                    bg={status.variant} 
                                >
                                    {status.text}
                                </Badge>
                                <span className='texto_pedido'>
                                    Usuario: {sol.nom_usu || 'N/A'} <br/>
                                    {esEspacio ? (
                                        <>
                                            <strong>Espacio:</strong> {nombreEspacio} <br/>
                                        </>
                                    ) : (
                                        <>
                                            <strong>Elemento:</strong> {subcategoriaNombre} | <strong>Cantidad:</strong> {sol.cantid || 1} <br/>
                                        </>
                                    )}
                                    Ambiente: {sol.ambient || 'N/A'} <br/>
                                    Inicio: {formatFecha(sol.fecha_ini || 'N/A')} | Fin: {formatFecha(sol.fecha_fn || 'N/A')}
                                </span>
                                <div className='Cont_botones_histo'>
                                    <div>
                                    </div>
                                    <Button 
                                        variant="danger" 
                                        size="sm" 
                                        onClick={() => handleCancelStatus(sol.id_soli)}
                                        className='Btn_desactivar_histo'
                                        disabled={!puedeCancelar}
                                    > Cancelar solicitud <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            // Renderizado de tickets
            historialContent = (
                <div className="p-3">
                    {currentSolicitudes.map((ticket) => {
                        const statusTicket = ticket.id_est_tick === 2 ? 
                            { text: 'Activo', variant: 'danger' } : 
                            { text: 'Resuelto', variant: 'success' };
                        return (
                            <div className="item_historial" key={ticket.id_tickets}>
                                <span className='emoji_historial'>🔧</span>
                                <Badge 
                                    className='let_histo' 
                                    bg={statusTicket.variant} 
                                >
                                    {statusTicket.text}
                                </Badge>
                                <span className='texto_pedido'>
                                    ID Ticket: {ticket.id_tickets || 'N/A'} | Equipo: {ticket.nom_elem || `ID ${ticket.id_eleme}`} <br/>
                                    Problema: {ticket.nom_problm || 'N/A'} <br/>
                                    Ambiente: {ticket.ambient || 'N/A'} <br/>
                                    Fecha: {formatFecha(ticket.fecha_in || 'N/A')}
                                    {ticket.Obser && (
                                        <div style={{ marginTop: '5px', fontSize: '0.9em', color: '#555' }}>
                                            Observaciones: {ticket.Obser}
                                        </div>
                                    )}
                                    {ticket.imageness && ticket.imageness !== 'null' && (
                                        <div style={{ marginTop: '8px' }}>
                                            <strong style={{ fontSize: '0.9em', color: '#333' }}>📷 Imágenes adjuntas:</strong>
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '5px', flexWrap: 'wrap' }}>
                                                {ticket.imageness.split(',').map((img, idx) => (
                                                    <a 
                                                        key={idx} 
                                                        href={img.trim()} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        style={{ 
                                                            display: 'inline-block',
                                                            padding: '5px 10px',
                                                            backgroundColor: '#667eea',
                                                            color: 'white',
                                                            borderRadius: '5px',
                                                            textDecoration: 'none',
                                                            fontSize: '0.85em'
                                                        }}
                                                    >
                                                        🖼️ Ver imagen {idx + 1}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </span>
                                <div className='Cont_botones_histo'>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }
    }
    
    // Nombre actual del filtro seleccionado
    const currentFilterName = subcategoriaOptions.find(opt => opt.id === selectedSubcategoriaId)?.nombre || 'Todas las subcategorías';

    return (
        <div className='Cont_historial'>
            <Header title="Historial de pedidos"/>
            
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3 custom-tabs"
                justify
            >
                <Tab eventKey="solicitudes" title="📝 Mis Solicitudes">
                    {/* CONTENEDOR DE FILTROS */}
                    <div className='Filter_Container' style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}> 
                        {/* Filtro por Tipo (Elementos/Espacios) */}
                        <Dropdown onSelect={handleTipoFilterChange}>
                            <Dropdown.Toggle 
                                variant="primary" 
                                id="dropdown-filter-tipo"
                                className='btn-filter-custom' 
                            >
                                🔍 Tipo: {tipoSolicitudFilter === 'all' ? 'Todas' : tipoSolicitudFilter === 'elementos' ? 'Elementos' : 'Espacios'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="all" active={tipoSolicitudFilter === 'all'}>
                                    Todas las solicitudes
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="elementos" active={tipoSolicitudFilter === 'elementos'}>
                                    📦 Solo Elementos
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="espacios" active={tipoSolicitudFilter === 'espacios'}>
                                    🏢 Solo Espacios
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Filtro por Subcategoría (solo visible si es tipo 'elementos' o 'all') */}
                        {tipoSolicitudFilter !== 'espacios' && (
                            <Dropdown onSelect={handleFilterChange}>
                                <Dropdown.Toggle 
                                    variant="success" 
                                    id="dropdown-filter-subcategoria"
                                    className='btn-filter-custom' 
                                >
                                    🏷️ Subcategoría: {currentFilterName}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="w-100" align="start"> 
                                    <Dropdown.Item eventKey="all" active={selectedSubcategoriaId === null}>
                                        Todas las subcategorías
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    {subcategoriaOptions.map(sub => (
                                        <Dropdown.Item 
                                            key={sub.id} 
                                            eventKey={sub.id}
                                            active={sub.id === selectedSubcategoriaId}
                                        >
                                            {sub.nombre}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                    </div>
                    {/* FIN DE LOS FILTROS */}
                    
                    <div className='Container_historial'>
                        {historialContent}
                    </div>
                </Tab>
                
                <Tab eventKey="tickets" title="🔧 Equipos Reportados">
                    <div className='Container_historial'>
                        {historialContent}
                    </div>
                </Tab>
            </Tabs>

            {/* Componente para la paginacion */}
            {totalPages > 1 && (
                <div className='Pag_histo'>
                    <Pagination>
                        <Pagination.Prev 
                            onClick={() => paginate(currentPage - 1)} 
                            disabled={currentPage === 1}
                        />
                        {renderPaginationItems()}
                        <Pagination.Next 
                            onClick={() => paginate(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            )}
            <div className='Footer_historial'>
                <Footer />
            </div>
        </div>
    ); 
}

export default Historial_ped;