const refreshTokenService = require('../services/RefreshTokenService')
const userService = require('../services/UserService')

class CleanUpService {
  static async cleanUp(req, res) {
    // Clear the cookies by name
    res.clearCookie('accessToken', { httpOnly: true, secure: true });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
    res.clearCookie('user', { httpOnly: true, secure: true });

    const user = await userService.findUserByUsername(res.locals.user.username);
    refreshTokenService.deleteTokenByUserId(user._id);

    res.locals.user=null;
  }
}

module.exports = CleanUpService;