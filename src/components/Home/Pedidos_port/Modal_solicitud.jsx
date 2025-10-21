import React, { useState } from 'react';
import { Modal, Form, Button, ListGroup } from 'react-bootstrap';
import { crearSolicitud } from '../../../api/solicitudesApi.js';

const id_usuario = 1; 
const ESTADO_SOLI_INICIAL = 1;

const Soli_port_modal = ({ show, handleClose, equiposSeleccionados, onSolicitudEnviada }) => {
const [form, setForm] = useState({
  fecha_ini: "",
  hora_ini: "",
  fecha_fn: "",
  hora_fn: "",
  ambient: "",
  num_ficha: "",
  estadosoli: ESTADO_SOLI_INICIAL,
  id_usu: id_usuario,
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
};

const handleFormSubmit = async (e) => {
  e.preventDefault();
  if (equiposSeleccionados.length === 0) {
  alert("Por favor, selecciona al menos un equipo de portátil para la solicitud.");
  return;
}
const fechaInicio = new Date(`${form.fecha_ini}T${form.hora_ini}:00`);
const fechaFin = new Date(`${form.fecha_fn}T${form.hora_fn}:00`);
if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
  alert("El formato de fecha o hora es inválido.");
  return;
}
const dto = {
  fecha_ini: fechaInicio.toISOString(),
  fecha_fn: fechaFin.toISOString(),
  ambient: form.ambient,
  estadosoli: form.estadosoli,
  id_usu: form.id_usu,
  num_ficha: form.num_ficha,
  id_elemen: equiposSeleccionados.map(eq => eq.id), 
};

try {
const resultado = await crearSolicitud(dto);
  console.log("Solicitud realizada:", resultado);
    alert("Solicitud realizada correctamente ✅");
      if (onSolicitudEnviada) {
        onSolicitudEnviada();
      }
setForm({
    fecha_ini: "",
    hora_ini: "",
    fecha_fn: "",
    hora_fn: "",
    ambient: "",
    num_ficha: "",
    estadosoli: ESTADO_SOLI_INICIAL,
    id_usu: id_usuario,
    });
handleClose(); 

} catch (err) {
    console.error("Error en la solicitud:", err);
    alert(`Hubo un problema al realizar la solicitud: ${err.message || "Añada un usuario para la solicitud"}`);
}
};
const selectedEquiposDetails = equiposSeleccionados.map(equipo => (
  <ListGroup.Item key={equipo.id}>
  {equipo.nombre || equipo.name}
    </ListGroup.Item>
));

return (
<Modal show={show} onHide={handleClose} centered>
    <Modal.Header closeButton>
       <Modal.Title className="modal-title">Realizar Solicitud</Modal.Title>
    </Modal.Header>
<Modal.Body className="modal-form">
<Form onSubmit={handleFormSubmit}>
  <div className="form-section-title">Detalles de la Solicitud</div>
<Form.Group className="mb-3">
<Form.Label>Fecha y Hora de Inicio</Form.Label>
<div className="row g-2">
  <div className="col-md-6">
    <Form.Control type="date" name="fecha_ini" value={form.fecha_ini} onChange={handleChange} required />
</div>
<div className="col-md-6">
   <Form.Control type="time" name="hora_ini" value={form.hora_ini} onChange={handleChange} required />
  </div>
</div>
</Form.Group>
<Form.Group className="mb-3">
  <Form.Label>Fecha y Hora de Fin</Form.Label>
   <div className="row g-2">
     <div className="col-md-6">
        <Form.Control type="date" name="fecha_fn" value={form.fecha_fn} onChange={handleChange} required />
</div>
<div className="col-md-6">
  <Form.Control type="time" name="hora_fn" value={form.hora_fn} onChange={handleChange} required />
</div>
</div>
</Form.Group>
<Form.Group className="mb-3">
    <div className="row g-2">
        <div className="col-md-6">
            <Form.Label>Ambiente</Form.Label>
            <Form.Control type="text" placeholder="Ej: Ambiente 301" name="ambient" value={form.ambient} onChange={handleChange} required />
        </div>
<div className="col-md-6">
    <Form.Label>Número de ficha</Form.Label>
    <Form.Control type="text" placeholder="Ej: 2560014" name="num_ficha" value={form.num_ficha} onChange={handleChange} required />
</div>
</div>
</Form.Group>
<div className="form-section-title mt-4">Equipos Incluidos ({equiposSeleccionados.length})</div>
<ListGroup className="mb-3">
    {selectedEquiposDetails.length > 0 ? selectedEquiposDetails : <p className="p-2">No hay equipos en la lista.</p>}
</ListGroup>
<div className="text-center mt-4">
    <Button variant="primary" type="submit" className="px-4" disabled={equiposSeleccionados.length === 0}>
      Enviar Solicitud
    </Button>
</div>
    </Form>
</Modal.Body>
</Modal>
);
};

export default Soli_port_modal;