import './stile_tec.css'
import React from 'react';
import Button from 'react-bootstrap/Button';
import Header_tec from '../header_tecnico/header_tec';
import Footer from '../Footer/Footer';
function Tercera() {
  return (
    <>
      <Header_tec></Header_tec>
               <div id="salida">
               <div id="pregunta">
                <h2>¿Estas seguro de que quieres confirmar cierre de solicitud?</h2>
               </div>
               <div id="dueño">
               <Button variant="primary" id="cosos" href='Tecnico'>Aceptar</Button>
               <Button variant="primary" id="cosos" href='/pie'>Cancelar</Button>
               </div>
               </div>
               <Footer></Footer>
    </>
  );
}

export default Tercera;