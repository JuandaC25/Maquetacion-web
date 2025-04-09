import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './App.css';

function Login() {
  return (
    <Form>
      <h1 className='iniciarsesion'>Iniciar sesión</h1>
      <Form.Group className="grupoinicio" controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control  
          placeholder="Ingrese su correo electrónico" 
          required 
        />
      </Form.Group>

      <Form.Group className="grupocontraseña" controlId="formBasicPassword"> 
        <Form.Label>Contraseña</Form.Label>
        <Form.Control 
          type="password" 
          placeholder="Ingrese su contraseña" 
          required 
        />
      </Form.Group>

      <Button className ="botton" href='/Usuario' variant="primary">
        Iniciar sesión
      </Button>
    </Form>
  );
}

export default Login;
