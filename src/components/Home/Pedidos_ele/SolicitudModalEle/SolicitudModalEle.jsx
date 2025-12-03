import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { crearSolicitud } from "../../../../api/solicitudesApi";
import { obtenerCategoria } from "../../../../api/CategoriaApi";
import { obtenerSubcategorias } from "../../../../api/SubcategotiaApi";

/**
 * @returns {string} Fecha actual en formato YYYY-MM-DD.
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
    const adjustedTime = new Date(now.getTime() + 60000);
    const adjustedHh = String(adjustedTime.getHours()).padStart(2, "0");
    const adjustedMm = String(adjustedTime.getMinutes()).padStart(2, "0");
    return `${adjustedHh}:${adjustedMm}`;
};

const todayDate = getMinMaxDate();

// --- COMPONENTE PRINCIPAL ---

/**
 * Componente de Modal con Formulario de Solicitud.
 * @param {object} props
 * @param {boolean} show
 * @param {function} handleHide
 * @param {number} userId
 */
function SolicitudModalEle({ show, handleHide, equiposDisponibles, userId }) {
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Define el estado inicial completo fuera del componente para evitar redefiniciones
    const getInitialFormState = (equipos, id) => ({
        fecha_ini: todayDate,
        hora_ini: getMinTime(),
        fecha_fn: todayDate,
        hora_fn: "",
        ambient: "",
        cantid: "1",
        id_elemen: equipos.length > 0 ? equipos[0].id_elemen.toString() : "",
        estadosoli: 1,
        id_usu: id,
        num_ficha: "",
        id_categoria: "",
        id_subcategoria: "",
    });

    const [form, setForm] = useState(getInitialFormState(equiposDisponibles, userId));

    // Reinicia el estado del formulario al abrir el modal o cambiar el ID de usuario/equipos
    useEffect(() => {
        if (show) {
            setForm(getInitialFormState(equiposDisponibles, userId));
        }
    }, [equiposDisponibles, show, userId]);

    useEffect(() => {
        obtenerCategoria()
            .then(data => {
                const categoriasFiltradas = data.filter(cat => cat.nom_cat !== "Multimedia");
                setCategorias(categoriasFiltradas);
            })
            .catch(err => console.error("Error al cargar categorías:", err));
    }, []);

    // Carga las subcategorías basadas en la categoría seleccionada
    useEffect(() => {
        const subcategoriasExcluidas = [
            "Equipo de mesa",
            "Equipo de edicion",
            "Portatil",
            "Portatil de edicion"
        ];

        if (form.id_categoria) {
            obtenerSubcategorias(form.id_categoria)
                .then(data => {
                    const subcategoriasFiltradas = data.filter(
                        sub => !subcategoriasExcluidas.includes(sub.nom_subcateg)
                    );
                    setSubcategorias(subcategoriasFiltradas);
                    // Importante: Reiniciar la subcategoría al cambiar de categoría
                    setForm(prevForm => ({ ...prevForm, id_subcategoria: "" }));
                })
                .catch(err => console.error("Error al cargar subcategorías:", err));
        } else {
            setSubcategorias([]);
            setForm(prevForm => ({ ...prevForm, id_subcategoria: "" }));
        }
    }, [form.id_categoria]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        
        setForm(prevForm => {
            let newState = { ...prevForm, [name]: value };

            // Lógica para sincronizar fechas
            if (name === "fecha_ini" && value > prevForm.fecha_fn && prevForm.fecha_fn) {
                newState.fecha_fn = value;
            }
            
            // Si cambia la categoría, también se resetea la subcategoría para forzar la recarga
            if (name === "id_categoria") {
                newState.id_subcategoria = ""; 
            }
            
            return newState;
        });

    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const parsedCantid = parseInt(form.cantid, 10);
        
        if (isNaN(parsedCantid) || parsedCantid <= 0 || parsedCantid > equiposDisponibles.length) {
            alert(`La cantidad a solicitar debe ser un número positivo (1-${equiposDisponibles.length})`);
            setIsSubmitting(false);
            return;
        }

        if (!form.id_elemen) {
            alert("Debes seleccionar un equipo específico para realizar la solicitud.");
            setIsSubmitting(false);
            return;
        }
        
        // Validación de fechas
        const fechaInicio = new Date(`${form.fecha_ini}T${form.hora_ini}:00`);
        const fechaFin = new Date(`${form.fecha_fn}T${form.hora_fn}:00`);

        if (fechaFin <= fechaInicio) {
            alert("La fecha y hora de fin debe ser posterior a la de inicio.");
            setIsSubmitting(false);
            return;
        }
        
        // 🚀 LÍNEA DE DIAGNÓSTICO CRUCIAL 🚀
        console.log("-----------------------------------------");
        console.log("DIAGNÓSTICO REACT: Valor de id_subcategoria antes de enviar:", form.id_subcategoria);
        console.log("-----------------------------------------");
        // FIN DEL DIAGNÓSTICO

        // Construcción del DTO (Data Transfer Object) para la API
        const dto = {
            fecha_ini: `${form.fecha_ini}T${form.hora_ini}:00`,
            fecha_fn: `${form.fecha_fn}T${form.hora_fn}:00`,
            ambient: form.ambient,
            num_fich: form.num_ficha ? parseInt(form.num_ficha, 10) : null,
            cantid: parsedCantid,
            id_estado_soli: form.estadosoli,
            id_categoria: form.id_categoria ? parseInt(form.id_categoria, 10) : null,
            // Aquí se envía el ID de subcategoría capturado del formulario
            id_subcategoria: form.id_subcategoria ? parseInt(form.id_subcategoria, 10) : null,
            id_usu: form.id_usu,
            ids_elem: form.id_elemen ? [parseInt(form.id_elemen, 10)] : [],
        };

        try {
            await crearSolicitud(dto);
            alert("Solicitud realizada correctamente ✅");
            handleHide();
        } catch (err) {
            console.error("Error al realizar la solicitud:", err);
            alert(`Hubo un problema al enviar la solicitud: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const maxCantidad = equiposDisponibles.length;

    return (
        <Modal show={show} onHide={handleHide} centered>
            <Modal.Header className="Modal_hea" closeButton>
                <Modal.Title className="Txt_modal_header">Realizar Solicitud</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleFormSubmit}>
                    
                    {/* Campo Categoría */}
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
                            {categorias.map(cat => (
                                <option key={cat.id_cat} value={cat.id_cat}>{cat.nom_cat}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    
                    {/* Campo Subcategoría */}
                    <Form.Group className="mb-3">
                        <Form.Label>Subcategoría</Form.Label>
                        <Form.Control
                            as="select"
                            name="id_subcategoria"
                            value={form.id_subcategoria}
                            onChange={handleChange}
                            required
                            disabled={!form.id_categoria || subcategorias.length === 0}
                        >
                            <option value="">Selecciona una subcategoría</option>
                            {subcategorias.map(sub => (
                                <option 
                                    key={sub.id_subcateg} 
                                    value={sub.id_subcateg} 
                                >
                                    {sub.nom_subcateg}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    
                    {/* Campo Selección de Equipo Específico */}
                    <Form.Group className="mb-3">
                        <Form.Label>Selecione el equipo</Form.Label>
                        <Form.Control
                            as="select"
                            name="id_elemen"
                            value={form.id_elemen}
                            onChange={handleChange}
                            required
                            disabled={maxCantidad === 0}
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
                            
                            {maxCantidad === 0 && (
                                <option value="" disabled>
                                    No hay equipos disponibles.
                                </option>
                            )}
                        </Form.Control>
                    </Form.Group>
                    
                    {/* Campo Cantidad */}
                    <Form.Group className="mb-3">
                        <Form.Label>Cantidad a solicitar (Máx: {maxCantidad})</Form.Label>
                        <Form.Control
                            type="number"
                            name="cantid"
                            placeholder="Ej: 1"
                            value={form.cantid}
                            onChange={handleChange}
                            min="1"
                            max={maxCantidad.toString()}
                            required
                            disabled={maxCantidad === 0}
                        />
                    </Form.Group>
                    
                    {/* Campo Fechas y Horas */}
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
                                    max={todayDate}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <Form.Control
                                    type="time"
                                    name="hora_ini"
                                    value={form.hora_ini}
                                    onChange={handleChange}
                                    min={form.fecha_ini === todayDate ? getMinTime() : "00:00"}
                                    max="23:59"
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
                                    min={form.fecha_ini || todayDate}
                                    max={todayDate}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <Form.Control
                                    type="time"
                                    name="hora_fn"
                                    value={form.hora_fn}
                                    onChange={handleChange}
                                    min={form.fecha_fn === form.fecha_ini ? form.hora_ini : "00:00"}
                                    max="23:59"
                                    required
                                />
                            </div>
                        </div>
                    </Form.Group>
                    
                    {/* Campo Ambiente y Ficha */}
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
                        <Button variant="success" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    {' Enviando...'}
                                </>
                            ) : (
                                'Enviar Solicitud'
                            )}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default SolicitudModalEle;