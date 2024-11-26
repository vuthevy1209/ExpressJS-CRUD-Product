const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'User' },
    salt: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
