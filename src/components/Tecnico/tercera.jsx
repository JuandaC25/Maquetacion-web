import './stile_tec.css'
import React from 'react';
import Button from 'react-bootstrap/Button';
import HeaderTec from './HeaderTec';
import Footer from '../Footer/Footer';
function Tercera() {
  return (
    <>
      <HeaderTec></HeaderTec>
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