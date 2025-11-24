import express from 'express';
import { body, validationResult } from 'express-validator';
import { clasificarIncidencia } from '../services/iaService.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Clasificar texto
router.post('/clasificar', authenticate, [
  body('texto').notEmpty().withMessage('Texto es requerido')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { texto } = req.body;

    const resultado = await clasificarIncidencia(texto);

    res.json({
      categoria: resultado.categoria,
      prioridad: resultado.prioridad,
      confianza: resultado.confianza
    });
  } catch (error) {
    next(error);
  }
});

export default router;

