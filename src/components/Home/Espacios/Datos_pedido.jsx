import React from 'react';
import "./Solicitud_espacios.css";
import Card from 'react-bootstrap/Card'; 
import { Carousel } from 'react-bootstrap';


function Datos_pedido() {
  const [smShow, setSmShow] = React.useState(false);

  return (
    <>
<div className="ACMC-Cua">
  
  <Carousel className='carrusel-espacios'>
  <Card className="product-card-01">
    <img src="/imagenes/Polideportivo.jpg" alt="Polideportivo" className="product-img" />
    <div className="product-details">
      <h1 className="solicitud-titulo001">Solicitar Polideportivo</h1>
      
      <p>Instalacion deportiva que cuenta con varias infraestructuras y areas dedicadas a la practica de diferentes deportes y actividades fisicas.<br/>
       <br/><strong>Especificaciones del lugar</strong>
       <br/>
      
      <br/>-Cuenta con una mallla de voleibol.

      <br/>-Posee dos arcos para practicar deportes como futbol <br/>
      o baloncesto.
      <br/>-Pantallas y equipos de sonido.
      </p>
      
    <button class="button-Espacio">
  <span class="shadow"></span>
  <span class="edge"></span>
  <div class="front">
    <span>Apartar espacio</span>
  </div>
</button>
    </div>
  </Card>
  </Carousel>

   <Card className="product-card-02 carrusel-auditorio">
      <Carousel className='carrusel-Auditorio'>
        <Carousel.Item>
          <img
            src="/imagenes/Auditorio.jpeg"
            alt="Auditorio1"
            className="product-img d-block w-100"
          />
        </Carousel.Item>

        <Carousel.Item>
          <img
            src="/imagenes/Imagen1Auditorio.jpg"
            alt="Auditorio2"
            className="product-img d-block w-100"
          />
        </Carousel.Item>

        <Carousel.Item>
          <img
            src="/imagenes/Imagen2Auditorio.jpg"
            alt="Auditorio3"
            className="product-img d-block w-100"
          />
        </Carousel.Item>
      </Carousel>

      <div className="product-details">
        <h1 className="solicitud-titulo">Solicitar Auditorio</h1>
        <br />
        <p>
          Sala o espacio público destinado a albergar conferencias, espectáculos y/o otros tipos de eventos educativos.
          <br /><br />
          <strong>Especificaciones del lugar</strong>
          <br /><br />
          - Cuenta con una pantalla.
          <br />
          - Pantallas y equipos de sonido.
          <br />
          - Capacidad para 150 personas.
          <br />
          - Posee equipo de sonido.
          <br />
          - Posee 100 sillas.
        </p>

        <button className="button-Espacio">
          <span className="shadow"></span>
          <span className="edge"></span>
          <div className="front">
            <span>Apartar espacio</span>
          </div>
        </button>
      </div>
    </Card>

</div>
    </>
  );
}
export default Datos_pedido;
