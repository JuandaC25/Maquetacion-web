import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Carousel } from "react-bootstrap";
import "./Pedidos_ele.css";
import Footer from "../../Footer/Footer";
import Header_ad from './Header_ele/Header_elemen.jsx';
import ElementosService from "../../../api/ElementosApi";
import { crearSolicitud } from "../../../api/solicitudesApi";
import SolicitudModalEle from "./SolicitudModalEle/SolicitudModalEle.jsx";

function SoliciMultimedia() {
  const [multimediaInfo, setMultimediaInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
      fecha_ini: `${form.fecha_ini}T${form.hora_ini}:00`,
      fecha_fn: `${form.fecha_fn}T${form.hora_fn}:00`,
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
    const fetchMultimediaInfo = async () => {
      try {
        setIsLoading(true);
        const data = await ElementosService.obtenerElementos();
        const itemsFiltrados = data.filter(
          (item) =>
            item.id_categ !== 2 &&
            item.sub_catg !== "Equipo de mesa" &&
            item.sub_catg !== "Equipo de edicion" &&
            item.sub_catg !== "Portátil de edicion" &&
            item.sub_catg !== "Portátil"
        );
        
        const activos = itemsFiltrados.filter((item) => item.est === 1);
        setEquiposDisponibles(activos);

        if (itemsFiltrados.length > 0) {
          setMultimediaInfo({
            nombre: "Equipos Generales",
            observacion: itemsFiltrados[0].obse || "",
            especificaciones: (itemsFiltrados[0].componen || "")
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

  return (
    <div className="multimedia-main-container">
      <Header_ad />
      {isLoading ? (
        <p className="text-center">Cargando información...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : multimediaInfo ? (
        <Card className="multimedia-ficha-visual">
          <div className="multimedia-ficha-header">
            <div className="multimedia-ficha-titulo">
              <h2>{multimediaInfo.nombre}</h2>
              <p className="multimedia-ficha-subtitulo">
                Visualiza aquí los detalles generales de todos los equipos disponibles (excepto multimedia)
              </p>
            </div>
          </div>

          <div className="multimedia-ficha-body">
            <div className="multimedia-ficha-descripcion">
              <h4>Equipos y Recursos Generales</h4>
              <p>
                En este apartado encontrarás todos los elementos y accesorios disponibles del Centro,
                abarcando diferentes categorías y subcategorías. Aquí podrás solicitar elementos de 
                distintas áreas según las necesidades de tu proyecto o actividad académica.
              </p>

              <div className="multimedia-carrusel">
                <Carousel interval={2500} controls={true} indicators={true} fade>
                  <Carousel.Item>
                    <img
                      className="d-block w-100 multimedia-carrusel-imagen"
                      src="/imagenes/Elementos/CableInternet.png"
                      alt="Cable de Internet"
                    />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      className="d-block w-100 multimedia-carrusel-imagen"
                      src="/imagenes/Elementos/destornillador.png"
                      alt="Destornillador"
                    />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      className="d-block w-100 multimedia-carrusel-imagen"
                      src="/imagenes/Elementos/Mouse.png"
                      alt="Mouse"
                    />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      className="d-block w-100 multimedia-carrusel-imagen"
                      src="/imagenes/Elementos/Teclaado.png"
                      alt="Teclado"
                    />
                  </Carousel.Item>
                </Carousel>
              </div>
            </div>
            
            <div className="multimedia-ficha-especificaciones">
              <h4>¿Qué encontrarás en esta categoría?</h4>
              <ul>
                <li>Equipos de diferentes categorías del Centro</li>
                <li>Herramientas para múltiples propósitos académicos</li>
                <li>Accesorios complementarios</li>
                <li>Elementos para desarrollo de proyectos</li>                
              </ul>
            </div>
          </div>
          
          <div className="multimedia-ficha-footer">
            <Button className="multimedia-boton-solicitar" onClick={() => setShowModal(true)}>
              <span>Realizar solicitud</span>
            </Button>
          </div>
        </Card>
      ) : (
        <p className="text-center mt-4">No hay datos disponibles.</p>
      )}
      <SolicitudModalEle
        show={showModal}
        handleHide={() => setShowModal(false)}
        form={form} // 👈 ¡Nuevo!
        handleChange={handleChange} // 👈 ¡Nuevo!
        handleFormSubmit={handleFormSubmit} // 👈 ¡Nuevo!
        equiposDisponibles={equiposDisponibles} // 👈 Opcional, pero útil si se requiere una selección
      />
      <Footer />
    </div>
  );
}

export default SoliciMultimedia;