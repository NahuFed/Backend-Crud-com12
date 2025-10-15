import { Router } from "express";
import { obtenerVentas, crearVenta, obtenerUnaVenta } from "../controllers/sales.controllers.js";
import verificarToken from "../auth/token-verify.js";
import verificarRol from "../auth/verificar-rol.js";
import validarVenta from "../helpers/validarVenta.js";

const router = Router();

router.route('/sales')
    .get(verificarToken, verificarRol('admin'), obtenerVentas) // Solo admin puede ver todas las ventas
    .post(verificarToken, validarVenta, crearVenta); // Cualquier usuario autenticado puede crear una venta
router.route('/sales/:id')
    .get(verificarToken, obtenerUnaVenta); // Cualquier usuario autenticado puede ver una venta por ID
    // .patch(verificarToken, verificarRol('admin'), validarVenta, actualizarVenta) // Solo admin puede actualizar ventas
    // .delete(verificarToken, verificarRol('admin'), eliminarVenta); // Solo admin puede eliminar ventas