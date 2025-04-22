import React from 'react';
import { Button, Alert } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import Dropdown from 'react-bootstrap/Dropdown';
import "./estilos_admin.css";


const ConsultaItem = () => {
  return (
    <div className="ticket-item">
      <div className="izquierda">
        <div className="estado">
          <span>Nombre,Correo,C.C.</span>
        </div>
      </div>
      <div className="derecha">
        <button className="ver-boton">Ver</button>
      </div>
    </div>
  );
};
const ListaConsultas = () => {
  const elementos = new Array(7).fill(null); 
  return (
    <div name="lista-crear">
      {elementos.map((_, i) => (
        <ConsultaItem key={i} />
      ))}
    </div>
  );
};
function adcrear() {
  return (
    <div className="admin-container">
      <div className="icon-container">
        <FaBars />
      </div>
      <h1 className="ticket-title">ESTADO DEL TICKET</h1>
      <div className="custom-buttons-container">
        <Button variant="custom-1">Home</Button>
        <Button variant="custom-2">Blog CEET</Button>
        <div className="custom-3-container">
          <FaUserCircle />
        </div>
      </div>
      <Alert variant="success" className="d-flex justify-content-between align-items-center">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Usuarios
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">instructores</Dropdown.Item>
            <Dropdown.Item href="#/action-2">tecnico</Dropdown.Item>
            <Dropdown.Item href="#/action-3">administrador</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Button className="añadir-boton">Añadir</Button>
      </Alert>
      <ListaConsultas />
    </div>
  );
}
export default adcrear;