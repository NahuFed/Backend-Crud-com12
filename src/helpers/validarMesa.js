import { check } from 'express-validator';
import resultadoValidacion from './resultadoValidacion.js';

const validarMesa = [
  check('number').notEmpty().withMessage('El número de mesa es obligatorio'),
  check('capacity').isInt({ min: 1 }).withMessage('La capacidad debe ser un número entero mayor a 0'),
  (req, res, next) => resultadoValidacion(req, res, next)
];

export default validarMesa;
