import React, { useState, useEffect } from 'react';
import './ReportarEquipo.css';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { obtenerProblemas } from '../../../api/ProblemasApi';
import { crearTicket } from '../../../api/ticket';

function ReportarEquipo() {
  const [problemas, setProblemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    numeroSerie: '',
    idElemento: '',
    ambiente: '',
    observaciones: '',
    problemasSeleccionados: []
  });

  useEffect(() => {
    cargarProblemas();
  }, []);

  const cargarProblemas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerProblemas();
      setProblemas(data);
    } catch (err) {
      setError('No se pudieron cargar los problemas: ' + err.message);
      console.error('Error al cargar problemas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProblemaChange = (problemaId) => {
    setFormData(prev => {
      const problemas = prev.problemasSeleccionados.includes(problemaId)
        ? prev.problemasSeleccionados.filter(id => id !== problemaId)
        : [...prev.problemasSeleccionados, problemaId];
      
      return { ...prev, problemasSeleccionados: problemas };
    });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validarFormulario = () => {
    if (!formData.idElemento.trim()) {
      setError('El ID del equipo es obligatorio');
      return false;
    }
    if (!formData.ambiente.trim()) {
      setError('El ambiente es obligatorio');
      return false;
    }
    if (formData.problemasSeleccionados.length === 0) {
      setError('Debe seleccionar al menos un problema');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validarFormulario()) return;

    setSubmitting(true);

    try {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      const idUsuario = usuario.id;

      if (!idUsuario) {
        throw new Error('No se pudo obtener el ID del usuario. Por favor, inicie sesión nuevamente.');
      }

      // Obtener nombres de problemas seleccionados para el mensaje
      const problemasNombres = problemas
        .filter(p => formData.problemasSeleccionados.includes(p.id))
        .map(p => p.descr_problem);

      // Crear un ticket por cada problema seleccionado
      // Nota: La BD tiene relación ManyToOne, por lo que cada ticket solo puede tener 1 problema
      const promesas = formData.problemasSeleccionados.map(idProblema => 
        crearTicket({
          id_elem: parseInt(formData.idElemento),
          id_problem: idProblema,
          ambient: formData.ambiente,
          obser: formData.observaciones || '',
          id_usu: idUsuario,
          fecha_in: new Date().toISOString()
        })
      );

      await Promise.all(promesas);

      setSuccess(
        `✓ Reporte exitoso! Se crearon ${formData.problemasSeleccionados.length} ticket(s) para el equipo ID ${formData.idElemento}:\n` +
        `• ${problemasNombres.join('\n• ')}`
      );

      // Limpiar formulario
      setFormData({
        numeroSerie: '',
        idElemento: '',
        ambiente: '',
        observaciones: '',
        problemasSeleccionados: []
      });

    } catch (err) {
      console.error('Error al reportar equipo:', err);
      setError('Error al reportar el equipo: ' + (err.message || 'Error desconocido'));
    } finally {
      setSubmitting(false);
    }
  };

  // Limpiar formulario
  const handleLimpiar = () => {
    setFormData({
      numeroSerie: '',
      idElemento: '',
      ambiente: '',
      observaciones: '',
      problemasSeleccionados: []
    });
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="reportar-equipo-card">
      <div className="reportar-equipo-inner">

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
            <div style={{ whiteSpace: 'pre-line' }}>{success}</div>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Número de Serie (opcional, para referencia) */}
          <Form.Group className="mb-3">
            <Form.Label>Número de Serie (Opcional)</Form.Label>
            <Form.Control
              type="text"
              name="numeroSerie"
              placeholder="Ej: ABC12345XYZ"
              value={formData.numeroSerie}
              onChange={handleInputChange}
            />
            <Form.Text className="text-muted">
              Este campo es solo para referenciar el equipo a reportar 
            </Form.Text>
          </Form.Group>

          {/* ID del Elemento (obligatorio) */}
          <Form.Group className="mb-3">
            <Form.Label>ID del Equipo *</Form.Label>
            <Form.Control
              type="number"
              name="idElemento"
              placeholder="Ingrese el ID del equipo"
              value={formData.idElemento}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          {/* Ambiente */}
          <Form.Group className="mb-3">
            <Form.Label>Ambiente/Ubicación *</Form.Label>
            <Form.Control
              type="text"
              name="ambiente"
              placeholder="Ej: Ambiente 301"
              value={formData.ambiente}
              onChange={handleInputChange}
              maxLength={30}
              required
            />
          </Form.Group>

          
          <Form.Group className="mb-3">
            <div className="label-con-info">
              <Form.Label>Seleccione los problemas que presento el equipo *</Form.Label>
              <div className="info-badge" title="Cada problema genera un ticket individual que el técnico podrá gestionar por separado">
                <span className="info-icon">ℹ️</span>
                <span className="info-text">Cada problema genera un ticket individual que el técnico podrá gestionar por separado.</span>
              </div>
            </div>
            {loading ? (
              <div className="text-center py-3">
                <Spinner animation="border" size="sm" />
                <span className="ms-2">Cargando problemas...</span>
              </div>
            ) : (
              <div className="problemas-grid">
                {problemas.map(problema => (
                  <div key={problema.id} className="problema-item">
                    <Form.Check
                      type="checkbox"
                      id={`problema-${problema.id}`}
                      label={problema.descr_problem}
                      checked={formData.problemasSeleccionados.includes(problema.id)}
                      onChange={() => handleProblemaChange(problema.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </Form.Group>

          {/* Observaciones */}
          <Form.Group className="mb-3">
            <Form.Label>Observaciones (Opcional)</Form.Label>
            <Form.Control
              as="textarea"
              name="observaciones"
              rows={3}
              placeholder="Describa detalles adicionales sobre el problema..."
              value={formData.observaciones}
              onChange={handleInputChange}
              maxLength={255}
            />
            <Form.Text className="text-muted">
              {formData.observaciones.length}/255 caracteres
            </Form.Text>
          </Form.Group>

          {/* Botones */}
          <div className="botones-accion">
            <Button 
              variant="danger" 
              type="submit" 
              disabled={submitting || loading}
              className="btn-reportar"
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Reportando...
                </>
              ) : (
                '🚨 Reportar Equipo'
              )}
            </Button>

            <Button 
              variant="secondary" 
              onClick={handleLimpiar}
              disabled={submitting}
              className="btn-limpiar"
            >
              🔄 Limpiar Formulario
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ReportarEquipo;
