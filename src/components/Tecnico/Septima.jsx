import './stile_tec.css'
import React from 'react';
import Button from 'react-bootstrap/Button';
import Header_tec from '../header_tecnico/header_tec';
import Footer from '../Footer/Footer';
 
function Septima() {
  return (
    <>
     <Header_tec></Header_tec>
               <div id="salida1">
               <div id="pregunta1">
                <h2>¿Estas seguro de que quieres cerrar ticket?</h2>
               </div>
               <div id="dueño1">
               <Button variant="primary" id="cosos" href='Cuarta'>Aceptar</Button>
               <Button variant="primary" id="cosos" href='/Sexta'>Cancelar</Button>
               </div>
               </div>
               <Footer></Footer> 
    </>
  );
}

export default Septima;