import React from 'react';
import { Button, Alert } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import Dropdown from 'react-bootstrap/Dropdown';


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

function Soli_Port() {
  return (
    <div className="admin-container">
      <div className="icon-container">
        <FaBars />
      </div>
      <h1>Consultar inventario</h1>

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
    </div>
  );
}

export default Soli_Port;
