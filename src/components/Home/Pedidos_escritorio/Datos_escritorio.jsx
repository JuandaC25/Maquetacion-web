import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, ButtonGroup, ToggleButton, Carousel } from "react-bootstrap";
import "./Pedidos_escritorio.css";
import ElementosService from "../../../api/ElementosApi";
import { crearSolicitud } from "../../../api/solicitudesApi";

// --- FUNCIONES GLOBALES DE FECHA/HORA ---

/**
 * @returns {string} Fecha actual.
 */
const getMinMaxDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Meses empiezan en 0
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Obtiene la hora actual en formato HH:mm.
 * @returns {string} Hora actual.
 */
const getMinTime = () => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const todayDate = getMinMaxDate();

function Datos_escritorio() {
  const [subcatInfo, setSubcatInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState("computo");
  const [showModal, setShowModal] = useState(false);
  const [equiposDisponibles, setEquiposDisponibles] = useState([]);
  // Estado para guardar la hora actual cuando se abre el modal, evitando que cambie mientras está abierto
  const [minHoraInicio, setMinHoraInicio] = useState(getMinTime());

  const [form, setForm] = useState({
    fecha_ini: "",
    hora_ini: "",
    fecha_fn: "",
    hora_fn: "",
    ambient: "",
    cantid:"",
    num_ficha: "",
    estadosoli: 1,
    id_usu: 1,
  });

  const handleShowModal = () => {
    // 🔑 Acción clave: Actualiza la hora mínima solo al abrir el modal para fijar el límite (hora actual)
    setMinHoraInicio(getMinTime());
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
    // Limpia el formulario al cerrarse
    setForm({
      fecha_ini: "",
      hora_ini: "",
      fecha_fn: "",
      hora_fn: "",
      ambient: "",
      cantid:"",
      num_ficha: "",
      estadosoli: 1,
      id_usu: 1,
    });
  };

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
    
    // Validación de coherencia: La fecha/hora de fin debe ser estrictamente posterior a la de inicio.
    if (fechaFin <= fechaInicio) {
        alert("La fecha y hora de fin debe ser posterior a la de inicio.");
        return;
    }

    const dto = {
      fecha_ini: fechaInicio.toISOString(),
      fecha_fn: fechaFin.toISOString(),
      ambient: form.ambient,
      cantid: form.cantid,
      estadosoli: form.estadosoli,
      id_usu: form.id_usu,
      num_ficha: form.num_ficha,
      id_elemen: [],
    };

    try {
      await crearSolicitud(dto);
      alert("Solicitud realizada correctamente ✅");
      handleHideModal(); // Cierra el modal y resetea el form
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
            <Button className="boton-solicitar" onClick={handleShowModal}>
              <span>Realizar solicitud</span>
            </Button>
          </div>
        </Card>
      ) : (
        <p className="text-center mt-4">No hay datos disponibles.</p>
      )}

      {/* Modal de solicitud */}
      <Modal show={showModal} onHide={handleHideModal} centered>
        <Modal.Header className="Modal_hea" closeButton >
          <Modal.Title className="Txt_modal_header">Realizar Solicitud</Modal.Title>
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
                    min={todayDate} // 🔑 Restricción: Solo hoy
                    max={todayDate} // 🔑 Restricción: Solo hoy
                    required
                  />
                </div>
                <div className="col-md-6">
                  <Form.Control
                    type="time"
                    name="hora_ini"
                    value={form.hora_ini}
                    onChange={handleChange}
                    min={minHoraInicio} // 🔑 Desde la hora actual
                    max="23:59" // 🔑 Hasta la medianoche
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
                    min={form.fecha_ini || todayDate} // Debe ser igual a la fecha de inicio (hoy)
                    max={todayDate} // Restricción: Solo hoy
                    required
                  />
                </div>
                <div className="col-md-6">
                  <Form.Control
                    type="time"
                    name="hora_fn"
                    value={form.hora_fn}
                    onChange={handleChange}
                    // Si la fecha de fin es igual a la de inicio (hoy), la hora de fin debe ser posterior a la de inicio.
                    min={form.fecha_fn === form.fecha_ini ? form.hora_ini : ""} 
                    max="23:59" // También limitada a la medianoche.
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
                <div className="col-md">
                  <Form.Label>Cantidad de equipos</Form.Label>
                  <Form.Control
                    type="text"
                    name="cantidad_equipos"
                    placeholder="max 3"
                    value={form.cantid}
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