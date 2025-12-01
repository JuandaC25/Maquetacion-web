import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { crearSolicitud } from "../../../../api/solicitudesApi";
import { obtenerCategoria } from "../../../../api/CategoriaApi";
import { obtenerSubcategorias } from "../../../../api/SubcategotiaApi";
import { obtenerEspacio } from "../../../../api/EspaciosApi";

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
 * @param {Array<object>} equiposDisponibles
 * @param {number} userId
 */
function SolicitudModalForm({ show, handleHide, equiposDisponibles, userId }) {
    const [minHoraInicio, setMinHoraInicio] = useState(getMinTime());
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [espacios, setEspacios] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initialFormState = {
        fecha_ini: todayDate,
        hora_ini: getMinTime(),
        fecha_fn: todayDate,
        hora_fn: "",
        ambient: "",
        cantid: "1", 
        id_elemen: equiposDisponibles.length > 0 ? equiposDisponibles[0].id_elemen.toString() : "", 
        estadosoli: 1, 
        id_usu: userId, 
        num_ficha: "",
        id_categoria: "", 
        id_subcategoria: "", 
        id_esp: "", 
    };

    const [form, setForm] = useState(initialFormState);
    useEffect(() => {
        setForm(prevForm => ({
            ...initialFormState,
            id_elemen: equiposDisponibles.length > 0 ? equiposDisponibles[0].id_elemen.toString() : "",
            id_usu: userId,
        }));
    }, [equiposDisponibles, show, userId]);
    useEffect(() => {
        obtenerCategoria()
            .then(data => setCategorias(data))
            .catch(err => console.error("Error al cargar categorías:", err));
            
        obtenerEspacio()
            .then(data => setEspacios(data))
            .catch(err => console.error("Error al cargar espacios:", err));
    }, []);

    useEffect(() => {
        if (form.id_categoria) {
            obtenerSubcategorias(form.id_categoria) 
                .then(data => {
                    setSubcategorias(data);
                    setForm(prevForm => ({ ...prevForm, id_subcategoria: "" }));
                })
                .catch(err => console.error("Error al cargar subcategorías:", err));
        } else {
            setSubcategorias([]);
        }
    }, [form.id_categoria]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
        if (name === "fecha_ini" || name === "hora_ini") {
            if (name === "fecha_ini" && value > prevForm.fecha_fn && prevForm.fecha_fn) {
                setForm(prevForm => ({ ...prevForm, fecha_fn: value }));
            }
        }
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
        const fechaInicio = new Date(`${form.fecha_ini}T${form.hora_ini}:00`);
        const fechaFin = new Date(`${form.fecha_fn}T${form.hora_fn}:00`);

        if (fechaFin <= fechaInicio) {
            alert("La fecha y hora de fin debe ser posterior a la de inicio.");
            setIsSubmitting(false);
            return;
        }
        const dto = {
            fecha_ini: `${form.fecha_ini}T${form.hora_ini}:00`, 
            fecha_fn: `${form.fecha_fn}T${form.hora_fn}:00`, 
            ambient: form.ambient,
            num_fich: form.num_ficha ? parseInt(form.num_ficha, 10) : null, 
            cantid: parsedCantid, 
            id_estado_soli: form.estadosoli,
            id_categoria: form.id_categoria ? parseInt(form.id_categoria, 10) : null,
            id_subcategoria: form.id_subcategoria ? parseInt(form.id_subcategoria, 10) : null,
            id_usu: form.id_usu,
            id_esp: form.id_esp ? parseInt(form.id_esp, 10) : null,
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
    const elementosFiltradosPorSubcategoria = equiposDisponibles.filter(equipo => {
        return true;
    });
    const maxCantidad = equiposDisponibles.length;

    return (
        <Modal show={show} onHide={handleHide} centered>
            <Modal.Header className="Modal_hea" closeButton>
                <Modal.Title className="Txt_modal_header">Realizar Solicitud</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleFormSubmit}>
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
                                <option key={sub.id} value={sub.id}>{sub.nom_subcateg}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
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
                    <Form.Group className="mb-3">
                        <Form.Label>Espacio (Opcional)</Form.Label>
                        <Form.Control
                            as="select"
                            name="id_esp"
                            value={form.id_esp}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona un espacio (Opcional)</option>
                            {espacios.map(esp => (
                                <option key={esp.id_esp} value={esp.id_esp}>{esp.nom_esp}</option>
                            ))}
                        </Form.Control>
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

export default SolicitudModalForm;