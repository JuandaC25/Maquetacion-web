import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Footer from '../../Footer/Footer';
import ModalPeticion from './modal_informacion_E/Modal2';
import './Info_equipos_tec.css';
import Otromodal from './OTRO.MODAL/Otro_modal';
import Header_informacion from '../header_informacion_E/Header_informacion_E.jsx';
import Carousel from 'react-bootstrap/Carousel';


function Cuarta() {
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  return (
    <>
     <Header_informacion/>
     <div className='carrusel'>

      <Carousel data-bs-theme="dark">
          <Carousel.Item>
            <div className='carrusel_1'>
              
              <div className='reportes'>
             
              <h3>DETALLES DEL EQUIPO</h3>
              
              <div className='pcesito'>
               <img src="/imagenes/computadorcito.png" alt="computador" className='comp' />
              </div>
              <h5 className='izquierdita'>Modelo equipo:</h5><h6>Hp Victus</h6>
              <Button className='buttoninfo'  onClick={abrirModal}>Abrir</Button>
              </div>
               <div className='reportes'>
              <h3>DETALLES DEL EQUIPO</h3>
              <div className='pcesito'>
                 <img src="/imagenes/computadorcito.png" alt="computador" className='comp' />

              </div>
              <h5 className='izquierdita'>Modelo equipo:</h5><h6>Hp Victus</h6>
              <Button className='buttoninfo'  onClick={abrirModal}>Abrir</Button>
              </div>
              
              <div className='reportes'>
              <h3>DETALLES DEL EQUIPO</h3>
              <div className='pcesito'>
                 <img src="/imagenes/computadorcito.png" alt="computador" className='comp' />

              </div>
              <h5 className='izquierdita'>Modelo equipo:</h5><h6>Hp Victus</h6>
              <Button className='buttoninfo'  onClick={abrirModal}>Abrir</Button>
              </div>
              <div className='reportes'>
              <h3>DETALLES DEL EQUIPO</h3>
              <div className='pcesito'>
                 <img src="/imagenes/computadorcito.png" alt="computador" className='comp' />

              </div>
              <h5 className='izquierdita'>Modelo equipo:</h5><h6>Hp Victus</h6>
              <Button className='buttoninfo'  onClick={abrirModal}>Abrir</Button>
              </div>
            </div>
             
            </Carousel.Item>
            <Carousel.Item>
            <div className='carrusel_1'>
              <div className='reportes'>
              <h3>DETALLES DEL EQUIPO</h3>
              <div className='pcesito'>
                 <img src="/imagenes/computadorcito.png" alt="computador" className='comp' />

              </div>
              <h5 className='izquierdita'>Modelo equipo:</h5><h6>Hp Victus</h6>
              <Button className='buttoninfo'  onClick={abrirModal}>Abrir</Button>
              </div>
               <div className='reportes'>
              <h3>DETALLES DEL EQUIPO</h3>
              <div className='pcesito'>
                 <img src="/imagenes/computadorcito.png" alt="computador" className='comp' />

              </div>
              <h5 className='izquierdita'>Modelo equipo:</h5><h6>Hp Victus</h6>
              <Button className='buttoninfo'  onClick={abrirModal}>Abrir</Button>
              </div>
              <div className='reportes'>
              <h3>DETALLES DEL EQUIPO</h3>
              <div className='pcesito'>
                 <img src="/imagenes/computadorcito.png" alt="computador" className='comp' />

              </div>
              <h5 className='izquierdita'>Modelo equipo:</h5><h6>Hp Victus</h6>
              <Button className='buttoninfo'  onClick={abrirModal}>Abrir</Button>
              </div>
              <div className='reportes'>
              <h3>DETALLES DEL EQUIPO</h3>
              <div className='pcesito'>
                 <img src="/imagenes/computadorcito.png" alt="computador" className='comp' />

              </div>
              <h5 className='izquierdita'>Modelo equipo:</h5><h6>Hp Victus</h6>
              <Button className='buttoninfo'  onClick={abrirModal}>Abrir</Button>
              </div>
            </div>    
              
            </Carousel.Item>
            <Carousel.Item>
              <div className='carrusel_1'>
              <div className='reportes'>
              <h3>DETALLES DEL EQUIPO</h3>
              <div className='pcesito'>
                 <img src="/imagenes/computadorcito.png" alt="computador" className='comp' />

              </div>
              <h5 className='izquierdita'>Modelo equipo:</h5><h6>Hp Victus</h6>
              <Button className='buttoninfo'  onClick={abrirModal}>Abrir</Button>
              </div>
               <div className='reportes'>
              <h3>DETALLES DEL EQUIPO</h3>
              <div className='pcesito'>
                 <img src="/imagenes/computadorcito.png" alt="computador" className='comp' />

              </div>
              <h5 className='izquierdita'>Modelo equipo:</h5><h6>Hp Victus</h6>
              <Button className='buttoninfo'  onClick={abrirModal}>Abrir</Button>
              </div>
              <div className='reportes'>
              <h3>DETALLES DEL EQUIPO</h3>
              <div className='pcesito'>
                 <img src="/imagenes/computadorcito.png" alt="computador" className='comp' />

              </div>
              <h5 className='izquierdita'>Modelo equipo:</h5><h6>Hp Victus</h6>
              <Button className='buttoninfo'  onClick={abrirModal}>Abrir</Button>
              </div>
              <div className='reportes'>
              <h3>DETALLES DEL EQUIPO</h3>
              <div className='pcesito'>
                 <img src="/imagenes/computadorcito.png" alt="computador" className='comp' />

              </div>
              <h5 className='izquierdita'>Modelo equipo:</h5><h6>Hp Victus</h6>
              <Button className='buttoninfo'  onClick={abrirModal}>Abrir</Button>
              </div>
            </div>
            <ModalPeticion show={mostrarModal} onHide={cerrarModal} />

              
          </Carousel.Item>
      </Carousel>
    </div>

      <Footer />
    </>
  );
  
}


export default Cuarta;
