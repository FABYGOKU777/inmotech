import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './Analytics.css';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/analytics/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const estadoData = data?.porEstado?.map((item) => ({
    name: item.estado,
    value: item.cantidad
  }));

  const prioridadData = data?.porPrioridad?.map((item) => ({
    name: item.prioridad,
    value: item.cantidad
  }));

  const categoriaData = data?.porCategoria?.map((item) => ({
    name: item.tipo,
    cantidad: item.cantidad,
    resueltas: item.resueltas,
    en_proceso: item.en_proceso,
    pendientes: item.pendientes
  }));

  return (
    <div className="analytics-page">
      <h1>Analytics</h1>

      <div className="stats-overview">
        <div className="stat-box">
          <h3>Incidencias Recientes</h3>
          <p className="stat-value">{data?.incidenciasRecientes || 0}</p>
          <p className="stat-label">Últimos 7 días</p>
        </div>
        <div className="stat-box">
          <h3>Tiempo Promedio</h3>
          <p className="stat-value">
            {data?.tiempoPromedioHoras
              ? `${Math.round(data.tiempoPromedioHoras)}h`
              : 'N/A'}
          </p>
          <p className="stat-label">Resolución</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h2>Incidencias por Estado</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={estadoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {estadoData?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Incidencias por Prioridad</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prioridadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container full-width">
        <h2>Incidencias por Categoría</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={categoriaData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="resueltas" stackId="a" fill="#10b981" />
            <Bar dataKey="en_proceso" stackId="a" fill="#3b82f6" />
            <Bar dataKey="pendientes" stackId="a" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="ranking-section">
        <h2>Ranking de Proveedores</h2>
        <div className="ranking-table">
          <table>
            <thead>
              <tr>
                <th>Posición</th>
                <th>Proveedor</th>
                <th>Especialidad</th>
                <th>Total Incidencias</th>
                <th>Resueltas</th>
                <th>Tiempo Promedio</th>
              </tr>
            </thead>
            <tbody>
              {data?.rankingProveedores?.map((proveedor, index) => (
                <tr key={proveedor.nombre_empresa}>
                  <td>#{index + 1}</td>
                  <td>{proveedor.nombre_empresa}</td>
                  <td>{proveedor.especialidad}</td>
                  <td>{proveedor.total_incidencias}</td>
                  <td>{proveedor.resueltas}</td>
                  <td>
                    {proveedor.horas_promedio_resolucion
                      ? `${Math.round(proveedor.horas_promedio_resolucion)}h`
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

