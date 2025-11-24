import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db/connection.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Listar proveedores
router.get('/list', authenticate, async (req, res, next) => {
  try {
    const { especialidad } = req.query;

    let query = 'SELECT * FROM proveedores WHERE 1=1';
    const params = [];

    if (especialidad) {
      query += ' AND especialidad = $1';
      params.push(especialidad);
    }

    query += ' ORDER BY nombre_empresa ASC';

    const result = await pool.query(query, params);

    res.json({ proveedores: result.rows });
  } catch (error) {
    next(error);
  }
});

// Crear proveedor (solo admin)
router.post('/create', authenticate, authorize('admin'), [
  body('nombre_empresa').notEmpty().withMessage('Nombre de empresa es requerido'),
  body('especialidad').notEmpty().withMessage('Especialidad es requerida'),
  body('contacto').isEmail().withMessage('Contacto debe ser un email válido')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre_empresa, especialidad, contacto, tiempo_respuesta_est } = req.body;

    const result = await pool.query(
      `INSERT INTO proveedores (nombre_empresa, especialidad, contacto, tiempo_respuesta_est)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nombre_empresa, especialidad, contacto, tiempo_respuesta_est || 24]
    );

    res.status(201).json({
      message: 'Proveedor creado exitosamente',
      proveedor: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Actualizar proveedor (solo admin)
router.put('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_empresa, especialidad, contacto, tiempo_respuesta_est } = req.body;

    const updates = [];
    const params = [];
    let paramCount = 1;

    if (nombre_empresa) {
      updates.push(`nombre_empresa = $${paramCount}`);
      params.push(nombre_empresa);
      paramCount++;
    }

    if (especialidad) {
      updates.push(`especialidad = $${paramCount}`);
      params.push(especialidad);
      paramCount++;
    }

    if (contacto) {
      updates.push(`contacto = $${paramCount}`);
      params.push(contacto);
      paramCount++;
    }

    if (tiempo_respuesta_est) {
      updates.push(`tiempo_respuesta_est = $${paramCount}`);
      params.push(tiempo_respuesta_est);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    params.push(id);

    const query = `
      UPDATE proveedores 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json({
      message: 'Proveedor actualizado exitosamente',
      proveedor: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Eliminar proveedor (solo admin)
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM proveedores WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json({ message: 'Proveedor eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
});

export default router;

