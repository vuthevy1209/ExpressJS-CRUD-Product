// services/productService.js
const Product = require('../models/product');

class ProductService {
    // Tìm sản phẩm theo slug
    async findBySlug(slug) {
        return await Product.findOne({ slug });
    }

    // Tạo mới một sản phẩm
    async createProduct(data) {
        const product = new Product(data);
        return await product.save();
    }
}

module.exports = new ProductService();
