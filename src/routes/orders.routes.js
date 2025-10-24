import { Router } from 'express';
import * as orderController from '../controllers/orders.controllers.js';
import verificarToken from '../auth/token-verify.js';
import verificarRol from '../auth/verificar-rol.js';
import validarOrden from '../helpers/validarOrden.js';

const router = Router();

router.route('/orders')
  .get(verificarToken, verificarRol('admin'), orderController.obtenerOrdenes)
  .post(verificarToken, validarOrden, orderController.crearOrden);

router.route('/orders/:id')
  .get(verificarToken, orderController.obtenerUnaOrden)
  .patch(verificarToken, verificarRol('admin'), orderController.actualizarOrden)
  .delete(verificarToken, verificarRol('admin'), orderController.eliminarOrden);

export default router;
