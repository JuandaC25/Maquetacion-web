import React from 'react';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import Pagination from 'react-bootstrap/Pagination';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
const ConsultaItem = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

    <div className="piepor">
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
    <footer id='Pie_pag'><h1>Tech.Inventory/Sena</h1></footer>
    </div>
    
  );
};

function Soli_Port() {
  return (
    <div className="Usu-container">
      <div className='general'>
      <div className="icon-container">
        <FaBars />
      </div>
      <div id='h1head'>
      <h1>Solicitar portatiles</h1>
      </div>
      <div className="custom-buttons-container">
        <Button variant="link">Home</Button>
        <Button variant="link">Blog CEET</Button>
        <div className="custom-3-container">
          <FaUserCircle />
        </div>
      </div>
      </div>

      
      <ListaConsultas />
    </div>
  );
}

export default Soli_Port;
