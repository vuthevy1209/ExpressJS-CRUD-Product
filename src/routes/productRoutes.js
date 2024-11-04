const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Xem danh sách sản phẩm
router.get('/', productController.getProducts);
// Thêm sản phẩm
router.get('/add', productController.addProduct);
router.post('/add', productController.postAddProduct);
// Sửa sản phẩm
router.get('/edit/:id', productController.editProduct);
router.post('/edit/:id', productController.postEditProduct);
// Xóa sản phẩm
router.get('/delete/:id', productController.deleteProduct);

module.exports = router;
