import React, { useState } from 'react';
import { crearEspacio, subirImagenesEspacio } from '../../../api/EspaciosApi';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CrearEspacio() {
  const [formData, setFormData] = useState({
    nom_espa: '',
    descripcion: '',
    estadoespacio: 1
  });

  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAgregarImagen = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenes(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleEliminarImagen = (index) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    try {
      // Validar que haya al menos un campo lleno
      if (!formData.nom_espa.trim() || !formData.descripcion.trim()) {
        setMensaje({ tipo: 'error', texto: 'El nombre y la descripción son obligatorios' });
        setLoading(false);
        return;
      }

      let imageUrls = [];

      // Si hay imágenes, subirlas primero
      if (imagenes.length > 0) {
        console.log('Subiendo imágenes...');
        const resultUpload = await subirImagenesEspacio(imagenes);
        imageUrls = resultUpload.urls;
        console.log('URLs recibidas:', imageUrls);
      }

      // Crear el espacio con las URLs de las imágenes
      const dataToSend = {
        ...formData,
        imagenes: JSON.stringify(imageUrls) // Guardar como JSON string de URLs
      };

      console.log('Datos a enviar:', dataToSend);

      const response = await crearEspacio(dataToSend);
      
      setMensaje({ tipo: 'success', texto: response.mensaje || 'Espacio creado exitosamente' });
      
      // Limpiar el formulario
      setFormData({
        nom_espa: '',
        descripcion: '',
        estadoespacio: 1
      });
      setImagenes([]);

    } catch (error) {
      console.error('Error al crear espacio:', error);
      setMensaje({ 
        tipo: 'error', 
        texto: error.message || 'Error al crear el espacio' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h3>Crear Nuevo Espacio</h3>
        </div>
        <div className="card-body">
          {mensaje && (
            <div className={`alert alert-${mensaje.tipo === 'error' ? 'danger' : 'success'} alert-dismissible fade show`} role="alert">
              {mensaje.texto}
              <button type="button" className="btn-close" onClick={() => setMensaje(null)}></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nom_espa" className="form-label">Nombre del Espacio *</label>
              <input
                type="text"
                className="form-control"
                id="nom_espa"
                name="nom_espa"
                value={formData.nom_espa}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción *</label>
              <textarea
                className="form-control"
                id="descripcion"
                name="descripcion"
                rows="4"
                value={formData.descripcion}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="estadoespacio" className="form-label">Estado</label>
              <select
                className="form-select"
                id="estadoespacio"
                name="estadoespacio"
                value={formData.estadoespacio}
                onChange={handleChange}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="imagenes" className="form-label">Imágenes</label>
              <input
                type="file"
                className="form-control"
                id="imagenes"
                accept="image/*"
                multiple
                onChange={handleAgregarImagen}
              />
              <small className="form-text text-muted">
                Puedes seleccionar múltiples imágenes
              </small>
            </div>

            {imagenes.length > 0 && (
              <div className="mb-3">
                <label className="form-label">Vista previa de imágenes:</label>
                <div className="row g-2">
                  {imagenes.map((img, index) => (
                    <div key={index} className="col-md-3">
                      <div className="card">
                        <img 
                          src={img} 
                          className="card-img-top" 
                          alt={`Preview ${index + 1}`}
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                        <div className="card-body p-2">
                          <button
                            type="button"
                            className="btn btn-danger btn-sm w-100"
                            onClick={() => handleEliminarImagen(index)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="d-grid gap-2">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creando...
                  </>
                ) : (
                  'Crear Espacio'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
