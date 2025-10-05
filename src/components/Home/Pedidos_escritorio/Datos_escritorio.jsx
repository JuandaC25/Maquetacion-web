import React, { useState, useEffect } from "react";
import { Card, ListGroup, Button, Modal, Form } from "react-bootstrap";
import "./Pedidos_escritorio.css";
import ElementosService from "../../../api/ElementosApi";

function Datos_escritorio() {
    const [equiposApi, setEquiposApi] = useState([]);
    const [filteredEquipos, setFilteredEquipos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [seleccionados, setSeleccionados] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");


    //Consumo de la api :)
useEffect(() => {
    const fetchElementos = async () => {
        try {
            setIsLoading(true);
            const data = await ElementosService.obtenerElementos();
            
            const transformedData = data.map(item => ({
                id: item.id_elemen, 
                nombre: item.nom_eleme,
                descripcion: item.obse, 
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


// Finalizacion del consumo de la api

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
    }, [searchTerm, equiposApi]);



    const toggleSelect = (id) => {
        setSeleccionados((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const confirmarSolicitud = (e) => {
        e.preventDefault();
        alert(`Solicitud confirmada ✅\nEquipos seleccionados: ${seleccionados.join(", ")}`);
        setShowModal(false);
    };

    const selectedEquiposDetails = seleccionados.map(id => filteredEquipos.find(equipo => equipo.id === id));

    return (
        <div className="main-page-container">
            <div className="Ajust-debusquedas">
                <div className="group-busqueda">
                    <input
                        className="input"
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {seleccionados.length > 0 && (
                    <div className="cartt-container">
                        <Button variant="info" onClick={() => setShowCartModal(true)}>
                            🛒 Equipos ({seleccionados.length})
                        </Button>
                    </div>
                )}
            </div>
            <div className="equipos-container">
                {isLoading ? (
                    <p className="loading-message">Cargando equipos...</p>
                ) : error ? (
                    <div className="alert alert-danger mt-3">{error}</div>
                ) : filteredEquipos.length > 0 ? (
                    filteredEquipos.map((equipo) => (
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
                                    <Card.Subtitle className="mb-2 text-muted">Modelo: {equipo.modelo}</Card.Subtitle>
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
                <div className="confirmar-container">
                    <Button variant="success" onClick={() => setShowModal(true)}>Confirmar solicitud</Button>
                </div>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar solicitud</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={confirmarSolicitud}>
                        <Form.Group className="mb-3"><Form.Label>Ambiente</Form.Label><Form.Control type="text" placeholder="Ej: Ambiente 301" /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Fecha de uso</Form.Label><Form.Control type="date" /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Cantidad</Form.Label><Form.Control type="number" min="1" /></Form.Group>
                        <Button variant="primary" type="submit">Enviar</Button>
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
                                    {equipo ? `${equipo.nombre} (${equipo.modelo})` : "Equipo no encontrado"}
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