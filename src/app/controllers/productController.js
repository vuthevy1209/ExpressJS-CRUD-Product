const Product = require('../models/Product');

// Trang danh sách sản phẩm
exports.getProducts = async (req, res) => {
    const products = await Product.find();
    res.render('products', { products });
};

// Trang thêm sản phẩm
exports.addProduct = (req, res) => {
    res.render('addProduct');
};

// Xử lý thêm sản phẩm
exports.postAddProduct = async (req, res) => {
    const { name, price, description } = req.body;
    const newProduct = new Product({ name, price, description });
    await newProduct.save();
    res.redirect('/products');
};

// Xử lý sửa sản phẩm
exports.editProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('editProduct', { product });
};

exports.postEditProduct = async (req, res) => {
    const { name, price, description } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { name, price, description });
    res.redirect('/products');
};

// Xử lý xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
};
