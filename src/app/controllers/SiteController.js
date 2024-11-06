// controllers/SiteController.js
const siteService = require('../services/siteService');
const { mutipleMongooseToObject } = require('../../utils/mongoose');

class SiteController {
    // [GET] /home
    async index(req, res) {
        try {
            let products = await siteService.getAllProducts();
            products = mutipleMongooseToObject(products);
            res.render('home', { products });
        } catch (err) {
            console.error('Error fetching products:', err);
            res.status(400).json({ error: 'ERROR!!!' });
        }
    }
}

module.exports = new SiteController();
