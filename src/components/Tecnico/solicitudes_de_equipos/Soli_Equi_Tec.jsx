import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import './Soli_Equi_Tec.css';
import Footer from '../../Footer/Footer';
import Button from 'react-bootstrap/Button';
import ModalFormulario from './modal_soli_E/FormularioModal/ModalFormulario';
import ConfirmacionModal from './modal_soli_E/ConfrirmacionModal/ConfirmacionModal';
import Header_solicitud_tec from '../header_solicitudes_equ_tec/Header_soli_equi_tec.jsx';
import { FaDesktop } from 'react-icons/fa';
import Carousel from 'react-bootstrap/Carousel';
import Dropdown from 'react-bootstrap/Dropdown';
function Tecnico() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const abrirFormulario = () => setMostrarFormulario(true);
  const cerrarFormulario = () => setMostrarFormulario(false);

  const abrirConfirmacion = () => setMostrarConfirmacion(true);
  const cerrarConfirmacion = () => setMostrarConfirmacion(false);

  const aceptarConfirmacion = () => {
    setMostrarConfirmacion(false);
    setMostrarFormulario(false);
    alert("Solicitud cerrada correctamente");
};

return (
    <>
    
      <Header_solicitud_tec/>
      <div className='dibsi'>
         <input class="Cuadro_busc_port" placeholder="Buscar..." type="text"></input>
         <Dropdown className='Drop_histo'>
            <Dropdown.Toggle variant='outline-dark' id="dropdown-basic">
            Categoria
            </Dropdown.Toggle>

            <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Equipos escritorio</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Televisores</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Elementos</Dropdown.Item>
            </Dropdown.Menu>
         </Dropdown>
      </div>
      <div className='conten'>
        <Carousel data-bs-theme="dark">
        <Carousel.Item>
       
        <div className='linea'>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#001</h3>
            <div className='icono'>
               <img src="/imagenes/otroc.png" alt="Computador" className='imagenzita' />
            </div>
            <h7 className='letras'>Instrutor:</h7>
            <h7 className='letras'>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#002</h3>
            <div className='icono'>
              <img src="/imagenes/otroc.png" alt="Computador" className='imagenzita' />


            </div>
            <h7 className='letras'>Instrutor:</h7>
            <h7 className='letras'>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#003</h3>
            <div className='icono'>
               <img src="/imagenes/otroc.png" alt="Computador" className='imagenzita' />

            </div>
            <h7 className='letras'>Instrutor:</h7>
            <h7 className='letras'>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#004</h3>
            <div className='icono'>
               <img src="/imagenes/otroc.png" alt="Computador" className='imagenzita' />
            </div>
            <h7 className='letras'>Instrutor:</h7>
            <h7 className='letras'>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#005</h3>
            <div className='icono'>
              <img src="/imagenes/otroc.png" alt="Computador" className='imagenzita' />

            </div>
            <h7 className='letras'>Instrutor:</h7>
            <h7 className='letras'>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
        </div>
        </Carousel.Item>
        <Carousel.Item>
        
        <div className='linea'>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#001</h3>
            <div className='icono'>
               <img src="/imagenes/otroc.png" alt="Computador" className='imagenzita' />
            </div>
            <h7 className='letras'>Instrutor:</h7>
            <h7 className='letras'>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#002</h3>
            <div className='icono'>
              <img src="/imagenes/otroc.png" alt="Computador" className='imagenzita' />


            </div>
            <h7 className='letras'>Instrutor:</h7>
            <h7 className='letras'>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#003</h3>
            <div className='icono'>
               <img src="/imagenes/otroc.png" alt="Computador" className='imagenzita' />

            </div>
            <h7 className='letras'>Instrutor:</h7>
            <h7 className='letras'>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#004</h3>
            <div className='icono'>
               <img src="/imagenes/otroc.png" alt="Computador" className='imagenzita' />
            </div>
            <h7 className='letras'>Instrutor:</h7>
            <h7 className='letras'>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
          <div className='peticiones'>
            <h3 className='jaaa'>Prestamo#005</h3>
            <div className='icono'>
              <img src="/imagenes/otroc.png" alt="Computador" className='imagenzita' />

            </div>
            <h7 className='letras'>Instrutor:</h7>
            <h7 className='letras'>Ambiente:</h7>
            <button className='clicksito' onClick={abrirFormulario}>Ver</button>
          </div>
        </div>
        </Carousel.Item>
        </Carousel>
        
      </div>
      {}
      <ModalFormulario
        show={mostrarFormulario}
        onHide={cerrarFormulario}
        onFinalizar={abrirConfirmacion}
      />
      <ConfirmacionModal
        show={mostrarConfirmacion}
        
        onHide={cerrarConfirmacion}
        onConfirm={aceptarConfirmacion}
      />
      <Footer />
    
    
    </>
  );
}

export default Tecnico;
