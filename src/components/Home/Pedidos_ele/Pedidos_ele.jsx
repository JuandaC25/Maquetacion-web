import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Carousel } from "react-bootstrap";
import "./Pedidos_ele.css";
import Footer from "../../Footer/Footer";
import Header from '../../common/Header/Header';
import ElementosService from "../../../api/ElementosApi";
import { crearSolicitud } from "../../../api/solicitudesApi";
import SolicitudModalEle from "./SolicitudModalEle/SolicitudModalEle.jsx";

function SoliciMultimedia() {
  const [multimediaInfo, setMultimediaInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // 🔑 Estado para almacenar el ID de la subcategoría
  const [subcategoriaId, setSubcategoriaId] = useState(null); 

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
      // ✅ CORRECCIÓN CLAVE: Envía el ID de subcategoría
      id_subcatego: subcategoriaId, 
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
        
        if (itemsFiltrados.length > 0) {
            // Obtiene el ID de subcategoría del primer elemento filtrado
            const idSubcat = itemsFiltrados[0].id_subcat || itemsFiltrados[0].id_subcatego; 
            setSubcategoriaId(idSubcat); 

          setMultimediaInfo({
            nombre: "Equipos Generales",
            observacion: itemsFiltrados[0].obse || "",
            especificaciones: (itemsFiltrados[0].componen || "")
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s.length > 0),
          });
        } else {
            setSubcategoriaId(null);
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
      <Header title="Solicitud Multimedia" />
      {isLoading ? (
        <p className="text-center">Cargando información...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : multimediaInfo ? (
        <Card className="multimedia-ficha-visual">
          <div className="multimedia-ficha-header">
            {/* ... (Contenido de Card se mantiene igual) ... */}
          </div>

          <div className="multimedia-ficha-body">
            {/* ... (Contenido de Card se mantiene igual) ... */}
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
        form={form} 
        handleChange={handleChange} 
        handleFormSubmit={handleFormSubmit} 
        // Nota: Aquí ya no pasamos equiposDisponibles. 
        // El modal (SolicitudModalEle.jsx) debe proteger su lógica interna.
      />
      <Footer />
    </div>
  );
}

export default SoliciMultimedia;
