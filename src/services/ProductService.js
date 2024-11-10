const Product = require('../models/Product');

class ProductService {

    // get all products
    async getAll() {
        return await Product.find();
    }

    // find product by slug
    async findBySlug(slug) {
        return await Product.findOne({ slug });
    }

    // get 4 related products
    async getRelatedProducts(productId, brand) {
        return await Product.find({ _id: { $ne: productId }, brand }).limit(4);
    }

    // create a new product
    async createProduct(data) {
        const product = new Product(data);
        return await product.save();
    }
}

module.exports = new ProductService();
