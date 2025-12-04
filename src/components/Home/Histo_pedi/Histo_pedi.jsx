import { useState, useEffect, useMemo } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Header from '../../common/Header/Header';
import './Histo_pedi.css';
import Stack from 'react-bootstrap/Stack';
import Footer from '../../Footer/Footer.jsx';
import { Pagination, Button, Badge, Tabs, Tab } from 'react-bootstrap'; 
import { 
    obtenersolicitudes, 
    actualizarEstadoSolicitud 
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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [solicitudesPerPage] = useState(5);
    const [activeTab, setActiveTab] = useState('solicitudes'); 

    const cargarSubcategorias = async () => {
        try {
            const data = await obtenerSubcategorias();
            if (Array.isArray(data)) {
                
                // 1. Mapeo ID -> Nombre (para la visualización en las tarjetas)
                const subMap = data.reduce((acc, sub) => {
                    acc[String(sub.id)] = sub.nom_subcateg; 
                    return acc;
                }, {});
                setSubcategorias(subMap);
                
                // 2. Lista de opciones para el Dropdown
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
            setSolicitudes(Array.isArray(data) ? data : []);
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
        setSelectedSubcategoriaId(null); // Resetear filtro al cambiar de pestaña
        if (activeTab === 'solicitudes') {
            cargarSolicitudes();
        } else {
            cargarTickets();
        }
    }, [activeTab]);
    
    // LÓGICA DE FILTRADO: Filtra las solicitudes basándose en el ID seleccionado.
    const filteredSolicitudes = useMemo(() => {
        if (activeTab !== 'solicitudes' || !selectedSubcategoriaId) {
            return solicitudes;
        }

        const filterId = String(selectedSubcategoriaId);
        
        return solicitudes.filter(sol => {
            // Se asume que el ID de subcategoría puede venir en cualquiera de estas llaves
            const solSubcatId = String(sol.id_subcatego ?? sol.id_subcate ?? sol.id_subcat ?? 'NULL');
            
            return solSubcatId === filterId;
        });
    }, [solicitudes, selectedSubcategoriaId, activeTab]);
    
    // Define el array para la paginación (Tickets o Solicitudes filtradas)
    const currentItems = activeTab === 'solicitudes' ? filteredSolicitudes : tickets;

    const indexOfLastSolicitud = currentPage * solicitudesPerPage;
    const indexOfFirstSolicitud = indexOfLastSolicitud - solicitudesPerPage;
    const currentSolicitudes = currentItems.slice(indexOfFirstSolicitud, indexOfLastSolicitud); 

    const handleCancelStatus = async (id_solicitud) => {
        const ESTADO_CANCELADO = 'Cancelado'; 

        if (!window.confirm(`¿Estás seguro de que deseas cancelar la solicitud ${id_solicitud}? El estado cambiará a "${ESTADO_CANCELADO}".`)) {
            return;
        }

        try {
            await actualizarEstadoSolicitud(id_solicitud, ESTADO_CANCELADO); 
            
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
    
    // Función para manejar la selección del filtro de subcategoría
    const handleFilterChange = (id) => {
        setSelectedSubcategoriaId(id === 'all' ? null : id);
        setCurrentPage(1); // Resetear a la primera página al aplicar filtro
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
                <Stack gap={1}>
                    {currentSolicitudes.map((sol) => {
                        const status = getStatusDetails(sol.est_soli); 
                        
                        // Obtener ID (será null si no existe)
                        const rawId = sol.id_subcatego ?? sol.id_subcate ?? sol.id_subcat ?? null;
                        
                        // Si el ID es válido, lo convierte a string para buscar.
                        const subcategoriaKey = rawId !== null && rawId !== undefined ? String(rawId) : '';
                        
                        let subcategoriaNombre;
                        if (subcategoriaKey !== '') {
                            subcategoriaNombre = subcategorias[subcategoriaKey] || 'N/A (ID No Encontrado)';
                        } else {
                            subcategoriaNombre = 'N/A';
                        }
                        
                        const puedeCancelar = sol.est_soli?.toLowerCase().includes('pendiente');

                        return (
                            <div className="p-3 item_historial" key={sol.id_soli}>
                                <span className='emoji_historial'>📝</span>
                                
                                <Badge 
                                    className='let_histo' 
                                    bg={status.variant} 
                                >
                                    {status.text}
                                </Badge>
                                
                                <span className='texto_pedido'>
                                    ID Solicitud: {sol.id_soli || 'N/A'} | Usuario: {sol.nom_usu || 'N/A'} <br/>
                                    Ambiente: {sol.ambient || 'N/A'} <br/>
                                    Inicio: {formatFecha(sol.fecha_ini || 'N/A')} | Fin: {formatFecha(sol.fecha_fn || 'N/A')}
                                    
                                    <div style={{ marginTop: '5px', fontSize: '0.9em', color: '#555' }}>
                                        Subcategoría: {subcategoriaNombre} | Cantidad: {sol.cantid || 1}
                                    </div>
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
                </Stack>
            );
        } else {
            // Renderizado de tickets
            historialContent = (
                <Stack gap={1}>
                    {currentSolicitudes.map((ticket) => {
                        const statusTicket = ticket.id_est_tick === 2 ? 
                            { text: 'Activo', variant: 'danger' } : 
                            { text: 'Resuelto', variant: 'success' };
                        
                        return (
                            <div className="p-3 item_historial" key={ticket.id_tickets}>
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
                                        <div style={{ marginTop: '5px', fontSize: '0.85em', color: '#667eea' }}>
                                            📷 Tiene imágenes adjuntas
                                        </div>
                                    )}
                                </span>
                                <div className='Cont_botones_histo'>
                                    <Button 
                                        variant="danger" 
                                        size="sm" 
                                        onClick={() => handleDeleteTicket(ticket.id_tickets)}
                                        className='Btn_eliminar_histo'
                                    >
                                        Eliminar 🗑️
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </Stack>
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
                    {/* CONTENEDOR DEL FILTRO DE CATEGORÍA */}
                    <div className='Filter_Container'> 
                        <Dropdown onSelect={handleFilterChange}>
                            <Dropdown.Toggle 
                                variant="success" 
                                id="dropdown-filter-subcategoria"
                                className='btn-filter-custom' 
                            >
                                {/* 🔑 CAMBIO DE TEXTO AQUÍ */}
                                🏷️ Filtrar por Subcategoría:
                            </Dropdown.Toggle>

                            {/* El menú desplegable con el mismo ancho (w-100) */}
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
                    </div>
                    {/* FIN DEL FILTRO */}
                    
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