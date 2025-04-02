const passport = require("passport");
const passportJwt = require("passport-jwt");
const User = require("../models/user.model");

const { Strategy, ExtractJwt } = passportJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "your_jwt_secret_key", 
};

passport.use(
  new Strategy(opts, async (jwt_payload, done) => {
    try {
      // Find the user based on the id from the JWT
      const user = await User.findById(jwt_payload.id);
            
      // If user found, attach the role from jwt_payload and the user document
      if (user) {
        // Attach role from JWT payload to the req.user object
        user.jwt_role = jwt_payload.role; 
        return done(null, user); 
      }
            
      return done(null, false, "user not found");
    } catch (err) {
      return done(err, false, "Invalid Token");
    }
  })
);

// Export passport instance
module.exports = passport;
