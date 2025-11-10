import React, { useState } from 'react';
import './Crear_espacio.css';
import { Form, Button, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import { crearEspacio, subirImagenesEspacio } from '../../../../api/EspaciosApi';

function CrearEspacio() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagenCargando, setImagenCargando] = useState(false);

  const [formData, setFormData] = useState({
    nom_espa: '',
    descripcion: '',
    estadoespacio: 1,
    imagenes: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Convertir imagen a Base64
  const convertirImagenABase64 = (archivo) => {
    return new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.readAsDataURL(archivo);
      lector.onload = () => resolve(lector.result);
      lector.onerror = (error) => reject(error);
    });
  };

  // Agregar imágenes
  const handleAgregarImagenes = async (e) => {
    const archivos = Array.from(e.target.files);
    if (archivos.length === 0) return;

    setImagenCargando(true);
    setError(null);

    try {
      const imagenesBase64 = await Promise.all(
        archivos.map(archivo => convertirImagenABase64(archivo))
      );

      setFormData(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, ...imagenesBase64]
      }));

      setSuccess(`✓ ${archivos.length} imagen(es) agregada(s) correctamente`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error al procesar las imágenes", err);
      setError("No se pudieron cargar las imágenes.");
    } finally {
      setImagenCargando(false);
    }
  };

  // Eliminar imagen
  const eliminarImagen = (index) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
  };

  const validarFormulario = () => {
    if (!formData.nom_espa.trim()) {
      setError('El nombre del espacio es obligatorio');
      return false;
    }
    if (formData.nom_espa.length > 25) {
      setError('El nombre del espacio no puede exceder 25 caracteres');
      return false;
    }
    if (!formData.descripcion.trim()) {
      setError('La descripción es obligatoria');
      return false;
    }
    if (formData.descripcion.length > 900) {
      setError('La descripción no puede exceder 900 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validarFormulario()) return;

    setLoading(true);

    try {
      let imageUrls = [];

      // Si hay imágenes, subirlas primero al servidor y obtener URLs
      if (formData.imagenes.length > 0) {
        console.log('Subiendo imágenes al servidor...');
        const resultUpload = await subirImagenesEspacio(formData.imagenes);
        imageUrls = resultUpload.urls;
        console.log('URLs de imágenes recibidas:', imageUrls);
      }

      // Crear el espacio con las URLs de las imágenes (no Base64)
      const espacioData = {
        nom_espa: formData.nom_espa,
        descripcion: formData.descripcion,
        estadoespacio: parseInt(formData.estadoespacio),
        imagenes: JSON.stringify(imageUrls) // Guardar URLs en lugar de Base64
      };

      console.log('Creando espacio con datos:', espacioData);
      const response = await crearEspacio(espacioData);

      setSuccess(`✓ Espacio "${formData.nom_espa}" creado exitosamente!`);

      // Limpiar formulario
      setFormData({
        nom_espa: '',
        descripcion: '',
        estadoespacio: 1,
        imagenes: []
      });

      // Scroll al inicio para ver el mensaje
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error al crear espacio:', err);
      setError('Error al crear el espacio: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-espacio-container">
      <div className="crear-espacio-header">
        <h2>Crear Nuevo Espacio</h2>
        <p className="text-muted">Completa el formulario para agregar un nuevo espacio con imágenes</p>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
          {success}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className="crear-espacio-form">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Espacio *</Form.Label>
              <Form.Control
                type="text"
                name="nom_espa"
                value={formData.nom_espa}
                onChange={handleInputChange}
                placeholder="Ej: Laboratorio 101"
                maxLength={25}
                required
              />
              <Form.Text className="text-muted">
                {formData.nom_espa.length}/25 caracteres
              </Form.Text>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Estado *</Form.Label>
              <Form.Select
                name="estadoespacio"
                value={formData.estadoespacio}
                onChange={handleInputChange}
                required
              >
                <option value={1}>Activo</option>
                <option value={2}>Inactivo</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Descripción *</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            placeholder="Describe el espacio, su capacidad, equipamiento, etc."
            maxLength={900}
            required
          />
          <Form.Text className="text-muted">
            {formData.descripcion.length}/900 caracteres
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Imágenes del Espacio</Form.Label>
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline-primary"
              as="label"
              disabled={imagenCargando}
              className="d-flex align-items-center gap-2"
            >
              {imagenCargando ? (
                <>
                  <Spinner animation="border" size="sm" />
                  <span>Cargando...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-image"></i>
                  <span>Agregar Imágenes</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAgregarImagenes}
                style={{ display: 'none' }}
                disabled={imagenCargando}
              />
            </Button>
            <Form.Text className="text-muted">
              Puedes seleccionar múltiples imágenes
            </Form.Text>
          </div>

          {/* Vista previa de imágenes */}
          {formData.imagenes.length > 0 && (
            <div className="imagenes-preview mt-3">
              <p className="mb-2">
                <strong>{formData.imagenes.length} imagen(es) agregada(s)</strong>
              </p>
              <Row className="g-3">
                {formData.imagenes.map((imagen, index) => (
                  <Col xs={6} md={4} lg={3} key={index}>
                    <Card className="imagen-card">
                      <Card.Img
                        variant="top"
                        src={imagen}
                        alt={`Imagen ${index + 1}`}
                        className="imagen-preview"
                      />
                      <Card.Body className="p-2">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => eliminarImagen(index)}
                          className="w-100"
                        >
                          <i className="bi bi-trash"></i> Eliminar
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Form.Group>

        <div className="d-flex gap-2 justify-content-end">
          <Button
            variant="secondary"
            onClick={() => {
              setFormData({
                nom_espa: '',
                descripcion: '',
                estadoespacio: 1,
                imagenes: []
              });
              setError(null);
              setSuccess(null);
            }}
          >
            Limpiar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="d-flex align-items-center gap-2"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" />
                <span>Creando...</span>
              </>
            ) : (
              <>
                <i className="bi bi-check-circle"></i>
                <span>Crear Espacio</span>
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CrearEspacio;
