// Helper para crear tokens JWT de prueba
import jwt from 'jsonwebtoken';
import User from '../models/usersSchema.js';
import bcrypt from 'bcrypt';

export const generateValidToken = async (role = 'user') => {
  const salt = bcrypt.genSaltSync(10);
  const user = await User.create({
    username: 'test-user',
    email: 'test@test.com',
    password: bcrypt.hashSync('test123', salt),
    role
  });

  const token = jwt.sign(
    { usuarioId: user._id, nombreUsuario: user.username, rol: user.role },
    process.env.JWT_SECRET_KEY || 'test-secret',
    { expiresIn: '1h' }
  );

  return { token, user };
};

// Helper para crear producto de prueba
export const createTestProduct = async () => {
  return await Product.create({
    name: 'Test Product',
    code: 'TEST001',
    price: 100,
    imgUrl: '/test.jpg',
    stock: 10,
    category: 'General'
  });
};

// Helper para crear mesa de prueba
export const createTestTable = async () => {
  return await Table.create({
    number: 1,
    capacity: 4,
    location: 'Interior'
  });
};

// Helper para crear venta de prueba
export const createTestSale = async (userId, items) => {
  return await Sale.create({
    userId,
    items,
    total: items.reduce((acc, item) => acc + (item.priceAtSale * item.quantity), 0)
  });
};