const { StatusCodes } = require('http-status-codes');

const roleVerifier = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: User not authenticated" });
  }

  if (!req.user.jwt_role) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Bad Request: User role not found" });
  }

  if (req.user.jwt_role !== role) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden: Insufficient permissions" });
  }

  next();
};

module.exports = roleVerifier;
