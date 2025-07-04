import './stile_tec.css'
import React from 'react';
import Button from 'react-bootstrap/Button';
import HeaderTec from './HeaderTec';
import Footer from '../Footer/Footer';
 
function Septima() {
  return (
    <>
        <HeaderTec></HeaderTec>
               <div id="salida1">
               <div id="pregunta1">
                <h2>¿Estas seguro de que quieres cerrar ticket?</h2>
               </div>
               <div id="dueño1">
               <Button variant="primary" id="cosos101" href='Cuarta'>Aceptar</Button>
               <Button variant="primary" id="cosos101" href='/Sexta'>Cancelar</Button>
               </div>
               </div>
               <Footer></Footer> 
    </>
  );
}

export default Septima;