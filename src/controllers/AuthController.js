const userService = require('../services/UserService');
const tokenUtil = require('../utils/token');
const refreshTokenService = require('../services/RefreshTokenService');
const cleanUpService = require('../services/CleanUpService');
const { emailRegex, passwordRegex } = require('../utils/regex');

class AuthController {
    // [GET] /login
    showLoginForm(req, res) {
        res.render('auth/login', { layout: 'auth', title: 'Login' });
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
            const accessToken = tokenUtil.generateAccessToken(foundUser);
            const refreshToken = tokenUtil.generateRefreshToken(foundUser);
            // expired after 7 day
            refreshTokenService.saveRefreshToken(foundUser._id, refreshToken, Date.now() + 7 * 24 * 60 * 60 * 1000);

            res.cookie('accessToken', accessToken,
                {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 5 * 60 * 1000
                });


            res.cookie('refreshToken', refreshToken,
                {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });

            res.cookie('user', {
                username: foundUser.username,
                role: foundUser.role
            }, { httpOnly: true, secure: true });

            res.redirect('/home');
        } catch (error) {
            console.log(error);
            res.status(500).send('Đã xảy ra lỗi');
        }
    }



    // [GET] /GA03/register
    showRegisterForm(req, res) {
        res.render('auth/register', { layout: 'auth', title: 'Register' });
    }



    // [POST] /register
    async register(req, res) {
        try {
            const { username, password, confirmPassword, email } = req.body;

            // Validate email
            if (!emailRegex.test(email)) {
                return res.status(400).render('auth/register', { layout: 'auth', title: 'Register', fail: true, message: 'Email không hợp lệ' });
            }

            // Validate password
            if (!passwordRegex.test(password)) {
                return res.status(400).render('auth/register', { layout: 'auth', title: 'Register', fail: true, message: 'Mật khẩu chứa ít nhất 8 ký tự, bao gồm chữ cái viết hoa,thường và số' });
            }


            if (password !== confirmPassword) {
                return res.status(400).render('auth/register', { layout: 'auth', title: 'Register', fail: true, message: 'Mật khẩu không khớp' });
            }


            if (await userService.findUserByUsername(username)) {
                return res.status(400).render('auth/register', { layout: 'auth', title: 'Register', fail: true, message: 'Username đã tồn tại' });
            }

            await userService.createUser(username, password, email);
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

module.exports = new AuthController();
