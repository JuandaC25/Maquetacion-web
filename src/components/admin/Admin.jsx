import React from 'react';
import { Button, Alert, Dropdown } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./estilos_admin.css";
import Footer from '../Footer/Footer';
import HeaderAd from './header_admin/header_ad.jsx';

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
        <button className="ver-boton">Ver</button>
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
    <div className="lista-tickets">
      <Alert variant="success">
        <strong>TICKET</strong>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Elemento
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Portátiles</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Equipos de escritorio</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Televisores</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Alert>

      {tickets.map((t, i) => (
        <Ticketxd key={i} estado={t.estado} ticket={t.ticket} />
      ))}
    </div>
  );
};

const Admin = () => {
  return (
    <div>
      <HeaderAd />
      <Listaxd />
      <Footer />
    </div>
  );
};

export default Admin;
