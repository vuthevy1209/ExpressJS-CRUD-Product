// services/siteService.js
const Product = require('../models/Product');

class SiteService {
    // Lấy tất cả sản phẩm
    async getAllProducts() {
        return await Product.find({});
    }
}

module.exports = new SiteService();
