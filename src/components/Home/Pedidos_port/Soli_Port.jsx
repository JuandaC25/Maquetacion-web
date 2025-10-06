/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from 'react';
import './Soli_port.css';
import Footer from '../../Footer/Footer.jsx';
import Header_port from './Header soli/Header.jsx';
import Modal_com_port from './Modal_comp_port.jsx';
import ElementosService from "../../../api/ElementosApi";
import { Modal, Button, Form, Alert, Carousel, Pagination } from 'react-bootstrap';

const SolicitudFormModal = ({ show, handleClose, equiposSeleccionados }) => {
    const fechaSolicitud = new Date().toLocaleDateString('es-ES');

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const solicitudFinal = {
            fechaSolicitud: fechaSolicitud,
            ...data,
            equipos: equiposSeleccionados.map(eq => ({ id: eq.id, nombre: eq.nombre }))
        };

        console.log("Datos de la Solicitud:", solicitudFinal);
        
        alert(`Solicitud enviada con éxito. Revisar consola para ver los datos.`);
        
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} size="md">
            <Modal.Header closeButton>
                <Modal.Title>Confirmar y Enviar Solicitud de Equipos</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Alert variant="info">
                        <strong>Fecha de Solicitud:</strong> {fechaSolicitud}
                    </Alert>
                    <Form.Group className="mb-3" controlId="formFechaInicio">
                        <Form.Label>Fecha de Inicio Requerida</Form.Label>
                        <Form.Control 
                            type="date" 
                            name="fechaInicio" 
                            required 
                        />
                        <Form.Text className="text-muted">
                            Día en que necesita los equipos.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formFechaFin">
                        <Form.Label>Fecha Estimada de Devolución</Form.Label>
                        <Form.Control 
                            type="date" 
                            name="fechaFin" 
                            required 
                        />
                        <Form.Text className="text-muted">
                            Día en que se espera devolver los equipos.
                        </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="formAmbiente">
                        <Form.Label>Ambiente / Ubicación</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="ambiente" 
                            placeholder="Ej: Sala de reuniones 301, Taller B" 
                            required
                        />
                    </Form.Group>

                    <h5 className="mt-4">Equipos Incluidos ({equiposSeleccionados.length})</h5>
                    <ul className="list-group">
                        {equiposSeleccionados.map(team => (
                            <li key={team.id} className="list-group-item">
                                {team.nombre || team.name}
                            </li>
                        ))}
                    </ul>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="success" type="submit">
                        Enviar Solicitud
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

