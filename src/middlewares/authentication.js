const passport = require("passport");
const passportJwt = require("passport-jwt");
const Seller = require("../models/seller.model");

const { Strategy, ExtractJwt } = passportJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "your_jwt_secret_key", // Use environment variables in production
};

passport.use(
    new Strategy(opts, async (jwt_payload, done) => {
        try {
            // Find the seller based on the id from the JWT
            const seller = await Seller.findById(jwt_payload.id);
            
            // If seller found, attach the role from jwt_payload and the seller document
            if (seller) {
                // Attach role from JWT payload to the req.user object
                seller.jwt_role = jwt_payload.role; 
                return done(null, seller); 
            }
            
            return done(null, false, "Seller not found");
        } catch (err) {
            return done(err, false, "Invalid Token");
        }
    })
);

// Export passport instance
module.exports = passport;
