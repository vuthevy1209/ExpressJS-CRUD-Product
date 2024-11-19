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
            name: user.username,
            iss: 'expressLamToiDauKho',
            role: user.role
        };
        return jwt.sign(payload, PRIVATE_ACCESS_KEY, this.AccessOptions);
    }

    generateRefreshToken(user) {
        const payload = { 
            sub: user._id, 
            username: user.username,
            email: user.email,      // Optional, include only if needed
            role: user.role
        };
        return jwt.sign(payload, PRIVATE_REFRESH_KEY,this.RefreshOptions); // Refresh token expires in 7 days
    }

}

module.exports = new TokenUtil();