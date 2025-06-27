import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './App.css';

function Login() {
  return (
    <div className="Fondo"> 
      <Form>
        <h1 className='iniciarsesion'><h1 className='Inicios'>Iniciar sesión</h1></h1>
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

        <Button className="botton" href='/Inicio' variant="primary">
          Iniciar sesión
        </Button>
      </Form>
    </div>
  );
}

export default Login;

