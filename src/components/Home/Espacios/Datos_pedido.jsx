import React, { useState } from 'react';
import "./Solicitud_espacios.css";
import Card from 'react-bootstrap/Card'; 
import { Carousel, Modal, Button } from 'react-bootstrap';

function Datos_pedido() {
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      <div className="ACMC-Cua">
        <Card className="Cuadroparaespacio">
          <Carousel className='carrusel-espacios'>
            <Carousel.Item>
              <img
                src="/imagenes/Polideportivo.jpg"
                alt="Polideportivo"
                className="ImagenPolideportivo"
              />
            </Carousel.Item>
          </Carousel>
          <div className="product-details">
            <h1 className="solicitud-titulo001">Solicitar Polideportivo</h1>
            <p> Instalacion deportiva que cuenta con varias infraestructuras y areas dedicadas a la practica de diferentes deportes y actividades fisicas. <br/><br/> <strong>Especificaciones del lugar</strong> <br/><br/> -Cuenta con una mallla de voleibol. <br/> -Posee dos arcos para practicar deportes como futbol <br/>o baloncesto. <br/> -Pantallas y equipos de sonido. </p>
            <button className="button-Espacio" onClick={handleOpen}>
              <span className="shadow"></span>
              <span className="edge"></span>
              <div className="front">
                <span>Apartar espacio</span>
              </div>
            </button>
          </div>
        </Card>

        {/* Modal */}
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header className='Titulo-modal-header' closeButton>
            <Modal.Title><h1>Reservar Polideportivo</h1></Modal.Title>
          </Modal.Header>
          <Modal.Body className='cuerpo-modal-Espacio'>
            <h3>Ingrese la hora que desea apartarlo</h3>
            <input type="time" placeholder="Tiempo de uso" className="input-hora" />
            <h3>Ingrese el tiempo de uso</h3>
            <input type="number" placeholder="aaaaa" className="input-tiempo" />

            <h3>Ingrese el numero de la ficha que lo ocupara</h3>
            <input type="number" placeholder="Numero de ficha" className="input-ficha" />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
            <Button variant="success" onClick={() => alert("Reserva confirmada ✅")}>
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>

        <Card className="Cuadroparaauditorio">
          <Carousel className='carrusel-Auditorio'>
            <Carousel.Item>
              <img src="/imagenes/Auditorio.jpeg" alt="Auditorio1" className="Imagenes-auditorio1" />
            </Carousel.Item>
            <Carousel.Item>
              <img src="/imagenes/Imagen1Auditorio.jpg" alt="Auditorio2" className="Imagenes-auditorio2" />
            </Carousel.Item>
            <Carousel.Item>
              <img src="/imagenes/Imagen2Auditorio.jpg" alt="Auditorio3" className="Imagenes-auditorio3" />
            </Carousel.Item>
          </Carousel>
          <div className="product-details">
            <h1 className="solicitud-titulo">Solicitar Auditorio</h1>
            <p> Sala o espacio público destinado a albergar conferencias, espectáculos y/o otros tipos de eventos educativos. <br/><br/> <strong>Especificaciones del lugar</strong> <br/><br/> - Cuenta con una pantalla. <br/> - Pantallas y equipos de sonido. <br/> - Capacidad para 150 personas. <br/> - Posee equipo de sonido. <br/> - Posee 100 sillas. </p>
            <button className="button-Espacio" onClick={handleOpen}>
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

