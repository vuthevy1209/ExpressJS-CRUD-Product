const userServices = require('../services/UserServices');

class UserController {
    // [GET] /users
    async getAllUsers(req, res) {
        try {
            const { username, password } = req.body;
            const foundUser = await userService.findUserByUsername(username);
            if (!foundUser) {
                return res.status(400).render('auth/login', { layout: 'auth', title: 'Login', error: 'Account does not exist' });
            }

            const isMatch = await userService.validatePassword(password, foundUser.password);
            if (!isMatch) {
                return res.status(400).render('auth/login', { layout: 'auth', title: 'Login', error: 'Incorrect password' });
            }

            res.redirect('/home');
        } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred');
        }
    }


}

module.exports = new UserController();