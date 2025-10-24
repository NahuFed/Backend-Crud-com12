import Table from '../models/tablesSchema.js';

export const obtenerMesas = async (req, res) => {
  try {
    const tables = await Table.find().sort({ number: 1 });
    res.status(200).json(tables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener mesas' });
  }
};

export const obtenerUnaMesa = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ mensaje: 'Mesa no encontrada' });
    res.status(200).json(table);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener la mesa' });
  }
};

export const crearMesa = async (req, res) => {
  try {
    const newTable = new Table(req.body);
    await newTable.save();
    res.status(201).json({ mensaje: 'Mesa creada', table: newTable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear mesa' });
  }
};

export const actualizarMesa = async (req, res) => {
  try {
    const updated = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ mensaje: 'Mesa no encontrada' });
    res.status(200).json({ mensaje: 'Mesa actualizada', table: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar mesa' });
  }
};

export const eliminarMesa = async (req, res) => {
  try {
    const deleted = await Table.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ mensaje: 'Mesa no encontrada' });
    res.status(200).json({ mensaje: 'Mesa eliminada', table: deleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar mesa' });
  }
};

export const reservarMesa = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, customerName, phone, people } = req.body;
    const table = await Table.findById(id);
    if (!table) return res.status(404).json({ mensaje: 'Mesa no encontrada' });

    table.reservation = { date, customerName, phone, people };
    table.status = 'reservada';
    await table.save();

    res.status(200).json({ mensaje: 'Mesa reservada', table });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al reservar mesa' });
  }
};
