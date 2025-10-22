import { Router } from 'express';
import { forgotPassword, resetPassword, verifyResetToken } from '../controllers/auth.controllers.js';
import { body } from 'express-validator';
import resultadoValidacion from '../helpers/resultadoValidacion.js';

const router = Router();

// POST /api/auth/forgot-password - Solicitar recuperación de contraseña
router.post(
    '/forgot-password',
    [
        body('email')
            .notEmpty().withMessage('El email es requerido')
            .isEmail().withMessage('Debe ser un email válido')
            .normalizeEmail(),
        resultadoValidacion
    ],
    forgotPassword
);

// POST /api/auth/reset-password - Restablecer contraseña con token
router.post(
    '/reset-password',
    [
        body('token')
            .notEmpty().withMessage('El token es requerido'),
        body('newPassword')
            .notEmpty().withMessage('La nueva contraseña es requerida')
            .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
        resultadoValidacion
    ],
    resetPassword
);

// GET /api/auth/verify-reset-token/:token - Verificar si un token es válido
router.get('/verify-reset-token/:token', verifyResetToken);

export default router;
