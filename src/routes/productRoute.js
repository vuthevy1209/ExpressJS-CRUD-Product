const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/productController');

router.get('/create', productController.create);
router.get('/:slug', productController.show);
router.post('/', productController.store);

module.exports = router;