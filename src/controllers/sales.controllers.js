import Sale from '../models/salesSchema.js';
import Product from '../models/productsSchema.js';
import User from '../models/usersSchema.js';

// Función helper para transformar el formato de las ventas
const transformSaleFormat = (sale) => {
    return {
        id: sale._id.toString(),
        items: sale.items.map(item => ({
            id: item.productId._id.toString(),
            name: item.productId.name,
            price: item.priceAtSale,
            quantity: item.quantity
        })),
        total: sale.total,
        customerInfo: {
            name: sale.userId.username,
            email: sale.userId.email
        },
        date: sale.date
    };
};

export const obtenerVentas = async (req, res) => {
    try {
        const sales = await Sale.find().populate('userId', 'username email').populate('items.productId', 'name');
        const transformedSales = sales.map(transformSaleFormat);
        res.status(200).json({ sales: transformedSales });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener ventas' });
    }   
};

export const obtenerUnaVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const sale = await Sale.findById(id).populate('userId', 'username email').populate('items.productId', 'name');
        if (!sale) {
            return res.status(404).json({ mensaje: 'Venta no encontrada' });
        }
        const transformedSale = transformSaleFormat(sale);
        res.status(200).json(transformedSale);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener la venta' });
    }
};
export const crearVenta = async (req, res) => {
    try {
        const { userId, items } = req.body;
        
        // Verificar que el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        
        let total = 0;
        const processedItems = [];
        
        // Procesar cada item
        for (let item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ mensaje: `Producto ${item.productId} no encontrado` });
            }
            
            if (product.stock < item.quantity) {
                return res.status(400).json({ mensaje: `Stock insuficiente para ${product.name}` });
            }
            
            const itemTotal = product.price * item.quantity;
            total += itemTotal;
            
            processedItems.push({
                productId: item.productId,
                quantity: item.quantity,
                priceAtSale: product.price // Guardar precio actual
            });
            
            // Actualizar stock
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity }
            });
        }
        
        const newSale = new Sale({
            userId,
            items: processedItems,
            total
        });
        
        await newSale.save();
        
        // Retornar la venta con populate
        const saleWithDetails = await Sale.findById(newSale._id)
            .populate('userId', 'username email')
            .populate('items.productId', 'name');
            
        const transformedSale = transformSaleFormat(saleWithDetails);
            
        res.status(201).json({ 
            mensaje: 'Venta creada exitosamente', 
            sale: transformedSale 
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor al crear la venta' });
    }   
};

