import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { requestPasswordReset } from '../api/AuthRecoveryApi';

function ForgotPassword({ show, handleClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await requestPasswordReset(email);
      setMessage(response.message || 'Si el correo existe, recibirás un enlace para recuperar tu contraseña');
      setEmail(''); // Limpiar el campo
      
      // Cerrar el modal después de 3 segundos
      setTimeout(() => {
        handleClose();
        setMessage('');
      }, 3000);
    } catch (err) {
      // Por seguridad, mostramos el mismo mensaje aunque falle
      setMessage('Si el correo existe, recibirás un enlace para recuperar tu contraseña');
      setTimeout(() => {
        handleClose();
        setMessage('');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setEmail('');
    setMessage('');
    setError('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Recuperar Contraseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-4">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {message && (
          <Alert variant="success" onClose={() => setMessage('')} dismissible>
            {message}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}

        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button 
              variant="secondary" 
              onClick={handleModalClose}
              disabled={loading}
              className="flex-fill"
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
              className="flex-fill"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ForgotPassword;
