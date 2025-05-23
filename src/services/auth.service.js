const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');

const User = require('../models/user.model');
const HttpException = require('../utils/HttpException');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;

// Create User (Customer)
async function createUser(username, password, email) {
  const usernameExists = await User.exists({ username });
  if (usernameExists) {
    throw new HttpException(StatusCodes.CONFLICT, "Username already exists");
  }

  const emailExists = await User.exists({ email });
  if (emailExists) {
    throw new HttpException(StatusCodes.CONFLICT, "Email already exists");
  }

  const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({ username, email, password: hashedPass });
  await user.save();

  const token = jwt.sign({ id: user._id, username, email, role: "customer" }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

  return { email, username, token };
}

// User Login (Customer)
async function logUser(username, password, email) {
  const user = await User.findOne({ username });
  if (!user) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const token = jwt.sign({ id: user._id, username, email, role: "customer" }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

  return { email, username, token };
}

// Create Seller
async function createSeller(username, password, email) {
  const usernameExists = await User.exists({ username });
  if (usernameExists) {
    throw new HttpException(StatusCodes.CONFLICT, "Username already exists");
  }

  const emailExists = await User.exists({ email });
  if (emailExists) {
    throw new HttpException(StatusCodes.CONFLICT, "Email already exists");
  }

  const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);
  const seller = new User({ username, email, password: hashedPass });
  await seller.save();

  const token = jwt.sign({ id: seller._id, username, email, role: "seller" }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

  return { username, email, token };
}

// Seller Login
async function logSeller(username, password, email) {
  const seller = await User.findOne({ email });
  if (!seller) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, seller.password);
  if (!isMatch) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const token = jwt.sign({ id: seller._id, username, email, role: "seller" }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

  return { username, email, token };
}

module.exports = { createUser, logUser, logSeller, createSeller };
