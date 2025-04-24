import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Desplegable() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <i className="bi bi-person-circle" id='icon' style={{ fontSize: '1.5rem', color: 'white' , marginBottom: '45px' }} onClick={handleShow}></i>

      <Modal show={show} onHide={handleClose} style={{width:'17%',marginLeft:'1180px',marginTop:'20px'}}>
        <Modal.Header  style={{ backgroundColor: ' rgb(9, 180, 26)', display:'flex', flexDirection:'column',textAlign:'center', borderRadius: '10px',border:'1px solid black'}}>
        <i className="bi bi-person-circle" style={{ fontSize: '3rem', color: 'white', width:'100%' }}></i>
          <Modal.Title style={{ color: 'white',textAlign:'center' }}> ¡Hola,usuario! </Modal.Title>
        </Modal.Header>
        
        
        <Modal.Footer> 
        
        <div style={{width:'100%',textAlign:'center'}}>
        <h6>Example@gmail.com</h6>
          <Button style={{textAlign:'center',backgroundColor:'lightgray',color:'black',margin:'auto',border:'2px solid black',height:'42px', borderRadius: '10px'}} onClick={handleClose}>
            Editar informacion 
          </Button>
          </div>
          <div style={{width:'100%',textAlign:'center'}}>
          <Button className='iconbut' href="http://localhost:5173/Login" style={{textAlign:'center',backgroundColor:'lightgray',color:'black',margin:'auto',border:'2px solid black', borderRadius: '10px',height:'42px'}} onClick={handleClose} >
            Cerrar sesion
          </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Desplegable;