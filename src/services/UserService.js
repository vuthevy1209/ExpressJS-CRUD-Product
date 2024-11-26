const crypto = require('crypto');
const User = require('../models/User');

class UserService {
    // find user by username
    async findByUsername(username) {
        return await User.findOne({ username });
    }

    // compare password
    async validatePassword(inputPassword, storedPassword) {
        return await bcrypt.compare(inputPassword, storedPassword);
    }

    // create a new user
    async createUser(username, password, email) {
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
            if (err) { return next(err); }

            const newUser = new User({
            username,
            email,
            password: hashedPassword,
            salt: salt
            });
            return await newUser.save();
        });
        
    }

    async findById(id) {
        return await User.findById(id);
    }
}

module.exports = new UserService();
