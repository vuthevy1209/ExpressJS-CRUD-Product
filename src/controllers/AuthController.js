const userService = require('../services/UserService');
const { emailRegex, passwordRegex } = require('../utils/regex');

class AuthController {
    // [GET] /login
    showLoginForm(req, res) {
        res.render('auth/login', { layout: 'auth', title: 'Login' });
    }

    // [POST] /login
    async login(req, res) {
        
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
