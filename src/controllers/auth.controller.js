const HttpException = require('../utils/HttpException');
const authService = require('../services/auth.service');
const { status } = require('http-status');

// User Signup
const userSignup = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const result = await authService.createUser(username, password, email);

        res.status(status.CREATED).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

// User Login
const userLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await authService.logUser(username, password);

        res.status(status.OK).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

// Seller Signup
const sellerSignup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const result = await authService.createSeller(username, email, password);

        res.status(status.CREATED).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

// Seller Login
const sellerLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.logSeller(email, password);

        res.status(status.OK).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    userSignup,
    userLogin,
    sellerSignup,
    sellerLogin,
};
