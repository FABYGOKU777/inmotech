import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db/connection.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { clasificarIncidencia } from '../services/iaService.js';
import { asignarProveedorAutomatico } from '../services/asignacionService.js';
import { notificarNuevaIncidencia, notificarCambioEstado } from '../services/notificacionService.js';

const router = express.Router();

// Crear incidencia
router.post('/create', authenticate, upload.single('imagen'), [
  body('descripcion').notEmpty().withMessage('Descripción es requerida'),
  body('edificio_id').optional().isInt()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { descripcion, edificio_id } = req.body;
    const usuario_id = req.user.id;
    const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Clasificar con IA
    const clasificacion = await clasificarIncidencia(descripcion);
    const { categoria, prioridad } = clasificacion;

    // Asignar proveedor automáticamente
    const proveedor_id = await asignarProveedorAutomatico(categoria, prioridad);

    // Insertar incidencia
    const result = await pool.query(
      `INSERT INTO incidencias 
       (usuario_id, edificio_id, tipo, descripcion, imagen_url, prioridad, estado, proveedor_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        usuario_id,
        edificio_id || req.user.edificio_id,
        categoria,
        descripcion,
        imagen_url,
        prioridad,
        'pendiente',
        proveedor_id
      ]
    );

    const incidencia = result.rows[0];

    // Notificar
    await notificarNuevaIncidencia(incidencia.id);

    res.status(201).json({
      message: 'Incidencia creada exitosamente',
      incidencia,
      clasificacion
    });
  } catch (error) {
    next(error);
  }
});

// Listar incidencias
router.get('/list', authenticate, async (req, res, next) => {
  try {
    const { estado, tipo, prioridad, limit = 50, offset = 0 } = req.query;
    let query = `
      SELECT i.*, 
             u.nombre as usuario_nombre, u.email as usuario_email,
             e.nombre as edificio_nombre,
             p.nombre_empresa as proveedor_nombre, p.especialidad as proveedor_especialidad
      FROM incidencias i
      JOIN usuarios u ON i.usuario_id = u.id
      LEFT JOIN edificios e ON i.edificio_id = e.id
      LEFT JOIN proveedores p ON i.proveedor_id = p.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    // Filtros según rol
    if (req.user.rol === 'residente') {
      query += ` AND i.usuario_id = $${paramCount}`;
      params.push(req.user.id);
      paramCount++;
    } else if (req.user.rol === 'proveedor') {
      query += ` AND i.proveedor_id = (SELECT id FROM proveedores WHERE contacto = $${paramCount})`;
      params.push(req.user.email);
      paramCount++;
    }

    // Filtros adicionales
    if (estado) {
      query += ` AND i.estado = $${paramCount}`;
      params.push(estado);
      paramCount++;
    }

    if (tipo) {
      query += ` AND i.tipo = $${paramCount}`;
      params.push(tipo);
      paramCount++;
    }

    if (prioridad) {
      query += ` AND i.prioridad = $${paramCount}`;
      params.push(prioridad);
      paramCount++;
    }

    query += ` ORDER BY i.fecha_creacion DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    res.json({
      incidencias: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    next(error);
  }
});

// Obtener incidencia por ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    let query = `
      SELECT i.*, 
             u.nombre as usuario_nombre, u.email as usuario_email,
             e.nombre as edificio_nombre, e.direccion as edificio_direccion,
             p.nombre_empresa as proveedor_nombre, p.especialidad as proveedor_especialidad,
             p.contacto as proveedor_contacto
      FROM incidencias i
      JOIN usuarios u ON i.usuario_id = u.id
      LEFT JOIN edificios e ON i.edificio_id = e.id
      LEFT JOIN proveedores p ON i.proveedor_id = p.id
      WHERE i.id = $1
    `;

    // Verificar permisos
    if (req.user.rol === 'residente') {
      query += ' AND i.usuario_id = $2';
      const result = await pool.query(query, [id, req.user.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Incidencia no encontrada' });
      }
      return res.json({ incidencia: result.rows[0] });
    } else if (req.user.rol === 'proveedor') {
      query += ' AND i.proveedor_id = (SELECT id FROM proveedores WHERE contacto = $2)';
      const result = await pool.query(query, [id, req.user.email]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Incidencia no encontrada' });
      }
      return res.json({ incidencia: result.rows[0] });
    }

    // Admin puede ver todas
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Incidencia no encontrada' });
    }

    res.json({ incidencia: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Actualizar incidencia
router.put('/:id', authenticate, authorize('admin', 'proveedor'), [
  body('estado').optional().isIn(['pendiente', 'en_proceso', 'resuelto']),
  body('proveedor_id').optional().isInt()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { estado, proveedor_id, descripcion, prioridad } = req.body;

    // Verificar que la incidencia existe
    const existingResult = await pool.query('SELECT * FROM incidencias WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Incidencia no encontrada' });
    }

    const incidenciaActual = existingResult.rows[0];
    const nuevoEstado = estado || incidenciaActual.estado;

    // Construir query de actualización
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (estado) {
      updates.push(`estado = $${paramCount}`);
      params.push(estado);
      paramCount++;
    }

    if (proveedor_id) {
      updates.push(`proveedor_id = $${paramCount}`);
      params.push(proveedor_id);
      paramCount++;
    }

    if (descripcion) {
      updates.push(`descripcion = $${paramCount}`);
      params.push(descripcion);
      paramCount++;
    }

    if (prioridad) {
      updates.push(`prioridad = $${paramCount}`);
      params.push(prioridad);
      paramCount++;
    }

    updates.push(`fecha_actualizacion = NOW()`);
    params.push(id);

    const query = `
      UPDATE incidencias 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, params);
    const incidencia = result.rows[0];

    // Notificar cambio de estado
    if (estado && estado !== incidenciaActual.estado) {
      await notificarCambioEstado(id, estado);
    }

    res.json({
      message: 'Incidencia actualizada exitosamente',
      incidencia
    });
  } catch (error) {
    next(error);
  }
});

// Eliminar incidencia (solo admin)
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM incidencias WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Incidencia no encontrada' });
    }

    res.json({ message: 'Incidencia eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
});

export default router;

