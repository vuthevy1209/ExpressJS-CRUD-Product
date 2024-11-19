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
                        refreshTokenService.deleteRefreshToken(refreshToken);
                        req.user = null;
                        return next();
                    }

                    const userId = await refreshTokenService.findUserByRefreshToken(refreshToken);
                    if (userId) {
                        const refreshedUser = await userService.findById(userId);
                        if (refreshedUser) {
                            // Generate a new access token 
                            const newToken = tokenUtil.generateAccessToken(refreshedUser);
                            res.cookie('accessToken', newToken, { httpOnly: true, secure: true });

                            // gen new refresh token
                            const newRefreshToken = tokenUtil.generateNewRefreshToken(decodedRefreshToken);
                            // Save the new refresh token
                            refreshTokenService.saveRefreshToken(refreshedUser._id, newRefreshToken, decodedRefreshToken.exp); 
                            res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });

                            refreshTokenService.deleteRefreshToken(refreshToken); // Delete the old refresh token
                            

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