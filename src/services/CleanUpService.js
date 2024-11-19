const refreshTokenService = require('../services/RefreshTokenService');

class CleanUpService {
  static cleanUp(req, res) {
    // Clear the cookies by name
    res.clearCookie('accessToken', { httpOnly: true, secure: true });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
    res.clearCookie('user', { httpOnly: true, secure: true });
    res.locals.user=null;
  }
}

module.exports = CleanUpService;