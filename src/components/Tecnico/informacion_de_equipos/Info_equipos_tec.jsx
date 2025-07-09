import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Footer from '../../Footer/Footer';
import ModalPeticion from './modal_informacion_E/Modal2';
import './Info_equipos_tec.css';
import Otromodal from './OTRO.MODAL/Otro_modal';
import Header_informacion from '../header_informacion_E/Header_informacion_E.jsx';



function Cuarta() {
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  return (
    <>
    <Header_informacion/>
      
      <div className='container_blanco'>
        <ListGroup>
          {[...Array(7)].map((_, index) => (
            <ListGroup.Item className='Conte1' key={index}>
              <div className='part1'>
                <h4 className='aja'>Detalle del equipo (Accesorios, número de serie)</h4>
                <Button className='vert' variant="primary" onClick={abrirModal}>
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
