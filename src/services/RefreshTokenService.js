const RefreshToken = require('../models/RefreshToken');
const tokenUtil = require('../utils/token');
const jwt = require('jsonwebtoken');

const cron = require('node-cron');

class RefreshTokenService {

    async generateRefreshToken(user) {
        const refreshToken = tokenUtil.generateRefreshToken(user);
        await RefreshToken.create({ userId: user._id, token: refreshToken });
        return refreshToken;
    }



    async findUserByRefreshToken(token) {
        const tokenDoc = await RefreshToken.findOne({ token });
        if (!tokenDoc) {
            return null;
        }
        return tokenDoc.userId;
    }

    async deleteRefreshToken(token) {
        await RefreshToken.deleteOne({ token });
    }

    async saveRefreshToken(userId, refreshtoken, expires) {
        await RefreshToken.create({ userId, refreshtoken, expires });
    }

    async deleteTokenByUserId(userId) {
        await RefreshToken.deleteMany({ userId });
    }

    async deleteExpiredTokens() {
        const currentTime = new Date();
        await RefreshToken.deleteMany({ expires: { $lt: currentTime } });
    }

    
}

// // Schedule the task to run every day at midnight
// cron.schedule('0 0 * * *', async () => {
//     const refreshTokenService = new RefreshTokenService();
//     await refreshTokenService.deleteExpiredTokens();
//     console.log('Expired refresh tokens deleted');
// });

module.exports = new RefreshTokenService();
