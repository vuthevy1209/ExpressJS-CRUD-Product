// controllers/ProductController.js
const productService = require('../services/productService');
const { mongooseToObject } = require('../../utils/mongoose');

class ProductController {
    // [GET] /products/:slug
    async show(req, res) {
        try {
            const product = await productService.findBySlug(req.params.slug);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            const productObject = mongooseToObject(product);

            res.render('product/ProductDetails', { product: productObject });
        } catch (error) {
            console.error('Error finding product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // [GET] /products/create
    create(req, res) {
        res.render('product/createProduct');
    }

    // [POST] /products
    async store(req, res) {
        try {
            await productService.createProduct(req.body);
            res.redirect(`/home`);
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new ProductController();
