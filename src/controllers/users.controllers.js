import User from "../models/usersSchema";
import bcrypt from "bcrypt";

export const obtenerUsuarios = async (req, res) => {
  // Lógica para obtener usuarios

  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(error);
      res.status(404).json({ errores: errors.array });
    }
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const usuarioNuevo = new User(req.body);
    const salt = bcrypt.genSaltSync();
    usuarioNuevo.password = bcrypt.hashSync(usuarioNuevo.password, salt);
    await usuarioNuevo.save();
    res.status(201).json({
      mensaje: "El usuario fué creado.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error interno del servidor al crear usuario",
    });
  }
};

// export const crearUsuario = async (req, res) => {
//   try {
//     const { nombreUsuario, email, rol } = req.body;
//     const esAdministrador = req.rol == 'administrador';

//     if ((!esAdministrador && rol === 'administrador')) {
//       return res.status(403).json({
//         mensaje: 'Acceso denegado. Solo los administradores pueden realizar esta acción.',
//       });
//     }
//       const usuarioNuevo = new Usuario(req.body);
//       const salt = bcrypt.genSaltSync()
//       usuarioNuevo.password = bcrypt.hashSync(usuarioNuevo.password, salt)
//       await usuarioNuevo.save();
//       res.status(201).json({
//         mensaje: "El usuario fué creado.",
//       });
//     }

//    catch (error) {
//     console.log(error);
//     res.status(404).json({
//       mensaje: "Error al crear usuario.",
//     });
//   }
// };
export const actualizarUsuario = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      mensaje: "Se actualizo correctamente el usuario",
    });
  } catch {
    error;
  }
  {
    console.log(error);
    res.status(400).json({
      mensaje: "No se editar el usuario",
    });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      mensaje: "Usuario eliminado correctamente",
    });
  } catch (error) {
    res.status(404).json({
      mensaje: "Error al eliminar el usuario",
    });
  }
};

export const obtenerUnUsuario = (req, res) => {};

export const login = async (req, res) => {
  try {
    const { email } = req.body;
    let usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({
        mensaje: "Correo o password invalido (correo)",
      });
    }

    const passwordValido = bcrypt.compareSync(req.body.password, usuario.password)

    if (!passwordValido) {
      return res.status(404).json({
        message: "Correo o password invalido (password)",
      });
    }

    res.status(200).json(usuario)
  } catch (error) {
    console.log(error);
    res.status(404).json("Error al loguear un usuario");
  }
};
