import React from 'react';
import "./Solicitud_espacios.css";
import Card from 'react-bootstrap/Card'; 


function Datos_pedido() {
  const [smShow, setSmShow] = React.useState(false);

  return (
    <>
<div className="ACMC-Cua">
  
  <Card className="product-card-01">
    <img src="/imagenes/Polideportivo.jpg" alt="Polideportivo" className="product-img" />

    <div className="product-details">
      <h1 className="solicitud-titulo001">Solicitar Polideportivo</h1>

        <label className="Tit-time001"><h3>Tiempo de uso</h3></label>
        <input className="form-input101" type="number" placeholder="Ingrese la cantidad de horas" />


        <label className="Tit-time002"><h3>Fecha de uso</h3></label>
        <input className="form-input101" type="date" placeholder="Ingrese la fecha" />


      <button className="btn-confirmar">Confirmar solicitud</button>
    </div>
  </Card>

  
  <Card className="product-card-02">
    <img src="/imagenes/Auditorio.jpeg" alt="Auditorio" className="product-img" />

    <div className="product-details">
      <h1 className="solicitud-titulo">Solicitar Auditorio</h1>
      
        <label className="Tit-time003"><h3>Tiempo de uso</h3></label>
        <input className="form-input101" type="number" placeholder="Ingrese la cantidad de horas" />
      
        <label className="Tit-time004"><h3>Fecha de uso</h3></label>
        <input className="form-input101" type="date" />      

      <button className="btn-confirmar">Confirmar solicitud</button>
    </div>
  </Card>
</div>
    </>
  );
}

export default Datos_pedido;
