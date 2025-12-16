import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './App.css';
import { login, saveToken } from '../api/AuthApi';
import { useAuth } from '../auth/AuthContext';
import ForgotPassword from './ForgotPassword';

function Login() {
  const navigate = useNavigate();
  const { refreshMe, roles: contextRoles } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await login({ username: email, password });
      saveToken(token);
      
      localStorage.removeItem('force_admin');
      localStorage.removeItem('force_tecnico');
      
      await refreshMe();
      
      const res = await fetch('http://localhost:8081/auth/me', {
        headers: { 'Authorization': token }
      });
      
      if (res.ok) {
        const userData = await res.json();
        const userRoles = userData?.roles || [];
        
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
        navigate('/Inicio');
      }
    } catch (err) {
      const mensajeError = err?.response?.data?.error || err.message || 'Error al iniciar sesión';
      setError(mensajeError);
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
          <a href="#" onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }}>
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <Button className="botton" type="submit" variant="primary" disabled={loading}>
          {loading ? 'Ingresando…' : 'Iniciar sesión'}
        </Button>
      </Form>

      <ForgotPassword 
        show={showForgotPassword} 
        handleClose={() => setShowForgotPassword(false)} 
      />
    </div>
  );
}

export default Login;


