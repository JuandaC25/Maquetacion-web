import React from 'react';
import { Button, Alert } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import Dropdown from 'react-bootstrap/Dropdown';
import "./estilos_admin.css"

function admin() {
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
      <Alert variant="info">
        INFORMACIÓN DEL TICKET
      </Alert>

      <Alert variant="warning">
        ADVERTENCIA DEL TICKET
      </Alert>

      <Alert variant="danger">
        ERROR DEL TICKET
      </Alert>
    </div>
  );
}

export default admin;


