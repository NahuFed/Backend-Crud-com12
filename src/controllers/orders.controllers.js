import Order from '../models/ordersSchema.js';
import Product from '../models/productsSchema.js';
import Table from '../models/tablesSchema.js';

export const obtenerOrdenes = async (req, res) => {
  try {
    const orders = await Order.find().populate('tableId').populate('waiterId').populate('items.productId');
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener órdenes' });
  }
};

export const obtenerUnaOrden = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('tableId').populate('waiterId').populate('items.productId');
    if (!order) return res.status(404).json({ mensaje: 'Orden no encontrada' });
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener la orden' });
  }
};

export const crearOrden = async (req, res) => {
  try {
    const { tableId, waiterId, items } = req.body;

    // Validaciones básicas
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ mensaje: 'La orden debe incluir al menos un item' });
    }

    // Calcular subtotal y total y comprobar stock
    let subtotal = 0;
    const processedItems = [];

    for (const it of items) {
      const prod = await Product.findById(it.productId);
      if (!prod) return res.status(404).json({ mensaje: `Producto ${it.productId} no encontrado` });
      if (prod.stock < it.quantity) return res.status(400).json({ mensaje: `Stock insuficiente para ${prod.name || prod.code || prod._id}` });

      const linePrice = prod.price * it.quantity;
      subtotal += linePrice;
      processedItems.push({ productId: it.productId, quantity: it.quantity, priceAtSale: prod.price, notes: it.notes });
    }

    const taxes = 0; // Calculo de impuestos simple (puede mejorarse)
    const discount = req.body.discount || 0;
    const total = subtotal + taxes - discount;

    const order = new Order({ tableId, waiterId, items: processedItems, subtotal, taxes, discount, total });
    await order.save();

    // Marcar mesa como ocupada
    if (tableId) {
      await Table.findByIdAndUpdate(tableId, { status: 'ocupada', waiter: waiterId });
    }

    const orderPopulated = await Order.findById(order._id).populate('items.productId').populate('tableId').populate('waiterId');

    res.status(201).json({ mensaje: 'Orden creada', order: orderPopulated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear orden' });
  }
};

export const actualizarOrden = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ mensaje: 'Orden no encontrada' });
    res.status(200).json({ mensaje: 'Orden actualizada', order: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar orden' });
  }
};

export const eliminarOrden = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ mensaje: 'Orden no encontrada' });
    res.status(200).json({ mensaje: 'Orden eliminada', order: deleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar orden' });
  }
};
