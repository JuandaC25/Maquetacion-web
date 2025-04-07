import React from 'react';
import { Button, Alert } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';

function Admin() {
  return (
    <div>
      <h1>Este es Administrador</h1>
      <h3>Cambios prueba</h3>
    </div>
  );
}

function AdminPanel() { // Cambié el nombre a AdminPanel para evitar la duplicación
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
        ¡Esta es una alerta de éxito!
      </Alert>
    </div>
  );
}

export default AdminPanel; // Exporta el componente que quieres usar

