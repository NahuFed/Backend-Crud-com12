import jwt from 'jsonwebtoken';

const verificarToken = (req, res, next) => {
    // Obtener el token solo de las cookies
    const token = req.cookies?.jwt;
    
    if(!token){
        return res.status(401).json({
            mensaje: "No hay token en la peticion"
        })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
        
        // Asignar datos del usuario al request desde el token
        req.id = payload.usuarioId;
        req.nombre = payload.nombreUsuario;
        req.rol = payload.rol; // El rol ya viene en el token
        
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            mensaje: "Token no valido" 
        })      
    }
    next();
}

export default verificarToken;