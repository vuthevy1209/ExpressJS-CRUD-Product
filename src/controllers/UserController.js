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
            const foundUser = await userService.findUserByUsername(username);
            if (!foundUser) {
                return res.status(400).render('auth/login', { layout: 'auth', title: 'Login', error: 'Tài khoản không tồn tại' });
            }

            const isMatch = await userService.validatePassword(password, foundUser.password);
            if (!isMatch) {
                return res.status(400).render('auth/login', { layout: 'auth', title: 'Login', error: 'Mật khẩu không chính xác' });
            }

            // Generate tokens
            const accessToken = tokenUtil.generateAccessToken(foundUser); // Generate access token
            const refreshToken = tokenUtil.generateRefreshToken(foundUser); // Generate refresh token
            // save refresh token

            refreshTokenService.saveRefreshToken(foundUser._id, refreshToken,Date.now() + 86400000); // expires in 24 hours
            
            res.cookie('accessToken', accessToken, { httpOnly: true, secure: true }); // Set the access token in a cookie
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }); // Set the refresh token in a cookie
            
            res.cookie('user',{
                username: foundUser.username,
                role: foundUser.role
            },{httpOnly: true, secure: true});

            res.redirect('/home');
        } catch (error) {
            console.log(error);
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
            const { username, password, confirmPassword,email } = req.body;

            // Validate email
            if (!emailRegex.test(email)) {
                return res.status(400).render('auth/register', { layout: 'auth', title: 'Register',fail: true, message: 'Email không hợp lệ' });
            }

            // Validate password
            if (!passwordRegex.test(password)) {
                return res.status(400).render('auth/register', { layout: 'auth', title: 'Register',fail: true, message: 'Mật khẩu chứa ít nhất 8 ký tự, bao gồm chữ cái viết hoa,thường và số' });
            }


            if (password !== confirmPassword) {
                return res.status(400).render('auth/register', { layout: 'auth', title: 'Register',fail: true, message: 'Mật khẩu không khớp' });
            }


            if(await userService.findUserByUsername(username)){
                return res.status(400).render('auth/register', { layout: 'auth', title: 'Register',fail: true, message: 'Username đã tồn tại' });
            }

            await userService.createUser(username, password,email);
            res.redirect('/login');
        } catch (error) {
            console.log(error);
            return res.status(500).send('Đã xảy ra lỗi');
        }
    }

    // [GET] /logout
    async logout(req, res) {
        try {
            cleanUpService.cleanUp(req, res);
            res.redirect('/home');
        } catch (error) {
            res.status(500).send('Đã xảy ra lỗi');
        }
    }
}

module.exports = new UserController();
