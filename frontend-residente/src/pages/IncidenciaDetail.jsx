import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/axios';
import './IncidenciaDetail.css';

const IncidenciaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incidencia, setIncidencia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidencia();
  }, [id]);

  const fetchIncidencia = async () => {
    try {
      const response = await api.get(`/api/incidencias/${id}`);
      setIncidencia(response.data.incidencia);
    } catch (error) {
      console.error('Error fetching incidencia:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!incidencia) {
    return <div className="error">Incidencia no encontrada</div>;
  }

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

  return (
    <div className="incidencia-detail-page">
      <button onClick={() => navigate('/mis-incidencias')} className="back-btn">
        ← Volver
      </button>

      <div className="detail-header">
        <h1>Incidencia #{incidencia.id}</h1>
        <div className="badges">
          <span
            className="estado-badge"
            style={{ backgroundColor: getEstadoColor(incidencia.estado) }}
          >
            {getEstadoText(incidencia.estado)}
          </span>
          <span
            className="prioridad-badge"
            style={{ backgroundColor: getPrioridadColor(incidencia.prioridad) }}
          >
            {incidencia.prioridad}
          </span>
          <span className="tipo-badge">{incidencia.tipo}</span>
        </div>
      </div>

      <div className="detail-content">
        <div className="section">
          <h2>Descripción</h2>
          <p>{incidencia.descripcion}</p>
        </div>

        {incidencia.imagen_url && (
          <div className="section">
            <h2>Imagen</h2>
            <div className="imagen-container">
              <img
                src={`http://localhost:3000${incidencia.imagen_url}`}
                alt="Incidencia"
              />
            </div>
          </div>
        )}

        <div className="section">
          <h2>Información</h2>
          <div className="info-grid">
            {incidencia.edificio_nombre && (
              <div className="info-item">
                <label>Edificio:</label>
                <p>{incidencia.edificio_nombre}</p>
              </div>
            )}
            {incidencia.proveedor_nombre && (
              <div className="info-item">
                <label>Proveedor Asignado:</label>
                <p>{incidencia.proveedor_nombre}</p>
                {incidencia.proveedor_especialidad && (
                  <small>{incidencia.proveedor_especialidad}</small>
                )}
              </div>
            )}
            <div className="info-item">
              <label>Fecha de Creación:</label>
              <p>{new Date(incidencia.fecha_creacion).toLocaleString()}</p>
            </div>
            <div className="info-item">
              <label>Última Actualización:</label>
              <p>{new Date(incidencia.fecha_actualizacion).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {incidencia.estado === 'resuelto' && (
          <div className="section success">
            <h2>✅ Incidencia Resuelta</h2>
            <p>Tu incidencia ha sido resuelta exitosamente.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidenciaDetail;

