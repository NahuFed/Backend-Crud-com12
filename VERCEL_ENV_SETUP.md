# Configuración de Variables de Entorno en Vercel

## Variables requeridas en el Backend (Backend-Crud-com12)

Asegúrate de tener configuradas las siguientes variables de entorno en tu proyecto de Vercel del backend:

1. **NODE_ENV** = `production` ✅ (Ya configurado)
2. **MONGODB_URI** = `tu_conexion_mongodb_atlas`
3. **JWT_SECRET** = `tu_secreto_jwt`
4. **EMAIL_USER** = `tu_email` (si usas nodemailer)
5. **EMAIL_PASS** = `tu_password_email` (si usas nodemailer)

## Variables requeridas en el Frontend (CRUD-COM-12)

Configura las siguientes variables en tu proyecto de Vercel del frontend:

```
VITE_API_BASE=https://TU-BACKEND.vercel.app/
VITE_API_URL=https://TU-BACKEND.vercel.app/api
VITE_API_USUARIOS=https://TU-BACKEND.vercel.app/api/users
VITE_API_PRODUCTOS=https://TU-BACKEND.vercel.app/api/products
VITE_API_LOGIN=https://TU-BACKEND.vercel.app/api/login
VITE_API_REGISTER=https://TU-BACKEND.vercel.app/api/register
VITE_API_VENTAS=https://TU-BACKEND.vercel.app/api/sales
VITE_API_ME=https://TU-BACKEND.vercel.app/api/me
```

**IMPORTANTE**: Reemplaza `TU-BACKEND` con la URL real de tu backend deployado en Vercel.

## Pasos para configurar en Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega cada variable con su valor correspondiente
4. Selecciona los ambientes (Production, Preview, Development)
5. Guarda los cambios
6. **Redeploy** el proyecto para que tome las nuevas variables

## Verificación después del deploy:

Para verificar que las cookies funcionan correctamente:

1. Abre las DevTools de tu navegador (F12)
2. Ve a la pestaña "Application" → "Cookies"
3. Después de hacer login, verifica que aparezca la cookie `jwt`
4. Debe tener los siguientes atributos:
   - `HttpOnly`: ✓
   - `Secure`: ✓
   - `SameSite`: None
   - `Path`: /

## Problemas comunes y soluciones:

### Si las cookies no se están enviando:
- Verifica que `withCredentials: true` esté en todas las peticiones axios del frontend
- Confirma que NODE_ENV=production en el backend de Vercel
- Asegúrate que las URLs del frontend coincidan en la lista de CORS del backend

### Si recibes errores de CORS:
- Verifica que la URL del frontend (`https://crud-com-12.vercel.app`) esté en la lista `allowedOrigins` del backend
- Confirma que `credentials: true` esté configurado en CORS

### Si el login funciona pero no persiste la sesión:
- Verifica que las cookies tengan `SameSite: None` y `Secure: true` en producción
- Confirma que ambos proyectos usen HTTPS (requerido para SameSite=None)
