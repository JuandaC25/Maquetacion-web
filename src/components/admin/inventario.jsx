import React from 'react';
import { Button, Alert, Dropdown } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./estilos_admin.css";
import Footer from '../Footer/Footer';
import Header_Inv from "./header_inv/header_inv.jsx"

const ConsultaItem = () => {
  return (
    <div className="ticket-item">
      <div className="izquierda">
        <div className="icono" role="img" aria-label="computadora">🖥️</div>
        <div className="estado">
          <span>Detalles del equipo</span>
        </div>
      </div>
      <div className="derecha">
        <div className="folder" role="img" aria-label="folder">📁</div>
        <button className="ver-boton">ver</button>
      </div>
    </div>
  );
};

const ListaConsultas = () => {
  const elementos = new Array(7).fill(null); 
  return (
    <div name="lista-inventario">
      {elementos.map((_, i) => (
        <ConsultaItem key={i} />
      ))}
    </div>
  );
};

const Admin = () => {
  return (
    <div>
      <Header_Inv/>
      <Alert variant="success" className="d-flex justify-content-between align-items-center">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Portátiles
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Portátiles</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Equipos de escritorio</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Televisores</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Button className="añadir-boton">Añadir</Button>
      </Alert>
      <ListaConsultas />
      <Footer />
    </div>
  );
};

export default Admin;
