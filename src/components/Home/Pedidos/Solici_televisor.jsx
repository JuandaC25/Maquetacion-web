import "./Soli_televisor.css";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { FaUserCircle } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';


function Solitelevisores() {
  const [smShow, setSmShow] = useState(false);
  return (
    <>
      <div className="admin-container">
        <div className="icon-container">
        </div>
        <h1>Solicitar televisores</h1>

        <div className="custom-buttons-container">
          <Button variant="custom-1">Home</Button>
          <Button variant="custom-2">Blog CEET</Button>
          <div className="custom-3-container">
            <FaUserCircle />
          </div>
        </div>
      </div>
      <div className="Cuadros">
        <div className="fila-superior">
          <Card className="cuadro">
            <Card.Body>
              <Form.Label htmlFor="inputCantidad" className="etiqueta-input">
                <h3>Ingrese cantidad</h3>
              </Form.Label>
              <Form.Control type="number" id="inputCantidad" />
            </Card.Body>
          </Card>

          <Card className="cuadro">
            <Card.Body>
              <Form.Label htmlFor="inputAmbiente" className="etiqueta-input">
                <h3>Ambiente</h3>
              </Form.Label>
              <Form.Control type="text" id="inputAmbiente" />
            </Card.Body>
          </Card>
        </div>

        <div className="fila-inferior">
          <Card className="cuadro">
            <Card.Body>
              <Form.Label htmlFor="inputFecha" className="etiqueta-input">
                <h3>Fecha de uso</h3>
              </Form.Label>
              <Form.Control type="date" id="inputFecha" />
            </Card.Body>
          </Card>
        </div>
      </div>



      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '100px' 
        }}
      >
        <Button 
          onClick={() => setSmShow(true)} 
          style={{ 
            backgroundColor: '#00AF00', 
            borderColor: '#00AF00',
            fontSize: '18px', 
            padding: '10px 20px',
            color: 'white'
          }}
        >
          Confirmar solicitud
        </Button>        
      </div>
      <Modal
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
        centered
      >
        <Modal.Header 
          closeButton 
          style={{ 
            backgroundColor: '#00AF00', 
            color: 'white', 
            borderBottom: 'none', 
            padding: '1rem 1rem',
            position: 'relative'
          }}
        >
          <Modal.Title 
            id="example-modal-sizes-title-sm"
            style={{ margin: '0 auto', fontWeight: '500' }}
          >
            Solicitud confirmada
          </Modal.Title>
        </Modal.Header>
      </Modal>
    </>
  );
}

export default Solitelevisores;


  

