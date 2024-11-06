const Product = require('../models/product');
const { mutipleMongooseToObject } = require('../../utils/mongoose');

class SiteController {
    // [GET] /home
    async index(req, res) {
        try {
            let products = await Product.find({});
            products = mutipleMongooseToObject(products);
            res.render('home', { products });
        } catch (err) {
            res.status(400).json({ error: 'ERROR!!!' });
        }
    }

    // [POST] /search
    search(req, res) {
        res.render('search');
    }
}

module.exports = new SiteController();