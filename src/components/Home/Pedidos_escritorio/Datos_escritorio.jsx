import './Pedidos_escritorio.css';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Datos_escritorio() {
  const [smShow, setSmShow] = useState(false);

  return (
    <div className="form-grid">
      <div className="form-row">
        <div className="form-col">
          <Form.Label htmlFor="inputCantidad">Ingrese la cantidad</Form.Label>
          <Form.Control type="number" id="inputCantidad" className="form-input" />
        </div>

        <div className="form-col">
          <Form.Label htmlFor="inputMouse"># de mouse necesarios</Form.Label>
          <Form.Control type="number" id="inputMouse" className="form-input" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <Form.Label htmlFor="inputAmbiente">Ambiente</Form.Label>
          <Form.Control type="text" id="inputAmbiente" className="form-input" />
        </div>

        <div className="form-col">
          <Form.Label htmlFor="inputTeclados"># de teclados necesarios</Form.Label>
          <Form.Control type="number" id="inputTeclados" className="form-input" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <Form.Label htmlFor="inputFecha">Fecha de uso</Form.Label>
          <Form.Control type="date" id="inputFecha" className="form-input" />
        </div>
      </div>

      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '60px' 
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
        <style>{`
          .modal-header .btn-close {
            filter: invert(1);
            opacity: 1;
          }
        `}</style>
      </Modal>
    </div>
  );
}
export default Datos_escritorio;

