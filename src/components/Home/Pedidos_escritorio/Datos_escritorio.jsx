// ... Mismo import y funciones de fecha/hora ...
import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, ButtonGroup, ToggleButton, Carousel, Spinner } from "react-bootstrap";
import "./Pedidos_escritorio.css";
import ElementosService from "../../../api/ElementosApi";
import SolicitudModalEscr from "./SolicitudModalEscr/SolicitudModalEscr";
import { crearSolicitud } from "../../../api/solicitudesApi";
import {obtenerCategoria} from "../../../api/CategoriaApi";
import {obtenerSubcategorias} from "../../../api/SubcategotiaApi"; 
import {obtenerEspacio} from "../../../api/EspaciosApi";
import { getCurrentUser } from "../../../api/http";

const USER_ID = 1; 

function Datos_escritorio() {
    const [subcatInfo, setSubcatInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoriaFiltro, setCategoriaFiltro] = useState("computo");
    const [showModal, setShowModal] = useState(false);
    const [equiposDisponibles, setEquiposDisponibles] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [espacios, setEspacios] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    const [form, setForm] = useState({
        fecha_ini: "",
        hora_ini: "",
        fecha_fn: "",
        hora_fn: "",
        ambient: "",
        cantid: "1", 
        id_elemen: "", 
        estadosoli: 1,
        num_ficha: "",
        id_categoria: "", 
        id_subcategoria: "", 
        id_esp: "", 
    });
    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleHideModal = () => {
        setShowModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // 1. Validaciones
        
        // Validación de cantidad
        const parsedCantid = parseInt(form.cantid, 10);
        if (isNaN(parsedCantid) || parsedCantid <= 0 || parsedCantid > equiposDisponibles.length) {
            alert(`La cantidad a solicitar debe ser un número positivo (1-${equiposDisponibles.length})`);
            return;
        }

        // Validación de elemento (equipo) específico
        if (!form.id_elemen) {
            alert("Debes seleccionar un equipo específico para realizar la solicitud.");
            return;
        }
        
        // 2. Validación y Formato de Fechas/Horas
        const fechaInicio = new Date(`${form.fecha_ini}T${form.hora_ini}:00`);
        const fechaFin = new Date(`${form.fecha_fn}T${form.hora_fn}:00`);

        if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
            alert("El formato de fecha u hora es inválido.");
            return;
        }
        
        if (fechaFin <= fechaInicio) {
            alert("La fecha y hora de fin debe ser posterior a la de inicio.");
            return;
        }

        const isoInicio = `${form.fecha_ini}T${form.hora_ini}:00`;
        const isoFin = `${form.fecha_fn}T${form.hora_fn}:00`;

        // Validar que tengamos el ID del usuario
        if (!currentUserId) {
            alert("Error: No se pudo obtener la información del usuario. Por favor inicia sesión nuevamente.");
            return;
        }

        // 3. Crear DTO (Data Transfer Object)
        const dto = {
            fecha_ini: isoInicio, 
            fecha_fn: isoFin, 
            ambient: form.ambient,
            
            // CONVERSIONES CRÍTICAS A NÚMEROS (Longs)
            num_fich: parseInt(form.num_ficha, 10), 
            cantid: parsedCantid, // Usamos la cantidad ya parseada y validada
            id_estado_soli: form.estadosoli,
            
            // IDs a Long o null 
            id_categoria: form.id_categoria ? parseInt(form.id_categoria, 10) : null,
            id_subcategoria: form.id_subcategoria ? parseInt(form.id_subcategoria, 10) : null,
            id_usu: currentUserId, // ID obtenido del token/usuario
            id_esp: form.id_esp ? parseInt(form.id_esp, 10) : null, 
            
            // ids_elem como array de números (Longs)
            ids_elem: form.id_elemen ? [parseInt(form.id_elemen, 10)] : [], 
        };
    
        // 4. Llamada a la API
        try {
            await crearSolicitud(dto);
            alert("Solicitud realizada correctamente ✅");
            handleHideModal(); 
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

    useEffect(() => {
        // Obtener usuario actual del token
        const loadCurrentUser = () => {
            try {
                const user = getCurrentUser();
                if (user && user.id) {
                    setCurrentUserId(user.id);
                    console.log('[USUARIO] ID cargado:', user.id);
                } else {
                    console.warn('[USUARIO] No se pudo obtener el ID del usuario');
                }
            } catch (err) {
                console.error('[USUARIO] Error al cargar usuario:', err);
            }
        };
        
        loadCurrentUser();
        
        // Cargar categorías y espacios al montar
        obtenerCategoria()
            .then(data => setCategorias(data))
            .catch(err => console.error("Error al cargar categorías:", err));
            
        obtenerEspacio()
            .then(data => setEspacios(data))
            .catch(err => console.error("Error al cargar espacios:", err));
    }, []);

    useEffect(() => {
        // Cargar subcategorías cuando cambia la categoría seleccionada
        if (form.id_categoria) {
            // Asegúrate que form.id_categoria sea el ID que espera tu API (Long o String)
            obtenerSubcategorias(form.id_categoria)
                .then(data => {
                    setSubcategorias(data);
                    // Asegúrate de resetear la subcategoría al cambiar la categoría.
                    setForm(prevForm => ({ ...prevForm, id_subcategoria: "" }));
                })
                .catch(err => console.error("Error al cargar subcategorías:", err));
        } else {
            setSubcategorias([]);
        }
    }, [form.id_categoria]);
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
            <SolicitudModalEscr
                show={showModal}
                handleHide={handleHideModal}
                equiposDisponibles={equiposDisponibles}
                userId={USER_ID}
            />
            
        </div>
    );
}

export default Datos_escritorio;