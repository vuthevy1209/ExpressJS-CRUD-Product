const jwt = require('jsonwebtoken');

const PRIVATE_ACCESS_KEY = 'access_secret_key';
const PRIVATE_REFRESH_KEY = 'refresh_secret_key';


class TokenUtil {
    constructor() {
        this.AccessOptions = { 
            algorithm: 'HS256',
            expiresIn: '5m'  // Token valid for 1 hour
        };
        
        this.RefreshOptions = { 
            algorithm: 'HS256',
            expiresIn: '7d'  // Token valid for 7 days
        };
    }


    generateAccessToken(user) {
        const payload = { 
            sub: user._id,
        };
        return jwt.sign(payload, PRIVATE_ACCESS_KEY, this.AccessOptions);
    }

    generateRefreshToken(user) {
        const payload = { 
            sub: user._id, 
        };
        return jwt.sign(payload, PRIVATE_REFRESH_KEY,this.RefreshOptions); // Refresh token expires in 7 days
    }

    generateNewRefreshToken(decodedRefreshToken) {
        const payload = { 
            sub: decodedRefreshToken.sub, 
        };
        return jwt.sign(payload, PRIVATE_REFRESH_KEY,{this:RefreshOptions[algorithm], expiresIn: decodedRefreshToken.expiresIn}); // Refresh token expires in 7 days
    }

    verifyRefreshToken = (refreshToken) => {
        return new Promise((resolve, reject) => {
          jwt.verify(refreshToken, refreshSecretKey, (err, payload) => {
            if (err) {
              return reject(new Error('Invalid refresh token'));
            }
            resolve(payload); // Return the decoded payload
          });
        });
    }
}

module.exports = new TokenUtil();