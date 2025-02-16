const roleVerifier = (role) => (req, res, next) => {
    console.log("User object:", req.user); // Debugging
    console.log("JWT role:", req.user.jwt_role); // Corrected from req.user.jwt_payload.role
    console.log("Expected role:", role);

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
