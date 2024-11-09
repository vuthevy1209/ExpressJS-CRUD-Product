const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/login', userController.showLoginForm);
router.post('/login', userController.login);
router.get('/register', userController.showRegisterForm);
router.post('/register', userController.register);

module.exports = router;
