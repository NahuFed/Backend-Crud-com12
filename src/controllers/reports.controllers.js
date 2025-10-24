import Sale from '../models/salesSchema.js';
import Product from '../models/productsSchema.js';
import User from '../models/usersSchema.js';

// Ventas por día (últimos n días si se pasa ?days=7)
export const ventasPorDia = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const since = new Date();
    since.setDate(since.getDate() - (days - 1));

    const results = await Sale.aggregate([
      { $match: { date: { $gte: new Date(since.setHours(0,0,0,0)) } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalRevenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ days: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al generar reporte de ventas por día' });
  }
};

// Ventas por producto (cantidad vendida y facturación)
export const ventasPorProducto = async (req, res) => {
  try {
    const results = await Sale.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          quantitySold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.priceAtSale'] } }
        }
      },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      { $project: { productId: '$_id', productName: '$product.name', code: '$product.code', quantitySold: 1, revenue: 1 } },
      { $sort: { revenue: -1 } }
    ]);

    res.json({ products: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al generar reporte de ventas por producto' });
  }
};

// Ventas por empleado (total facturado y número de ventas)
export const ventasPorEmpleado = async (req, res) => {
  try {
    const results = await Sale.aggregate([
      {
        $group: {
          _id: '$userId',
          totalRevenue: { $sum: '$total' },
          salesCount: { $sum: 1 }
        }
      },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $project: { userId: '$_id', username: '$user.username', email: '$user.email', totalRevenue: 1, salesCount: 1 } },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({ employees: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al generar reporte de ventas por empleado' });
  }
};
