import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './App.css';

function Login() {
  return (
    <div id='Form_login'>
    <Form>
      <h1 className='iniciarsesion'>Iniciar sesión</h1>
      <Form.Group className="grupoinicio" controlId="formBasicEmail">
        <Form.Control  
          placeholder="Ingrese su correo electrónico" 
          required 
        />
      </Form.Group>

      <Form.Group className="grupocontraseña" controlId="formBasicPassword"> 
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
    </div>
  );
}

export default Login;
