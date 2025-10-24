import 'dotenv/config';
import '../database/dbConnection.js';
import Product from '../models/productsSchema.js';
import User from '../models/usersSchema.js';
import Table from '../models/tablesSchema.js';
import bcrypt from 'bcrypt';

const run = async () => {
  try {
    // Limpiar colecciones (solo en entorno de desarrollo)
    if (process.env.NODE_ENV === 'production') {
      console.log('Seed no se ejecuta en producción');
      process.exit(0);
    }

    await Product.deleteMany({});
    await User.deleteMany({});
    await Table.deleteMany({});

    const products = [
      { name: 'Coca Cola', code: 'B001', price: 180, imgUrl: '/images/cocacola.jpg', stock: 50, category: 'Bebidas' },
      { name: 'Empanada', code: 'E001', price: 250, imgUrl: '/images/empanada.jpg', stock: 100, category: 'Entradas' },
      { name: 'Milanesa', code: 'P001', price: 1200, imgUrl: '/images/milanesa.jpg', stock: 20, category: 'Platos' }
    ];

    await Product.insertMany(products);

    const salt = bcrypt.genSaltSync(10);
    const admin = new User({ username: 'admin', email: 'admin@local', role: 'admin', password: bcrypt.hashSync('admin123', salt) });
    const waiter = new User({ username: 'mozo1', email: 'mozo1@local', role: 'user', password: bcrypt.hashSync('mozo123', salt) });

    await admin.save();
    await waiter.save();

    const tables = [];
    for (let i = 1; i <= 8; i++) {
      tables.push({ number: i, capacity: 4, location: 'Interior' });
    }

    await Table.insertMany(tables);

    console.log('Seed completado correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar seed:', error);
    process.exit(1);
  }
};

run();
