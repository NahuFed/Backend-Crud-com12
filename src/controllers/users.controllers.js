import generarToken from "../auth/token-sign";
import User from "../models/usersSchema";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

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

export const obtenerUnUsuario = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error interno del servidor al obtener el usuario",
    });
  }
};


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

    const token = await generarToken(usuario._id, usuario.username, usuario.role)

    res.cookie('jwt',token,{
      httpOnly:true,
      sameSite:true,
      maxAge: 3600000 //1 hora
    })

    res.status(200).json({
      mensaje: "Login exitoso",
      user: {
        id: usuario._id, // Agregar el ID del usuario
        username: usuario.username,
        email: usuario.email,
        role: usuario.role,
        preferences: usuario.preferences
      }
    })
  } catch (error) {
    console.log(error);
    res.status(404).json("Error al loguear un usuario");
  }
};




export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('username email role preferences');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: userId, // Agregar el ID del usuario
      username: user.username,
      email: user.email,
      role: user.role,
      preferences: user.preferences
    });
  } catch (err) {
    console.error('Error in /me:', err);
    res.status(500).json({ message: 'Server error' });
  }
}



export const logout = (req, res) => {
  res.cookie('jwt','',{
    httpOnly:true,
    sameSite:true,
    expires: new Date(0)
  })
  res.status(200).json({
    mensaje: "Logout exitoso"
  })
}