import './stile_tec.css'
import React from "react";
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';    
import Header_tec from '../header_tecnico/header_tec';
import Footer from '../Footer/Footer';

function Pie() {
  return (
    <>
     <Header_tec></Header_tec>
    
    <Stack gap={3} id="centro">
        
      <div id="contgr1">
        
      Nombre Usuario
        
      <div className="p-2" ></div>
      </div>
      <div id="contgr">
        
            Ambiente
    
      <div className="p-2" ></div>
      </div>
      <div id="contgr">
        Cantidad de equipos
      <div className="p-2" id="grillas"></div>
      </div>
      <div id="contgr">
    Clase de equipos
      <div className="p-2" id="grillas"></div>
      </div>
     
    
    </Stack>
    <div>
    <Button variant="primary" id='button102' href='/Tercera'>finalizado</Button>
    </div>
  
    <Footer/>
    
    </>
  );
}

export default Pie;

