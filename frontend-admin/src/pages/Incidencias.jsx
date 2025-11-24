import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
import './Incidencias.css';

const Incidencias = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    estado: '',
    tipo: '',
    prioridad: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchIncidencias();
  }, [filters]);

  const fetchIncidencias = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.estado) params.append('estado', filters.estado);
      if (filters.tipo) params.append('tipo', filters.tipo);
      if (filters.prioridad) params.append('prioridad', filters.prioridad);

      const response = await api.get(`/api/incidencias/list?${params.toString()}`);
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

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="incidencias-page">
      <div className="page-header">
        <h1>Incidencias</h1>
      </div>

      <div className="filters">
        <select
          value={filters.estado}
          onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En Proceso</option>
          <option value="resuelto">Resuelto</option>
        </select>

        <select
          value={filters.tipo}
          onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
        >
          <option value="">Todas las categorías</option>
          <option value="Ascensor">Ascensor</option>
          <option value="Electricidad">Electricidad</option>
          <option value="Plomería">Plomería</option>
          <option value="Filtraciones">Filtraciones</option>
          <option value="Seguridad">Seguridad</option>
          <option value="Limpieza">Limpieza</option>
          <option value="Otros">Otros</option>
        </select>

        <select
          value={filters.prioridad}
          onChange={(e) => setFilters({ ...filters, prioridad: e.target.value })}
        >
          <option value="">Todas las prioridades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <div className="incidencias-grid">
        {incidencias.length === 0 ? (
          <p className="no-data">No hay incidencias</p>
        ) : (
          incidencias.map((incidencia) => (
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
                  {incidencia.estado}
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
                  <span className="usuario">👤 {incidencia.usuario_nombre}</span>
                  {incidencia.edificio_nombre && (
                    <span className="edificio">🏢 {incidencia.edificio_nombre}</span>
                  )}
                </div>
                <span
                  className="prioridad-badge"
                  style={{ backgroundColor: getPrioridadColor(incidencia.prioridad) }}
                >
                  {incidencia.prioridad}
                </span>
              </div>

              {incidencia.proveedor_nombre && (
                <div className="proveedor-info">
                  Proveedor: {incidencia.proveedor_nombre}
                </div>
              )}

              <div className="fechas">
                <small>
                  Creada: {new Date(incidencia.fecha_creacion).toLocaleDateString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Incidencias;

