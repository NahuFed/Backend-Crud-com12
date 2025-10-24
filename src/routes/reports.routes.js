import { Router } from 'express';
import * as reportsController from '../controllers/reports.controllers.js';
import verificarToken from '../auth/token-verify.js';
import verificarRol from '../auth/verificar-rol.js';

const router = Router();

// Todos los reportes están protegidos y sólo accesibles por admin
router.get('/reports/sales/daily', verificarToken, verificarRol('admin'), reportsController.ventasPorDia);
router.get('/reports/sales/by-product', verificarToken, verificarRol('admin'), reportsController.ventasPorProducto);
router.get('/reports/sales/by-employee', verificarToken, verificarRol('admin'), reportsController.ventasPorEmpleado);

export default router;
