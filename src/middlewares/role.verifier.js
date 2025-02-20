const roleVerifier = (role) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    if (!req.user.jwt_role) {
        return res.status(400).json({ message: "Bad Request: User role not found" });
    }

    if (req.user.jwt_role !== role) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
};

module.exports = roleVerifier;
