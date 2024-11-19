const passport = require('passport');
const tokenUtil = require('../utils/token');
const refreshTokenService = require('../services/RefreshTokenService');
const userService = require('../services/UserService');
const jwt = require('jsonwebtoken');


async function checkAuth(req, res, next) {
    const token = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!token) {
        req.user = null;
        return next();
    }

    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err || !user) { // invalid or expired token
            if (refreshToken) {
                try {
                    const decodedRefreshToken = jwt.decode(refreshToken);
                    const currentTime = Math.floor(Date.now() / 1000);

                    if (decodedRefreshToken.exp < currentTime) {
                        // Refresh token is expired
                        req.user = null;
                        return next();
                    }

                    const userId = await refreshTokenService.findUserByRefreshToken(refreshToken);
                    if (userId) {
                        const refreshedUser = await userService.findById(userId);
                        if (refreshedUser) {
                            // Generate a new access token and set it in the response
                            const newToken = tokenUtil.generateAccessToken(refreshedUser);
                            res.cookie('accessToken', newToken, { httpOnly: true, secure: true });

                            req.user = refreshedUser; // Attach refreshed user

                            return next(); // Proceed to the next middleware
                        }
                    }
                } catch (err) {
                    req.user = null;
                    return next();
                }
            } else {
                req.user = null;
                return next();
            }
        } else {
            console.log('User CHECK 1', user);
            req.user = user;
            return next();
        }
    })(req, res, next);
}

function authorize(roles = []) {
    // roles param can be a single role string (e.g. 'Admin') or an array of roles (e.g. ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        checkAuth,
        (req, res, next) => {
            if (!req.user || (roles.length && !roles.includes(req.user.role))) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        }
    ];
}

module.exports = { checkAuth, authorize };