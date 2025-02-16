const HttpException = require('../utils/HttpException');
const Seller = require('../models/seller.model.js');
const { createUser, logUser, loginSeller, registerSeller } = require('../services/auth.service');
const httpStatus = require('http-status');

const signup = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const token = await createUser(username, password);
        res.status(httpStatus.CREATE).json({
          success: true,
          data: { username, token }
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
}

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const token = await logUser(username, password);
        res.status(httpStatus.OK).json({ 
          success: true,
          data: { username, token }
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
}

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await registerSeller(name, email, password);
        res.status(httpStatus.CREATE).json(result);
    } catch (err) {
        res.status(BAD_REQUEST).json({ error: err.message });
    }
}

const SLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginSeller(email, password);
        res.json(result);
    } catch (err) {
        res.status(httpStatus.UNAUTHORIZED).json({ error: err.message });
    }
}

module.exports = { register, SLogin, signup, login };
