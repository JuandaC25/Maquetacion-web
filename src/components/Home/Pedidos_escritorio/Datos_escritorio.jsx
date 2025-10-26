import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, ButtonGroup, ToggleButton, Carousel } from "react-bootstrap";
import "./Pedidos_escritorio.css";
import ElementosService from "../../../api/ElementosApi";
import { crearSolicitud } from "../../../api/solicitudesApi";

function Datos_escritorio() {
  const [subcatInfo, setSubcatInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState("computo");
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
      id_elemen: [], // no hay selección directa en esta versión
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
    const fetchSubcatInfo = async () => {
      try {
        setIsLoading(true);
        const data = await ElementosService.obtenerElementos();
        const subCatgFiltro = categoriaFiltro === "computo" ? "Equipo de mesa" : "Equipo de edicion";
        // Filtrar solo los elementos activos y de la subcategoría seleccionada
        const filtrados = data.filter((item) => item.sub_catg === subCatgFiltro);
        const activos = filtrados.filter((item) => item.est_elemn === 1);
        setEquiposDisponibles(activos);

        if (filtrados.length > 0) {
          setSubcatInfo({
            nombre: subCatgFiltro,
            observacion: filtrados[0].obse || "",
            especificaciones: (filtrados[0].componen || "")
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s.length > 0),
          });
        } else {
          setSubcatInfo(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubcatInfo();
  }, [categoriaFiltro]);

  return (
    <div className="main-page-container">
      {/* Filtro de categoría */}
      <div className="mb-3 d-flex justify-content-center">
        <ButtonGroup>
          <ToggleButton
            id="filtro-computo"
            type="radio"
            variant={categoriaFiltro === "computo" ? "success" : "outline-success"}
            name="categoriaFiltro"
            value="computo"
            checked={categoriaFiltro === "computo"}
            onChange={() => setCategoriaFiltro("computo")}
          >
            Computo
          </ToggleButton>
          <ToggleButton
            id="filtro-multimedia"
            type="radio"
            variant={categoriaFiltro === "multimedia" ? "success" : "outline-success"}
            name="categoriaFiltro"
            value="multimedia"
            checked={categoriaFiltro === "multimedia"}
            onChange={() => setCategoriaFiltro("multimedia")}
          >
            Multimedia
          </ToggleButton>
        </ButtonGroup>
      </div>

      {/* Ficha visual */}
      {isLoading ? (
        <p className="text-center">Cargando información...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : subcatInfo ? (
        <Card className="ficha-visual">
          <div className="ficha-header">
            <div className="ficha-titulo">
              <h2>{subcatInfo.nombre}</h2>
              <p className="ficha-subtitulo">
                Visualiza aquí los detalles generales de los equipos disponibles
              </p>
            </div>
          </div>

          <div className="ficha-body">
            <div className="ficha-descripcion">
              <h4>Descripción general</h4>
              <p>{subcatInfo.observacion || "Sin observaciones disponibles."}</p>
              <div className="carrusel-escritorio">
                <Carousel interval={2500} controls={true} indicators={true} fade>
                  {[1, 2, 3].map((num) => (
                    <Carousel.Item key={num}>
                      <img
                        className="d-block w-100 carrusel-imagen"
                        src={`/imagenes/imagenes_escritorio/Escritorio${num}.png`}
                        alt={`Equipo escritorio ${num}`}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
            </div>

            <div className="ficha-especificaciones">
              <h4>Componentes principales</h4>
              <ul>
                {subcatInfo.especificaciones.map((esp, i) => (
                  <li key={i}>{esp}</li>
                ))}
              </ul>
            </div>

            <div className="equipos-disponibles mt-4">
              <h4>Equipos disponibles:</h4>
              <div className="contador-equipos">
                <span className="numero">{equiposDisponibles.length}</span>
                <p>Equipos actualmente disponibles</p>
              </div>
            </div>
          </div>

          <div className="ficha-footer">
            <Button className="boton-solicitar" onClick={() => setShowModal(true)}>
              <span>Realizar solicitud</span>
            </Button>
          </div>
        </Card>
      ) : (
        <p className="text-center mt-4">No hay datos disponibles.</p>
      )}

      {/* Modal de solicitud */}
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
    </div>
  );
}

export default Datos_escritorio;