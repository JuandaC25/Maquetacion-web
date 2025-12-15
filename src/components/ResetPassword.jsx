import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import './App.css';
import { resetPassword } from '../api/AuthRecoveryApi';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Validar que el token existe en la URL
    if (!token) {
      setError('Token inválido o faltante. Por favor, solicita un nuevo enlace de recuperación.');
    }
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validar longitud mínima
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(token, newPassword);
      setMessage(response.message || 'Contraseña actualizada exitosamente');
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al restablecer la contraseña. El token puede estar expirado.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '400px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Restablecer Contraseña</h2>
          <p className="text-muted text-center mb-4">
            Ingresa tu nueva contraseña
          </p>

          {message && (
            <Alert variant="success">
              {message}
              <br />
              <small>Redirigiendo al login...</small>
            </Alert>
          )}

          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          {!token ? (
            <div className="text-center">
              <Alert variant="warning">
                Token inválido o faltante
              </Alert>
              <Link to="/forgot-password" className="btn btn-primary">
                Solicitar nuevo enlace
              </Link>
            </div>
          ) : (
            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3" controlId="formNewPassword">
                <Form.Label>Nueva Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingresa tu nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
                <Form.Text className="text-muted">
                  Mínimo 6 caracteres
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Confirmar Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirma tu nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? 'Actualizando...' : 'Restablecer contraseña'}
              </Button>

              <div className="text-center">
                <Link to="/login" className="text-decoration-none">
                  ← Volver al inicio de sesión
                </Link>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ResetPassword;
