const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const userService = require('../../services/UserService');

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    try {
        const user = await userService.findByUsername(username);
        console.log('call back local strategy user service');
        if (!user) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }

        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
            if (err) { return cb(err); }
            if (!crypto.timingSafeEqual(Buffer.from(user.password, 'hex'), hashedPassword)) {
              console.log('INCORRECT PASSPORT USE')
              return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, user);
        });
    } catch (err) {
        return cb(err);
    }
}));

module.exports = passport;