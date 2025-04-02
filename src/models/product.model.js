const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, trim: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }, 
  images: [{ type: String, required: false }] 
}, { timestamps: true }); 

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
