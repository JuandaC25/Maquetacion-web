import React from 'react';
import { Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
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
    handleProblemaChange,
    handleInputChange,
    handleSubmit,
    handleLimpiar,
    setError,
    setSuccess,
    detallesProblemas,
    actualizarDescripcion,
    agregarImagenes,
    eliminarImagen
  } = useReportarEquipo();

  // Estado para modal de detalles
  const [modalProblemaId, setModalProblemaId] = React.useState(null);
  const [selectedTipo, setSelectedTipo] = React.useState(null);

  React.useEffect(() => {
    if (problemas && problemas.length > 0) {
      const tipos = Object.keys(
        problemas.reduce((acc, problema) => {
          const tipo = problema.tipo_problema || 'Otros';
          if (!acc[tipo]) acc[tipo] = [];
          acc[tipo].push(problema);
          return acc;
        }, {})
      );
      setSelectedTipo(prev => prev || tipos[0] || null);
    }
  }, [problemas]);

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

        {success && (
          <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
            <Alert.Heading>¡Operación exitosa!</Alert.Heading>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {success}
            </div>
            <hr />
            <div className="d-flex justify-content-end">
              <Button onClick={() => setSuccess(null)} variant="outline-success">
                Cerrar mensaje
              </Button>
            </div>
          </Alert>
        )}

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
              <div className="problemas-grid two-column">
                <div className="tipos-list">
                  {Object.entries(
                    problemas.reduce((acc, problema) => {
                      const tipo = problema.tipo_problema || 'Otros';
                      if (!acc[tipo]) acc[tipo] = [];
                      acc[tipo].push(problema);
                      return acc;
                    }, {})
                  ).map(([tipo, lista]) => (
                    <div
                      key={tipo}
                      className={`tipo-item ${selectedTipo === tipo ? 'active' : ''}`}
                      onClick={() => setSelectedTipo(tipo)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') setSelectedTipo(tipo); }}
                    >
                      {tipo} <span className="tipo-count">({lista.length})</span>
                    </div>
                  ))}
                </div>

                
                <div className="descripciones-list">
                  {selectedTipo ? (
                    (problemas.filter(p => (p.tipo_problema || 'Otros') === selectedTipo)).map(problema => {
                      const seleccionado = formData.problemasSeleccionados.includes(problema.id);
                      const detalles = detallesProblemas[problema.id] || {};
                      return (
                        <div key={problema.id} className="problema-item" style={{marginBottom: 8}}>
                          <label className="custom-checkbox">
                            <input
                              type="checkbox"
                              name="problemas"
                              checked={seleccionado}
                              onChange={() => handleProblemaChange(problema.id)}
                            />
                            <span className="checkmark"></span>
                            <span>{problema.descr_problem}</span>
                          </label>
                          {seleccionado && (
                            <div style={{marginLeft: 24, marginTop: 4}}>
                              <Button
                                variant="primary"
                                size="sm"
                                style={{marginBottom: 4, fontWeight: 600, letterSpacing: 0.5}}
                                onClick={() => setModalProblemaId(problema.id)}
                              >
                                <span style={{display:'inline-flex',alignItems:'center'}}>
                                  <span style={{fontSize:18,marginRight:4}}>📝</span> Detalles
                                </span>
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-muted">Selecciona un tipo para ver las descripciones</div>
                  )}
                </div>
              </div>
            )}
          </Form.Group>


          {/* MODAL para detalles de problema */}
          <Modal show={!!modalProblemaId} onHide={() => setModalProblemaId(null)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Detalles del problema</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalProblemaId && (() => {
                const detalles = detallesProblemas[modalProblemaId] || {};
                const problema = problemas.find(p => p.id === modalProblemaId);
                return (
                  <>
                    <div style={{fontWeight:600,marginBottom:8}}>{problema?.descr_problem}</div>
                    <Form.Group>
                      <Form.Label>Descripción (opcional)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Describe el problema con más detalle"
                        value={detalles.descripcion || ''}
                        onChange={e => actualizarDescripcion(modalProblemaId, e.target.value)}
                        maxLength={255}
                      />
                      <Form.Text className="text-muted">{(detalles.descripcion||'').length}/255 caracteres</Form.Text>
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label>Imágenes (opcional)</Form.Label>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <Form.Control
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={e => agregarImagenes(modalProblemaId, e.target.files)}
                          disabled={imagenCargando}
                          style={{maxWidth:220}}
                        />
                        {/* Eliminar el texto 'Ningún archivo seleccionado' para que solo se vea el botón */}
                      </div>
                      {detalles.imagenes && detalles.imagenes.length > 0 && (
                        <div className="imagenes-preview-grid mt-2">
                          {detalles.imagenes.map((img, idx) => (
                            <div key={idx} className="imagen-preview-card">
                              <div className="imagen-wrapper">
                                <img 
                                  src={img} 
                                  alt={`img-${idx}`} 
                                  className="imagen-preview imagen-modal-preview"
                                />
                                <div className="imagen-overlay">
                                  <button
                                    type="button"
                                    className="btn-eliminar-imagen"
                                    onClick={() => eliminarImagen(modalProblemaId, idx)}
                                    title="Eliminar imagen"
                                  >
                                    <span className="btn-icon">🗑️</span> Quitar imagen
                                  </button>
                                </div>
                              </div>
                              <div className="imagen-numero">Imagen {idx + 1}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Form.Group>
                  </>
                );
              })()}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setModalProblemaId(null)}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>

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