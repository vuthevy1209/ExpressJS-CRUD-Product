const userService = require('../services/UserService');
const tokenUtil = require('../utils/token');
const refreshTokenService = require('../services/RefreshTokenService');
const cleanUpService = require('../services/CleanUpService');
const {emailRegex, passwordRegex} = require('../utils/regex');  

class UserController {
    // [GET] /login
    showLoginForm(req, res) {
        res.render('auth/login', { layout: 'auth', title: 'Login'});
    }

    // [POST] /login
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await userService.findUserByUsername(username);
            if (!user) {
                return res.status(400).render('auth/login', { layout: 'auth', title: 'Login', error: 'Tài khoản không tồn tại' });
            }

            const isMatch = await userService.validatePassword(password, user.password);
            if (!isMatch) {
                return res.status(400).render('auth/login', { layout: 'auth', title: 'Login', error: 'Mật khẩu không chính xác' });
            }


            // Generate tokens
            const accessToken = tokenUtil.generateAccessToken(user); // Generate access token
            const refreshToken = tokenUtil.generateRefreshToken(user); // Generate refresh token

            // save refresh token

            refreshTokenService.saveRefreshToken(user._id, refreshToken,Date.now() + 86400000); // expires in 24 hours
            
            res.cookie('accessToken', accessToken, { httpOnly: true, secure: true }); // Set the access token in a cookie
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }); // Set the refresh token in a cookie
            res.cookie('user',{
                username: user.username,
                role: user.role
            },{httpOnly: true, secure: true});
            res.locals.user = res.cookies.user;
            res.redirect('/home');
        } catch (error) {
            res.status(500).send('Đã xảy ra lỗi');
        }
    }
    
    // // [POST] /refresh-token
    // async refreshToken(req, res) {
    //     try {
    //         const { refreshToken } = req.cookies;
    //         if (!refreshToken) {
    //             return res.status(401).json({ success: false, message: 'Refresh token not provided' });
    //         }

    //         const userId = await refreshTokenService.findUserByRefreshToken(refreshToken);
    //         if (!userId) {
    //             return res.status(403).json({ success: false, message: 'Invalid refresh token' });
    //         }

    //         const user = await userService.findUserById(userId);
    //         if (!user) {
    //             return res.status(403).json({ success: false, message: 'Invalid refresh token' });
    //         }

    //         const newToken = tokenUtil.generateAccessToken(user);
    //         res.cookie('accessToken', newToken, { httpOnly: true, secure: true }); // Set the new access token in a cookie
    //         res.status(200).json({ success: true, message: 'Token refreshed' });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).send('Đã xảy ra lỗi');
    //     }
    // }
    

    // [GET] /GA03/register
    showRegisterForm(req, res) {
        res.render('auth/register', { layout: 'auth', title: 'Register' });
    }


    // [POST] /register
    async register(req, res) {
        try {
            const { username, password, confirmPassword } = req.body;

            // Validate email
            if (!emailRegex.test(username)) {
                return res.status(400).render('auth/register', { layout: 'auth', title: 'Register', error: 'Email không hợp lệ' });
            }

            // Validate password
            if (!passwordRegex.test(password)) {
                return res.status(400).render('auth/register', { layout: 'auth', title: 'Register', error: 'Mật khẩu không hợp lệ' });
            }


            if (password !== confirmPassword) {
                return res.status(400).render('auth/register', { layout: 'auth', title: 'Register', error: 'Mật khẩu không khớp' });
            }

            await userService.createUser(username, password);
            res.redirect('/login');
        } catch (error) {
            res.status(500).send('Đã xảy ra lỗi');
        }
    }

    // [GET] /logout
    async logout(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (refreshToken) {
                console.log('Deleting refresh token');
                
                await refreshTokenService.deleteRefreshToken(refreshToken);
            }
            cleanUpService.cleanUp(req, res);

            console.log(req.cookies);

            res.redirect('/home');
        } catch (error) {
            console.log(error);
            res.status(500).send('Đã xảy ra lỗi');
        }
    }
}

module.exports = new UserController();
