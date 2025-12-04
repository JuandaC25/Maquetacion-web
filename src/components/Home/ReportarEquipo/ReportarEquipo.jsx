import React from 'react';
import './ReportarEquipo.css';
import { Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { useReportarEquipo } from './Apis-tickets';

function ReportarEquipo() {
  const {
    problemas,
    loading,
    error,
    success,
    submitting,
    imagenCargando,
    formData,
    imagenes,
    handleProblemaChange,
    handleInputChange,
    handleAgregarImagen,
    handleEliminarImagen,
    handleSubmit,
    handleLimpiar,
    setError,
    setSuccess
  } = useReportarEquipo();
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

          <Form.Group className="mb-3">
            <Form.Label>Ambiente/Ubicación *</Form.Label>
            <Form.Control
              type="text"
              name="ambiente"
              placeholder="Ej: Ambiente 301"
              value={formData.ambiente}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Seleccione los problemas *</Form.Label>
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

          {/* ✅ Observaciones */}
          <Form.Group className="mb-3">
            <Form.Label>Observaciones (Opcional)</Form.Label>
            <Form.Control
              as="textarea"
              name="observaciones"
              rows={3}
              placeholder="Detalles adicionales del problema..."
              value={formData.observaciones}
              onChange={handleInputChange}
              maxLength={255}
            />
            <Form.Text className="text-muted">
              {formData.observaciones.length}/255 caracteres
            </Form.Text>
          </Form.Group>

          {/* ✅ Sección de imágenes */}
          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label>Imágenes (Opcional)</Form.Label>
              <Button variant="secondary" size="sm" as="label" disabled={imagenCargando}>
                {imagenCargando ? 'Procesando...' : '📷 Agregar Imagen'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAgregarImagen}
                  disabled={imagenCargando}
                />
              </Button>
            </div>

            {/* Preview de imágenes */}
            {imagenes.length > 0 && (
              <div className="row g-2 mb-3">
                {imagenes.map((img, index) => (
                  <div key={index} className="col-md-3">
                    <Card>
                      <Card.Img 
                        variant="top" 
                        src={img} 
                        style={{ height: '150px', objectFit: 'cover' }}
                      />
                      <Card.Body className="p-2">
                        <Button
                          variant="danger"
                          size="sm"
                          className="w-100"
                          onClick={() => handleEliminarImagen(index)}
                        >
                          Eliminar
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            )}

            <Form.Text className="text-muted">
              {imagenes.length > 0 
                ? `${imagenes.length} imagen(es) agregada(s)` 
                : 'No hay imágenes agregadas'}
            </Form.Text>
          </Form.Group>

          <div className="botones-accion">
            <Button 
              variant="danger"
              type="submit"
              disabled={submitting}
              className="btn-reportar"
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Tomando...
                </>
              ) : (
                '✋ Tomar'
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