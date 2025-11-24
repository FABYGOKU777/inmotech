import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import pool from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', [
  body('nombre').notEmpty().withMessage('Nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Password debe tener al menos 6 caracteres'),
  body('rol').isIn(['residente', 'admin', 'proveedor']).withMessage('Rol inválido')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, email, password, rol, edificio_id } = req.body;

    // Verificar si el email ya existe
    const existingUser = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email ya está registrado' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol, edificio_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, email, rol, edificio_id',
      [nombre, email, hashedPassword, rol, edificio_id || null]
    );

    const user = result.rows[0];

    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Password es requerido')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Buscar usuario
    const result = await pool.query(
      'SELECT id, nombre, email, password, rol, edificio_id FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Verificar password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        edificio_id: user.edificio_id
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticate, async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
});

export default router;

