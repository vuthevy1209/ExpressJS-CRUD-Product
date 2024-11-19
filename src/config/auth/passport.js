var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const userService = require('../../services/UserService');

const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.accessToken]),
    secretOrKey: 'access_secret_key', // Use a secure secret in production
    algorithms: ['HS256']
};

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try{
        const user = await userService.findById(jwt_payload.sub);
        if(user){
            // check token expiration
            const currentTime = Math.floor(Date.now() / 1000);
            if(jwt_payload.exp < currentTime){
                return done(null, false, {message: 'Token expired'});
            }
            return done(null, user);
        }
        return done(null, false);
    }
    catch(error){
        return done(error, false);
    }
}));

module.exports = passport;