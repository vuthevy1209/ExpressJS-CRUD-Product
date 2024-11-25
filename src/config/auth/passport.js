const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const userService = require('../../services/UserService');

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    try {
        const user = await userService.getUserByUsername(username);
        if (!user) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }

        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
            if (err) {
                return cb(err);
            }
            if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, user);
        });
    } catch (err) {
        return cb(err);
    }
}));

module.exports = passport;