import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function Login() {
  return (
    <Form>
        <h1>Iniciar sesión</h1>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control type="email" placeholder="Ingrese su correo electronico" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword"> 
        <Form.Control type="password" placeholder="Ingrese su contraseña" />
      </Form.Group>
      <ButtonGroup aria-label="Botones_inicio">
      <Button href='/Usuario'>Iniciar sesión</Button>
    </ButtonGroup>
    </Form>
  );
}

export default Login;