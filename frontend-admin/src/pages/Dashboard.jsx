import { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentIncidencias, setRecentIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, incidenciasRes] = await Promise.all([
        axios.get('/api/analytics/dashboard'),
        axios.get('/api/incidencias/list?limit=5')
      ]);

      setStats(analyticsRes.data);
      setRecentIncidencias(incidenciasRes.data.incidencias);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
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

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Incidencias Recientes</h3>
          <p className="stat-number">{stats?.incidenciasRecientes || 0}</p>
          <p className="stat-label">Últimos 7 días</p>
        </div>
        <div className="stat-card">
          <h3>Tiempo Promedio</h3>
          <p className="stat-number">
            {stats?.tiempoPromedioHoras
              ? `${Math.round(stats.tiempoPromedioHoras)}h`
              : 'N/A'}
          </p>
          <p className="stat-label">Resolución</p>
        </div>
        <div className="stat-card">
          <h3>Por Estado</h3>
          <div className="estado-stats">
            {stats?.porEstado?.map((item) => (
              <div key={item.estado} className="estado-item">
                <span
                  className="estado-dot"
                  style={{ backgroundColor: getEstadoColor(item.estado) }}
                ></span>
                <span>{item.cantidad}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="stat-card">
          <h3>Por Prioridad</h3>
          <div className="prioridad-stats">
            {stats?.porPrioridad?.map((item) => (
              <div key={item.prioridad} className="prioridad-item">
                <span
                  className="prioridad-badge"
                  style={{ backgroundColor: getPrioridadColor(item.prioridad) }}
                >
                  {item.prioridad}
                </span>
                <span>{item.cantidad}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>Incidencias Recientes</h2>
          <div className="incidencias-list">
            {recentIncidencias.length === 0 ? (
              <p>No hay incidencias recientes</p>
            ) : (
              recentIncidencias.map((incidencia) => (
                <div key={incidencia.id} className="incidencia-card">
                  <div className="incidencia-header">
                    <span className="incidencia-id">#{incidencia.id}</span>
                    <span
                      className="estado-badge"
                      style={{ backgroundColor: getEstadoColor(incidencia.estado) }}
                    >
                      {incidencia.estado}
                    </span>
                  </div>
                  <h4>{incidencia.tipo}</h4>
                  <p>{incidencia.descripcion}</p>
                  <div className="incidencia-footer">
                    <span>Por: {incidencia.usuario_nombre}</span>
                    <span
                      className="prioridad-badge-small"
                      style={{
                        backgroundColor: getPrioridadColor(incidencia.prioridad)
                      }}
                    >
                      {incidencia.prioridad}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="section">
          <h2>Incidencias por Categoría</h2>
          <div className="categoria-stats">
            {stats?.porCategoria?.map((item) => (
              <div key={item.tipo} className="categoria-item">
                <div className="categoria-header">
                  <h4>{item.tipo}</h4>
                  <span className="categoria-total">{item.cantidad}</span>
                </div>
                <div className="categoria-bars">
                  <div className="bar-item">
                    <span>Resueltas: {item.resueltas}</span>
                    <div className="bar">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${(item.resueltas / item.cantidad) * 100}%`,
                          backgroundColor: '#10b981'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="bar-item">
                    <span>En proceso: {item.en_proceso}</span>
                    <div className="bar">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${(item.en_proceso / item.cantidad) * 100}%`,
                          backgroundColor: '#3b82f6'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="bar-item">
                    <span>Pendientes: {item.pendientes}</span>
                    <div className="bar">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${(item.pendientes / item.cantidad) * 100}%`,
                          backgroundColor: '#f59e0b'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

