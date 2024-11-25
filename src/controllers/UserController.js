const userServices = require('../services/UserServices');

class UserController {
    // [GET] /users
    async getAllUsers(req, res) {
        try {
            const users = await userServices.getAllUsers();
            res.json(users);
        } catch (error) {
            console.log(error);
            res.status(500).send('Đã xảy ra lỗi');
        }
    }
}

module.exports = new UserController();