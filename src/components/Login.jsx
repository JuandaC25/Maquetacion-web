import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './App.css';

function Login() {
  return (
    <div className="Fondo"> 
      <Form className='Cuadro-iniciarsesion'>
        <h1 className='iniciarsesion'>
          <span className='Inicios'>Iniciar sesión</span>
        </h1>

        <div className="inputGroup">
          <Form.Control  
            type="Text"
            placeholder=" "  
            required 
          />
          <label>Correo electrónico</label>
        </div>
        <div className="inputGroup">
          <Form.Control 
            type="password" 
            placeholder=" " 
            required 
          />
          <label>Contraseña</label>
        </div>

        <div className="forgot-password">
          <a href="/recuperar">¿Olvidaste tu contraseña?</a>
        </div>

        <Button className="botton" href='/Inicio' variant="primary">
          Iniciar sesión
        </Button>
      </Form>
    </div>
  );
}

export default Login;


