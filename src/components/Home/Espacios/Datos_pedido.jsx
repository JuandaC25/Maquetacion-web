import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "./Solicitud_espacios.css";

function Datos_pedido() {
  const [smShow, setSmShow] = React.useState(false);

  return (
    <>
      <h3 className='titulo1'>Seleccione el espacio que desea apartar</h3>
      <div className='menuespa'>
        <Form.Select aria-label="Example">
          <option value="1">Auditorio</option>
          <option value="2">Cancha</option>
        </Form.Select>
      </div>
      <div className='conteinercenter'>
        <Form.Label htmlFor="inputPassword5"><h3>Tiempo de uso</h3></Form.Label>
        <Form.Control className='Usotimp'
          type="textarea"
          id="inputPassword5"
          aria-describedby="passwordHelpBlock"
        />
      </div>
      <div className='conteinercenter2'>
        <Form.Label htmlFor="inputPassword5"><h3>Fecha de uso</h3></Form.Label>
        <Form.Control className='Usotimp'
          type="date"
          id="inputPassword5"
          aria-describedby="passwordHelpBlock"
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
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
    </>
  );
}

export default Datos_pedido;
