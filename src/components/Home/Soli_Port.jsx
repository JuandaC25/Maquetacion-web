import React from 'react';
import { Button, Alert } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import Pagination from 'react-bootstrap/Pagination';
import './Soli_port.css';
const ConsultaItem = () => {

  return (
    <div className="ticket-item2">
      <div className="izquierda2">
        <div className="icono" role="img" aria-label="computadora">🖥️</div>
        <div className="estado1">
          <span>Detalles del equipo</span>
        </div>
      </div>
      <div className="derecha1">
        <button href='/Form_port' className="ver-boton">Ver</button>
      </div>
    </div>
  );
};

const ListaConsultas = () => {
  const elementos = new Array(8).fill(null); 
  return (
    <div name="lista-inventario1">
      {elementos.map((_, i) => (
        <ConsultaItem key={i} />
      ))}

    <div id="piepor">
    <Pagination>
      <Pagination.Prev/>
      <Pagination.Item  id="font">{1}</Pagination.Item>
      <Pagination.Item id="font">{2}</Pagination.Item>
      <Pagination.Item id="font">{3}</Pagination.Item>
      <Pagination.Ellipsis />
      <Pagination.Item  id="font">{10}</Pagination.Item>
      <Pagination.Next />
    </Pagination >
    </div>
    </div>
  );
};

function Soli_Port() {
  return (
    <div className="admin-container1">
      <div className='general2'>
      <div className="icon-container3">
        <FaBars />
      </div>
      <h1 id="h1">Solicitar portatiles</h1>

      <div className="custom-buttons-container1">
        <Button variant="custom-1">Home</Button>
        <Button variant="custom-2">Blog CEET</Button>
        <div className="custom-3-container3">
          <FaUserCircle />
        </div>
      </div>
      </div>
      <ListaConsultas />
    </div>
  );
}

export default Soli_Port;
