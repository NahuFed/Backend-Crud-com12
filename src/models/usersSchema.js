import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin','superadmin'], default: 'user' },
  password: { type: String, required: true }
});

const User = model('User', userSchema);

export default User;
// Exporta el modelo para usarlo en otros archivos