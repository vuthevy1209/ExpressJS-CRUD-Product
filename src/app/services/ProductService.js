// services/productService.js
const Product = require('../models/product');

class ProductService {

    // Lấy tất cả sản phẩm
    async getAll() {
        return await Product.find();
    }

    // Tìm sản phẩm theo slug
    async findBySlug(slug) {
        return await Product.findOne({ slug });
    }

    // Lấy ra 4 sản phẩm cùng thương hiệu
    async getRelatedProducts(productId, brand) {
        return await Product.find({ _id: { $ne: productId }, brand }).limit(4);
    }

    // Tạo mới một sản phẩm
    async createProduct(data) {
        const product = new Product(data);
        return await product.save();
    }
}

module.exports = new ProductService();
