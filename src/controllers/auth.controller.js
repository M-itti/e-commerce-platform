const authService = require('../services/auth.service');
const { StatusCodes } = require('http-status-codes');

// User Signup
const userSignup = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const result = await authService.createUser(username, password, email);

    res.status(StatusCodes.CREATED).json({
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
    const { username, password, email} = req.body;
    const result = await authService.logUser(username, password, email);

    res.status(StatusCodes.OK).json({
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
    const { username, password, email } = req.body;
    const result = await authService.createSeller(username, password, email);

    res.status(StatusCodes.CREATED).json({
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
    const { username, password, email } = req.body;
    const result = await authService.logSeller(username, password, email);

    res.status(StatusCodes.OK).json({
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
