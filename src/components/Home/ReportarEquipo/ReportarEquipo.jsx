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
    <div className="reportar-equipo-container">
      <div className="reportar-equipo-card">
        <div className="reportar-equipo-header">
          <div className="header-icon-wrapper">
            <div className="icon-circle">
              <span className="header-icon">🔧</span>
            </div>
          </div>
          <h2 className="titulo-reportar">Reporta los equipos que presenten fallas</h2>
        </div>

        <div className="reportar-equipo-inner">

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {success && (() => { window.alert(success); setSuccess(null); return null; })()}

        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3 form-group-enhanced">
            <Form.Label className="label-with-icon">
              Identificador de Equipo *
            </Form.Label>
            <Form.Control
              type="number"
              name="idElemento"
              placeholder="Ingrese el identificador del equipo"
              value={formData.idElemento}
              onChange={handleInputChange}
              required
              className="input-enhanced"
            />
          </Form.Group>

          <Form.Group className="mb-3 form-group-enhanced">
            <Form.Label className="label-with-icon">
              Ambiente/Ubicación *
            </Form.Label>
            <Form.Control
              type="text"
              name="ambiente"
              placeholder="Ej: Ambiente 301"
              value={formData.ambiente}
              onChange={handleInputChange}
              required
              className="input-enhanced"
            />
          </Form.Group>

          <Form.Group className="mb-3 form-group-enhanced">
            <Form.Label className="label-with-icon">
              <span className="label-icon">⚠️</span>
              Seleccione los problemas *
            </Form.Label>
            {loading ? (
              <div className="text-center py-3">
                <Spinner animation="border" size="sm" />
                <span className="ms-2">Cargando problemas...</span>
              </div>
            ) : (
              <div className="problemas-grid" style={{display: 'flex', gap: 24}}>
                {Object.entries(
                  problemas.reduce((acc, problema) => {
                    const tipo = problema.tipo_problema || 'Otros';
                    if (!acc[tipo]) acc[tipo] = [];
                    acc[tipo].push(problema);
                    return acc;
                  }, {})
                ).map(([tipo, lista]) => (
                  <div key={tipo} style={{minWidth: 220, flex: 1}}>
                    <div style={{fontWeight: 700, color: '#38a169', fontSize: '1.1rem', marginBottom: 10, textAlign: 'center'}}>{tipo}</div>
                    {lista.map(problema => (
                      <div key={problema.id} className="problema-item">
                        <label className="custom-checkbox">
                          <input
                            type="checkbox"
                            name="problemas"
                            checked={formData.problemasSeleccionados.includes(problema.id)}
                            onChange={() => handleProblemaChange(problema.id)}
                          />
                          <span className="checkmark"></span>
                          <span>{problema.descr_problem}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </Form.Group>

          {/* ✅ Observaciones */}
          <Form.Group className="mb-3 form-group-enhanced">
            <Form.Label className="label-with-icon">
              Observaciones (Opcional)
            </Form.Label>
            <Form.Control
              as="textarea"
              name="observaciones"
              rows={3}
              placeholder="Detalles adicionales del problema..."
              value={formData.observaciones}
              onChange={handleInputChange}
              maxLength={255}
              className="input-enhanced textarea-enhanced"
            />
            <Form.Text className="text-muted counter-text">
              <span className="counter-icon">✏️</span>
              {formData.observaciones.length}/255 caracteres
            </Form.Text>
          </Form.Group>

          {/* ✅ Sección de imágenes */}
          <Form.Group className="mb-3 form-group-enhanced">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Form.Label className="label-with-icon">
                <span className="label-icon">📸</span>
                Imágenes (Opcional)
              </Form.Label>
              <Button variant="outline-success" size="sm" as="label" disabled={imagenCargando} className="btn-agregar-imagen-modern">
                {imagenCargando ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-1" />
                    Procesando...
                  </>
                ) : (
                  <>
                    Agregar Imagen
                  </>
                )}
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
              <div className="imagenes-preview-grid">
                {imagenes.map((img, index) => (
                  <div key={index} className="imagen-preview-card">
                    <div className="imagen-wrapper">
                      <img src={img} alt={`Preview ${index + 1}`} className="imagen-preview" />
                      <div className="imagen-overlay">
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="btn-eliminar-imagen"
                          onClick={() => handleEliminarImagen(index)}
                        >
                          <span className="btn-icon">🗑️</span>
                          Eliminar
                        </Button>
                      </div>
                    </div>
                    <div className="imagen-numero">Imagen {index + 1}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="imagenes-info">
              <span className="info-icon">ℹ️</span>
              <Form.Text className="text-muted">
                {imagenes.length > 0 
                  ? `${imagenes.length} imagen(es) agregada(s)` 
                  : 'No hay imágenes agregadas'}
              </Form.Text>
            </div>
          </Form.Group>

          <div className="botones-accion">
            <Button 
              variant="outline-success"
              type="submit"
              disabled={submitting}
              className="btn-reportar"
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Reportando...
                </>
              ) : (
                <>
                  Reportar
                </>
              )}
            </Button>

            <Button 
              variant="outline-secondary"
              onClick={handleLimpiar}
              disabled={submitting}
              className="btn-limpiar"
            >
              <span className="btn-icon">🔄</span>
              Limpiar Formulario
            </Button>
          </div>

        </Form>
        </div>
      </div>
    </div>
  );
}
export default ReportarEquipo;