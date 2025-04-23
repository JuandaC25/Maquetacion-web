import './stile_tec.css'
import React from 'react';
import Button from 'react-bootstrap/Button';
import Header_tickets from '../header_tecnico/header_ticket';
import Footer from '../Footer/Footer';
 
function Septima() {
  return (
    <>
        <Header_tickets></Header_tickets>
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