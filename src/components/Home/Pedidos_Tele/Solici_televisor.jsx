import React, { useState, useEffect } from "react";
import { Card, ListGroup, Button, Modal, Form } from "react-bootstrap";
import "./Soli_televisor.css";
import Footer from "../../Footer/Footer";
import Headertele from "./Header tele/Header";

function Solitelevisores() {
    const televisoresData = [
        {
            id: 1,
            nombre: "Samsung UHD 4K",
            modelo: "UN55AU8000G",
            descripcion: "Televisor inteligente con colores vibrantes y gran claridad.",
            especificaciones: [
                "Tamaño: 55 pulgadas",
                "Resolución: 3840 x 2160 (4K)",
                "Tipo de Pantalla: LED",
                "Conectividad: Wi-Fi, Bluetooth",
            ],
            imagen: "/imagenes/Televisorr-solicitud.png"

        },
        {
            id: 2,
            nombre: "LG NanoCell",
            modelo: "50NANO75SQA",
            descripcion: "Colores puros con tecnología NanoCell y sonido envolvente.",
            especificaciones: [
                "Tamaño: 50 pulgadas",
                "Resolución: 4K UHD",
                "Tipo de Pantalla: NanoCell",
                "Asistente de Voz: Google Assistant, Alexa",
            ],
            imagen: "/imagenes/Televisorr-solicitud.png"

        },
        {
            id: 3,
            nombre: "Sony Bravia OLED",
            modelo: "XR-65A80J",
            descripcion: "Negros perfectos y un contraste impresionante con el procesador XR.",
            especificaciones: [
                "Tamaño: 65 pulgadas",
                "Resolución: 4K (3840 x 2160)",
                "Tipo de Pantalla: OLED",
                "Tasa de Refresco: 120Hz",
            ],
            imagen: "/imagenes/Televisorr-solicitud.png"

        },
        {
            id: 4,
            nombre: "LG OLED evo",
            modelo: "OLED65C2PUA",
            descripcion: "Imágenes increíblemente realistas, ideal para cine y videojuegos.",
            especificaciones: [
                "Tamaño: 65 pulgadas",
                "Resolución: 4K Ultra HD",
                "Tipo de Pantalla: OLED",
                "Tasa de Refresco: 120Hz",
            ],
           imagen: "/imagenes/Televisorr-solicitud.png"

        },
        {
            id: 5,
            nombre: "Samsung QLED 8K",
            modelo: "QN75Q900",
            descripcion: "La máxima definición en imagen, con inteligencia artificial.",
            especificaciones: [
                "Tamaño: 75 pulgadas",
                "Resolución: 8K (7680 x 4320)",
                "Tipo de Pantalla: QLED",
                "Sonido: Audio Inteligente con IA",
            ],
            imagen: "/imagenes/Televisorr-solicitud.png"
        },
    ];

    const [seleccionados, setSeleccionados] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTelevisores, setFilteredTelevisores] = useState(televisoresData);

    useEffect(() => {
        const results = televisoresData.filter((televisor) => {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const nombreMatch = televisor.nombre.toLowerCase().includes(lowerSearchTerm);
            const modeloMatch = televisor.modelo.toLowerCase().includes(lowerSearchTerm);
            const descripcionMatch = televisor.descripcion.toLowerCase().includes(lowerSearchTerm);
            const especificacionesMatch = televisor.especificaciones.some((esp) =>
                esp.toLowerCase().includes(lowerSearchTerm)
            );
            return nombreMatch || modeloMatch || descripcionMatch || especificacionesMatch;
        });
        setFilteredTelevisores(results);
    }, [searchTerm]);

    const toggleSelect = (id) => {
        setSeleccionados((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const confirmarSolicitud = (e) => {
        e.preventDefault();
        alert(`Solicitud confirmada ✅ 
        Televisores seleccionados: ${seleccionados.join(", ")}`);
        setShowModal(false);
    };

    const selectedTelevisoresDetails = seleccionados.map(id => {
      return televisoresData.find(televisor => televisor.id === id);
    });

    return (
        <div className="main-page-container">
          <Headertele/>
            <div className="Ajust-debusquedas">
                <div className="group-busqueda">
                    
                    <input
                        className="input"
                        type="text"
                        placeholder="Buscar televisores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {seleccionados.length > 0 && (
                    <div className="cartt-containerrr">
                        <Button variant="info" onClick={() => setShowCartModal(true)}>
                            🛒 Televisores ({seleccionados.length})
                        </Button>
                    </div>
                )}
            </div>
            <div className="televisores-container">
                {filteredTelevisores.map((televisor) => (
                    <Card
                        key={televisor.id}
                        className={`ficha-tv ${
                            seleccionados.includes(televisor.id) ? "seleccionado" : ""
                        }`}
                    >
                        <div className="ficha-img">
                            <Card.Img src={televisor.imagen} alt={televisor.nombre} />
                        </div>

                        <div className="ficha-info">
                            <Card.Body>
                                <Card.Title>{televisor.nombre}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Modelo: {televisor.modelo}
                                </Card.Subtitle>
                                <Card.Text>{televisor.descripcion}</Card.Text>

                                <Card className="Cuadro_especificaciones-tv">
                                    <Card.Header>Especificaciones</Card.Header>
                                    <ListGroup variant="flush">
                                        {televisor.especificaciones.map((esp, i) => (
                                            <ListGroup.Item key={i}>{esp}</ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Card>

                                <Button
                                    className="boton-tv"
                                    variant={seleccionados.includes(televisor.id) ? "danger" : "primary"}
                                    onClick={() => toggleSelect(televisor.id)}
                                >
                                    {seleccionados.includes(televisor.id) ? "Quitar" : "Seleccionar"}
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

            {/* Modal de confirmación (Formulario) */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar solicitud</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={confirmarSolicitud}>
                        <Form.Group className="mb-3">
                            <Form.Label>Ambiente</Form.Label>
                            <Form.Control type="text" placeholder="Ej: Aula 201" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Fecha de uso</Form.Label>
                            <Form.Control type="date" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control type="number" min="1" />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Enviar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            
            {/* Nuevo Modal para mostrar los televisores del carrito */}
            <Modal show={showCartModal} onHide={() => setShowCartModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Televisores seleccionados</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup className="equipos-seleccionados-list">
                        {selectedTelevisoresDetails.length > 0 ? (
                            selectedTelevisoresDetails.map((televisor) => (
                                <ListGroup.Item key={televisor.id} className="equipo-item">
                                    {televisor.nombre} ({televisor.modelo})
                                </ListGroup.Item>
                            ))
                        ) : (
                            <p>No hay televisores en el carrito.</p>
                        )}
                    </ListGroup>
                </Modal.Body>
            </Modal>
         <Footer/>
        </div>
       
    );
}

export default Solitelevisores;



  

