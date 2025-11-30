import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, ButtonGroup, ToggleButton, Carousel, Spinner } from "react-bootstrap";
import "./Pedidos_escritorio.css";
import ElementosService from "../../../api/ElementosApi";
import { crearSolicitud } from "../../../api/solicitudesApi";
import {obtenerCategoria} from "../../../api/CategoriaApi";
import {obtenerSubcategorias} from "../../../api/SubcategotiaApi"; 
import {obtenerEspacio} from "../../../api/EspaciosApi";
import { getCurrentUser } from "../../../api/http";

// --- FUNCIONES GLOBALES DE FECHA/HORA ---

/**
 * @returns {string} Fecha actual.
 */
const getMinMaxDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); 
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

/**
 * Obtiene la hora actual más un minuto en formato HH:mm.
 * @returns {string} Hora actual ajustada.
 */
const getMinTime = () => {
    const now = new Date();
    // Ajuste para la hora actual: la solicitud debe ser para el siguiente minuto
    const adjustedTime = new Date(now.getTime() + 60000); 
    const adjustedHh = String(adjustedTime.getHours()).padStart(2, "0");
    const adjustedMm = String(adjustedTime.getMinutes()).padStart(2, "0");
    return `${adjustedHh}:${adjustedMm}`;
};

const todayDate = getMinMaxDate();

