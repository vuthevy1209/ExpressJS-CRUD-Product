// controllers/ProductController.js
const productService = require('../services/productService');
const { mongooseToObject } = require('../../utils/mongoose');

class ProductController {
    // [GET] /products
    async index(req, res) {
        try {
            const products = await productService.getAll();
            const productList = products.map(product => mongooseToObject(product));

            res.render('product/Products', { productList });
        } catch (error) {
            console.error('Error getting product list:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    // [GET] /products/:slug
    async show(req, res) {
        try {
            const product = await productService.findBySlug(req.params.slug);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            const productRelated = await productService.getRelatedProducts(product._id, product.brand);
            const relatedProductList = productRelated.map(product => mongooseToObject(product));

            const productObject = mongooseToObject(product);

            res.render('product/ProductDetails', { product: productObject, relatedProductList });
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
