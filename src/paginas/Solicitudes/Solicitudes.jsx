import React, { useEffect, useState } from "react";

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    console.log("✅ useEffect ejecutado (cargando solicitudes)");

    fetch("http://localhost:8081/api/solicitudes")
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Datos recibidos:", data);
        setSolicitudes(data);
      })
      .catch((err) => console.error("❌ Error al cargar:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Solicitudes de préstamo</h2>

      {solicitudes.length === 0 ? (
        <p>No hay solicitudes disponibles</p>
      ) : (
        solicitudes.map((sol) => (
          <div
            key={sol.id_soli}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p><strong>Elemento:</strong> {sol.nom_elem}</p>
            <p><strong>Usuario:</strong> {sol.nom_usu}</p>
            <p><strong>Fecha inicio:</strong> {sol.fecha_ini}</p>
            <p><strong>Fecha fin:</strong> {sol.fecha_fn}</p>
          </div>
        ))
      )}
    </div>
  );
}
