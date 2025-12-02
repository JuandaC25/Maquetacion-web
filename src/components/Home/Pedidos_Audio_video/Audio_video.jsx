import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Carousel, ButtonGroup, ToggleButton } from "react-bootstrap";
import "./Audio_video.css";
import Footer from "../../Footer/Footer";
import HeaderAudioVideoPedidos from "./Header Audio_video/Header";
import ElementosService from "../../../api/ElementosApi";
import { crearSolicitud } from "../../../api/solicitudesApi";


// --- SOLO MULTIMEDIA, SOLO SI HAY ELEMENTOS ---
import { getCurrentUser } from "../../../api/http";

function AudioVideoPedidos() {
  const [multimediaInfo, setMultimediaInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [equiposDisponibles, setEquiposDisponibles] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [form, setForm] = useState({
    fecha_ini: "",
    hora_ini: "",
    fecha_fn: "",
    hora_fn: "",
    ambient: "",
    num_ficha: "",
    estadosoli: 1,
    id_usu: "",
  });

  // Cargar usuario actual del token
  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.id) {
      setCurrentUserId(user.id);
      setForm((prev) => ({ ...prev, id_usu: user.id }));
    }
  }, []);

  // Cargar solo multimedia y solo si hay elementos
  useEffect(() => {
    const fetchMultimediaInfo = async () => {
      try {
        setIsLoading(true);
        const data = await ElementosService.obtenerElementos();
        // Solo multimedia (id_categ === 2), excluyendo "Equipo de edicion" y "Portátil de edicion"
        const multimediaItems = data.filter(
          (item) =>
            item.id_categ === 2 &&
            item.sub_catg !== "Equipo de edicion" &&
            item.sub_catg !== "Portátil de edicion"
        );
        const activos = multimediaItems.filter((item) => item.est === 1);
        setEquiposDisponibles(activos);

        if (activos.length > 0) {
          setMultimediaInfo({
            nombre: "Multimedia",
            observacion: activos[0].obse || "",
            especificaciones: (activos[0].componen || "")
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s.length > 0),
          });
        } else {
          setMultimediaInfo(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMultimediaInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validar usuario
    if (!currentUserId) {
      alert("Error: No se pudo obtener la información del usuario. Por favor inicia sesión nuevamente.");
      return;
    }

    const fechaInicio = new Date(`${form.fecha_ini}T${form.hora_ini}:00`);
    const fechaFin = new Date(`${form.fecha_fn}T${form.hora_fn}:00`);

    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      alert("El formato de fecha u hora es inválido.");
      return;
    }

    const dto = {
      fecha_ini: `${form.fecha_ini}T${form.hora_ini}:00`,
      fecha_fn: `${form.fecha_fn}T${form.hora_fn}:00`,
      ambient: form.ambient,
      estadosoli: form.estadosoli,
      id_usu: currentUserId,
      num_ficha: form.num_ficha,
      id_elemen: [],
    };

    try {
      await crearSolicitud(dto);
      alert("Solicitud realizada correctamente ✅");
      setShowModal(false);
      setForm({
        fecha_ini: "",
        hora_ini: "",
        fecha_fn: "",
        hora_fn: "",
        ambient: "",
        num_ficha: "",
        estadosoli: 1,
        id_usu: currentUserId,
      });
    } catch (err) {
      console.error("Error al realizar la solicitud:", err);
      alert(`Hubo un problema al enviar la solicitud: ${err.message}`);
    }
  };

  return (
    <div className="audio-video-main-container">
      <HeaderAudioVideoPedidos />
      {isLoading ? (
        <p className="text-center">Cargando información...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : multimediaInfo ? (
        <Card className="audio-video-ficha-visual">
          <div className="audio-video-ficha-header">
            <div className="audio-video-ficha-titulo">
              <h2>{multimediaInfo.nombre}</h2>
              <p className="audio-video-ficha-subtitulo">
                Visualiza aquí los detalles generales de los elementos multimedia disponibles
              </p>
            </div>
          </div>

          <div className="audio-video-ficha-body">
            {/* DESCRIPCIÓN GENERAL */}
            <div className="audio-video-ficha-descripcion">
              <h4>Zona de Producción Audiovisual</h4>
              <p>
                En este apartado encontrarás los accesorios y elementos esenciales para la creación
                de proyectos o trabajos de multimedia dentro del Centro. Equipos como micrófonos, pantallas
                verdes, audífonos, iluminación entre otros están disponibles para
                actividades de grabación, ensayo, diseño de escenas y producción audiovisual
                en general.
              </p>

              <div className="audio-video-carrusel">
                <Carousel interval={2500} controls={true} indicators={true} fade>
                  <Carousel.Item>
                    <img
                      className="d-block w-100 audio-video-carrusel-imagen"
                      src="/imagenes/Audiovideo/Audifonos.png"
                      alt="Audífonos"
                    />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      className="d-block w-100 audio-video-carrusel-imagen"
                      src="/imagenes/Audiovideo/Camara.png"
                      alt="Cámara"
                    />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      className="d-block w-100 audio-video-carrusel-imagen"
                      src="/imagenes/Audiovideo/Reflector.png"
                      alt="Reflector"
                    />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      className="d-block w-100 audio-video-carrusel-imagen"
                      src="/imagenes/Audiovideo/tabletaGrafica.png"
                      alt="Tableta Gráfica"
                    />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      className="d-block w-100 audio-video-carrusel-imagen"
                      src="/imagenes/Audiovideo/Trajedecroma.png"
                      alt="Traje de Croma"
                    />
                  </Carousel.Item>
                </Carousel>
              </div>
            </div>
            <div className="audio-video-ficha-especificaciones">
              <h4>¿Qué encontrarás en esta categoría?</h4>
              <ul>
                {multimediaInfo.especificaciones.map((esp, i) => (
                  <li key={i}>{esp}</li>
                ))}
              </ul>
            </div>
            {/* Contador de equipos disponibles */}
            <div className="equipos-disponibles-notif">
              <span>
                Equipos actualmente disponibles: {equiposDisponibles.length}
              </span>
            </div>
          </div>
          <div className="audio-video-ficha-footer">
            <Button className="audio-video-boton-solicitar" onClick={() => setShowModal(true)}>
              <span>Realizar solicitud</span>
            </Button>
          </div>
        </Card>
      ) : (
        <p className="text-center mt-4">No hay elementos multimedia disponibles.</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Realizar Solicitud</Modal.Title>
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
              <div className="row g-2">
                <div className="col-md-6">
                  <Form.Label>Ambiente</Form.Label>
                  <Form.Control
                    type="text"
                    name="ambient"
                    placeholder="Ej: Ambiente 301"
                    value={form.ambient}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <Form.Label>Número de ficha</Form.Label>
                  <Form.Control
                    type="text"
                    name="num_ficha"
                    placeholder="Ej: 2560014"
                    value={form.num_ficha}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </Form.Group>

            <div className="text-center mt-4">
              <Button variant="success" type="submit">
                Enviar Solicitud
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Footer />
    </div>
  );
}

export default AudioVideoPedidos;