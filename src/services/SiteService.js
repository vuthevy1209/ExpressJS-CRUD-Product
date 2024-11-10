const Product = require('../models/Product');

class SiteService {
    // get all products
    async getAllProducts() {
        return await Product.find({});
    }
}

module.exports = new SiteService();
