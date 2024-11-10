const bcrypt = require('bcrypt');
const User = require('../models/User');

class UserService {
    // find user by username
    async findUserByUsername(username) {
        return await User.findOne({ username });
    }

    // compare password
    async validatePassword(inputPassword, storedPassword) {
        return await bcrypt.compare(inputPassword, storedPassword);
    }

    // create a new user
    async createUser(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email: username,
            password: hashedPassword,
        });
        return await newUser.save();
    }
}

module.exports = new UserService();
