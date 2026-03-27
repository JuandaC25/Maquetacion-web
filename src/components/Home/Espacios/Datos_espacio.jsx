import React, { useState, useEffect } from "react";
import "./Solicitud_espacios.css";
import Card from "react-bootstrap/Card";
import { Carousel, Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { crearSolicitud, verificarDisponibilidadEspacio } from "../../../api/solicitudesApi";
import { listarEspacios } from "../../../api/EspaciosApi";
import { BASE_URL } from "../../../api/http";

function Datos_espacio() {
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  });

  // Obtener la fecha actual en formato YYYY-MM-DD
  const getFechaMinima = () => {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  };

  // Cargar espacios al montar el componente
  useEffect(() => {
    cargarEspacios();
  }, []);

  const cargarEspacios = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[ESPACIOS] Iniciando carga de espacios...');
      const data = await listarEspacios();
      console.log('[ESPACIOS] Datos recibidos:', data);
      console.log('[ESPACIOS] Total de espacios:', data?.length);
      const espaciosActivos = data.filter(esp => esp.estadoespacio === 1);
      console.log('[ESPACIOS] Espacios activos:', espaciosActivos.length);
      setEspacios(espaciosActivos);
      setError(null);
    } catch (err) {
      console.error("[ESPACIOS] Error al cargar espacios:", err);
      console.error("[ESPACIOS] Error completo:", err.message, err.stack);
      setError("No se pudieron cargar los espacios disponibles: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (espacio) => {
    setEspacioSeleccionado(espacio);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!espacioSeleccionado || !espacioSeleccionado.id) {
      alert("Error: no se seleccionó ningún espacio.");
      return;
    }

    const fechaInicio = new Date(`${form.fecha_ini}T${form.hora_ini}:00`);
    const fechaFin = new Date(`${form.fecha_fn}T${form.hora_fn}:00`);

    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      alert("El formato de fecha u hora es inválido.");
      return;
    }

    // ✅ Validación 1: No permitir fechas pasadas
    const ahora = new Date();
    const fechaActualSoloFecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const fechaInicioSoloFecha = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate());
    
    // Si es una fecha anterior (día anterior), rechazar
    if (fechaInicioSoloFecha < fechaActualSoloFecha) {
      alert("❌ No puedes seleccionar una fecha anterior al día de hoy.");
      return;
    }

    // Validar que la fecha de fin sea posterior a la de inicio
    if (fechaFin <= fechaInicio) {
      alert("❌ La fecha y hora de fin debe ser posterior a la de inicio.");
      return;
    }
    const pad = (n) => String(n).padStart(2, '0');
    const formatLocal = (d) => {
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const dto = {
      fecha_ini: formatLocal(fechaInicio),
      fecha_fn: formatLocal(fechaFin),
      ambient: form.ambient,
      estadosoli: parseInt(form.estadosoli, 10) || 1, // ✅ Usar el alias que acepta el DTO
      num_fich: parseInt(form.num_ficha, 10), // ✅ Convertir a número entero
      id_esp: espacioSeleccionado.id
      // ❌ NO enviar id_usu - el backend lo asigna automáticamente desde el token JWT
    };

    try {
      // ✅ Validación 2: Verificar disponibilidad del espacio
      console.log('[VALIDACIÓN] Verificando disponibilidad del espacio...');
      const verificacion = await verificarDisponibilidadEspacio(
        espacioSeleccionado.id,
        dto.fecha_ini,
        dto.fecha_fn
      );

      if (!verificacion.disponible) {
        alert(`❌ ${verificacion.mensaje}\n\nPor favor, elige otro horario o fecha.`);
        return;
      }

      console.log('[SOLICITUD] DTO enviado:', dto);
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
      });
    } catch (err) {
      console.error("Error en la solicitud:", err);
      alert("❌ Error al enviar la solicitud: " + (err?.message || err));
    }
  };

  return (
    <>
      {loading && (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="success" />
          <p className="mt-3">Cargando espacios disponibles...</p>
        </div>
      )}
      {error && (
        <div className="container mt-4">
          <Alert variant="danger">{error}</Alert>
        </div>
      )}
      {!loading && !error && (
        <div className="ACMC-Cua">
          {espacios.length === 0 ? (
            <div className="text-center mt-5">
              <Alert variant="info">No hay espacios disponibles en este momento</Alert>
            </div>
          ) : (
            espacios.map((espacio, index) => {
              let imagenes = [];
              console.log('Espacio:', espacio.nom_espa);
              console.log('Imagenes raw:', espacio.imagenes);
              
              try {
                imagenes = espacio.imagenes ? JSON.parse(espacio.imagenes) : [];
                console.log('Imagenes parseadas:', imagenes);
              } catch (e) {
                console.error("Error al parsear imágenes:", e);
                imagenes = [];
              }
              if (imagenes.length === 0) {
                imagenes = ["/imagenes/imagenes_espacios/default.jpg"];
                console.log('Usando imagen por defecto');
              }
              const cardClass = index % 2 === 0 ? "Cuadroparaespacio" : "Cuadroparaauditorio";

              return (
                <Card key={espacio.id} className={cardClass}>
                  <Carousel className="carrusel-espacios" interval={3000}>
                    {imagenes.map((imgUrl, imgIndex) => {
                      const fullUrl = imgUrl.startsWith('http') 
                        ? imgUrl 
                        : `${BASE_URL}${imgUrl}`;
                      
                      console.log(`Imagen ${imgIndex + 1} URL:`, fullUrl);
                      
                      return (
                        <Carousel.Item key={imgIndex}>
                          <img
                            src={fullUrl}
                            alt={`${espacio.nom_espa} - Imagen ${imgIndex + 1}`}
                            className="ImagenPolideportivo"
                            style={{ width: '100%', height: '490px', objectFit: 'cover' }}
                            onError={(e) => {
                              console.error('Error al cargar imagen:', fullUrl);
                              e.target.src = "/imagenes/imagenes_espacios/default.jpg";
                            }}
                            onLoad={() => console.log('Imagen cargada exitosamente:', fullUrl)}
                          />
                        </Carousel.Item>
                      );
                    })}
                  </Carousel>

                  <div className="product-details">
                    <h1 className="solicitud-titulo001">{espacio.nom_espa}</h1>
                    <p>{espacio.descripcion}</p>
                    <button className="button-Espacio" onClick={() => handleOpen(espacio)}>
                      <div className="front">
                        <span>Apartar espacio</span>
                      </div>
                    </button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* 🔹 MODAL FORMULARIO */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Reservar {espacioSeleccionado?.nom_espa || "Espacio"}
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
                    min={getFechaMinima()}
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
                    min={form.fecha_ini || getFechaMinima()}
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
            {/* Eliminados campos de ambiente y número de ficha, solo fechas y horas */}
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

export default Datos_espacio;