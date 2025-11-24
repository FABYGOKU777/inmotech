import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MisIncidencias.css';

const MisIncidencias = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchIncidencias();
  }, [filter]);

  const fetchIncidencias = async () => {
    try {
      const params = filter ? `?estado=${filter}` : '';
      const response = await axios.get(`/api/incidencias/list${params}`);
      setIncidencias(response.data.incidencias);
    } catch (error) {
      console.error('Error fetching incidencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      pendiente: '#f59e0b',
      en_proceso: '#3b82f6',
      resuelto: '#10b981'
    };
    return colors[estado] || '#666';
  };

  const getPrioridadColor = (prioridad) => {
    const colors = {
      baja: '#10b981',
      media: '#f59e0b',
      alta: '#ef4444'
    };
    return colors[prioridad] || '#666';
  };

  const getEstadoText = (estado) => {
    const textos = {
      pendiente: 'Pendiente',
      en_proceso: 'En Proceso',
      resuelto: 'Resuelta'
    };
    return textos[estado] || estado;
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="mis-incidencias-page">
      <div className="page-header">
        <h1>Mis Incidencias</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Todas</option>
          <option value="pendiente">Pendientes</option>
          <option value="en_proceso">En Proceso</option>
          <option value="resuelto">Resueltas</option>
        </select>
      </div>

      {incidencias.length === 0 ? (
        <div className="empty-state">
          <p>No tienes incidencias reportadas</p>
          <button
            onClick={() => navigate('/nueva')}
            className="new-incidencia-btn"
          >
            Reportar Nueva Incidencia
          </button>
        </div>
      ) : (
        <div className="incidencias-list">
          {incidencias.map((incidencia) => (
            <div
              key={incidencia.id}
              className="incidencia-card"
              onClick={() => navigate(`/incidencias/${incidencia.id}`)}
            >
              <div className="card-header">
                <span className="incidencia-id">#{incidencia.id}</span>
                <span
                  className="estado-badge"
                  style={{ backgroundColor: getEstadoColor(incidencia.estado) }}
                >
                  {getEstadoText(incidencia.estado)}
                </span>
              </div>

              <h3>{incidencia.tipo}</h3>
              <p className="descripcion">{incidencia.descripcion}</p>

              {incidencia.imagen_url && (
                <div className="imagen-preview">
                  <img
                    src={`http://localhost:3000${incidencia.imagen_url}`}
                    alt="Incidencia"
                  />
                </div>
              )}

              <div className="card-footer">
                <div className="card-info">
                  <span
                    className="prioridad-badge"
                    style={{
                      backgroundColor: getPrioridadColor(incidencia.prioridad)
                    }}
                  >
                    {incidencia.prioridad}
                  </span>
                  {incidencia.proveedor_nombre && (
                    <span className="proveedor">
                      Proveedor: {incidencia.proveedor_nombre}
                    </span>
                  )}
                </div>
                <span className="fecha">
                  {new Date(incidencia.fecha_creacion).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisIncidencias;

