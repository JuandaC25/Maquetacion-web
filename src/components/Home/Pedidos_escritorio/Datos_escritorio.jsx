import React, { useState, useEffect } from "react";
import { Card, ListGroup, Button, Modal, Form, Pagination } from "react-bootstrap";
import "./Pedidos_escritorio.css";
import ElementosService from "../../../api/ElementosApi";
import { crearSolicitud } from "../../../api/solicitudesApi"; // Importar la función

function Datos_escritorio() {
    const [equiposApi, setEquiposApi] = useState([]);
    const [filteredEquipos, setFilteredEquipos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [seleccionados, setSeleccionados] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [equiposPerPage] = useState(6);
    const categoryName = "Equipo de Escritorio";

    const [form, setForm] = useState({
        fecha_ini: "",
        hora_ini: "",
        fecha_fn: "",
        hora_fn: "",
        ambient: "",
        num_ficha: "", // corregido nombre
        estadosoli: 1,
        id_usu: 1,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (seleccionados.length === 0) {
            alert("Por favor, selecciona al menos un equipo de escritorio para la solicitud.");
            return;
        }

        const fechaInicio = new Date(`${form.fecha_ini}T${form.hora_ini}:00`);
        const fechaFin = new Date(`${form.fecha_fn}T${form.hora_fn}:00`);

        if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
            alert("El formato de fecha o hora es inválido.");
            return;
        }

        // Ajustar DTO para coincidir con el backend
        const dto = {
            fecha_ini: fechaInicio.toISOString(),
            fecha_fn: fechaFin.toISOString(),
            ambient: form.ambient,
            estadosoli: form.estadosoli,
            id_usu: form.id_usu,
            num_ficha: form.num_ficha, // corregido nombre
            id_elemen: seleccionados,
        };

        try {
            const resultado = await crearSolicitud(dto);
            console.log("Solicitud realizada:", resultado);
            alert("Solicitud realizada correctamente ✅");
            setShowModal(false);
            setSeleccionados([]);
            setForm({
                fecha_ini: "",
                hora_ini: "",
                fecha_fn: "",
                hora_fn: "",
                ambient: "",
                num_ficha: "", // corregido nombre
                estadosoli: 1,
                id_usu: 1,
            });
        } catch (err) {
            console.error("Error en la solicitud:", err);
            alert(`Hubo un problema al realizar la solicitud: ${err.message || "Error desconocido"}`);
        }
    };

    useEffect(() => {
        const fetchElementos = async () => {
            try {
                setIsLoading(true);
                const data = await ElementosService.obtenerElementos();
                // Ajustar mapeo para coincidir con backend
                const equiposDeEscritorio = data.filter(item => item.id_categ === 2);

                const transformedData = equiposDeEscritorio.map(item => ({
                    id: item.id_elemen,
                    nombre: item.nom_eleme,
                    descripcion: item.obse,
                    modelo: item.num_serie,
                    especificaciones: (item.componen || "").split(',').map(s => s.trim()),
                    imagen: "/imagenes/EscritorioMesa.png",
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
                (equipo.modelo || "").toLowerCase().includes(lowerSearchTerm) ||
                (equipo.descripcion || "").toLowerCase().includes(lowerSearchTerm) ||
                (equipo.especificaciones || []).some((esp) => (esp || "").toLowerCase().includes(lowerSearchTerm))
            );
        });
        setFilteredEquipos(results);
        setCurrentPage(1);
    }, [searchTerm, equiposApi]);

    const toggleSelect = (id) => {
        setSeleccionados((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const selectedEquiposDetails = seleccionados.map(id => equiposApi.find(equipo => equipo.id === id));
    const indexOfLastEquipo = currentPage * equiposPerPage;
    const indexOfFirstEquipo = indexOfLastEquipo - equiposPerPage;
    const currentEquipos = filteredEquipos.slice(indexOfFirstEquipo, indexOfLastEquipo);
    const totalPages = Math.ceil(filteredEquipos.length / equiposPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderPaginationItems = () => {
        const items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                    {number}
                </Pagination.Item>
            );
        }
        return items;
    };

    return (
        <div className="main-page-container">
            <div className="Ajust-debusquedas">
                <div className="group-busqueda">
                    <input
                        className="input"
                        type="text"
                        placeholder={`Buscar ${categoryName.toLowerCase()}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {seleccionados.length > 0 && (
                    <div className="cartt-container">
                        <Button variant="info" onClick={() => setShowCartModal(true)}>
                             Equipos ({seleccionados.length})
                        </Button>
                    </div>
                )}
            </div>

            <div className="equipos-container">
                {isLoading ? (
                    <p className="loading-message">Cargando equipos...</p>
                ) : error ? (
                    <div className="alert alert-danger mt-3">{error}</div>
                ) : currentEquipos.length > 0 ? (
                    currentEquipos.map((equipo) => (
                        <Card
                            key={equipo.id}
                            className={`ficha-horizontal ${seleccionados.includes(equipo.id) ? "seleccionado" : ""}`}
                        >
                            <div className="ficha-img">
                                <Card.Img src={equipo.imagen} alt={equipo.nombre} />
                            </div>
                            <div className="ficha-info">
                                <Card.Body>
                                    <Card.Title>{equipo.nombre}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Observaciones: {equipo.modelo}</Card.Subtitle>
                                    <Card.Text>{equipo.descripcion}</Card.Text>
                                    <Card className="Cuadro_especificacioness">
                                        <Card.Header>Especificaciones</Card.Header>
                                        <ListGroup variant="flush">
                                            {equipo.especificaciones && equipo.especificaciones.map((esp, i) => (
                                                <ListGroup.Item key={i}>{esp}</ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Card>
                                    <Button
                                        className="boton_equiposescritorio"
                                        variant={seleccionados.includes(equipo.id) ? "danger" : "primary"}
                                        onClick={() => toggleSelect(equipo.id)}
                                    >
                                        {seleccionados.includes(equipo.id) ? "Quitar" : "Seleccionar"}
                                    </Button>
                                </Card.Body>
                            </div>
                        </Card>
                    ))
                ) : (
                    <p className="no-results-message">No se encontraron equipos.</p>
                )}
            </div>

            {seleccionados.length > 0 && (
                <div className="text-center mt-4 mb-5">
                    <Button variant="success" size="lg" onClick={() => setShowModal(true)}>
                        Confirmar Solicitud
                    </Button>
                </div>
            )}

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                        {renderPaginationItems()}
                        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="modal-title">Realizar Solicitud</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-form">
                    <Form onSubmit={handleFormSubmit}>
                        <div className="form-section-title">Detalles de la solicitud</div>

                        <Form.Group className="mb-3">
                            <Form.Label>Fecha y Hora de Inicio</Form.Label>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <Form.Control
                                        type="date"
                                        name="fecha_ini"
                                        value={form.fecha_ini}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Form.Control
                                        type="time"
                                        name="hora_ini"
                                        value={form.hora_ini}
                                        onChange={handleChange}
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
                                        value={form.fecha_fn}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Form.Control
                                        type="time"
                                        name="hora_fn"
                                        value={form.hora_fn}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <Form.Label>Ambiente</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ej: Ambiente 301"
                                        name="ambient"
                                        value={form.ambient}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Form.Label>Número de ficha</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ej: 2560014"
                                        name="num_ficha" // corregido name
                                        value={form.num_ficha} // corregido value
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </Form.Group>

                        <div className="text-center mt-4">
                            <Button variant="primary" type="submit" className="px-4">
                                Enviar Solicitud
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showCartModal} onHide={() => setShowCartModal(false)} >
                <Modal.Header closeButton>
                    <Modal.Title>Equipos seleccionados</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup className="equipos-seleccionados-list">
                        {selectedEquiposDetails.length > 0 ? (
                            selectedEquiposDetails.map((equipo, index) => (
                                <ListGroup.Item key={equipo ? equipo.id : index} className="equipo-item">
                                    {equipo ? equipo.nombre : "Equipo no encontrado"}
                                </ListGroup.Item>
                            ))
                        ) : (
                            <p>No hay equipos en el carrito.</p>
                        )}
                    </ListGroup>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Datos_escritorio;