import './Pedidos_ele.css';
import HeaderElemen from './Header_ele/Header_elemen';
import Dropdown from 'react-bootstrap/Dropdown';
import { Container } from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Pagination from 'react-bootstrap/Pagination';
import Footer from '../../Footer/Footer';

function Pedidos_ele() {
      const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="pedidos-ele">
      <HeaderElemen />
        <Container className='Cont_ele'>
      <h2 className='Txt_inv'>Inventario</h2>
    <Dropdown>
      <Dropdown.Toggle className='Btn_ele' id="dropdown-basic"> Teclados</Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item className='Btn_mouse' href="#/action-1">Mouses</Dropdown.Item>
        <Dropdown.Item className='Btn_cable' href="#/action-2">Cables de internet</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    </Container>
    <div>
       <Container className='Cont_inv'>
        <Stack className='Lista_ele' gap={4}>
      <div className="p-2">🖥️ Detalles del Elemento (Especificaciones, número de serie) <button className='Btn_add'>Añadir</button> </div>
      <div className="p-2">🖥️ Detalles del Elemento (Especificaciones, número de serie) <button className='Btn_add'>Añadir</button> </div>
      <div className="p-2">🖥️ Detalles del Elemento (Especificaciones, número de serie) <button className='Btn_add'>Añadir</button> </div>
      <div className="p-2">🖥️ Detalles del Elemento (Especificaciones, número de serie) <button className='Btn_add'>Añadir</button> </div>
      <div className="p-2">🖥️ Detalles del Elemento (Especificaciones, número de serie) <button className='Btn_add'>Añadir</button> </div>
    </Stack>
       </Container>
    </div>
      <Button className='Btn_conf' variant="primary" onClick={handleShow}>
        Confirmar solicitud
      </Button>
      <Modal show={show} onHide={handleClose}>
        <div className='Msj_ele'>
        <Modal.Body>
          <h4>Solicitud exitosa</h4>
        </Modal.Body>
        </div>
      </Modal>

      <Pagination className='Pag_ele'>
      <Pagination.Prev />
      <Pagination.Item active>{1}</Pagination.Item>
      <Pagination.Item>{2}</Pagination.Item>
      <Pagination.Item>{3}</Pagination.Item>
      <Pagination.Ellipsis />
      <Pagination.Item>{10}</Pagination.Item>
      <Pagination.Next />
    </Pagination>
    <Footer />
    </div>
  );
}
export default Pedidos_ele;