function Datos_escritorio() {
    const [subcatInfo, setSubcatInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoriaFiltro, setCategoriaFiltro] = useState("computo");
    const [showModal, setShowModal] = useState(false);
    const [equiposDisponibles, setEquiposDisponibles] = useState([]);
    const [minHoraInicio, setMinHoraInicio] = useState(getMinTime());
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
        setMinHoraInicio(getMinTime());
        
        const firstEquipoId = equiposDisponibles.length > 0 ? equiposDisponibles[0].id_elemen.toString() : "";

        setForm(prevForm => ({ 
            ...prevForm, 
            cantid: "1", 
            id_elemen: firstEquipoId, 
            // Limpia los campos de IDs que el usuario debe seleccionar en el modal
            id_categoria: "",
            id_subcategoria: "",
            id_esp: "",
        })); 
        setShowModal(true);
    };

    const handleHideModal = () => {
        setShowModal(false);
        // Limpia solo los campos de la solicitud
        setForm(prevForm => ({
            ...prevForm,
            fecha_ini: "",
            hora_ini: "",
            fecha_fn: "",
            hora_fn: "",
            ambient: "",
            cantid: "1",
            id_elemen: "", 
            num_ficha: "",
            id_categoria: "", 
            id_subcategoria: "", 
            id_esp: "", 
        }));
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
                    // Limpiar IDs si no hay elementos
                    setForm(prevForm => ({
                        ...prevForm,
                        id_categoria: "",
                        id_subcategoria: "",
                        id_esp: "",
                    }));
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
        // Obtener usuario actual del localStorage/token
        const loadCurrentUser = async () => {
            try {
                const user = await getCurrentUser();
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

    // --- COMIENZO DEL RENDERIZADO ---
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

                        {/* Contador de equipos disponibles como texto pequeño arriba a la derecha */}
                        <div className="equipos-disponibles-notif">
                            <span>
                                Equipos actualmente disponibles: {equiposDisponibles.length}
                            </span>
                        </div>
                    </div>

                    <div className="ficha-footer">
                        <Button className="boton-solicitar" onClick={handleShowModal}>
                            <span>Realizar solicitud</span>
                        </Button>
                    </div>
                </Card>
            ) : (
                <p className="text-center mt-4">{error || "No hay datos disponibles."}</p>
            )}

            {/* Modal de solicitud */}
            <Modal show={showModal} onHide={handleHideModal} centered>
                <Modal.Header className="Modal_hea" closeButton>
                    <Modal.Title className="Txt_modal_header">Realizar Solicitud</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        {/* Dropdown Categoría */}
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Control
                                as="select"
                                name="id_categoria"
                                value={form.id_categoria}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                {/* Asumiendo que `categorias` tiene `id_cat` y `nom_cat` */}
                                {categorias.map(cat => (
                                    <option key={cat.id_cat} value={cat.id_cat}>{cat.nom_cat}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        {/* Dropdown Subcategoría */}
                        <Form.Group className="mb-3">
                            <Form.Label>Subcategoría</Form.Label>
                            <Form.Control
                                as="select"
                                name="id_subcategoria"
                                value={form.id_subcategoria}
                                onChange={handleChange}
                                required
                                disabled={!form.id_categoria} // Deshabilitado si no hay categoría seleccionada
                            >
                                <option value="">Selecciona una subcategoría</option>
                                {/* Asumiendo que `subcategorias` tiene `id` y `nom_subcateg` */}
                                {subcategorias.map(sub => (
                                    <option key={sub.id} value={sub.id}>{sub.nom_subcateg}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        {/* --- DROPDOWN 2: Elemento específico (Número de ficha) --- */}
                        <Form.Group className="mb-3">
                            <Form.Label>Selecione el equipo</Form.Label>
                            <Form.Control
                                as="select"
                                name="id_elemen"
                                value={form.id_elemen}
                                onChange={handleChange}
                                required
                                disabled={equiposDisponibles.length === 0}
                            >
                                <option value="">Selecciona el equipo a solicitar</option>
                                
                                {equiposDisponibles.map((equipo) => (
                                    <option 
                                        key={equipo.id_elemen} 
                                        value={equipo.id_elemen}
                                    >
                                        {equipo.num_ficha} - {equipo.sub_catg}
                                    </option>
                                ))}
                                
                                {equiposDisponibles.length === 0 && (
                                    <option value="" disabled>
                                        No hay equipos disponibles para esta subcategoría
                                    </option>
                                )}
                            </Form.Control>
                        </Form.Group>

                        {/* --- Campo: Cantidad de equipos --- */}
                        <Form.Group className="mb-3">
                            <Form.Label>Cantidad a solicitar (Máx: {equiposDisponibles.length})</Form.Label>
                            <Form.Control
                                type="number"
                                name="cantid"
                                placeholder="Ej: 1"
                                value={form.cantid}
                                onChange={handleChange}
                                min="1"
                                max={equiposDisponibles.length.toString()}
                                required
                            />
                        </Form.Group>
                        
                        {/* --- FECHA Y HORA DE INICIO --- */}
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha y Hora de Inicio</Form.Label>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <Form.Control
                                        type="date"
                                        name="fecha_ini"
                                        value={form.fecha_ini}
                                        onChange={handleChange}
                                        min={todayDate}
                                        max={todayDate} // Solo hoy
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Form.Control
                                        type="time"
                                        name="hora_ini"
                                        value={form.hora_ini}
                                        onChange={handleChange}
                                        min={minHoraInicio}
                                        max="23:59"
                                        required
                                    />
                                </div>
                            </div>
                        </Form.Group>

                        {/* --- FECHA Y HORA DE FIN --- */}
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha y Hora de Fin</Form.Label>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <Form.Control
                                        type="date"
                                        name="fecha_fn"
                                        value={form.fecha_fn}
                                        onChange={handleChange}
                                        min={form.fecha_ini || todayDate}
                                        max={todayDate} // Solo hoy
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Form.Control
                                        type="time"
                                        name="hora_fn"
                                        value={form.hora_fn}
                                        onChange={handleChange}
                                        // Min hora: Si es la misma fecha de inicio, debe ser después de hora_ini
                                        min={form.fecha_fn === form.fecha_ini ? form.hora_ini : "00:00"} 
                                        max="23:59"
                                        required
                                    />
                                </div>
                            </div>
                        </Form.Group>
                        
                        {/* --- CAMPOS AMBIENTE Y NÚMERO DE FICHA (Ficha del usuario) --- */}
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
                                    <Form.Label>Número de ficha (Usuario)</Form.Label>
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