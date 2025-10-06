import React, { useState } from "react";
import "./Solicitud_espacios.css";
import Card from "react-bootstrap/Card";
import { Carousel, Modal, Button, Form } from "react-bootstrap";
import { crearSolicitud } from "../../../api/solicitudesApi";

function Datos_pedido() {
  const [showModal, setShowModal] = useState(false);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);

  const [form, setForm] = useState({
    fecha_ini: "",
    hora_ini: "",
    fecha_fn: "",
    hora_fn: "",
    ambient: "",
    num_ficha: "",
    estadosoli: 1,
    id_usu: 1,
  });

  const handleOpen = (idEsp) => {
    setEspacioSeleccionado(idEsp);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!espacioSeleccionado) {
      alert("Error: no se seleccionó ningún espacio.");
      return;
    }

    const fechaInicio = new Date(`${form.fecha_ini}T${form.hora_ini}:00`);
    const fechaFin = new Date(`${form.fecha_fn}T${form.hora_fn}:00`);

    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      alert("El formato de fecha u hora es inválido.");
      return;
    }

    const dto = {
      fecha_ini: fechaInicio.toISOString(),
      fecha_fn: fechaFin.toISOString(),
      ambient: form.ambient,
      estadosoli: form.estadosoli,
      id_usu: form.id_usu,
      num_fich: form.num_ficha,
      id_esp: espacioSeleccionado,
    };

    try {
      await crearSolicitud(dto);
      alert("✅ Solicitud enviada correctamente");
      handleClose();
      setForm({
        fecha_ini: "",
        hora_ini: "",
        fecha_fn: "",
        hora_fn: "",
        ambient: "",
        num_ficha: "",
        estadosoli: 1,
        id_usu: 1,
      });
    } catch (err) {
      console.error("Error en la solicitud:", err);
      alert("❌ Error al enviar la solicitud");
    }
  };

  return (
    <>
      <div className="ACMC-Cua">
        {/* POLIDEPORTIVO */}
        <Card className="Cuadroparaespacio">
          <Carousel className="carrusel-espacios">
            <Carousel.Item>
              <img src="/imagenes/Polideportivo.jpg" alt="Polideportivo" className="ImagenPolideportivo" />
            </Carousel.Item>
            <Carousel.Item>
              <img src="/imagenes/imagenes_espacios/espacio1.jpeg" alt="Espacio 1" className="ImagenPolideportivo" />
            </Carousel.Item>
            <Carousel.Item>
              <img src="/imagenes/imagenes_espacios/espacio2.jpeg" alt="Espacio 2" className="ImagenPolideportivo" />
            </Carousel.Item>
          </Carousel>

          <div className="product-details">
            <h1 className="solicitud-titulo001">Solicitar Polideportivo</h1>
            <p>
              Espacio amplio y multifuncional destinado a actividades deportivas y recreativas.
Ideal para la práctica de fútbol, baloncesto, voleibol y eventos institucionales.
              <br />
              <br />
              <strong>Especificaciones:</strong> <br />
              - Malla de voleibol. <br />- Arcos para fútbol y tableros de baloncesto <br />- Equipos de sonido.<br />- Iluminación adecuada para actividades diurnas y nocturnas
            </p>

            {/* 🔹 Tu botón original restaurado */}
            <button className="button-Espacio" onClick={() => handleOpen(1)}>
              <div className="front">
                <span>Apartar espacio</span>
              </div>
            </button>
          </div>
        </Card>

        <Card className="Cuadroparaauditorio">
          <Carousel className="carrusel-Auditorio">
            <Carousel.Item>
              <img src="/imagenes/imagenes_espacios/Auditorio1.jpeg" alt="Auditorio 1" className="Imagenes-auditorio1" />
            </Carousel.Item>
            <Carousel.Item>
              <img src="/imagenes/imagenes_espacios/Auditorio2.jpeg" alt="Auditorio 2" className="Imagenes-auditorio1" />
            </Carousel.Item>
          </Carousel>

          <div className="product-details">
            <h1 className="solicitud-titulo">Solicitar Auditorio</h1>
            <p>
              Espacio diseñado para conferencias, presentaciones, proyecciones y eventos académicos.
Ofrece comodidad, buena acústica y equipamiento audiovisual de alta calidad.
              <br />
              <br />
              <strong>Especificaciones:</strong> <br />
              - Pantalla grande para presentaciones o proyección de videos.. <br />- Capacidad para 150 personas. <br />- Sistema de sonido profesional.<br />-Iluminacion adecuada para todo el lugar
            </p>

            {/* 🔹 Botón original también aquí */}
            <button className="button-Espacio" onClick={() => handleOpen(2)}>
              <div className="front">
                <span>Apartar espacio</span>
              </div>
            </button>
          </div>
        </Card>
      </div>

      {/* 🔹 MODAL FORMULARIO */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Reservar {espacioSeleccionado === 1 ? "Polideportivo" : "Auditorio"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
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
              <Form.Label>Ambiente</Form.Label>
              <Form.Control
                type="text"
                name="ambient"
                placeholder="Ej: Polideportivo / Auditorio"
                value={form.ambient}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Número de ficha</Form.Label>
              <Form.Control
                type="text"
                name="num_ficha"
                placeholder="Ej: 2560014"
                value={form.num_ficha}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="text-center mt-3">
              <Button variant="success" type="submit">
                Confirmar Reserva
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Datos_pedido;


