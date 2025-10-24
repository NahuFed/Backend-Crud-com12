import { Router } from 'express';
import * as tableController from '../controllers/tables.controllers.js';
import verificarToken from '../auth/token-verify.js';
import verificarRol from '../auth/verificar-rol.js';
import validarMesa from '../helpers/validarMesa.js';

const router = Router();

router.route('/tables')
  .get(verificarToken, tableController.obtenerMesas)
  .post(verificarToken, verificarRol('admin'), validarMesa, tableController.crearMesa);

router.route('/tables/:id')
  .get(verificarToken, tableController.obtenerUnaMesa)
  .patch(verificarToken, verificarRol('admin'), validarMesa, tableController.actualizarMesa)
  .delete(verificarToken, verificarRol('admin'), tableController.eliminarMesa);

router.route('/tables/:id/reserve')
  .post(verificarToken, tableController.reservarMesa);

export default router;
