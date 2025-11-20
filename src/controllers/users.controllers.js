import generarToken from "../auth/token-sign.js";
import User from "../models/usersSchema.js";
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

// Controlador específico para registro público (siempre crea usuarios con rol 'user')
export const registrarUsuario = async (req, res) => {
  try {
    // Validar que todos los campos requeridos estén presentes
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        mensaje: "Todos los campos son requeridos (username, email, password)"
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ email: req.body.email });
    if (usuarioExistente) {
      return res.status(400).json({
        mensaje: "El correo electrónico ya está registrado",
      });
    }

    // Crear usuario con rol forzado a 'user' (no se permite desde el frontend)
    const usuarioNuevo = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: 'user' // Siempre 'user' para registro público
    });
    
    const salt = bcrypt.genSaltSync();
    usuarioNuevo.password = bcrypt.hashSync(usuarioNuevo.password, salt);
    await usuarioNuevo.save();
    
    res.status(201).json({
      mensaje: "Usuario registrado exitosamente. Ya puedes iniciar sesión.",
      user: {
        username: usuarioNuevo.username,
        email: usuarioNuevo.email,
        role: usuarioNuevo.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error interno del servidor al registrar usuario",
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
    console.log('🔍 Inicio del proceso de login');
    console.log('📧 Request body:', req.body);
    
    const { email, password } = req.body;
    
    console.log('📧 Email recibido:', email);
    console.log('🔑 Password recibido:', password ? 'Sí se recibió password' : 'No se recibió password');
    
    // Buscar usuario por email
    console.log('🔍 Buscando usuario en la base de datos...');
    let usuario = await User.findOne({ email });
    console.log('👤 Usuario encontrado:', usuario ? `Sí - ID: ${usuario._id}` : 'No');
    
    if (!usuario) {
      console.log('❌ Usuario no encontrado con email:', email);
      return res.status(404).json({
        mensaje: "Correo o password invalido (correo)",
      });
    }

    console.log('🔑 Verificando password...');
    console.log('🔑 Password del usuario en BD (hash):', usuario.password);
    console.log('🔑 Password del request:', password);
    
    const passwordValido = bcrypt.compareSync(password, usuario.password);
    console.log('✅ Password válido:', passwordValido);

    if (!passwordValido) {
      console.log('❌ Password inválido');
      return res.status(404).json({
        mensaje: "Correo o password invalido (password)",
      });
    }

    console.log('🎫 Generando token...');
    const token = await generarToken(usuario._id, usuario.username, usuario.role);
    console.log('🎫 Token generado:', token ? 'Sí' : 'No');

    console.log('🍪 Configurando cookie...');
    console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
    res.cookie('jwt',token,{
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 3600000 //1 hora
    });

    console.log('✅ Login exitoso, enviando respuesta...');
    res.status(200).json({
      mensaje: "Login exitoso",
      user: {
        id: usuario._id, // Agregar el ID del usuario
        username: usuario.username,
        email: usuario.email,
        role: usuario.role,
        preferences: usuario.preferences
      }
    });
  } catch (error) {
    console.error('💥 Error en login:', error);
    console.error('💥 Stack trace:', error.stack);
    res.status(500).json({
      mensaje: "Error al loguear el usuario",
      error: error.message
    });
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
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0)
  })
  res.status(200).json({
    mensaje: "Logout exitoso"
  })
}