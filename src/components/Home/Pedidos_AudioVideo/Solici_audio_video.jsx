import React, { useState, useEffect } from "react";
import { Card, Button, Carousel, Modal, Form } from "react-bootstrap";
import "./Soli_audio_video.css";
import Footer from "../../Footer/Footer"; 
import Header from '../../common/Header/Header';
import ElementosService from "../../../api/ElementosApi";
import { crearSolicitud } from "../../../api/solicitudesApi"; // 👈 Nueva Importación
// Asumimos que el componente del modal para Audio/Video se llama SoliModalAud
import SoliModalAud from './SoliModalAud/SoliModalAud.jsx'; // 👈 Nueva Importación

function SoliciAudioVideo() {
  const [audioVideoInfo, setAudioVideoInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ESTADOS Y HANDLERS DEL MODAL (Integrados del componente de referencia)
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
    id_usu: 1, // Nota: Este ID debe ser dinámico en una aplicación real
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
      fecha_ini: `${form.fecha_ini}T${form.hora_ini}:00`,
      fecha_fn: `${form.fecha_fn}T${form.hora_fn}:00`,
      ambient: form.ambient,
      estadosoli: form.estadosoli,
      id_usu: form.id_usu,
      num_ficha: form.num_ficha,
      id_elemen: [], // Se asume que la selección de elementos se maneja dentro del modal
    };

    try {
      await crearSolicitud(dto);
      alert("Solicitud realizada correctamente ✅");
      setShowModal(false);
      // Limpiar formulario después del envío
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
 // Fin de lógica y handlers del modal

  useEffect(() => {
    const fetchAudioVideoInfo = async () => {
      try {
        setIsLoading(true);
        const data = await ElementosService.obtenerElementos();
        
        // Filtro específico para "multimedia" (mantenido de SoliciAudioVideo)
        const subcategoriasExcluir = [
          "Equipo de edicion",
          "Portátil de edicion"
        ];
        const multimediaItems = data.filter(
          (item) =>
            item.tip_catg && 
            item.tip_catg.toLowerCase().trim() === "multimedia" &&
            (!item.sub_catg || !subcategoriasExcluir.includes(item.sub_catg))
        );
        
        const activos = multimediaItems.filter((item) => item.est === 1);
        setEquiposDisponibles(activos); // Actualizar equipos disponibles

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
      <Header title="Solicitud Audio/Video" />
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

  {/* DESCRIPCIÓN GENERAL */}
  <div className="audio-video-ficha-descripcion">
    <h4>Zona de Producción Audiovisual</h4>
    <p>
      En este apartado encontraras los accesorios y elementos esenciales para la creación
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
        <li>Equipos para captura de audio</li>
        <li>Herramientas para composición visual y chromas </li>
        <li>Accesorios de ambientación multimedia</li>
        <li>Elementos para monitorización y control de sonido</li>
        <li>Recursos para actividades de grabación y producción</li>
      </ul>
    </div>
  </div>
          <div className="audio-video-ficha-footer">
            <Button 
              className="audio-video-boton-solicitar" 
              onClick={() => setShowModal(true)} // Abrir el modal
            >
              <span>Realizar solicitud</span>
            </Button>
          </div>
        </Card>
      ) : (
        <p className="text-center mt-4">No hay datos disponibles.</p>
      )}

      {/* COMPONENTE DEL MODAL DE SOLICITUD */}
      <SoliModalAud // Se asume que este es el componente del modal
        show={showModal}
        onHide={() => setShowModal(false)} // Es handleHide en tu referencia, pero 'onHide' es convención de React-Bootstrap
        form={form}
        handleChange={handleChange}
        handleFormSubmit={handleFormSubmit}
        equiposDisponibles={equiposDisponibles}
      />

      <Footer />
    </div>
  );
}

export default SoliciAudioVideo;