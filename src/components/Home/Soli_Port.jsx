import React from 'react';
import { Button, Alert } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import Dropdown from 'react-bootstrap/Dropdown';
import Pagination from 'react-bootstrap/Pagination';


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
        <button className="ver-boton" href="Formulario-pedidos-portatiles">Ver</button>
      </div>
    </div>
  );
};

const ListaConsultas = () => {
  const elementos = new Array(8).fill(null); 
  return (
    <div name="lista-inventario">
      {elementos.map((_, i) => (
        <ConsultaItem key={i} />
      ))}

    <Pagination id='Pag_form'>
      <Pagination.First />
      <Pagination.Prev />
      <Pagination.Item>{1}</Pagination.Item>
      <Pagination.Ellipsis />

      <Pagination.Item>{10}</Pagination.Item>
      <Pagination.Item>{11}</Pagination.Item>
      <Pagination.Item active>{12}</Pagination.Item>
      <Pagination.Item>{13}</Pagination.Item>
      <Pagination.Item disabled>{14}</Pagination.Item>

      <Pagination.Ellipsis />
      <Pagination.Item>{20}</Pagination.Item>
      <Pagination.Next />
      <Pagination.Last />
    </Pagination>
    </div>
  );
};

function Soli_Port() {
  return (
    <div className="admin-container">
      <div className="icon-container">
        <FaBars />
      </div>
      <h1>Solicitar portatiles</h1>

      <div className="custom-buttons-container">
        <Button variant="custom-1">Home</Button>
        <Button variant="custom-2">Blog CEET</Button>
        <div className="custom-3-container">
          <FaUserCircle />
        </div>
      </div>

      <Alert variant="success" className="d-flex justify-content-between align-items-center">

      </Alert>
      <ListaConsultas />
    </div>
  );
}

export default Soli_Port;
