const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user.model');
const Seller = require('../models/seller.model');
const HttpException = require('../utils/HttpException');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;

async function createUser(username, password) {
    // check if already registered
    const usernameExists = await User.exists({ username: username });
    if (usernameExists) {
        throw new HttpException(409, "Username already exist")
    }
    
    // hash the password before saving it into the database
    const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);
    
    const user = new User({ username: username, password: hashedPass });
    await user.save();

    const token = jwt.sign({ username: username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

    return token;
}

async function logUser(username, password) {
    if (!username || !password) {
        throw new HttpException(409, "Username or password are required")
    }

    // Find the user by username if doesn't exist return 401
    const user = await User.findOne({ username })
    if (!user) {
       throw new HttpException(401, 'Invalid credentials');
    }
    
    // check if the password entered by user matches the hashed version on database
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new HttpException(401, 'Invalid credentials');
    }

    const token = jwt.sign(
        { 
            username: username,
            role: "user"
        }
        , JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

    return token;
}


async function createSeller(name, email, password) {
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) throw new Error("Email already in use");

    const seller = new Seller({ name, email, password });
    await seller.save();
    return { message: "Seller registered successfully" };
}

async function logSeller(email, password) {
    const seller = await Seller.findOne({ email });
    if (!seller) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) throw new Error("Invalid email or password");

    const token = jwt.sign(
        { id: seller._id, role: "seller" }, // Include role here
        "your_jwt_secret_key",
        { expiresIn: "7d" }
    );

    return { token };
}

module.exports = { createUser, logUser, logSeller, createSeller };
