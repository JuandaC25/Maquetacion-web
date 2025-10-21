import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";

const TicketsActivosTec = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivos = async () => {
      try {
        setError("");
        setLoading(true);
        const res = await fetch("http://localhost:8081/api/tickets/activos");
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setTickets(Array.isArray(data) ? data : []);
      } catch {
        setError("No se pudo conectar con el backend o no hay tickets activos.");
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActivos();
  }, []);

  if (loading) return <Spinner animation="border" role="status"><span className="visually-hidden">Cargando tickets...</span></Spinner>;
  if (error) return <div style={{color:'red'}}>{error}</div>;
  if (!tickets.length) return <div>No hay tickets activos.</div>;

  return (
    <div>
      <h2>Tickets Activos</h2>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket.id_tickets}>
            #{ticket.id_tickets} - {ticket.ambient}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketsActivosTec;
