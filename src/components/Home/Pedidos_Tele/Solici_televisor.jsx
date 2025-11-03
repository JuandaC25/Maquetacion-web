import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Carousel, ButtonGroup, ToggleButton } from "react-bootstrap";
import "./Soli_televisor.css";
import Footer from "../../Footer/Footer";
import Headertele from "./Header tele/Header";
import ElementosService from "../../../api/ElementosApi";
import { crearSolicitud } from "../../../api/solicitudesApi";

function SoliciAudioVideo() {
  const [audioVideoInfo, setAudioVideoInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState("multimedia");
  const [showModal, setShowModal] = useState(false);
  const [equiposDisponibles, setEquiposDisponibles] = useState([]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

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
        id_usu: 1,
      });
    } catch (err) {
      console.error("Error al realizar la solicitud:", err);
      alert(`Hubo un problema al enviar la solicitud: ${err.message}`);
    }
  };

  useEffect(() => {
    const fetchAudioVideoInfo = async () => {
      try {
        setIsLoading(true);
        const data = await ElementosService.obtenerElementos();
        // Solo multimedia, excluyendo "Equipo de edicion" y "Portátil de edicion"
        const multimediaItems = data.filter(
          (item) =>
            item.id_categ === 2 &&
            item.sub_catg !== "Equipo de edicion" &&
            item.sub_catg !== "Portátil de edicion"
        );
  const activos = multimediaItems.filter((item) => item.est === 1);
        setEquiposDisponibles(activos);

        if (multimediaItems.length > 0) {
          setAudioVideoInfo({
            nombre: "Audio/Video",
            observacion: multimediaItems[0].obse || "",
            especificaciones: (multimediaItems[0].componen || "")
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s.length > 0),
          });
        } else {
          setAudioVideoInfo(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAudioVideoInfo();
  }, []);

  return (
    <div className="audio-video-main-container">
      <Headertele />
      {isLoading ? (
        <p className="text-center">Cargando información...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : audioVideoInfo ? (
        <Card className="audio-video-ficha-visual">
          <div className="audio-video-ficha-header">
            <div className="audio-video-ficha-titulo">
              <h2>{audioVideoInfo.nombre}</h2>
              <p className="audio-video-ficha-subtitulo">
                Visualiza aquí los detalles generales de los elementos de audio/video disponibles
              </p>
            </div>
          </div>

          <div className="audio-video-ficha-body">
            <div className="audio-video-ficha-descripcion">
              <h4>Descripción general</h4>
              <p>{audioVideoInfo.observacion || "Sin observaciones disponibles."}</p>
              <div className="audio-video-carrusel">
                <Carousel interval={2500} controls={true} indicators={true} fade>
                  {[1, 2, 3].map((num) => (
                    <Carousel.Item key={num}>
                      <img
                        className="d-block w-100 audio-video-carrusel-imagen"
                        src={`/imagenes/imagenes_audio_video/AudioVideo${num}.png`}
                        alt={`Equipo audio/video ${num}`}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
            </div>

            <div className="audio-video-ficha-especificaciones">
              <h4>Componentes principales</h4>
              <ul>
                {audioVideoInfo.especificaciones.map((esp, i) => (
                  <li key={i}>{esp}</li>
                ))}
              </ul>
            </div>

            <div className="audio-video-equipos-disponibles mt-4">
              <h4>Elementos de audio/video disponibles:</h4>
              <div className="audio-video-contador-equipos">
                <span className="audio-video-numero">{equiposDisponibles.length}</span>
                <p>Elementos actualmente disponibles</p>
              </div>
            </div>
          </div>

          <div className="audio-video-ficha-footer">
            <Button className="audio-video-boton-solicitar" onClick={() => setShowModal(true)}>
              <span>Realizar solicitud</span>
            </Button>
          </div>
        </Card>
      ) : (
        <p className="text-center mt-4">No hay datos disponibles.</p>
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

export default SoliciAudioVideo;
