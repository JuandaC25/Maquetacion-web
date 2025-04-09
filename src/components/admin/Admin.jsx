import React from 'react';
import { Button, Alert } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import Dropdown from 'react-bootstrap/Dropdown';
import "./estilos_admin.css";

const Ticketxd = ({ estado, ticket }) => {
  return (
    <div className="ticket-item">
      <div className="izquierda">
        <div className="icono">
          <span role="img" aria-label="computadora">🖥️</span>
        </div>
        <div className="estado">
          <span>{estado}</span>
        </div>
      </div>
      <div className="derecha">
        <div className="ticket">
          <span>{ticket}</span>
        </div>
        <div className="folder">
          <span role="img" aria-label="folder">📁</span>
        </div>
        <button className="ver-boton"><Observar></Observar></button>
      </div>
    </div>
  );
};

const Listaxd = () => {
  const tickets = [
    { estado: 'En proceso', ticket: 'Primer ticket' },
    { estado: 'En proceso', ticket: 'Segundo ticket' },
    { estado: 'Pendiente', ticket: 'Tercer ticket' },
    { estado: 'Pendiente', ticket: 'Primer ticket' },
    { estado: 'En proceso', ticket: 'Primer ticket' },
    { estado: 'Pendiente', ticket: 'Segundo ticket' },
    { estado: 'Pendiente', ticket: 'Primer ticket' },
    { estado: 'En proceso', ticket: 'Segundo ticket' },
  ];

  return (
    <div name="lista-tickets">
      {tickets.map((t, i) => (
        <Ticketxd key={i} estado={t.estado} ticket={t.ticket} />
      ))}
    </div>
  );
};

function Admin() {
  return (
    <div className="Admin-container">
      <div className="icon-container">
        <FaBars />
      </div>
      <h1>ESTADO DEL TICKET</h1>
      <div className="custom-buttons-container">
        <Button variant="custom-1">Home</Button>
        <Button variant="custom-2">Blog CEET</Button>
        <div className='custom-3-container'>
          <span></span>
          <FaUserCircle />
        </div>
      </div>
      <Alert variant="success">
        TICKET
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Elemento 
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">portatiles</Dropdown.Item>
            <Dropdown.Item href="#/action-2">equipos de escritorio</Dropdown.Item>
            <Dropdown.Item href="#/action-3">televisores</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Alert>
      <Listaxd />
    </div>
  );
}

export default Admin;