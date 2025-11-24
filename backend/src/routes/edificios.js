import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db/connection.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Listar edificios
router.get('/list', authenticate, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM edificios ORDER BY nombre ASC');

    res.json({ edificios: result.rows });
  } catch (error) {
    next(error);
  }
});

// Crear edificio (solo admin)
router.post('/create', authenticate, authorize('admin'), [
  body('nombre').notEmpty().withMessage('Nombre es requerido'),
  body('direccion').notEmpty().withMessage('Dirección es requerida')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, direccion } = req.body;

    const result = await pool.query(
      'INSERT INTO edificios (nombre, direccion) VALUES ($1, $2) RETURNING *',
      [nombre, direccion]
    );

    res.status(201).json({
      message: 'Edificio creado exitosamente',
      edificio: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

export default router;

