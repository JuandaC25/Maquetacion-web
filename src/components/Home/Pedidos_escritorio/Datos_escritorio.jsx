import React, { useState } from "react";
import { Card, ListGroup, Button, Modal, Form } from "react-bootstrap";
import "./Pedidos_escritorio.css";

function Datos_escritorio() {
  const equipos = [
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
      id: 3,
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
    <div className="equipos-container">
      {equipos.map((equipo) => (
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

              <Card className="mb-3">
                <Card.Header>Especificaciones</Card.Header>
                <ListGroup variant="flush">
                  {equipo.especificaciones.map((esp, i) => (
                    <ListGroup.Item key={i}>{esp}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>

              <Button
                variant={
                  seleccionados.includes(equipo.id) ? "danger" : "primary"
                }
                onClick={() => toggleSelect(equipo.id)}
              >
                {seleccionados.includes(equipo.id)
                  ? "Quitar"
                  : "Seleccionar"}
              </Button>
            </Card.Body>
          </div>
        </Card>
      ))}

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
              <Form.Control type="text" placeholder="Ej: Sala de informática" />
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
    </div>
  );
}

export default Datos_escritorio;



