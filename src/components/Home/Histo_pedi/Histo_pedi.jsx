import { useState, useEffect } from 'react';
// Importaciones
import './Header_histo/Header_his.jsx';
import Dropdown from 'react-bootstrap/Dropdown';
import Header_his from './Header_histo/Header_his.jsx';
import './Histo_pedi.css';
import Stack from 'react-bootstrap/Stack';
import Footer from '../../Footer/Footer.jsx';
import { Pagination, Button } from 'react-bootstrap';
import Modal_ver from './Modal_ver/Modal_ver.jsx';
// Se usa obtenersolicitudes y eliminarSolicitud del API corregido
import { obtenersolicitudes, eliminarSolicitud } from '../../../api/solicitudesApi.js'; 

// Función de formato de fecha
const formatFecha = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (error) {
        console.error("Error al formatear la fecha:", error);
        return 'Fecha inválida';
    }
};

function Historial_ped() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // ** ESTADOS DE PAGINACIÓN **
    const [currentPage, setCurrentPage] = useState(1);
    const [solicitudesPerPage] = useState(5); 

    // ===============================================
    // ** EFECTO DE CARGA DE DATOS **
    // ===============================================
    const cargarSolicitudes = async () => {
        try {
            setIsLoading(true);
            const data = await obtenersolicitudes();
            // Asegúrate de que los IDs y estados sean coherentes
            // Asumiendo que 'data' es un array de objetos con 'id', 'estado', etc.
            setSolicitudes(Array.isArray(data) ? data : []); 
            setError(null);
        } catch (err) {
            console.error("Fallo al obtener solicitudes:", err);
            setError(err.message || "Error al cargar el historial de pedidos. Revisa la consola para más detalles.");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        cargarSolicitudes();
    }, []);

    // ===============================================
    // ** LÓGICA DE ELIMINAR Y ESTADOS **
    // ===============================================
    const indexOfLastSolicitud = currentPage * solicitudesPerPage;
    const indexOfFirstSolicitud = indexOfLastSolicitud - solicitudesPerPage;
    const currentSolicitudes = solicitudes.slice(indexOfFirstSolicitud, indexOfLastSolicitud); 

    const handleDelete = async (id) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar la solicitud ${id}? Esta acción es irreversible.`)) {
            return;
        }

        try {
            await eliminarSolicitud(id);
            
            // Actualizar el estado en el cliente
            const updatedSolicitudes = prev => prev.filter(sol => sol.id !== id);
            setSolicitudes(updatedSolicitudes);
            
            // Lógica para ajustar la paginación si la página actual queda vacía
            if (currentSolicitudes.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
            
            alert(`✅ Solicitud ${id} eliminada correctamente.`);
            
        } catch (err) {
            console.error("Error al eliminar la solicitud:", err);
            alert(`❌ Error al eliminar la solicitud ${id}: ${err.message}`);
        }
    };

    const getStatusVariant = (estado) => {
        switch (estado) {
            case 'Pendiente':
                return 'warning';
            case 'Aceptado':
            case 'Completado':
                return 'success';
            case 'Cancelado':
            case 'Rechazado':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    // ===============================================
    // ** LÓGICA DE PAGINACIÓN **
    // ===============================================
    const totalPages = Math.ceil(solicitudes.length / solicitudesPerPage);
    
    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const renderPaginationItems = () => {
        // ... (Tu lógica de paginación detallada, se mantiene igual)
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


    // ===============================================
    // ** RENDERIZADO CONDICIONAL **
    // ===============================================

    let historialContent;
    
    if (isLoading) {
        historialContent = <div className="p-3">Cargando historial... ⏳</div>;
    } else if (error) {
        historialContent = <div className="p-3 text-danger">Error al cargar historial: **{error}** 🚫</div>;
    } else if (solicitudes.length === 0) {
        historialContent = <div className="p-3">No hay solicitudes en el historial.</div>;
    } else if (currentSolicitudes.length === 0 && solicitudes.length > 0) {
        // Si no hay solicitudes en la página actual, pero sí hay en total (puede pasar si eliminas todo en una página)
        historialContent = <div className="p-3">No hay solicitudes en esta página.</div>;
    } else {
        historialContent = (
            <Stack gap={1}>
                {currentSolicitudes.map((sol) => ( 
                    <div className="p-3 item_historial" key={sol.id}>
                        <span className='emoji_historial'>📝</span> 
                        <Button 
                            disabled 
                            className={`let_histo`}
                            variant={getStatusVariant(sol.estado)}
                        >
                            {sol.estado}
                        </Button>
                        
                        {/* DETALLES DE LA FILA */}
                        <span className='texto_pedido'>
                            **ID Solicitud:** **{sol.id || 'N/A'}** | **Usuario:** {sol.idUsuario || 'N/A'}
                            <br/>
                            **Fecha:** {formatFecha(sol.fechaInicio || sol.fechaCreacion)} | **Ambiente:** {sol.ambiente || 'N/A'}
                        </span> 
                        
                        {/* BOTONES DE ACCIÓN */}
                        <div className='Cont_botones_histo'>
                            <div className='Btn_ver'>
                                <Modal_ver solicitud={sol} /> 
                            </div>
                            
                            <Button 
                                variant="danger" 
                                size="sm" 
                                onClick={() => handleDelete(sol.id)}
                                className='Btn_eliminar_histo'
                            >
                                Eliminar 🗑️
                            </Button>
                        </div>
                    </div>
                ))}
            </Stack>
        );
    }

    return (
        <div className='Cont_historial'>
            <Header_his/>
            <Dropdown className='Drop_histo'>
                <Dropdown.Toggle variant='outline-dark' id="dropdown-basic">
                    Portatiles
                </Dropdown.Toggle>
                {/* ... (Menú desplegable) ... */}
            </Dropdown>
            
            <div className='Container_historial'>
                {historialContent}
            </div>
            
            {/* ** COMPONENTE DE PAGINACIÓN ** */}
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