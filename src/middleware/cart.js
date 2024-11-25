    
const passport = require('passport');
const authMiddleware = require('./auth');

class CartMiddleware {
    // Passport Authenticate Middleware
    passportAuthenticate(req, res, next) {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err || !user) {
                req.authError = err || info || 'Authentication failed';
                return;
            }
            req.user = user; // Store the user in req
           return;
        })
    }

    // Middleware to handle refresh token if authentication fails
    refreshToken(req, res, next) {
        if (req.authError) {
            try {
                authMiddleware.refreshToken(req, res, next); // Try refreshing the token
            } catch (error) {
                req.authError = error; // Set error in case of failure
                return;
            }
        }
        return;
    }

    // Final middleware to handle the response
    handleAuthResponse(req, res, next) {
        if (req.authError) {
            console.error('Auth Error:', req.authError);
            return res.redirect('/login'); // Redirect to login if there's an auth error
        }
        console.log('You are authenticated');
        return res.redirect('/404'); // Redirect to 404 or some other page
    }

    allMiddleware(req, res, next) {
        this.passportAuthenticate(req, res, next);
        this.refreshToken(req, res, next);
        this.handleAuthResponse(req, res, next);
    }
}

module.exports = new CartMiddleware();