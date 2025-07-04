import './stile_tec.css'
import React from "react";
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button'; 
import HeaderTec from './HeaderTec';
import Footer from '../Footer/Footer';
function Sexta() {
    
    return(
        <>
          <HeaderTec></HeaderTec>
        <Stack gap={3} id="centro1">
       


        
        <div id="mega">
        <div id="nada">
            <div id="contgr3">
            <div id="escrito">
            Fecha de reporte
            </div>
            <div className="p-3" ></div>
            </div>
            <div id="contgr3">
            <div id="escrito">
              Modelo de pc
              </div>
            <div className="p-3" ></div>
            </div>
            <div id="contgr3">
            <div id="escrito">
            Numero de serie
            </div>
            <div className="p-3" id="grillas"></div>
            </div>
            <div id="contgr3">
            <div id="escrito">
            Ambiente
            </div>
            <div className="p-3" id="grillas"></div>
            </div>
            </div>
           
            <div id="rey">
            <div>
            <div className="p-5" >ticket</div>
            </div>
            <div>
            <div className="p-6" >3</div>
            </div>

            </div>
           <div id="mega2">
            <h5>Informe detallado errores de equipo</h5>

            
            <h5>Tecnico</h5>
            <h5 id='envidio'>10/12/2024</h5>
             <Button variant="primary" id='button3' href='/Sexta'>ENVIAR REPORTE</Button>
                  

           </div>
           <Button variant="primary" id='button4' href='/Septima'>CERRAR TICKET</Button>
                  
        </div>
      
      
      </Stack>
      
      <Footer></Footer>
        </>
    )
}

export default Sexta;