import { check } from 'express-validator';
import resultadoValidacion from './resultadoValidacion.js';

const validarOrden = [
  check('tableId').notEmpty().withMessage('La mesa es obligatoria'),
  check('waiterId').notEmpty().withMessage('El mozo es obligatorio'),
  check('items').isArray({ min: 1 }).withMessage('La orden debe contener al menos un item'),
  (req, res, next) => resultadoValidacion(req, res, next)
];

export default validarOrden;
