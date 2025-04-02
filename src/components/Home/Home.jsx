import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


function Home() {
  return (
    <Form>
        <h1>Iniciar sesión</h1>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control type="email" placeholder="Ingrese su correo electronico" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Control type="password" placeholder="Ingrese su contraseña" />
      </Form.Group>
      <Button variant="primary" type="Button">
        Ingresar
      </Button>
    </Form>
  );
}

export default Home;