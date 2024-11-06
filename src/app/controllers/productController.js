const Product = require('../models/product');
const { mongooseToObject } = require('../../utils/mongoose');

class ProductController {
    // [GET] /products/:slug
    async show(req, res) {
        try {
            const product = await Product.findOne({ slug: req.params.slug });
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

    // [GET] /products/add
    create(req, res) {
        res.render('product/createProduct');
    }

    // [POST] /products
    async store(req, res) {
        try {
            const product = new Product(req.body);
            await product.save();
            res.redirect('/home');
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new ProductController();