const ConsultaItem = ({ onAddClick, equipoDetalles, equipoAnadido }) => {

    const handleAddClick = () => {
        if (onAddClick) {
            onAddClick(equipoDetalles);
        }
    };

    const Imagenes_portatiles = equipoDetalles.imagen || [
        '/imagenes/imagenes_port/portatil1.png',
        '/imagenes/imagenes_port/portatil2.png',
        '/imagenes/imagenes_port/portatil3.png',
        '/imagenes/imagenes_port/portatil4.png',
        '/imagenes/imagenes_port/portatil5.png',
        '/imagenes/imagenes_port/portatil6.png'
    ];

    return (
        <div className={`card_port ${equipoAnadido ? 'Card_agregado' : ''}`}>
            <div className='Cua_port'>
                <div>
                    <Carousel indicators={false} controls={false} interval={3000}>
                        {Imagenes_portatiles.map((imagen, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100 carrusel_img_port"
                                    src={typeof imagen === 'string' ? imagen : '/imagenes/imagenes_port/portatil1.png'}
                                    alt={`${equipoDetalles.nombre || 'Portátil'} - Diapositiva ${index + 1}`}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
                <div className='espa_text_port'>
                    <span className="title">{equipoDetalles.nombre || equipoDetalles.name}</span>
                    <Modal_com_port />
                    <Button
                        variant="primary"
                        className='Btn_añadir_port'
                        onClick={handleAddClick}
                        disabled={equipoAnadido}
                    >
                        {equipoAnadido ? 'Añadido' : 'Añadir equipo'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const ListaConsultas = () => {

    const [equiposApi, setEquiposApi] = useState([]);
    const [filteredEquipos, setFilteredEquipos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [equiposPerPage] = useState(5);

    const [showModal, setShowModal] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [equiposAnadidos, setequiposAnadidos] = useState([]);

    useEffect(() => {
        const fetchElementos = async () => {
            try {
                setIsLoading(true);
                const data = await ElementosService.obtenerElementos();
                const equiposDePortatil = data.filter(item => item.id_categ === 1);

                const transformedData = equiposDePortatil.map(item => ({
                    id: item.id_elemen,
                    nombre: item.nom_eleme,
                    descripcion: item.obse,
                    imagen: [
                        '/imagenes/imagenes_port/portatil1.png',
                        '/imagenes/imagenes_port/portatil2.png',
                    ],
                    especificaciones: (item.componen || "").split(',').map(s => s.trim()),
                }));

                setEquiposApi(transformedData);
                setFilteredEquipos(transformedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchElementos();
    }, []);

    useEffect(() => {
        const results = equiposApi.filter((equipo) => {
            const lowerSearchTerm = searchTerm.toLowerCase();
            return (
                (equipo.nombre || "").toLowerCase().includes(lowerSearchTerm) ||
                (equipo.descripcion || "").toLowerCase().includes(lowerSearchTerm) ||
                (equipo.especificaciones || []).some((esp) => (esp || "").toLowerCase().includes(lowerSearchTerm))
            );
        });
        setFilteredEquipos(results);
        setCurrentPage(1); // Resetear a la primera página al buscar
    }, [searchTerm, equiposApi]);

    // Funciones para abrir y cerrar modales
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const handleShowLimitModal = () => setShowLimitModal(true);
    const handleCloseLimitModal = () => setShowLimitModal(false);
    
    // ** NUEVAS FUNCIONES PARA EL MODAL DE CONFIRMACIÓN **
    const handleShowConfirm = () => setShowConfirmModal(true);
    const handleCloseConfirm = () => setShowConfirmModal(false);

    // Añadir equipos con el límite de 3
    const equiposPortAdd = (detallesEquipo) => {
        if (equiposAnadidos.length >= 3) {
            handleShowLimitModal();
            return;
        }

        // Verificación de duplicados en la lista de pedidos
        const equipoYaAnadido = equiposAnadidos.some(team => team.id === detallesEquipo.id);
        if (!equipoYaAnadido) {
            setequiposAnadidos(prevTeams => [...prevTeams, detallesEquipo]);
        }
    };

    // Eliminar equipo en el modal 
    const handleRemoveTeam = (teamId) => {
        setequiposAnadidos(prevTeams => prevTeams.filter(team => team.id !== teamId));
    };

    {/*logica de la paginacion */}
    const indexOfLastEquipo = currentPage * equiposPerPage;
    const indexOfFirstEquipo = indexOfLastEquipo - equiposPerPage;
    const currentEquipos = filteredEquipos.slice(indexOfFirstEquipo, indexOfLastEquipo);
    const totalPages = Math.ceil(filteredEquipos.length / equiposPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderPaginationItems = () => {
        const items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} id="font" onClick={() => paginate(number)}>
                    {number}
                </Pagination.Item>
            );
        }
        return items;
    };


    return (
        <div className='cuer-inve'>
            <div className='Elementos_arriba'>
                <div className="Grupo_buscador">
                    <input
                        type="text"
                        className="Cuadro_busc_port"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="btn_buscar" aria-hidden="true" viewBox="0 0 24 24">
                        <g>
                            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                        </g>
                    </svg>
                </div>
                <div className='Boton_campana'>
                    <button className="Boton_campanita" onClick={handleShow}>
                        <svg viewBox="0 0 448 512" className="Campanita"><path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></svg>
                        {equiposAnadidos.length > 0 && (
                            <span className="Noti_agregado">{equiposAnadidos.length}</span>
                        )}
                    </button>
                </div>
            </div>

            <div className="lista-inventario1">
                {isLoading ? (
                    <p>Cargando portátiles...</p>
                ) : error ? (
                    <p className="text-danger">Error al cargar: {error}</p>
                ) : currentEquipos.length > 0 ? (
                    currentEquipos.map((equipo) => (
                        <ConsultaItem
                            key={equipo.id}
                            equipoDetalles={equipo}
                            onAddClick={equiposPortAdd}
                            equipoAnadido={equiposAnadidos.some(team => team.id === equipo.id)}
                        />
                    ))
                ) : (
                    <p>No se encontraron portátiles.</p>
                )}
            </div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton className='Btn_cerrar_mdl_add'>
                    <Modal.Title>Equipos agregados</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {equiposAnadidos.length > 0 ? (
                        <ul>
                            {equiposAnadidos.map(team => (
                                <li key={team.id} className="Lista_equipos_add">
                                    {team.nombre || team.name}

                                    <Button className='Eliminar_equipos_add' variant="danger" size="sm" onClick={() => handleRemoveTeam(team.id)}>
                                        Eliminar
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay equipos agregados en tu lista.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="success" onClick={handleShowConfirm} disabled={equiposAnadidos.length === 0}>
                        Confirmar Solicitud
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showLimitModal} onHide={handleCloseLimitModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Límite de equipos alcanzado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Has alcanzado el límite máximo de 3 equipos añadidos. Debes eliminar uno para añadir otro.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseLimitModal}>
                        Entendido
                    </Button>
                </Modal.Footer>
            </Modal>
            <SolicitudFormModal
                show={showConfirmModal}
                handleClose={handleCloseConfirm}
                equiposSeleccionados={equiposAnadidos}
            />


{/*Apartado para la paginacion */}
            {totalPages > 1 && (
                <div className='Foo_port'>
                    <div id="piepor">
                        <Pagination>
                            <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                            {renderPaginationItems()}
                            <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                        </Pagination>
                    </div>
                </div>
            )}

        </div>
    );
};


// Componente principal
function Soli_Port() {
    return (
        <div className="Usu-container1">
            <Header_port />
            <ListaConsultas />
            <div className='fotaj'>
                <div className='contenido_fotaj'></div>
                <Footer />
            </div>
        </div>
    );
}

export default Soli_Port;