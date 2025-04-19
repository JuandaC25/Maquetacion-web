import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Formulario.css';
import { Container } from 'react-bootstrap';

function Form_port() {
  return (
    
    <Container className='Cuadro_form'>
        <h1 id='Header_soli'>Información de equipos</h1>
        <Container className='Cont_gene'>
        <Container className='Izq_1'>
          <Container className='Cont_1'>
      <Form.Group className="mb-3" controlId="Id_ele">
        <Form.Label>Id del elemento</Form.Label>
        <Form.Control className='tx1' placeholder="XXXXXXXX" disabled />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Categoria</Form.Label>
        <Form.Control className='tx1' placeholder="Portatiles, escritorio...." disabled />
      </Form.Group>
      <Form.Group className="mb-3" controlId="Acce">
        <Form.Label >Acceesorios</Form.Label>
        <Form.Control className='tx1' placeholder="Mouse,Cargador, Funda..." disabled/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="Num_serie">
        <Form.Label>Numero de serie</Form.Label>
        <Form.Control className='tx1' placeholder="XXXXXXXX" disabled/>
      </Form.Group>
      </Container>
      </Container>
      <Container className='Cua_der'>
        <Form.Label>Nombre del elemento</Form.Label>
        <Form.Control className='tx1' placeholder="XXXXXXXX" disabled/>
        <Form.Label> Observaciones</Form.Label>
        <Form.Control className='tx1' as="textarea" rows={3} disabled/>
        <Button className='Btn_Conf' type="submit">Confirmar solicitud</Button>
    </Container>
    </Container>
    </Container>
  );
}

export default Form_port;