const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }, // Reference seller
  //categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true } // TODO: needs to change
});

Product = mongoose.model('Product', productSchema);

module.exports = Product;
