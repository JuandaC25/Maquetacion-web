# Ejemplo: Crear Ticket con Imágenes (Opcional)

## 📁 Ubicación de Imágenes
Todas las imágenes se guardan en:
```
uploads/
  ├── espacios/    ← Imágenes de espacios
  └── tickets/     ← Imágenes de tickets
```

## ✅ El campo `imageness` es **OPCIONAL**

Puedes crear tickets con o sin imágenes.

---

## 📝 Opción 1: Crear Ticket SIN Imágenes

```javascript
import { crearTicket } from '../api/ticket';

const ticketData = {
  id_elem: 1,
  id_problem: 2,
  ambient: "Lab 301",
  obser: "Pantalla rota",
  id_usu: userId,
  fecha_in: new Date().toISOString(),
  // imageness: null  ← No es necesario enviar este campo
};

const ticket = await crearTicket(ticketData);
```

---

## 🖼️ Opción 2: Crear Ticket CON Imágenes

```javascript
import { crearTicket, subirImagenesTicket } from '../api/ticket';

// 1. Usuario selecciona imágenes
const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  
  // Convertir a Base64
  const promises = files.map(file => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  });
  
  Promise.all(promises).then(base64Images => {
    setImagenes(base64Images);
  });
};

// 2. Al crear el ticket
const handleSubmit = async (e) => {
  e.preventDefault();
  
  let imageUrls = [];
  
  // Solo subir imágenes si hay alguna seleccionada
  if (imagenes.length > 0) {
    const { urls } = await subirImagenesTicket(imagenes);
    imageUrls = urls;
  }
  
  // 3. Crear ticket
  const ticketData = {
    id_elem: elementoId,
    id_problem: problemaId,
    ambient: ambiente,
    obser: observaciones,
    id_usu: userId,
    fecha_in: new Date().toISOString(),
    imageness: imageUrls.length > 0 ? JSON.stringify(imageUrls) : null
  };
  
  const ticket = await crearTicket(ticketData);
};
```

---

## 🎨 Componente Completo Ejemplo

```jsx
import React, { useState } from 'react';
import { crearTicket, subirImagenesTicket } from '../api/ticket';

export default function CrearTicket() {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleImageChange = (e) => {
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
    
    try {
      let imageUrls = [];
      
      // Solo subir si hay imágenes
      if (imagenes.length > 0) {
        console.log('Subiendo imágenes...');
        const result = await subirImagenesTicket(imagenes);
        imageUrls = result.urls;
        console.log('URLs recibidas:', imageUrls);
      }
      
      // Crear ticket
      const ticketData = {
        id_elem: 1, // Obtener del formulario
        id_problem: 2, // Obtener del formulario
        ambient: "Lab 301", // Obtener del formulario
        obser: "Observaciones...", // Obtener del formulario
        id_usu: 1, // Obtener del contexto de usuario
        fecha_in: new Date().toISOString(),
        imageness: imageUrls.length > 0 ? JSON.stringify(imageUrls) : null
      };
      
      const ticket = await crearTicket(ticketData);
      alert('Ticket creado exitosamente!');
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear ticket');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario... */}
      
      {/* Campo de imágenes OPCIONAL */}
      <div className="mb-3">
        <label>Imágenes (Opcional)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
      </div>
      
      {/* Preview de imágenes */}
      {imagenes.length > 0 && (
        <div className="row">
          {imagenes.map((img, index) => (
            <div key={index} className="col-md-3 mb-2">
              <img 
                src={img} 
                alt={`Preview ${index}`}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
              <button 
                type="button"
                onClick={() => handleEliminarImagen(index)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Ticket'}
      </button>
    </form>
  );
}
```

---

## 🔍 Mostrar Imágenes de un Ticket

```jsx
import { obtenerTicketPorId } from '../api/ticket';

const MostrarTicket = ({ ticketId }) => {
  const [ticket, setTicket] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  
  useEffect(() => {
    const cargar = async () => {
      const data = await obtenerTicketPorId(ticketId);
      setTicket(data);
      
      // Parsear imágenes si existen
      if (data.imageness) {
        const urls = JSON.parse(data.imageness);
        setImageUrls(urls);
      }
    };
    
    cargar();
  }, [ticketId]);
  
  return (
    <div>
      <h3>Ticket #{ticket?.id_tickets}</h3>
      <p>{ticket?.Obser}</p>
      
      {/* Mostrar imágenes solo si existen */}
      {imageUrls.length > 0 && (
        <div className="galeria">
          <h4>Imágenes del problema:</h4>
          {imageUrls.map((url, index) => (
            <img 
              key={index}
              src={`http://localhost:8081${url}`}
              alt={`Ticket imagen ${index + 1}`}
              style={{ width: '200px', margin: '10px' }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## ✨ Resumen

- ✅ **Imágenes OPCIONALES** - No es necesario subir imágenes
- ✅ **Si no hay imágenes** - Enviar `imageness: null` o no enviar el campo
- ✅ **Si hay imágenes** - Primero subir con `subirImagenesTicket()`, luego crear ticket con URLs
- ✅ **Guardar como JSON** - `imageness: JSON.stringify(urls)`
- ✅ **Leer como JSON** - `JSON.parse(ticket.imageness)`
