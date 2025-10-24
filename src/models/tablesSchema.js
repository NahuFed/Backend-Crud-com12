import { Schema, model } from 'mongoose';

const tableSchema = new Schema({
  number: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true, default: 4 },
  status: { type: String, enum: ['libre', 'ocupada', 'reservada'], default: 'libre' },
  location: { type: String, enum: ['Interior', 'Exterior', 'Terraza'], default: 'Interior' },
  waiter: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  reservation: {
    date: Date,
    customerName: String,
    phone: String,
    people: Number
  }
}, { timestamps: true });

const Table = model('Table', tableSchema);

export default Table;
