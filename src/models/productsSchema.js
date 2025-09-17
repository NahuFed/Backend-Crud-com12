import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  imgUrl: { type: String, required: true }
});

const Product = model('Product', productSchema);

export default Product;
// Exporta el modelo para usarlo en otros archivos