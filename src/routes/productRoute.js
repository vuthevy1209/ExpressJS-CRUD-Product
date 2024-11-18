const express = require('express');
const router = express.Router();

const productController = require('../controllers/ProductController');

router.get('/', productController.index);
router.get('/create', productController.create);
router.get('/search', productController.search);
router.get('/:slug', productController.show);
router.post('/', productController.store);

module.exports = router;