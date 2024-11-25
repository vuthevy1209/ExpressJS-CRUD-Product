const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

router.get('/login', authController.showLoginForm);
router.post('/login', authController.login);
router.get('/register', authController.showRegisterForm);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

module.exports = router;