import express from 'express';
import pool from '../db/connection.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Analytics generales (solo admin)
router.get('/dashboard', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    // Incidencias por categoría
    const porCategoria = await pool.query(`
      SELECT tipo, COUNT(*) as cantidad, 
             COUNT(*) FILTER (WHERE estado = 'resuelto') as resueltas,
             COUNT(*) FILTER (WHERE estado = 'pendiente') as pendientes,
             COUNT(*) FILTER (WHERE estado = 'en_proceso') as en_proceso
      FROM incidencias
      GROUP BY tipo
      ORDER BY cantidad DESC
    `);

    // Incidencias por estado
    const porEstado = await pool.query(`
      SELECT estado, COUNT(*) as cantidad
      FROM incidencias
      GROUP BY estado
    `);

    // Incidencias por prioridad
    const porPrioridad = await pool.query(`
      SELECT prioridad, COUNT(*) as cantidad
      FROM incidencias
      GROUP BY prioridad
    `);

    // Tiempo promedio de resolución
    const tiempoPromedio = await pool.query(`
      SELECT 
        AVG(EXTRACT(EPOCH FROM (fecha_actualizacion - fecha_creacion)) / 3600) as horas_promedio
      FROM incidencias
      WHERE estado = 'resuelto'
    `);

    // Ranking de proveedores
    const rankingProveedores = await pool.query(`
      SELECT 
        p.nombre_empresa,
        p.especialidad,
        COUNT(i.id) as total_incidencias,
        COUNT(i.id) FILTER (WHERE i.estado = 'resuelto') as resueltas,
        AVG(EXTRACT(EPOCH FROM (i.fecha_actualizacion - i.fecha_creacion)) / 3600) 
          FILTER (WHERE i.estado = 'resuelto') as horas_promedio_resolucion
      FROM proveedores p
      LEFT JOIN incidencias i ON p.id = i.proveedor_id
      GROUP BY p.id, p.nombre_empresa, p.especialidad
      HAVING COUNT(i.id) > 0
      ORDER BY resueltas DESC, horas_promedio_resolucion ASC
      LIMIT 10
    `);

    // Incidencias recientes (últimas 7 días)
    const recientes = await pool.query(`
      SELECT COUNT(*) as cantidad
      FROM incidencias
      WHERE fecha_creacion >= NOW() - INTERVAL '7 days'
    `);

    res.json({
      porCategoria: porCategoria.rows,
      porEstado: porEstado.rows,
      porPrioridad: porPrioridad.rows,
      tiempoPromedioHoras: tiempoPromedio.rows[0]?.horas_promedio || 0,
      rankingProveedores: rankingProveedores.rows,
      incidenciasRecientes: recientes.rows[0]?.cantidad || 0
    });
  } catch (error) {
    next(error);
  }
});

export default router;

