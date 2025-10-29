import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './App.css';
import { login, saveToken } from '../api/AuthApi';
import { useAuth } from '../auth/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { refreshMe, roles: contextRoles } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await login({ username: email, password });
      saveToken(token); // Guarda, incluye el prefijo Bearer que envía el backend
      
      // Limpiar flags previos
      localStorage.removeItem('force_admin');
      localStorage.removeItem('force_tecnico');
      
      // Cargar info de usuario y roles desde el backend
      await refreshMe();
      
      // Obtener roles actualizados después de refreshMe
      // Como refreshMe es async, necesitamos obtener los roles directamente del backend
      const res = await fetch('http://localhost:8081/auth/me', {
        headers: { 'Authorization': token }
      });
      
      if (res.ok) {
        const userData = await res.json();
        const userRoles = userData?.roles || [];
        
        // Redirigir según el rol del usuario
        if (userRoles.includes('ADMINISTRADOR')) {
          localStorage.setItem('force_admin', '1');
          navigate('/Admin');
        } else if (userRoles.includes('TECNICO')) {
          localStorage.setItem('force_tecnico', '1');
          navigate('/Prestamos-Tecnico');
        } else {
          navigate('/Inicio');
        }
      } else {
        // Si falla obtener roles, ir a inicio por defecto
        navigate('/Inicio');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Fondo">
      <Form className='Cuadro-iniciarsesion' onSubmit={onSubmit}>
        <h1 className='iniciarsesion'>
          <span className='Inicios'>Iniciar sesión</span>
        </h1>

        <div className="inputGroup">
          <Form.Control
            type="email"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Correo electrónico</label>
        </div>
        <div className="inputGroup">
          <Form.Control
            type="password"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>Contraseña</label>
        </div>

        {error && (
          <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>
        )}

        <div className="forgot-password">
          <a href="/recuperar">¿Olvidaste tu contraseña?</a>
        </div>

        <Button className="botton" type="submit" variant="primary" disabled={loading}>
          {loading ? 'Ingresando…' : 'Iniciar sesión'}
        </Button>
      </Form>
    </div>
  );
}

export default Login;


