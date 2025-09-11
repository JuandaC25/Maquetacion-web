import "./Soli_televisor.css";
  import Button from 'react-bootstrap/Button';
  import Card from 'react-bootstrap/Card';
  import Form from 'react-bootstrap/Form';
  import Modal from 'react-bootstrap/Modal';
  import { useState } from 'react';
  import Footer from "../../Footer/Footer";
  import Headertele from "./Header tele/Header";

  function Solitelevisores() {
    const [smShow, setSmShow] = useState(false);
    return (
      <>
      <Headertele/>
        <div className='acomodeichion2'>
      <div className='decoracionredondeadaaa'>
      <img src="/imagenes/Televisorr-solicitud.png" className="imagen-Televisorr" alt="Televisor" />
  </div>

      <div className="form-grid-01">
        <div className="form-row2">
          <div className="Reacomodaciontele">
            <Form.Label>Ingrese la cantidad</Form.Label>
            <Form.Control type="number" className="ajust-tamañoo" />
          </div>
        </div>
        
        <div className="form-row2-02">
          <div className="Reacomodaciontele">
            <Form.Label>Ambiente</Form.Label>
            <Form.Control type="text" className="ajust-tamañoo" />
          </div>
        </div>

        <div className="form-row2-02">
          <div className="Reacomodaciontele">
            <Form.Label>Fecha de uso</Form.Label>
            <Form.Control type="date" className="ajust-tamañoo" />
          </div>
        </div>

        <button className="bton-cOnfirmacion">Confirmar solicitud</button>
      </div>
  </div>
  <div className="ajustTelevisores"> 
    <Footer/>
  </div>    
      </>
    );
  }
  export default Solitelevisores;



  

