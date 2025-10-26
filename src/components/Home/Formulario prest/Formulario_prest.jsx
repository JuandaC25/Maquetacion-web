import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

/**
 * Componente Modal para realizar la solicitud de equipos.
 *
 * @param {object} props - Propiedades del componente.
 * @param {boolean} props.showModal - Estado para mostrar/ocultar el modal.
 * @param {function} props.onHide - Función para cerrar el modal.
 * @param {object} props.form - Objeto de estado del formulario.
 * @param {function} props.handleChange - Manejador para actualizar los campos del formulario.
 * @param {function} props.handleFormSubmit - Manejador para el envío del formulario.
 */
function RequestModal({ showModal, onHide, form, handleChange, handleFormSubmit }) {
    return (
        <Modal show={showModal} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title className="modal-title">Realizar Solicitud</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-form">
                <Form onSubmit={handleFormSubmit}>
                    <div className="form-section-title">Detalles de la solicitud</div>

                    {/* Fecha y Hora de Inicio */}
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha y Hora de Inicio</Form.Label>
                        <div className="row g-2">
                            <div className="col-md-6">
                                <Form.Control
                                    type="date"
                                    name="fecha_ini"
                                    value={form.fecha_ini}
                                    onChange={handleChange}
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

                    {/* Fecha y Hora de Fin */}
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha y Hora de Fin</Form.Label>
                        <div className="row g-2">
                            <div className="col-md-6">
                                <Form.Control
                                    type="date"
                                    name="fecha_fn"
                                    value={form.fecha_fn}
                                    onChange={handleChange}
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

                    {/* Ambiente y Número de ficha */}
                    <Form.Group className="mb-3">
                        <div className="row g-2">
                            <div className="col-md-6">
                                <Form.Label>Ambiente</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ej: Ambiente 301"
                                    name="ambient"
                                    value={form.ambient}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <Form.Label>Número de ficha</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ej: 2560014"
                                    name="num_ficha"
                                    value={form.num_ficha}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </Form.Group>

                    {/* Botón de Enviar */}
                    <div className="text-center mt-4">
                        <Button variant="primary" type="submit" className="px-4">
                            Enviar Solicitud
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default RequestModal;