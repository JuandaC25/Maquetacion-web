import { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Header_his from './Header_histo/Header_his.jsx';
import './Histo_pedi.css';
import Stack from 'react-bootstrap/Stack';
import Footer from '../../Footer/Footer.jsx';
import { Pagination, Button } from 'react-bootstrap';
import { obtenersolicitudes, eliminarSolicitud } from '../../../api/solicitudesApi.js'; 
import Modal_ver from '../Histo_pedi/Modal_ver/Modal_ver.jsx'; 

const formatFecha = (fechaString) => {
  if (!fechaString || fechaString === 'N/A') return 'N/A';
  try {
    const dateOnly = fechaString.includes('T') ? fechaString.split('T')[0] : fechaString;
    return new Date(dateOnly).toLocaleDateString('es-ES', { 
      year: 'numeric', month: 'numeric', day: 'numeric' 
    });
  } catch (e) {
    console.error("Error al formatear la fecha:", e);
    return 'Fecha Inválida';
  }
}

function Historial_ped() {
const [solicitudes, setSolicitudes] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
const [currentPage, setCurrentPage] = useState(1);
const [solicitudesPerPage] = useState(5); 

const cargarSolicitudes = async () => {
    try {
        setIsLoading(true);
        const data = await obtenersolicitudes();
        
        const solicitudesConEquipos = data.map(sol => {
            const elementos = Array.isArray(sol.elementos_soli) 
                ? sol.elementos_soli.map(el => ({
                    id: el.id_eleme || el.id_accesorio,
                    nombre:el.nom_eleme || el.nom_acces || 'Equipo/Accesorio sin nombre',
                }))
                : []; 

            return {
                ...sol,
                equipos_detalles: elementos,
            };
        });

        setSolicitudes(solicitudesConEquipos || []); 
        setError(null);
    } catch (err) {
        console.error("Fallo al obtener solicitudes:", err);
        setError(err.message || "Error al cargar el historial de pedidos.");
    } finally {
        setIsLoading(false);
    }
};

  useEffect(() => {
    cargarSolicitudes();
  }, []);
  
  const indexOfLastSolicitud = currentPage * solicitudesPerPage;
  const indexOfFirstSolicitud = indexOfLastSolicitud - solicitudesPerPage;
  const currentSolicitudes = solicitudes.slice(indexOfFirstSolicitud, indexOfLastSolicitud); 

  const handleDelete = async (id_solicitud) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la solicitud ${id_solicitud}?`)) {
      return;
    }

    try {
      await eliminarSolicitud(id_solicitud);
      setSolicitudes(prev => prev.filter(sol => sol.id_soli !== id_solicitud));
      
      if (currentSolicitudes.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      alert(`Solicitud ${id_solicitud} eliminada correctamente.`);
      
    } catch (err) {
      console.error("Error al eliminar la solicitud:", err);
      alert(`Error al eliminar la solicitud ${id_solicitud}: ${err.message}`);
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

  const totalPages = Math.ceil(solicitudes.length / solicitudesPerPage);
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

let historialContent;
if (isLoading) {
historialContent = <div className="p-3">Cargando historial... ⏳</div>;
} else if (error) {
historialContent = <div className="p-3 text-danger">Error: {error}</div>;
} else if (solicitudes.length === 0) {
historialContent = <div className="p-3">No hay solicitudes en el historial.</div>;
} else if (currentSolicitudes.length === 0 && solicitudes.length > 0) {
historialContent = <div className="p-3">No hay solicitudes en esta página.</div>;
} else {
historialContent = (
<Stack gap={1}>
{currentSolicitudes.map((sol) => ( 
  <div className="p-3 item_historial" key={sol.id_soli}>
    <span className='emoji_historial'>📝</span>
    <Button disabled className={`let_histo`} variant={getStatusVariant(sol.estado)}>
      {sol.estado}
    </Button>
    <span className='texto_pedido'>
      ID Solicitud:{sol.id_soli || 'N/A'} | Usuario: {sol.nom_usu || 'N/A'} <br/>
      Ambiente: {sol.ambient || 'N/A'} <br/>
      Inicio: {formatFecha(sol.fecha_ini || 'N/A')} | Fin: {formatFecha(sol.fecha_fn || 'N/A')}
      <div style={{ marginTop: '5px', fontSize: '0.9em', color: '#555' }}>
        Equipos: {sol.equipos_detalles && sol.equipos_detalles.length > 0
          ? sol.equipos_detalles.map(eq => (
            <span key={eq.id}>
              [{eq.id}] **{eq.nombre}**
            </span>
          )).reduce((prev, curr) => [prev, ', ', curr])
          : 'N/A'
        }
      </div>
    </span>
    <div className='Cont_botones_histo'>
<div className='Btn_ver'>
<Modal_ver solicitud={sol} /> 
</div>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDelete(sol.id_soli)}
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


<div className='Container_historial'>
  {historialContent}
</div>

{/* Ccomp para la paginacion */}
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