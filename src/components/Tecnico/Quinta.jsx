import './stile_tec.css'
import React from "react";
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button'; 
import Header_tickets from '../header_tecnico/header_ticket';
import Footer from '../Footer/Footer';
function Quinta() {
    
    return(
        <>
       <Header_tickets></Header_tickets>
        <Stack gap={3} id="centro">
            <div id="supremof">
        
        <div id="contgr2">
          <div id="escrito">
        Fecha de reporte
        </div>
        <div className="p-3" ></div>
        </div>
        <div id="contgr2">
        <div id="escrito">
              Modelo de pc
              </div>
        <div className="p-3" ></div>
        </div>
        <div id="contgr2">
        <div id="escrito">
          Numero de serie
          </div>
        <div className="p-3" id="grillas"></div>
        </div>
        <div id="contgr2">
        <div id="escrito">
     Ambiente
        </div>
        <div className="p-3" id="grillas"></div>
        </div>
        </div>
       
      
      </Stack>
      <Button variant="primary" id='button101' href='/Sexta'>Reportar</Button>
      <Footer></Footer>
        </>
    )
}

export default Quinta;