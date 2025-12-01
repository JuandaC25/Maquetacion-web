// ... Mismo import y funciones de fecha/hora ...
import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, ButtonGroup, ToggleButton, Carousel, Spinner } from "react-bootstrap";
import "./Pedidos_escritorio.css";
import ElementosService from "../../../api/ElementosApi";
import SolicitudModalForm from "./SolicitudModal/SolicitudModal";

const USER_ID = 1; 

function Datos_escritorio() {
    const [subcatInfo, setSubcatInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoriaFiltro, setCategoriaFiltro] = useState("computo");
    const [showModal, setShowModal] = useState(false);
    const [equiposDisponibles, setEquiposDisponibles] = useState([]);
    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleHideModal = () => {
        setShowModal(false);
    };
    useEffect(() => {
        const fetchSubcatInfo = async () => {
            try {
                setIsLoading(true);
                const data = await ElementosService.obtenerElementos();
                const subCatgFiltroNombre = categoriaFiltro === "computo" ? "Equipo de mesa" : "Equipo de edición";
                
                const filtrados = data.filter((item) => item.sub_catg === subCatgFiltroNombre);
                const activos = filtrados.filter((item) => item.est === 1);
                setEquiposDisponibles(activos);

                if (filtrados.length > 0) {
                    const primerElemento = filtrados[0];

                    setSubcatInfo({
                        nombre: subCatgFiltroNombre,
                        observacion: primerElemento.obse || "",
                        especificaciones: (primerElemento.componen || "")
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

    if (isLoading) {
        return (
            <div className="main-page-container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </div>
        );
    }
    return (
        <div className="main-page-container">
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

            {subcatInfo ? (
                <Card className="ficha-visual">
                    {/* ... (Contenido de Card) ... */}
                    <div className="ficha-header">
                        <div className="ficha-titulo">
                            <h2>{subcatInfo.nombre}</h2>
                            <p className="ficha-subtitulo">
                                Visualiza aquí los detalles generales de los equipos disponibles
                            </p>
                        </div>
                    </div>

                    <div className="ficha-body">
                        {/* ... (Descripción, Carrusel, Especificaciones) ... */}
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

                        <div className="equipos-disponibles-notif">
                            <span>
                                Equipos actualmente disponibles: {equiposDisponibles.length}
                            </span>
                        </div>
                    </div>

                    <div className="ficha-footer">
                        <Button className="boton-solicitar" onClick={handleShowModal} disabled={equiposDisponibles.length === 0}>
                            <span>Realizar solicitud</span>
                        </Button>
                    </div>
                </Card>
            ) : (
                <p className="text-center mt-4">{error || "No hay datos disponibles."}</p>
            )}
            <SolicitudModalForm
                show={showModal}
                handleHide={handleHideModal}
                equiposDisponibles={equiposDisponibles}
                userId={USER_ID}
            />
            
        </div>
    );
}

export default Datos_escritorio;