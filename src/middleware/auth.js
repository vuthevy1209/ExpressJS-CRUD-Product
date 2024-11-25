const tokenUtil = require('../utils/token');


async function refreshToken(req, res, next) {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            req.authError='Refresh token is not provided';
            return next();
        }

        // Verify refresh token
        const payload = await tokenUtil.verifyRefreshToken(refreshToken);

        // Generate new access token
        const newAccessToken = tokenUtil.generateAccessToken(userService.findById(payload.sub));

        // Set the new access token in a cookie
        res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 5 * 60 * 1000 });

        // Generate new refresh token
        const newRefreshToken = tokenUtil.generateNewRefreshToken(payload);
        refreshTokenService.deleteRefreshToken(refreshToken);
        refreshTokenService.saveRefreshToken(payload.sub, newRefreshToken, payload.exp);
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
        return next();

    } catch (error) {
        res.status(500).send('Đã xảy ra lỗi');
    }
}

module.exports = { refreshToken };