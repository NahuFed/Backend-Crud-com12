import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import 'dotenv/config';
import './src/database/dbConnection.js';
import userRoutes from './src/routes/users.routes.js';
import productRoutes from './src/routes/products.routes.js';

const app = express();

//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', userRoutes, productRoutes);
app.set('port', process.env.PORT || 4000);
app.listen(app.get('port'), () => {
    console.log(`Servidor en el puerto ${app.get('port')}`);
});