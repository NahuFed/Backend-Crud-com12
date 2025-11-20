import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import './src/database/dbConnection.js';
import userRoutes from './src/routes/users.routes.js';
import productRoutes from './src/routes/products.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import salesRoutes from './src/routes/sales.routes.js';

const app = express();

//middlewares
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000',
  'https://crud-com-12.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', userRoutes, productRoutes, salesRoutes);
app.use('/api/auth', authRoutes);
app.set('port', process.env.PORT || 4000);
app.listen(app.get('port'), () => {
    console.log(`Servidor en el puerto ${app.get('port')}`);
});