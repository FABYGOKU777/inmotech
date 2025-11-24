import pool from '../db/connection.js';

// Asignar proveedor automáticamente según la categoría
export const asignarProveedorAutomatico = async (categoria, prioridad) => {
  try {
    // Buscar proveedores que tengan la especialidad correspondiente
    const especialidadMap = {
      'Ascensor': 'Ascensores',
      'Electricidad': 'Electricidad',
      'Plomería': 'Plomería',
      'Filtraciones': 'Plomería',
      'Seguridad': 'Seguridad',
      'Limpieza': 'Limpieza',
      'Otros': 'General'
    };

    const especialidad = especialidadMap[categoria] || 'General';

    // Buscar proveedores disponibles (sin muchas incidencias pendientes)
    const result = await pool.query(
      `SELECT p.*, 
              COUNT(i.id) FILTER (WHERE i.estado IN ('pendiente', 'en_proceso')) as incidencias_pendientes
       FROM proveedores p
       LEFT JOIN incidencias i ON p.id = i.proveedor_id
       WHERE p.especialidad = $1 OR p.especialidad = 'General'
       GROUP BY p.id
       ORDER BY incidencias_pendientes ASC, p.tiempo_respuesta_est ASC
       LIMIT 1`,
      [especialidad]
    );

    if (result.rows.length > 0) {
      return result.rows[0].id;
    }

    // Si no hay proveedor específico, buscar uno general
    const generalResult = await pool.query(
      `SELECT p.*, 
              COUNT(i.id) FILTER (WHERE i.estado IN ('pendiente', 'en_proceso')) as incidencias_pendientes
       FROM proveedores p
       LEFT JOIN incidencias i ON p.id = i.proveedor_id
       WHERE p.especialidad = 'General'
       GROUP BY p.id
       ORDER BY incidencias_pendientes ASC
       LIMIT 1`
    );

    if (generalResult.rows.length > 0) {
      return generalResult.rows[0].id;
    }

    return null;
  } catch (error) {
    console.error('Error asignando proveedor:', error);
    return null;
  }
};

