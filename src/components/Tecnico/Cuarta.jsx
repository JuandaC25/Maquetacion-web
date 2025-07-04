import './stile_tec.css';
import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Footer from '../Footer/Footer';
import HeaderTec from './HeaderTec';
import ModalPeticion from './Modal2';

function Cuarta() {
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  return (
    <>
      <HeaderTec />
      <div id="container_blanco">
        <ListGroup>
          {[...Array(10)].map((_, index) => (
            <ListGroup.Item id="Conte1" key={index}>
              <div id="part1">
                <h4 className='aja'>Detalle del equipo (Accesorios, número de serie)</h4>
                <Button id="vert" variant="primary" onClick={abrirModal}>
                  Tomar petición
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>

      {}
      <ModalPeticion show={mostrarModal} onHide={cerrarModal} />

      <Footer />
    </>
  );
}

export default Cuarta;
