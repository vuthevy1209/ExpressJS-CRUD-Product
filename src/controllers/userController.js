const User = require('../models/User');

// Trang đăng nhập
exports.login = (req, res) => {
    res.render('login');
};

// Xử lý đăng nhập
exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await user.isValidPassword(password)) {
        req.session.userId = user._id;
        return res.redirect('/products');
    }
    res.redirect('/users/login');
};

// Trang đăng ký
exports.register = (req, res) => {
    res.render('register');
};

// Xử lý đăng ký
exports.postRegister = async (req, res) => {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    res.redirect('/users/login');
};

// Đăng xuất
exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};
