import { Schema, model } from 'mongoose';

const orderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  priceAtSale: { type: Number, required: true, min: 0 },
  notes: { type: String }
});

const orderSchema = new Schema({
  tableId: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
  waiterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  status: { type: String, enum: ['pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'], default: 'pendiente' },
  subtotal: { type: Number, required: true, min: 0 },
  taxes: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true, min: 0 },
  paid: { type: Boolean, default: false }
}, { timestamps: true });

// Después de guardar una orden, decrementar stock de productos
orderSchema.post('save', async function(doc) {
  try {
    const Product = model('Product');
    for (const it of doc.items) {
      await Product.findByIdAndUpdate(it.productId, { $inc: { stock: -it.quantity } });
    }
  } catch (error) {
    console.error('Error actualizando stock desde orden:', error);
  }
});

const Order = model('Order', orderSchema);

export default Order;
