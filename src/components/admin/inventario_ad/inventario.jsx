import React, { useState } from "react";
import { Button, Alert, Dropdown, Modal, Form } from "react-bootstrap";
import "./inventario.css";
import Footer from "../../Footer/Footer.jsx";
import HeaderInv from "../header_inv/header_inv.jsx";

const EquipoItem = ({ elemento, onVerClick }) => (
  <div className="ticket-item302">
    <div className="izquierda303">
      <div className="icono307">
        <span role="img" aria-label="computadora">🖥️</span>
      </div>
      <div className="estado308">
        <span>{elemento.nombre}</span>
      </div>
    </div>
    <div className="derecha304">
      <div className="folder306">
        <span role="img" aria-label="folder">📁</span>
      </div>
      <button className="ver-boton309" onClick={() => onVerClick(elemento)}>
        Ver
      </button>
    </div>
  </div>
);

const ListaEquipos = ({ elementos, onVerClick }) => (
  <div className="lista-tickets301">
    {elementos.map((el) => (
      <EquipoItem key={el.id} elemento={el} onVerClick={onVerClick} />
    ))}
  </div>
);

const DetallesEquipoModal = ({ show, onHide, detalles, onEliminar }) => {
  if (!detalles) return null;

  return (
    <Modal show={show} onHide={onHide} className="custom-modal315" centered>
      <Modal.Header closeButton className="modal-header-verde316">
        <Modal.Title>Detalles del Equipo</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body317">
        <div className="form-group-row310">
          <label className="form-label311">ID:</label>
          <div className="form-control-wrapper312">
            <Form.Control type="text" value={detalles.id} readOnly />
          </div>
        </div>
        <div className="form-group-row310">
          <label className="form-label311">Nombre:</label>
          <div className="form-control-wrapper312">
            <Form.Control type="text" value={detalles.nombre} readOnly />
          </div>
        </div>
        <div className="form-group-row310">
          <label className="form-label311">Categoría:</label>
          <div className="form-control-wrapper312">
            <Form.Control type="text" value={detalles.categoria} readOnly />
          </div>
        </div>
        <div className="form-group-row310">
          <label className="form-label311">Accesorios:</label>
          <div className="form-control-wrapper312">
            <Form.Control type="text" value={detalles.accesorios} readOnly />
          </div>
        </div>
        <div className="form-group-row310">
          <label className="form-label311">Número de serie:</label>
          <div className="form-control-wrapper312">
            <Form.Control type="text" value={detalles.serie} readOnly />
          </div>
        </div>
        <div className="form-group-row310">
          <label className="form-label311">Observaciones:</label>
          <div className="form-control-wrapper312">
            <Form.Control as="textarea" rows={3} value={detalles.observaciones} readOnly />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer318">
        <Button variant="danger" size="sm" onClick={() => onEliminar(detalles.id)}>
          Eliminar
        </Button>
        <Button variant="secondary" size="sm" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const NuevoEquipoModal = ({ show, onHide, nuevoEquipo, onChange, onSubmit }) => (
  <Modal show={show} onHide={onHide} className="custom-modal315" centered>
    <Modal.Header closeButton className="modal-header-verde316">
      <Modal.Title>Añadir Equipo</Modal.Title>
    </Modal.Header>
    <Modal.Body className="modal-body317">
      <div className="form-group-row310">
        <label className="form-label311" htmlFor="id">Id del elemento</label>
        <div className="form-control-wrapper312">
          <Form.Control type="number" id="id" value={nuevoEquipo.id} onChange={onChange} />
        </div>
      </div>
      <div className="form-group-row310 mt-2">
        <label className="form-label311" htmlFor="nombre">Nombre del elemento</label>
        <div className="form-control-wrapper312">
          <Form.Control type="text" id="nombre" value={nuevoEquipo.nombre} onChange={onChange} />
        </div>
      </div>
      <div className="form-group-row310 mt-2">
        <label className="form-label311" htmlFor="categoria">Categoría</label>
        <div className="form-control-wrapper312">
          <Form.Select id="categoria" value={nuevoEquipo.categoria} onChange={onChange}>
            <option value="">Seleccionar...</option>
            <option>Portátil</option>
            <option>Equipos de escritorio</option>
            <option>Televisores</option>
          </Form.Select>
        </div>
      </div>
      <div className="form-group-row310 mt-2">
        <label className="form-label311" htmlFor="accesorios">Accesorios</label>
        <div className="form-control-wrapper312">
          <Form.Control type="text" id="accesorios" value={nuevoEquipo.accesorios} onChange={onChange} />
        </div>
      </div>
      <div className="form-group-row310 mt-2">
        <label className="form-label311" htmlFor="serie">Número de serie</label>
        <div className="form-control-wrapper312">
          <Form.Control type="text" id="serie" value={nuevoEquipo.serie} onChange={onChange} />
        </div>
      </div>
      <div className="form-group-row310 mt-2">
        <label className="form-label311" htmlFor="observaciones">Observaciones</label>
        <div className="form-control-wrapper312">
          <Form.Control as="textarea" rows={3} id="observaciones" value={nuevoEquipo.observaciones} onChange={onChange} />
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer className="modal-footer318">
      <Button variant="secondary" onClick={onHide}>
        Cancelar
      </Button>
      <Button variant="success" onClick={onSubmit}>
        Añadir Equipo
      </Button>
    </Modal.Footer>
  </Modal>
);

const Admin = () => {
  const [elementosInventario, setElementosInventario] = useState([
    { id: "1", nombre: "Laptop Dell XPS 13", categoria: "Portátil", accesorios: "Cargador, Mouse inalámbrico", serie: "DELLXPS13-ABC", observaciones: "Excelente rendimiento para trabajo y estudio." },
    { id: "2", nombre: "PC de Escritorio HP Pavilion", categoria: "Equipos de escritorio", accesorios: "Teclado, Mouse, Monitor 24''", serie: "HPPV-XYZ-456", observaciones: "Ideal para oficina y tareas diarias." },
    { id: "3", nombre: "Smart TV Samsung QLED 55''", categoria: "Televisores", accesorios: "Control remoto, Cable HDMI", serie: "SAMQLED55-QWE-789", observaciones: "Imagen 4K impresionante, perfecto para entretenimiento." },
    { id: "4", nombre: "Impresora Multifuncional Epson", categoria: "Impresoras", accesorios: "Cable USB, Cartuchos de tinta", serie: "EPSONMF-123-ABC", observaciones: "Funcionalidad de impresión, copia y escaneo." },
    { id: "5", nombre: "Proyector Optoma HD", categoria: "Proyectores", accesorios: "Cable de alimentación, Control remoto", serie: "OPTHD-456-DEF", observaciones: "Ideal para presentaciones y cine en casa, buena luminosidad." },
    { id: "6", nombre: "Laptop Lenovo ThinkPad T14", categoria: "Portátil", accesorios: "Cargador USB-C", serie: "LENOVO-T14-789-GHI", observaciones: "Diseño robusto y batería de larga duración, enfocado en productividad." },
    { id: "7", nombre: "Monitor LG UltraGear 27'' Gaming", categoria: "Monitores", accesorios: "Cable DisplayPort", serie: "LGUG27-GHI-JKL", observaciones: "Alta tasa de refresco para gaming, colores vibrantes." },
  ]);

  const [showDetalles, setShowDetalles] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [showNuevo, setShowNuevo] = useState(false);
  const [nuevoEquipo, setNuevoEquipo] = useState({
    id: "",
    nombre: "",
    categoria: "",
    accesorios: "",
    serie: "",
    observaciones: "",
  });

  const openDetalles = (equipo) => {
    setEquipoSeleccionado(equipo);
    setShowDetalles(true);
  };

  const closeDetalles = () => {
    setShowDetalles(false);
    setEquipoSeleccionado(null);
  };

  const eliminarEquipo = (id) => {
    setElementosInventario((prev) => prev.filter((e) => e.id !== id));
    closeDetalles();
  };

  const openNuevo = () => setShowNuevo(true);

  const closeNuevo = () => {
    setShowNuevo(false);
    setNuevoEquipo({ id: "", nombre: "", categoria: "", accesorios: "", serie: "", observaciones: "" });
  };

  const handleNuevoChange = (e) => {
    const { id, value } = e.target;
    setNuevoEquipo((prev) => ({ ...prev, [id]: value }));
  };

  const submitNuevo = () => {
    if (!nuevoEquipo.id || !nuevoEquipo.nombre) {
      alert("ID y nombre son obligatorios");
      return;
    }
    setElementosInventario((prev) => [...prev, nuevoEquipo]);
    closeNuevo();
  };

  return (
    <div>
      <HeaderInv />
      <Alert variant="success" className="alert301 d-flex justify-content-between align-items-center">
        <strong>INVENTARIO</strong>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Categoría
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Portátiles</Dropdown.Item>
            <Dropdown.Item>Equipos de escritorio</Dropdown.Item>
            <Dropdown.Item>Televisores</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Button className="añadir-boton322" onClick={openNuevo}>
          Añadir Equipo
        </Button>
      </Alert>
      <ListaEquipos elementos={elementosInventario} onVerClick={openDetalles} />
      <DetallesEquipoModal
        show={showDetalles}
        onHide={closeDetalles}
        detalles={equipoSeleccionado}
        onEliminar={eliminarEquipo}
      />
      <NuevoEquipoModal
        show={showNuevo}
        onHide={closeNuevo}
        nuevoEquipo={nuevoEquipo}
        onChange={handleNuevoChange}
        onSubmit={submitNuevo}
      />
      <Footer />
    </div>
  );
};

export default Admin;

