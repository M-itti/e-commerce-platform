const mongoose = require('mongoose');

const { Schema, model } = mongoose

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'seller']} 
}, { timestamps: true });

const User = mongoose.model('User', userSchema)

module.exports = User;

