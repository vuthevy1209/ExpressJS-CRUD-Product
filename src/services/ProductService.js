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

    // search products
    async search({ name, brand, category, priceMin, priceMax, inventoryQuantityMin, inventoryQuantityMax }) {
        const query = {};
        if (name) query.name = { $regex: name, $options: 'i' };
        if (brand) query.brand = brand;
        if (category) query.category = category;
        if (priceMin) query.price = { $gte: priceMin };
        if (priceMax) query.price = { ...query.price, $lte: priceMax };
        if (inventoryQuantityMin) query.inventory_quantity = { $gte: inventoryQuantityMin };
        if (inventoryQuantityMax) query.inventory_quantity = { ...query.inventory_quantity, $lte: inventoryQuantityMax };

        return await Product.find(query);
    }
}

module.exports = new ProductService();
