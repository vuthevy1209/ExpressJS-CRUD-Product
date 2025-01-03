const express = require('express');
const router = express.Router();

const siteController = require('../controllers/SiteController');

router.get('/contact', siteController.contact);
router.get('/home', siteController.index);

module.exports = router;