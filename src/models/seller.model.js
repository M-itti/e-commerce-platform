const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sellerSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
});

// Hash password before saving
sellerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;
