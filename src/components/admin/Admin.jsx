import React from 'react';
import { Button, Alert } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';


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
        ¡Esta es una alerta de éxito!
      </Alert>
    </div>
  );
}


export default admin;


