const HttpException = require('../utils/HttpException');
const Seller = require('../models/seller.model.js');
const authService = require('../services/auth.service');
const { status } = require('http-status');

const userSignup = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const token = await authService.createUser(username, password);
        res.status(status.CREATE).json({
          success: true,
          data: { username, token }
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
}

const userLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const token = await authService.logUser(username, password);
        res.status(status.OK).json({ 
          success: true,
          data: { username, token }
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
}

const sellerSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await authService.createSeller(name, email, password);
        res.status(status.CREATE).json(result);
    } catch (err) {
        res.status(status.BAD_REQUEST).json({ error: err.message });
    }
}

const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.logSeller(email, password);
        res.json(result);
    } catch (err) {
        res.status(status.UNAUTHORIZED).json({ error: err.message });
    }
}

module.exports = { userSignup, userLogin, sellerLogin, sellerSignup };
