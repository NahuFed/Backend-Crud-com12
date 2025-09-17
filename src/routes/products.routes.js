import {Router} from 'express';
import { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto, obtenerUnProducto } from '../controllers/products.controllers.js';
import validarProducto from '../helpers/validarProducto.js';

const router = Router();

router.route('/products')
    .get(obtenerProductos)
    .post(validarProducto, crearProducto);

router.route('/products/:id')
    .get(obtenerUnProducto)
    .patch(validarProducto, actualizarProducto)
    .delete(eliminarProducto);

export default router;    