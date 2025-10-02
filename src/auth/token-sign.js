import jwt from 'jsonwebtoken';

const generarToken = (idUsuario, nombreUsuario, rolUsuario) => {
    return new Promise((resolve, reject) => {
        const payload = { 
            usuarioId: idUsuario, 
            nombreUsuario: nombreUsuario,
            rol: rolUsuario 
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY, // Asegúrate de que esta variable de entorno esté definida)
            {
                expiresIn: '1h' // El token expirará en 1 hora
            },
            (error, token) => {
                if (error) {
                    console.error('Error al generar el token:', error);
                    reject(new Error('Error al generar el token'));
                }
                resolve(token);
            }
        );
    });
    
};

export default generarToken;