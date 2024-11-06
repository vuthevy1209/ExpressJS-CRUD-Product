// controllers/UserController.js
const userService = require('../services/userService');

class UserController {
    // [GET] /GA03/login
    showLoginForm(req, res) {
        res.render('auth/login', { layout: 'auth', title: 'Login' });
    }

    // [POST] /GA03/login
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

            res.redirect('/home');
        } catch (error) {
            res.status(500).send('Đã xảy ra lỗi');
        }
    }


    // [GET] /GA03/register
    showRegisterForm(req, res) {
        res.render('auth/register', { layout: 'auth', title: 'Register' });
    }


    // [POST] /GA03/register
    async register(req, res) {
        try {
            const { username, password, confirmPassword } = req.body;

            if (password !== confirmPassword) {
                return res.status(400).render('auth/register', { layout: 'auth', title: 'Register', error: 'Mật khẩu không khớp' });
            }

            await userService.createUser(username, password);
            res.redirect('/GA03/login');
        } catch (error) {
            res.status(500).send('Đã xảy ra lỗi');
        }
    }
}

module.exports = new UserController();
