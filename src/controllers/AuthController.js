const userService = require('../services/UserService');
const { emailRegex, passwordRegex } = require('../utils/regex');
const passport = require('../config/auth/passport');

class AuthController {
    // [GET] /login
    showLoginForm(req, res) {
        res.render('auth/login', {
            layout: 'auth',
            title: 'Login',
            error: req.flash('error')
        });
    }

    // [POST] /login
    async login(req, res, next) {
        passport.authenticate('local', {
            successRedirect: req.session.returnTo || '/home', // the returnTo is set in the middleware connectEnsureLogin.ensureLoggedIn
            // returnTo is the url that the user tried to access before being redirected to the login page
            failureRedirect: '/login',
            failureFlash: true // Enable flash messages for login failure
        })(req, res, next);
    }



    // [GET] /register
    showRegisterForm(req, res) {
        res.render('auth/register', { layout: 'auth', title: 'Register' });
    }


        // [POST] /register
        async register(req, res) {
            try {
                const { username, password, confirmPassword, email } = req.body;
    
                // Validate email
                if (!emailRegex.test(email)) {
                    return res.status(400).render('auth/register', {
                        layout: 'auth',
                        title: 'Register',
                        fail: true,
                        message: 'Invalid email',
                        username,
                        email
                    });
                }
    
                // Validate password
                if (!passwordRegex.test(password)) {
                    return res.status(400).render('auth/register', {
                        layout: 'auth',
                        title: 'Register',
                        fail: true,
                        message: 'Password must contain at least 8 characters, including uppercase, lowercase letters, and numbers',
                        username,
                        email
                    });
                }
    
                if (password !== confirmPassword) {
                    return res.status(400).render('auth/register', {
                        layout: 'auth',
                        title: 'Register',
                        fail: true,
                        message: 'Passwords do not match',
                        username,
                        email
                    });
                }
    
                if (await userService.findByUsername(username)) {
                    return res.status(400).render('auth/register', {
                        layout: 'auth',
                        title: 'Register',
                        fail: true,
                        message: 'Username already exists',
                        username,
                        email
                    });
                }
                await userService.createUser(username, password, email);
                res.redirect('/login');
            } catch (error) {
                console.log(error);
                return res.status(500).send('An error occurred');
            }
        }

    // [GET] /logout
    async logout(req, res) {
        try {
            // it is a passport function to logout
            // remove the user property from the request object 
            // and in the session (JUST INFORMATION OF THE USER) - NOT FULLY DELETE THE SESSION
            req.logout(function(err) { 
                if (err) { return next(err); }
                res.redirect('/home');
              });
        } catch (error) {
            res.status(500).send('Đã xảy ra lỗi');
        }
    }
}

module.exports = new AuthController();
