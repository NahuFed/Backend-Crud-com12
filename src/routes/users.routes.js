import {Router} from 'express';
import { obtenerUsuarios, crearUsuario,actualizarUsuario,eliminarUsuario, obtenerUnUsuario, login  } from '../controllers/users.controllers';
import validarUsuario from '../helpers/validarUsuario';


const router = Router();

router.route('/users')
    .get(obtenerUsuarios)
    .post(validarUsuario,crearUsuario);

router.route('/users/:id')
    .get(obtenerUnUsuario)
    .patch(actualizarUsuario)
    .delete(eliminarUsuario);

router.route('/login')
    .get(login);

export default router;    