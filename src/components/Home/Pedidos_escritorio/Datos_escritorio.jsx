import React, { useState, useEffect } from "react";
import { Card, ListGroup, Button, Modal, Form } from "react-bootstrap";
import "./Pedidos_escritorio.css";

function Datos_escritorio() {
    const equiposData = [
        {
            id: 1,
            nombre: "HP ProDesk 400 G7",
            modelo: "ProDesk 400",
            descripcion: "Equipo ideal para oficina con buen rendimiento.",
            especificaciones: [
                "Procesador: Intel i5 10th Gen",
                "RAM: 8 GB DDR4",
                "Disco: 512 GB SSD",
                "Pantalla: 24” Full HD",
            ],
            imagen: "/imagenes/EscritorioMesa.png",
        },
        {
            id: 2,
            nombre: "HP ProDesk 400 G7",
            modelo: "ProDesk 400",
            descripcion: "Equipo ideal para oficina con buen rendimiento.",
            especificaciones: [
                "Procesador: Intel i5 10th Gen",
                "RAM: 8 GB DDR4",
                "Disco: 512 GB SSD",
                "Pantalla: 24” Full HD",
            ],
            imagen: "/imagenes/EscritorioMesa.png",
        },
        {
            id: 3,
            nombre: "HP ProDesk 400 G7",
            modelo: "ProDesk 400",
            descripcion: "Equipo ideal para oficina con buen rendimiento.",
            especificaciones: [
                "Procesador: Intel i5 10th Gen",
                "RAM: 8 GB DDR4",
                "Disco: 512 GB SSD",
                "Pantalla: 24” Full HD",
            ],
            imagen: "/imagenes/EscritorioMesa.png",
        },
        {
            id: 4,
            nombre: "HP ProDesk 400 G7",
            modelo: "ProDesk 400",
            descripcion: "Equipo ideal para oficina con buen rendimiento.",
            especificaciones: [
                "Procesador: Intel i5 10th Gen",
                "RAM: 8 GB DDR4",
                "Disco: 512 GB SSD",
                "Pantalla: 24” Full HD",
            ],
            imagen: "/imagenes/EscritorioMesa.png",
        },
        {
            id: 5,
            nombre: "Dell OptiPlex 7080",
            modelo: "OptiPlex",
            descripcion: "Diseñado para tareas pesadas y multitarea.",
            especificaciones: [
                "Procesador: Intel i7 11th Gen",
                "RAM: 16 GB DDR4",
                "Disco: 1 TB SSD",
                "Gráfica: NVIDIA GTX 1650",
            ],
            imagen: "/imagenes/EscritorioMesa.png",
        },
        {
            id: 6,
            nombre: "Lenovo ThinkCentre M720",
            modelo: "ThinkCentre",
            descripcion: "Compacto y eficiente para oficinas pequeñas.",
            especificaciones: [
                "Procesador: Intel i3 9th Gen",
                "RAM: 4 GB DDR4",
                "Disco: 256 GB SSD",
                "Pantalla: 21” Full HD",
            ],
            imagen: "/imagenes/EscritorioMesa.png",
        },
    ];

    const [seleccionados, setSeleccionados] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredEquipos, setFilteredEquipos] = useState(equiposData);

    useEffect(() => {
        const results = equiposData.filter((equipo) => {
            const lowerSearchTerm = searchTerm.toLowerCase();

            const nombreMatch = equipo.nombre.toLowerCase().includes(lowerSearchTerm);
            const modeloMatch = equipo.modelo.toLowerCase().includes(lowerSearchTerm);
            const descripcionMatch = equipo.descripcion.toLowerCase().includes(lowerSearchTerm);
            const especificacionesMatch = equipo.especificaciones.some((esp) =>
                esp.toLowerCase().includes(lowerSearchTerm)
            );

            return nombreMatch || modeloMatch || descripcionMatch || especificacionesMatch;
        });
        setFilteredEquipos(results);
    }, [searchTerm]);

    const toggleSelect = (id) => {
        setSeleccionados((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const confirmarSolicitud = (e) => {
        e.preventDefault();
        alert(`Solicitud confirmada ✅ 
        Equipos seleccionados: ${seleccionados.join(", ")}`);
        setShowModal(false);
    };

    return (
        <div className="main-page-container">
            <div className="group-busquedass">
                <svg stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="icon">
                    
                </svg>
                <input
                    className="input"
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="equipos-container">
                {filteredEquipos.map((equipo) => (
                    <Card
                        key={equipo.id}
                        className={`ficha-horizontal ${
                            seleccionados.includes(equipo.id) ? "seleccionado" : ""
                        }`}
                    >
                        <div className="ficha-img">
                            <Card.Img src={equipo.imagen} alt={equipo.nombre} />
                        </div>

                        <div className="ficha-info">
                            <Card.Body>
                                <Card.Title>{equipo.nombre}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Modelo: {equipo.modelo}
                                </Card.Subtitle>
                                <Card.Text>{equipo.descripcion}</Card.Text>

                                <Card className="Cuadro_especificacioness">
                                    <Card.Header>Especificaciones</Card.Header>
                                    <ListGroup variant="flush">
                                        {equipo.especificaciones.map((esp, i) => (
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
                ))}
            </div>

            {seleccionados.length > 0 && (
                <div className="confirmar-container">
                    <Button variant="success" onClick={() => setShowModal(true)}>
                        Confirmar solicitud
                    </Button>
                </div>
            )}

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar solicitud</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={confirmarSolicitud}>
                        <Form.Group className="mb-3">
                            <Form.Label>Ambiente</Form.Label>
                            <Form.Control type="text" placeholder="Ej: Ambiente 301" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Fecha de uso</Form.Label>
                            <Form.Control type="date" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cantidad </Form.Label>
                            <Form.Control type="number" min="1" />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Enviar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
export default Datos_escritorio;